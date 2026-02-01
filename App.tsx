
import React, { useState, useEffect } from 'react';
import type { View, OrderDetails } from './types';
import SplashScreen from './components/SplashScreen';
import MainScreen from './components/MainScreen';
import ProfileScreen from './components/ProfileScreen';
import BuyStarsScreen from './components/BuyStarsScreen';
import BuyPremiumScreen from './components/BuyPremiumScreen';
import OrderSuccessScreen from './components/OrderSuccessScreen';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LanguageModal from './components/LanguageModal';
import ReferralModal from './components/ReferralModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>('splash');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const [isReferralModalOpen, setReferralModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [pendingOrder, setPendingOrder] = useState<{ details: OrderDetails; expiry: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (pendingOrder) {
      const timerId = setInterval(() => {
        if (Date.now() > pendingOrder.expiry) {
          setPendingOrder(null);
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pendingOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setView('main');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (newView: View) => {
    setView(newView);
  };
  
  const handleCreateOrder = (details: OrderDetails) => {
    const expiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes from now
    setPendingOrder({ details, expiry: expiryTime });
    setCurrentOrder(details);
    setView('orderSuccess');
  };

  const handleViewPendingOrder = () => {
    if (pendingOrder) {
      setCurrentOrder(pendingOrder.details);
      setView('orderSuccess');
    }
  };

  const renderHeader = () => {
    const headerProps = {
        title: "Yma Star",
        subtitle: "mini ilova",
    };

    switch (view) {
      case 'main':
        return null;
      case 'profile':
      case 'buy':
      case 'premium':
      case 'orderSuccess':
        return <Header {...headerProps} leftButton="back" rightButton={true} onBack={() => setView(view === 'orderSuccess' ? 'buy' : 'main')} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'splash':
        return <SplashScreen />;
      case 'main':
        return <MainScreen onNavigate={handleNavigate} pendingOrder={pendingOrder} onLanguageClick={() => setLanguageModalOpen(true)} onViewPendingOrder={handleViewPendingOrder} />;
      case 'profile':
        return <ProfileScreen theme={theme} setTheme={setTheme} />;
      case 'buy':
        return <BuyStarsScreen onCreateOrder={handleCreateOrder} />;
      case 'premium':
        return <BuyPremiumScreen />;
      case 'orderSuccess':
        return currentOrder ? <OrderSuccessScreen order={currentOrder} onNavigate={handleNavigate} /> : <MainScreen onNavigate={handleNavigate} pendingOrder={pendingOrder} onLanguageClick={() => setLanguageModalOpen(true)} onViewPendingOrder={handleViewPendingOrder} />;
      default:
        return <MainScreen onNavigate={handleNavigate} pendingOrder={pendingOrder} onLanguageClick={() => setLanguageModalOpen(true)} onViewPendingOrder={handleViewPendingOrder} />;
    }
  };
  
  const showBottomNav = view === 'main' || view === 'profile';

  return (
    <div className={`max-w-md mx-auto h-screen flex flex-col font-sans ${theme}`}>
       <div className="bg-skin-primary text-skin-primary flex-grow flex flex-col">
        {view !== 'splash' && renderHeader()}
        <main className="flex-grow overflow-y-auto bg-skin-primary">
            {renderContent()}
        </main>
        {showBottomNav && <BottomNav activeView={view} onNavigate={handleNavigate} onInviteClick={() => setReferralModalOpen(true)} />}
        <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setLanguageModalOpen(false)} />
        <ReferralModal isOpen={isReferralModalOpen} onClose={() => setReferralModalOpen(false)} />
       </div>
    </div>
  );
};

export default App;
