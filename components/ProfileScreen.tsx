
import React, { useState } from 'react';
import { PaymeIcon } from './icons/PaymeIcon';
import { HelpIcon } from './icons/HelpIcon';
import { NewsIcon } from './icons/NewsIcon';
import { FriendsIcon } from './icons/FriendsIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ClickIcon } from './icons/ClickIcon';
import { GoldStarIcon } from './icons/GoldStarIcon';
import { ThemeIcon } from './icons/ThemeIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle }) => (
  <div onClick={handleToggle} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}>
    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-6' : ''}`}></div>
  </div>
);


interface ProfileScreenProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ theme, setTheme }) => {
  const { t } = useLocalization();
  const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click'>('payme');

  const togglePaymentMethod = () => {
    setPaymentMethod(prev => prev === 'payme' ? 'click' : 'payme');
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleInvite = async () => {
    const shareData = {
      title: 'Tez Star',
      text: 'Tez Star ilovasini sinab ko\'ring!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Sharing not supported on this browser.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const renderMenuItem = (item) => {
     const content = (
         <div className={`flex items-center justify-between p-3 ${item.action || item.href ? 'cursor-pointer' : ''}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-lg text-skin-primary">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#2AABEE] font-semibold">{item.value}</span>
              {item.action ? item.customAction || <ChevronRightIcon /> : <ChevronRightIcon />}
            </div>
          </div>
     );

    if (item.href) {
        return <a href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
    }
    return <div onClick={item.action}>{content}</div>
  }

  const menuItems = [
    { icon: <ThemeIcon />, label: t('theme'), value: theme === 'dark' ? t('dark') : t('light'), action: handleThemeToggle, customAction: <ToggleSwitch isOn={theme === 'dark'} handleToggle={handleThemeToggle} />, iconBg: 'bg-gray-200 dark:bg-gray-700', iconColor: 'text-gray-600 dark:text-gray-300' },
    { icon: paymentMethod === 'payme' ? <PaymeIcon /> : <ClickIcon />, label: t('paymentMethod'), value: paymentMethod === 'payme' ? 'Payme' : 'Click', action: togglePaymentMethod, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { icon: <HelpIcon />, label: t('help'), value: '@tezstar_supp', href: 'https://t.me/yusufbe_fx', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { icon: <NewsIcon />, label: t('newsChannel'), value: '@tezstar', href: 'https://t.me/tezstar', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  ];

  const balanceItems = [
    { icon: <GoldStarIcon />, label: t('balance'), value: `0 ${t('yulduzlar')}`, iconBg: 'bg-yellow-100' },
    { icon: <FriendsIcon />, label: t('friends'), value: '0', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  ];


  return (
    <>
      <div className="p-4 space-y-5 pb-20 bg-skin-primary">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <img src="https://picsum.photos/seed/yusuf/200/200" alt="User Profile" className="w-[90px] h-[90px] rounded-full" />
          <h2 className="text-3xl font-bold text-skin-primary">yusuf</h2>
          <p className="text-lg text-skin-secondary">@yusufbe_fx</p>
        </div>

        {/* Menu List */}
        <div className="bg-skin-secondary rounded-3xl p-2">
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
                {renderMenuItem(item)}
            </React.Fragment>
          ))}
        </div>
        
        {/* Balance List */}
        <div className="bg-skin-secondary rounded-3xl p-2">
          {balanceItems.map((item) => (
            <div key={item.label} className={`flex items-center justify-between p-3`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                  {item.icon}
                </div>
                <span className="font-semibold text-lg text-skin-primary">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 text-skin-secondary">
                <span className="font-semibold">{item.value}</span>
                <ChevronRightIcon />
              </div>
            </div>
          ))}
        </div>

        {/* Referral Program Card */}
        <div className="bg-skin-secondary rounded-3xl p-5 text-center space-y-4">
          <img src="https://i.imgur.com/e2Nf8aI.png" alt="Referral Characters" className="w-32 mx-auto" />
          <h3 className="text-2xl font-bold text-skin-primary">{t('referralProgram')}</h3>
          <p className="text-skin-secondary">{t('referralDescription')}</p>
          <div className="text-left space-y-3 pt-2">
            <div className="flex items-center bg-skin-primary p-3 rounded-xl"><span className="text-2xl mr-3">⭐</span> <div className="text-skin-primary">{t('referralPremiumBonus')} <span className="font-bold text-yellow-500">+15 ⭐</span></div></div>
            <div className="flex items-center bg-skin-primary p-3 rounded-xl"><span className="text-2xl mr-3">⭐</span> <div className="text-skin-primary">{t('referralStarsBonus')} <span className="font-bold text-yellow-500">+5 ⭐</span></div></div>
            <div className="flex items-center bg-skin-primary p-3 rounded-xl"><span className="text-2xl mr-3">👥</span> <div className="text-skin-primary"><span className="font-bold">{t('forInfluencers')}</span> <span className="bg-blue-100 text-[#2AABEE] text-xs font-bold ml-2 px-2 py-1 rounded-md">YANGI</span></div></div>
          </div>
        </div>

        <div className="space-y-3">
              <button onClick={handleInvite} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">{t('inviteFriends')}</button>
              <button className="w-full bg-skin-button-secondary text-skin-button-secondary font-bold h-14 rounded-2xl text-lg">{t('getPersonalLink')}</button>
          </div>
      </div>
    </>
  );
};

export default ProfileScreen;
