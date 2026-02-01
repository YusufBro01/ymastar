import type { User } from '../types';

// Railway'ga yuklaganingizdan keyingi manzilingizni shu yerga qo'ying
// Masalan: https://tez-star-production.up.railway.app
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
  
  if (!cleanUsername) return null;

  try {
    console.log(`Searching for: @${cleanUsername} via API...`);
    
    // Botdagi biz yaratgan /api/user/:username manziliga so'rov yuboramiz
    const response = await fetch(`${API_BASE_URL}/api/user/${cleanUsername}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log('User not found in Telegram.');
      }
      return null;
    }

    const userData = await response.json();
    console.log('User found:', userData);

    return {
      id: userData.id,
      name: userData.first_name, // Telegram'dan kelgan ismni name'ga o'giramiz
      username: `@${userData.username}`,
      avatar: userData.avatar,
    };

  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};