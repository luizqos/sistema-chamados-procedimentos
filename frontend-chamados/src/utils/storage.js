import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY;

export const secureStorage = {
  setItem(key, value) {
    if (typeof window === 'undefined') return;
    try {
      const dataToEncrypt = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error(`Erro ao salvar no storage (${key}):`, error);
    }
  },

  getItem(key, isJson = false) {
    if (typeof window === 'undefined') return null;
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) return null;

      return isJson ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
      console.error(`Erro ao ler do storage (${key}):`, error);
      localStorage.removeItem(key);
      return null;
    }
  },

  removeItem(key) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};