// geminiService.ts ni shunday qilib soddalashtiring:
export const validateUsername = async (username: string): Promise<boolean> => {
  // Shunchaki formatni tekshiramiz: kamida 3 ta harf va @ bilan boshlanishi
  return username.length > 3 && username.startsWith('@');
};