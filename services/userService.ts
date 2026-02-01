import type { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ymastar-production.up.railway.app';

export const findUserByUsername = async (username: string): Promise<User | null> => {
  // 1. Bo'sh joylarni olib tashlaymiz va boshidagi barcha @ belgilarini tozalaymiz
  const cleanUsername = username.trim().replace(/^@+/, '');
  
  // Username kamida 3 ta belgidan iborat bo'lishi shart
  if (cleanUsername.length < 3) return null;

  try {
    console.log(`Searching for: @${cleanUsername}`);
    
    const response = await fetch(`${API_BASE_URL}/api/user/${cleanUsername}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn(`User topilmadi yoki API xatosi: ${response.status}`);
      return null;
    }

    const userData = await response.json();

    return {
      id: userData.id,
      name: userData.first_name || 'Telegram User',
      username: `@${userData.username}`,
      avatar: userData.avatar || 'https://via.placeholder.com/150', // Rasm bo'lmasa default
    };

  } catch (error) {
    // Agar bu yerga tushsa, CORS yoki tarmoq xatosi bor
    console.error('API Error (Check CORS or Server):', error);
    return null;
  }
};