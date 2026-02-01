
import React from 'react';

export const HourglassIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 2v2.34c0 1.48-.52 2.87-1.46 3.97l-1.08 1.26c-.32.37-.32.92 0 1.29l1.08 1.26c.94 1.1 1.46 2.49 1.46 3.97V22" />
        <path d="M7 2v2.34c0 1.48.52 2.87 1.46 3.97l1.08 1.26c.32.37.32.92 0 1.29l-1.08 1.26C7.52 16.79 7 18.18 7 19.66V22" />
    </svg>
);
