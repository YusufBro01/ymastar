
import React from 'react';
import type { User, StarPackage } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User;
    starPackage: StarPackage;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, user, starPackage }) => {
    const { t } = useLocalization();
    if (!isOpen) return null;

    // A simple conversion for display, replace with actual logic
    const priceInUSD = (starPackage.price / 17300).toFixed(2);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t('buyTelegramStars')}</h2>
                    <button onClick={onClose} className="text-gray-400 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                        &times;
                    </button>
                </div>

                <p className="text-gray-600">{t('confirmPurchasePrompt', { stars: starPackage.stars.toString() })}</p>
                <p className="text-gray-500 text-sm mt-2">{t('youWillBeNotified')}</p>

                <div className="bg-gray-100 rounded-2xl p-4 my-6">
                    <p className="text-left font-semibold">{t('anonymous')}</p>
                    <p className="text-left text-gray-600">{t('sentYouAGift')} — ${priceInUSD}</p>
                    <img src="https://i.imgur.com/gKrg407.png" alt="Gift Box" className="w-32 mx-auto my-4" />
                    <p className="font-bold">{starPackage.stars} Telegram {t('yulduzlar')}</p>
                    <p className="text-gray-500 text-sm">{t('forContentAndServices')}</p>
                </div>
                
                <button onClick={onConfirm} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">
                    {t('buyStarsForUser', { name: user.name })}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
