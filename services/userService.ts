import type { User } from '../types';

// Railway manzilingizni tekshiring (oxirida slash bo'lmasin)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tez-star-production.up.railway.app';

export const findUserByUsername = async (username: string): Promise<User | null> => {
  // 1. Foydalanuvchi kiritgan matnni tozalaymiz
  // Boshidagi barcha @ belgilarini va bo'sh joylarni olib tashlaymiz
  const cleanUsername = username.trim().replace(/^@+/, '');
  
  if (cleanUsername.length < 3) return null;

  try {
    const targetUrl = `${API_BASE_URL}/api/user/${cleanUsername}`;
    console.log(`Telegram qidiruv so'rovi yuborilmoqda: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn(`Foydalanuvchi topilmadi (Status: ${response.status})`);
      return null;
    }

    const userData = await response.json();

    if (!userData || !userData.id) {
      return null;
    }

    // 2. Ma'lumotlarni interfeysga moslab qaytaramiz
    return {
      id: userData.id,
      name: userData.first_name || 'Telegram Foydalanuvchisi',
      username: `@${userData.username}`,
      avatar: userData.avatar || 'https://via.placeholder.com/150', // Rasm bo'lmasa default rasm
    };

  } catch (error) {
    // Agar bu yerga tushsa, demak: 
    // 1. VITE_API_URL manzili xato.
    // 2. Server (bot) o'chiq.
    // 3. CORS ruxsat bermagan.
    console.error('API bilan bog‘lanishda xatolik:', error);
    return null;
  }
};