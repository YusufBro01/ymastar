
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { ThreeDotsIcon } from './icons/ThreeDotsIcon';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftButton: 'back' | 'close' | 'none';
  rightButton: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  leftButton,
  rightButton,
  onBack
}) => {
  const { t } = useLocalization();

  return (
    <header className="bg-skin-header-bg backdrop-blur-sm sticky top-0 z-10 p-4 flex items-center justify-between h-[60px]">
      <div className="w-1/3">
        {leftButton === 'back' && (
           <button onClick={onBack} className="text-[#2AABEE] font-semibold text-lg">&lt; {t('back')}</button>
        )}
        {leftButton === 'close' && (
           <button className="text-[#2AABEE] font-semibold text-lg">{t('yopish')}</button>
        )}
      </div>
      <div className="w-1/3 text-center">
        <h1 className="font-bold text-lg text-skin-primary">{title}</h1>
        <p className="text-sm text-skin-secondary">{t('')}</p>
      </div>
      <div className="w-1/3 flex justify-end">
         {rightButton && (
            <button className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
                <ThreeDotsIcon />
            </button>
         )}
      </div>
    </header>
  );
};

export default Header;