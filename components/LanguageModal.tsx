import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageModal = ({ isOpen, onClose }) => {
    const { language, setLanguage, t } = useLocalization();
    const [selectedLang, setSelectedLang] = useState(language);

    if (!isOpen) return null;

    // FIX: Add 'as const' to infer the 'code' property as a literal type,
    // which is required by the 'setSelectedLang' state setter.
    const languages = [
        { code: 'uz', name: 'Uzbek', nativeName: "O'zbek" },
        { code: 'en', name: 'English', nativeName: "English" },
        { code: 'ru', name: 'Russian', nativeName: "Русский" },
    ] as const;
    
    const handleConfirm = () => {
        setLanguage(selectedLang);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-end z-50" onClick={onClose}>
            <div className="bg-[#F5F6F8] w-full max-w-md rounded-t-3xl p-4 transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                    &times;
                </button>
                <div className="flex flex-col items-center text-center space-y-3 pt-4">
                    <img src="https://i.imgur.com/g0nKUq2.png" alt="Language Selection" className="w-32" />
                    <h2 className="text-2xl font-bold">{t('selectLanguage')}</h2>
                    <p className="text-gray-500 max-w-xs">{t('selectLanguageDescription')}</p>
                </div>
                
                <div className="my-6 space-y-3">
                    {languages.map((lang) => (
                        <div key={lang.code} onClick={() => setSelectedLang(lang.code)} className="flex items-center justify-between p-4 bg-white rounded-xl cursor-pointer">
                            <div>
                                <h3 className="font-semibold text-lg">{lang.name}</h3>
                                <p className="text-gray-500">{lang.nativeName}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                {selectedLang === lang.code && <div className="w-4 h-4 bg-blue-500 rounded-full"></div>}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleConfirm} className="w-full bg-[#2AABEE] text-white font-bold h-14 rounded-2xl text-lg">
                    {t('confirm')}
                </button>
            </div>
        </div>
    );
};

export default LanguageModal;