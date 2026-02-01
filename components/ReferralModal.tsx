
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { CopyIcon } from './icons/CopyIcon';

const ReferralModal = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;
    
    const handleCopy = () => {
        navigator.clipboard.writeText('https://t.me/tezstar_bot?start=yusufbe_fx'); // Example link
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleInvite = async () => {
        const shareData = {
          title: 'Tez Star',
          text: 'Tez Star ilovasini sinab ko\'ring! https://t.me/tezstar_bot?start=yusufbe_fx',
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


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-end z-50" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-3xl p-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                    &times;
                </button>
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden">
                        <img src="https://i.imgur.com/eKk0OoD.png" alt="Referral Ducks" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-2xl font-bold">{t('referralProgram')}</h2>
                    <p className="text-gray-500 max-w-xs">{t('referralDescription')}</p>
                </div>
                
                <div className="my-6 p-3 bg-gray-100/70 rounded-2xl space-y-3 text-left">
                     <div className="flex items-start gap-4">
                        <div className="text-2xl mt-1">⭐</div>
                        <div>
                            <h3 className="font-semibold text-lg">Telegram Premium</h3>
                            <p className="text-gray-600">{t('referralPremiumBonus')} <span className="font-bold text-yellow-500">+15 ⭐</span></p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="text-2xl mt-1">⭐</div>
                        <div>
                            <h3 className="font-semibold text-lg">{t('yulduzlar')}</h3>
                            <p className="text-gray-600">{t('referralStarsBonus')} <span className="font-bold text-yellow-500">+5 ⭐</span></p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="text-2xl mt-1">👥</div>
                        <div>
                            <h3 className="font-semibold text-lg">{t('forInfluencers')} <span className="bg-blue-100 text-[#2AABEE] text-xs font-bold ml-1 px-2 py-1 rounded-md align-middle">YANGI</span></h3>
                            <p className="text-gray-600">{t('forInfluencersDescription')}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={handleInvite} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">
                        {t('inviteFriends')}
                    </button>
                    <div className="relative">
                        <button onClick={handleCopy} className="w-full bg-gray-100 text-[#2AABEE] font-bold h-14 rounded-2xl text-lg flex items-center justify-center gap-2">
                            {t('getPersonalLink')} <CopyIcon />
                        </button>
                         {copied && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm rounded-md px-3 py-1 transition-opacity duration-300">
                                {t('copied')}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralModal;
