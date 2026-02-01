interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// MANA SHU QISMINI QO'SHING:
interface Window {
  Telegram?: {
    WebApp: {
      close: () => void;
      initDataUnsafe: {
        user?: {
          id: number;
          first_name: string;
          username?: string;
        };
      };
      showAlert: (message: string) => void;
    };
  };
}