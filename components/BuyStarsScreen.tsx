import React, { useState } from 'react';
import type { OrderDetails } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { ClearIcon } from './icons/ClearIcon';
import PaymentMethodModal from './PaymentMethodModal';
import ConfirmationModal from './ConfirmationModal';

// 1 Star narxi (masalan 260 so'm)
const STAR_UNIT_PRICE = 260; 

interface BuyStarsScreenProps {
    onCreateOrder: (details: OrderDetails) => void;
}

const BuyStarsScreen: React.FC<BuyStarsScreenProps> = () => {
    const { t } = useLocalization();
    
    // State-lar
    const [username, setUsername] = useState('@');
    const [starAmount, setStarAmount] = useState<string>('50');
    const [isLoading, setIsLoading] = useState(false);
    
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'payme' | 'click' | null>(null);

    // Narxni hisoblash
    const currentStars = parseInt(starAmount) || 0;
    const totalPrice = currentStars * STAR_UNIT_PRICE;
    const formattedPrice = new Intl.NumberFormat('uz-UZ').format(totalPrice) + ' UZS';

    // Username o'zgarganda @ ni saqlab qolish
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('@')) {
            value = '@' + value.replace(/@/g, '');
        }
        setUsername(value);
    };

    const handleStarAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value.replace(/[^0-9]/g, '');
        setStarAmount(amount);
    };

    const handlePaymentContinue = (method: 'payme' | 'click') => {
        setSelectedPaymentMethod(method);
        setPaymentModalOpen(false);
        setConfirmModalOpen(true);
    };

    const handleConfirmPurchase = async () => {
        if (username.length > 3 && currentStars >= 50 && selectedPaymentMethod) {
            setIsLoading(true);
            const tg = (window as any).Telegram?.WebApp;
            const senderId = tg?.initDataUnsafe?.user?.id;

            const orderData = {
                recipient: { 
                    username: username,
                    name: 'User' 
                },
                stars: currentStars,
                price: formattedPrice,
                paymentMethod: selectedPaymentMethod,
                senderId: senderId
            };

            try {
                const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ymastar-production.up.railway.app';
                const response = await fetch(`${API_BASE_URL}/api/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });

                if (response.ok) {
                    if (tg) tg.close();
                } else {
                    alert("Xatolik yuz berdi.");
                }
            } catch (err) {
                console.error(err);
                alert("Server bilan bog'lanishda xato.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Minimum 50 ta star va username yozilgan bo'lishi kerak
    const isMinLimitOk = currentStars >= 50;
    const isValid = username.length > 3 && isMinLimitOk;

    return (
        <>
            <div className="p-4 space-y-5 bg-skin-primary min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-skin-primary">{t('buyTelegramStars')} ⭐</h1>
                    <p className="text-skin-secondary mt-1">{t('telegramStarsDescription')}</p>
                </div>
                
                {/* User Input */}
                <div className="space-y-2">
                    <label className="font-semibold text-skin-primary px-1">{t('whoToSend')}</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                             <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">TG</div>
                        </div>
                         <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="w-full bg-skin-input rounded-xl p-4 pl-12 text-lg focus:outline-none text-skin-primary border-2 border-transparent focus:border-blue-500 shadow-sm"
                            placeholder="@username"
                        />
                        {username.length > 1 && (
                            <button onClick={() => setUsername('@')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* Star Amount Input */}
                <div className="space-y-2">
                    <div className="flex justify-between px-1">
                        <label className="font-semibold text-skin-primary">{t('enterStarAmount')}</label>
                        <span className="font-bold text-blue-500">{formattedPrice}</span>
                    </div>
                    <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">⭐</div>
                         <input
                            type="text"
                            inputMode="numeric"
                            value={starAmount}
                            onChange={handleStarAmountChange}
                            className={`w-full bg-skin-input rounded-xl p-4 pl-12 text-lg focus:outline-none text-skin-primary border-2 ${!isMinLimitOk && starAmount !== '' ? 'border-red-500' : 'border-transparent focus:border-blue-500'}`}
                        />
                         {starAmount && (
                            <button onClick={() => setStarAmount('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ClearIcon />
                            </button>
                        )}
                    </div>
                    {!isMinLimitOk && starAmount !== '' && (
                        <p className="text-xs text-red-500 px-1 font-medium italic">Minimum 50 ta star kiritishingiz kerak!</p>
                    )}
                </div>

                {/* Eslatma */}
                <div className="p-4 bg-skin-secondary rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-sm text-skin-secondary italic leading-relaxed">
                        * Iltimos, username to'g'ri yozilganini tekshiring. Xato yozilsa, stars boshqa odamga ketib qolishi mumkin.
                    </p>
                </div>
            </div>

            <div className="sticky bottom-0 bg-skin-primary p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={!isValid || isLoading}
                    className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-lg"
                >
                    {isLoading ? '...' : `${currentStars} Stars ${t('sotibOlish')}`}
                </button>
            </div>
            
            <PaymentMethodModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onContinue={handlePaymentContinue}
            />

            {isValid && (
                 <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirmPurchase}
                    user={{ username: username, name: 'User' } as any}
                    starPackage={{ stars: currentStars, priceFormatted: formattedPrice } as any}
                 />
            )}
        </>
    );
};

export default BuyStarsScreen;