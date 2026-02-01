import type { User } from '../types';

// 1. Manzil oxirida / belgisini tekshiring. 
// Railway'da VITE_API_URL oxirida / bo'lmasligi kerak.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const findUserByUsername = async (username: string): Promise<User | null> => {
  // Username'dan faqat toza matnni olamiz
  const cleanUsername = username.replace('@', '').trim();
  
  if (cleanUsername.length < 3) return null;

  try {
    const targetUrl = `${API_BASE_URL}/api/user/${cleanUsername}`;
    console.log(`So'rov yuborilmoqda: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn(`API xatosi: ${response.status}`);
      return null;
    }

    const userData = await response.json();

    // Ma'lumotlar kelganini tekshiramiz
    if (!userData || !userData.id) {
      return null;
    }

    return {
      id: userData.id,
      name: userData.first_name || 'Telegram User',
      username: `@${userData.username}`,
      avatar: userData.avatar || 'https://via.placeholder.com/150',
    };

  } catch (error) {
    // Agar bu yerga tushsa, demak Network (CORS yoki Server o'chiq) xatosi
    console.error('Fetch jarayonida xatolik:', error);
    return null;
  }
};