
import React from 'react';

export const MainAppIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
    const starColor = isActive ? 'white' : 'currentColor';
    
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[#2AABEE]' : 'bg-transparent'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill={starColor} className={`transition-colors ${isActive ? '' : 'text-gray-500'}`}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
        </div>
    );
};
