
import React, { useState } from 'react';
import type { View, OrderDetails } from '../types';
import { PremiumIcon } from './icons/PremiumIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { GoldStarIcon } from './icons/GoldStarIcon';
import { GlobeIcon } from './icons/GlobeIcon';

interface MainScreenProps {
    onNavigate: (view: View) => void;
    pendingOrder: { details: OrderDetails; expiry: number } | null;
    onLanguageClick: () => void;
    onViewPendingOrder: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onNavigate, pendingOrder, onLanguageClick, onViewPendingOrder }) => {
    const [activeTab, setActiveTab] = useState<'stars' | 'premium'>('stars');
    const { t } = useLocalization();

    const cardContent = {
        stars: {
            title: t('telegramYulduzlari'),
            description: t('telegramStarsDescription'),
            buttonText: t('buyStars'),
            action: () => onNavigate('buy'),
            icon: (
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <span className="absolute -top-1 right-0 text-yellow-300 text-xl">+</span>
                    <span className="absolute top-8 -left-2 text-yellow-300 text-xl">+</span>
                    <span className="absolute bottom-0 -right-1 text-yellow-300 text-sm">+</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                </div>
            )
        },
        premium: {
            title: t('telegramPremium'),
            description: t('telegramPremiumDescription'),
            buttonText: t('buyPremium'),
            action: () => onNavigate('premium'),
            icon: (
                 <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center text-white bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
                   <PremiumIcon />
                </div>
            )
        }
    }

    const currentContent = cardContent[activeTab];

    return (
        <div className="p-4 flex flex-col h-full bg-skin-primary">
             {/* Top controls */}
            <div className="flex items-center justify-between pt-2">
                 <button onClick={() => onNavigate('profile')} className="w-10 h-10">
                    <img src="https://picsum.photos/seed/yusuf/200/200" className="w-10 h-10 rounded-full" alt="Profile"/>
                </button>
                <div className="relative flex items-center bg-skin-toggle p-1 rounded-full">
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-2px)] bg-skin-toggle-slider shadow-sm rounded-full transition-transform duration-300 ease-in-out`}
                        style={{ transform: activeTab === 'stars' ? 'translateX(0%)' : 'translateX(100%)' }}
                    ></div>
                    <button 
                        onClick={() => setActiveTab('stars')}
                        className={`relative z-10 px-5 py-1.5 text-base font-semibold rounded-full transition-colors ${activeTab === 'stars' ? 'text-skin-toggle-active' : 'text-skin-toggle-inactive'}`}>
                        {t('stars')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('premium')}
                        className={`relative z-10 px-5 py-1.5 text-base font-semibold rounded-full transition-colors ${activeTab === 'premium' ? 'text-skin-toggle-active' : 'text-skin-toggle-inactive'}`}>
                        {t('premium')}
                    </button>
                </div>
                 <button onClick={onLanguageClick} className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <GlobeIcon className="text-white w-7 h-7" />
                </button>
            </div>

            {/* Main Card (centered) */}
            <div className="flex-grow flex items-center justify-center">
                 <div className="bg-skin-secondary rounded-3xl p-6 text-center shadow-sm w-full max-w-sm">
                    {currentContent.icon}
                    <h2 className="text-2xl font-bold mb-2 text-skin-primary">{currentContent.title}</h2>
                    <p className="text-skin-secondary mb-6">{currentContent.description}</p>
                    <button 
                        onClick={currentContent.action}
                        className="w-full bg-[#2AABEE] text-white font-semibold py-3.5 rounded-2xl text-lg h-14 glow-effect">
                        {currentContent.buttonText}
                    </button>
                </div>
            </div>

            {/* Pending Payment */}
            {pendingOrder && (
                <div className="mt-auto">
                    <button onClick={onViewPendingOrder} className="w-full bg-skin-secondary rounded-2xl p-3 flex items-center justify-between cursor-pointer border border-blue-400 text-left">
                        <div className="flex items-center gap-3">
                            <GoldStarIcon className="w-8 h-8"/>
                            <div>
                                <p className="font-bold text-skin-primary">{t('paymentPending')}</p>
                                <p className="text-sm text-skin-secondary">{pendingOrder.details.stars} Stars · {pendingOrder.details.priceFormatted}</p>
                            </div>
                        </div>
                        <ChevronRightIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MainScreen;
