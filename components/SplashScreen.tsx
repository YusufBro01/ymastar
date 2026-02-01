
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-[#F5F6F8] flex-col">
       <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-sm font-semibold text-center">
         <span className="w-1/3"></span>
         <span className="w-1/3 py-1 px-3 bg-[#2AABEE] text-white rounded-full"></span>
         <span className="w-1/3 text-right"></span>
       </div>
       <div className="w-48 h-48 rounded-3xl shadow-lg overflow-hidden">
         <img src="https://i.imgur.com/kP1wum7.png" alt="App Icon" className="w-full h-full object-cover" />
       </div>
    </div>
  );
};

export default SplashScreen;
