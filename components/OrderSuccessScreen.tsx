
import React, { useState } from 'react';
import type { View, OrderDetails } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { ClickIcon } from './icons/ClickIcon';
import { PaymeIcon } from './icons/PaymeIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { GoldStarIcon } from './icons/GoldStarIcon';
import { HourglassIcon } from './icons/HourglassIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface OrderSuccessScreenProps {
    order: OrderDetails;
    onNavigate: (view: View) => void;
}

const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ order, onNavigate }) => {
    const { t } = useLocalization();
    const [detailsVisible, setDetailsVisible] = useState(false);

    const PaymentIcon = order.paymentMethod === 'click' ? ClickIcon : PaymeIcon;
    const paymentUrl = order.paymentMethod === 'click' ? 'https://click.uz/' : 'https://payme.uz/';

    const handlePay = () => {
        window.open(paymentUrl, '_blank');
    };

    return (
        <div className="flex flex-col h-full bg-skin-primary">
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 space-y-4">
                <HourglassIcon className="w-20 h-20 text-gray-400" />
                <h1 className="text-3xl font-bold">{t('paymentPending')}</h1>
                <p className="text-gray-500 text-lg">{t('makePaymentWithButton')}</p>
                <button onClick={handlePay} className="flex items-center justify-center gap-3 bg-blue-100 text-[#2AABEE] font-bold py-3 px-6 rounded-2xl text-lg">
                    <PaymentIcon /> {t('pay')} <ExternalLinkIcon className="w-5 h-5" />
                </button>

                <div className="w-full max-w-xs pt-4">
                    <button onClick={() => setDetailsVisible(!detailsVisible)} className={`flex items-center justify-between w-full p-4 bg-skin-secondary rounded-xl transition-all ${detailsVisible ? 'rounded-b-none' : ''}`}>
                        <span className="font-semibold">{t('viewDetails')}</span>
                         <div className={`transition-transform duration-300 ${detailsVisible ? 'rotate-90' : ''}`}>
                             <ChevronRightIcon />
                        </div>
                    </button>
                    {detailsVisible && (
                        <div className="p-4 bg-skin-secondary rounded-b-xl space-y-3 text-left animate-fade-in-down">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">{t('recipient')}</span>
                                <div className="flex items-center gap-2 font-semibold">
                                    <img src={order.recipient.avatar} alt={order.recipient.name} className="w-6 h-6 rounded-full" />
                                    {order.recipient.name}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">{t('starAmount')}</span>
                                <div className="flex items-center gap-2 font-semibold">
                                    <GoldStarIcon className="w-5 h-5"/> {order.stars}
                                </div>
                            </div>
                             <hr className="border-gray-200 dark:border-gray-700"/>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">{t('price')}</span>
                                <span className="font-semibold">{order.priceFormatted}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 bg-skin-secondary p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3">
                 <button onClick={() => onNavigate('main')} className="w-full bg-skin-button-secondary text-skin-button-secondary font-bold h-14 rounded-2xl text-lg">
                    {t('toHomePage')}
                </button>
                 <button onClick={handlePay} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">
                    {t('pay')}
                </button>
            </div>
        </div>
    );
};

export default OrderSuccessScreen;
