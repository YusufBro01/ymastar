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

const ToggleSwitch: React.FC<{ isOn: boolean; handleToggle: () => void }> = ({ isOn, handleToggle }) => (
  <div onClick={(e) => { e.stopPropagation(); handleToggle(); }} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}>
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

  // 1. Telegram WebApp ma'lumotlarini olish
  const tg = (window as any).Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  // Foydalanuvchi ma'lumotlari (Start bosgan odamniki)
  const firstName = user?.first_name || "Foydalanuvchi";
  const userUsername = user?.username ? `@${user.username}` : "@username";
  
  // Rasm bo'lmasa ismning birinchi harfini chiqaradigan xizmatdan foydalanamiz
  const userPhoto = user?.photo_url || `https://ui-avatars.com/api/?name=${firstName}&background=random&color=fff`;

  const togglePaymentMethod = () => setPaymentMethod(prev => prev === 'payme' ? 'click' : 'payme');
  const handleThemeToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handleInvite = () => {
    const botUsername = 'TezStarBot'; // O'zingizning botingiz niki
    const inviteLink = `https://t.me/${botUsername}?start=r_${user?.id || ''}`;
    tg?.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(t('referralDescription'))}`);
  };

  const menuItems = [
    { icon: <ThemeIcon />, label: t('theme'), value: theme === 'dark' ? t('dark') : t('light'), action: handleThemeToggle, customAction: <ToggleSwitch isOn={theme === 'dark'} handleToggle={handleThemeToggle} />, iconBg: 'bg-gray-200 dark:bg-gray-700', iconColor: 'text-gray-600 dark:text-gray-300' },
    { icon: paymentMethod === 'payme' ? <PaymeIcon /> : <ClickIcon />, label: t('paymentMethod'), value: paymentMethod === 'payme' ? 'Payme' : 'Click', action: togglePaymentMethod, iconBg: 'bg-green-100', iconColor: 'text-green-500' },
    { icon: <HelpIcon />, label: t('help'), value: '@yusufbe_fx', href: 'https://t.me/yusufbe_fx', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { icon: <NewsIcon />, label: t('newsChannel'), value: '@ymastars', href: 'https://t.me/ymastars', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  ];

  const balanceItems = [
    { icon: <GoldStarIcon />, label: t('balance'), value: `0 ${t('yulduzlar')}`, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { icon: <FriendsIcon />, label: t('friends'), value: '0', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  ];

  return (
    <div className="p-4 space-y-5 pb-20 bg-skin-primary min-h-screen">
      {/* Profil qismi */}
      <div className="flex flex-col items-center space-y-2 pt-4">
        <img 
          src={userPhoto} 
          alt="Profile" 
          className="w-[90px] h-[90px] rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl" 
        />
        <h2 className="text-3xl font-bold text-skin-primary">{firstName}</h2>
        <p className="text-lg text-skin-secondary">{userUsername}</p>
      </div>

      {/* Menu List */}
      <div className="bg-skin-secondary rounded-3xl p-2 shadow-sm">
        {menuItems.map((item) => (
          <div 
            key={item.label} 
            onClick={() => item.href ? tg?.openTelegramLink(item.href) : item.action?.()} 
            className="flex items-center justify-between p-3 cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                {item.icon}
              </div>
              <span className="font-semibold text-lg text-skin-primary">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#2AABEE] font-semibold">{item.value}</span>
              {item.customAction || <ChevronRightIcon />}
            </div>
          </div>
        ))}
      </div>

      {/* Balance List */}
      <div className="bg-skin-secondary rounded-3xl p-2 shadow-sm">
        {balanceItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 border-b last:border-0 border-gray-100 dark:border-gray-800">
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

      {/* Invite Card */}
      <div className="bg-skin-secondary rounded-3xl p-5 text-center space-y-4 shadow-sm">
        <h3 className="text-2xl font-bold text-skin-primary">{t('referralProgram')}</h3>
        <button onClick={handleInvite} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg active:scale-95 transition-transform">
          {t('inviteFriends')}
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;