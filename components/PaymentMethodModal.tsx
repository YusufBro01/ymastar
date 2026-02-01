
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { ClickIcon } from './icons/ClickIcon';
import { PaymeIcon } from './icons/PaymeIcon';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: (method: 'payme' | 'click') => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ isOpen, onClose, onContinue }) => {
    const { t } = useLocalization();
    const [selectedMethod, setSelectedMethod] = useState<'payme' | 'click'>('click');
    const [isDefault, setIsDefault] = useState(false);

    if (!isOpen) return null;

    const handleContinue = () => {
        // Here you could save the `isDefault` preference
        onContinue(selectedMethod);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-3xl p-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-4">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold">{t('selectPaymentMethod')}</h3>
                    <p className="text-gray-500">{t('paymentProviderPrompt')}</p>
                </div>
                <div className="space-y-3">
                    <div onClick={() => setSelectedMethod('payme')} className={`flex items-center gap-3 text-left p-4 rounded-xl font-semibold text-lg cursor-pointer transition-all ${selectedMethod === 'payme' ? 'bg-gray-100' : ''}`}>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {selectedMethod === 'payme' && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                        </div>
                        <PaymeIcon/> Payme
                    </div>
                     <div onClick={() => setSelectedMethod('click')} className={`flex items-center gap-3 text-left p-4 rounded-xl font-semibold text-lg cursor-pointer transition-all ${selectedMethod === 'click' ? 'bg-blue-100 border border-blue-500' : ''}`}>
                         <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {selectedMethod === 'click' && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                        </div>
                        <ClickIcon/> Click
                    </div>
                </div>
                 <div className="flex items-center my-6">
                    <div onClick={() => setIsDefault(!isDefault)} className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center cursor-pointer">
                        {isDefault && <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>}
                    </div>
                    <label onClick={() => setIsDefault(!isDefault)} className="ml-3 font-semibold text-gray-700 cursor-pointer">{t('setAsDefault')}</label>
                 </div>
                 <button onClick={handleContinue} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">
                    {t('continue')}
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodModal;
