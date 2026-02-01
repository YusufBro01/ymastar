
import React, { useState, useEffect, useCallback } from 'react';
import type { User, StarPackage, OrderDetails } from '../types';
import { findUserByUsername } from '../services/userService';
import { validateUsername } from '../services/geminiService';
import { useLocalization } from '../contexts/LocalizationContext';
import { ClearIcon } from './icons/ClearIcon';
import PaymentMethodModal from './PaymentMethodModal';
import ConfirmationModal from './ConfirmationModal';

const starPlans: StarPackage[] = [
  { stars: 50, price: 12999, priceFormatted: '12 999,00 UZS' },
  { stars: 100, price: 25999, priceFormatted: '25 999,00 UZS' },
];

interface BuyStarsScreenProps {
    onCreateOrder: (details: OrderDetails) => void;
}

const BuyStarsScreen: React.FC<BuyStarsScreenProps> = ({ onCreateOrder }) => {
    const { t } = useLocalization();
    const [username, setUsername] = useState('@yusufbe_fx');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [starAmount, setStarAmount] = useState<string>('50');
    const [selectedPlan, setSelectedPlan] = useState<StarPackage | null>(starPlans[0]);
    
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'payme' | 'click' | null>(null);

    const handleUsernameSearch = useCallback(async (searchUsername: string) => {
    // 1. Bo'sh yoki juda qisqa bo'lsa to'xtatamiz
    if (searchUsername.length <= 2) { 
        setFoundUser(null);
        setError(null);
        return;
    }

    setError(null);
    setIsLoading(true);

    try {
        // AI validateUsername ni olib tashladik! 
        // To'g'ridan-to'g'ri Bot API orqali qidiramiz.
        const user = await findUserByUsername(searchUsername);

        if (user) {
            setFoundUser(user);
            setError(null);
        } else {
            setFoundUser(null);
            setError(t('userNotFound')); // "Foydalanuvchi topilmadi"
        }
    } catch (err) {
        console.error("Search Error:", err);
        setError('Server bilan bog‘lanishda xato yuz berdi.');
        setFoundUser(null);
    } finally {
        setIsLoading(false);
    }
}, [t]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            handleUsernameSearch(username);
        }, 1000);
        return () => clearTimeout(handler);
    }, [username, handleUsernameSearch]);

    const handleStarAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value.replace(/[^0-9]/g, '');
        setStarAmount(amount);
        const matchingPlan = starPlans.find(p => p.stars === parseInt(amount, 10));
        setSelectedPlan(matchingPlan || null);
    };

    const handlePlanSelect = (plan: StarPackage) => {
        setSelectedPlan(plan);
        setStarAmount(plan.stars.toString());
    };
    
    const handlePaymentContinue = (method: 'payme' | 'click') => {
        setSelectedPaymentMethod(method);
        setPaymentModalOpen(false);
        setConfirmModalOpen(true);
    };

    const handleConfirmPurchase = async () => {
    if (foundUser && selectedPlan && selectedPaymentMethod) {
        setIsLoading(true); // Yuklanish indikatorini yoqamiz

        // Botga yuboriladigan ma'lumotlar
        const orderData = {
            recipient: foundUser,
            stars: selectedPlan.stars,
            price: selectedPlan.priceFormatted,
            paymentMethod: selectedPaymentMethod,
            // Ilovani kim ishlatayotgan bo'lsa, o'shaning IDsi (bot unga SMS yuboradi)
            senderId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id 
        };

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ymastar-production.up.railway.app';
            
            const response = await fetch(`${API_BASE_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setConfirmModalOpen(false);
                // Muvaffaqiyatli bo'lsa, WebApp ni yopamiz, foydalanuvchi botga qaytadi
                window.Telegram?.WebApp?.close();
            } else {
                setError("Buyurtma berishda xatolik yuz berdi.");
            }
        } catch (err) {
            console.error(err);
            setError("Server bilan bog'lanishda xato.");
        } finally {
            setIsLoading(false);
        }
    }
};
    
    const isValid = foundUser && starAmount && parseInt(starAmount, 10) > 0 && selectedPlan;

    return (
        <>
            <div className="p-4 space-y-5 bg-skin-primary">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-skin-primary">{t('buyTelegramStars')} ⭐</h1>
                    <p className="text-skin-secondary mt-1">{t('telegramStarsDescription')}</p>
                </div>
                
                {/* User Input */}
                <div className="space-y-2">
                    <label className="font-semibold text-skin-primary px-1">{t('whoToSend')}</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                           {foundUser ? (
                             <img src={foundUser.avatar} className="w-7 h-7 rounded-full" />
                           ) : (
                             <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                           )}
                        </div>
                         <input
                            type="text"
                            value={username.startsWith('@') ? username.substring(1) : username}
                            onChange={(e) => setUsername(`@${e.target.value}`)}
                            className="w-full bg-skin-input rounded-xl p-4 pl-12 text-lg focus:outline-none text-skin-primary"
                        />
                        {username.length > 1 && (
                            <button onClick={() => setUsername('@')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                     {isLoading && <p className="text-sm text-blue-500 text-center">Checking username...</p>}
                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>

                {/* Star Amount Input */}
                <div className="space-y-2">
                    <label className="font-semibold text-skin-primary px-1">{t('enterStarAmount')}</label>
                    <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2">⭐</div>
                         <input
                            type="text"
                            inputMode="numeric"
                            value={starAmount}
                            onChange={handleStarAmountChange}
                            className="w-full bg-skin-input rounded-xl p-4 pl-12 text-lg focus:outline-none text-skin-primary"
                        />
                         {starAmount && (
                            <button onClick={() => setStarAmount('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* Plan Selection */}
                 <div className="space-y-3">
                    <label className="font-semibold text-skin-primary px-1">{t('orSelectPlan')}</label>
                     {starPlans.map(plan => (
                        <div key={plan.stars} onClick={() => handlePlanSelect(plan)} className="flex items-center justify-between p-4 bg-skin-secondary rounded-xl cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                    {selectedPlan?.stars === plan.stars && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                                </div>
                                <span className="font-semibold text-lg text-skin-primary">⭐ {plan.stars} Stars</span>
                            </div>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{plan.priceFormatted}</span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="sticky bottom-0 bg-skin-primary p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={!isValid || isLoading}
                    className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? '...' : t('continue')}
                </button>
            </div>
            
            <PaymentMethodModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onContinue={handlePaymentContinue}
            />

            {foundUser && selectedPlan && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirmPurchase}
                    user={foundUser}
                    starPackage={selectedPlan}
                 />
            )}
        </>
    );
};

export default BuyStarsScreen;
