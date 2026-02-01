
import React from 'react';
import type { View } from '../types';
import { InviteIcon } from './icons/InviteIcon';
import { MainAppIcon } from './icons/MainAppIcon';
import { ProfileNavIcon } from './icons/ProfileNavIcon';
import { useLocalization } from '../contexts/LocalizationContext';

interface BottomNavProps {
    activeView: View;
    onNavigate: (view: View) => void;
    onInviteClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, onInviteClick }) => {
    const { t } = useLocalization();
    return (
        <footer className="bg-skin-secondary/80 backdrop-blur-sm p-2 sticky bottom-0 z-10 shadow-t-lg border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-around items-center">
                <button onClick={onInviteClick} className="flex flex-col items-center text-gray-500 w-1/3 space-y-1">
                    <InviteIcon />
                    <span className="text-xs">{t('invite')}</span>
                </button>
                 <button onClick={() => onNavigate('main')} className="flex flex-col items-center text-gray-500 w-1/3">
                    <MainAppIcon isActive={activeView === 'main'}/>
                </button>
                <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center w-1/3 transition-colors space-y-1 ${activeView === 'profile' ? 'text-[#2AABEE]' : 'text-gray-500'}`}>
                    <ProfileNavIcon />
                    <span className="text-xs">{t('profile')}</span>
                </button>
            </div>
        </footer>
    );
};

export default BottomNav;