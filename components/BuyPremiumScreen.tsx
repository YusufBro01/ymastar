
import React, { useState, useEffect, useCallback } from 'react';
import type { User, PremiumPackage } from '../types';
import { findUserByUsername } from '../services/userService';
import { ClearIcon } from './icons/ClearIcon';
import { VerifiedCheckIcon } from './icons/VerifiedCheckIcon';
import { PremiumIcon } from './icons/PremiumIcon';
import { useLocalization } from '../contexts/LocalizationContext';
import PaymentMethodModal from './PaymentMethodModal';


const BuyPremiumScreen: React.FC = () => {
    const { t } = useLocalization();

    const premiumPackages: PremiumPackage[] = [
      { duration: `1 ${t('month')}`, price: '35 000 UZS' },
      { duration: `3 ${t('month')}`, price: '90 000 UZS', monthlyPrice: '30 000 UZS' },
      { duration: `1 ${t('year')}`, price: '300 000 UZS', monthlyPrice: '25 000 UZS' },
    ];

    const [username, setUsername] = useState('@');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(premiumPackages[1]);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    
    const handlePaymentSelected = (method: 'payme' | 'click') => {
        console.log(`Premium payment started with ${method}`);
        // Here you would proceed with the premium purchase logic
    };

    const handleUsernameSearch = useCallback(async (searchUsername: string) => {
        setLoading(true);
        setError(null);
        try {
            const user = await findUserByUsername(searchUsername);
            if (user) {
                setFoundUser(user);
            } else {
                setFoundUser(null);
                setError(t('userNotFound'));
            }
        } catch (err) {
            setError('An error occurred');
            setFoundUser(null);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (username.length > 4) {
                handleUsernameSearch(username);
            } else {
                setFoundUser(null);
                setError(null);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [username, handleUsernameSearch]);
    
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('@')) {
            value = '@' + value.replace(/[^a-zA-Z0-9_]/g, '');
        }
        setUsername(value);
    };

    const clearInput = () => {
        setUsername('@');
        setFoundUser(null);
        setError(null);
    }
    
    const isDisabled = !foundUser || !selectedPackage;

    return (
        <>
            <PaymentMethodModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} onContinue={handlePaymentSelected} />
            <div className="p-4 space-y-6 flex flex-col h-full">
                <div className="flex-grow space-y-6">
                    <div>
                        <label htmlFor="username" className="text-sm font-semibold text-gray-500 px-1">{t('whoToSend')}</label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                placeholder="@username"
                                className="w-full p-3 pl-4 pr-10 mt-1 bg-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/50 text-lg"
                            />
                            {username.length > 1 && (
                                <button onClick={clearInput} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ClearIcon />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="h-20">
                        {foundUser && (
                            <div className={`bg-white rounded-3xl p-3 flex items-center gap-3 transition-opacity duration-300 ease-in-out ${foundUser ? 'opacity-100' : 'opacity-0'}`}>
                                <img src={foundUser.avatar} alt={foundUser.name} className="w-14 h-14 rounded-full" />
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="font-bold text-lg">{foundUser.name}</p>
                                        <VerifiedCheckIcon />
                                    </div>
                                    <p className="text-sm text-gray-500">{foundUser.username}</p>
                                </div>
                            </div>
                        )}
                        {error && <p className="mt-2 text-sm text-center text-red-500">{error}</p>}
                    </div>
                    
                    <div className="space-y-3">
                        {premiumPackages.map((pkg) => (
                            <button 
                                key={pkg.duration} 
                                onClick={() => setSelectedPackage(pkg)}
                                className={`w-full text-left p-4 bg-white rounded-3xl border-2 transition-colors ${selectedPackage?.duration === pkg.duration ? 'border-[#2AABEE]' : 'border-transparent'}`}
                            >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg flex items-center gap-2">
                                    <PremiumIcon /> {pkg.duration}
                                </span>
                                <div className="text-right">
                                    <span className="text-[#2AABEE] font-semibold">{pkg.price}</span>
                                    {pkg.monthlyPrice && <p className="text-sm text-gray-500">{pkg.monthlyPrice}/{t('month')}</p>}
                                </div>
                            </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pb-4">
                     <button 
                        onClick={() => setPaymentModalOpen(true)}
                        disabled={isDisabled}
                        className={`w-full text-white font-semibold py-3.5 rounded-2xl text-lg h-14 relative overflow-hidden transition-colors ${
                            isDisabled 
                            ? 'bg-gray-300 cursor-not-allowed shimmer-effect' 
                            : 'bg-[#2AABEE]'
                        }`}>
                         {selectedPackage ? t('purchaseButtonText', { price: selectedPackage.price }) : t('purchase')}
                     </button>
                </div>
            </div>
        </>
    );
};


export default BuyPremiumScreen;
