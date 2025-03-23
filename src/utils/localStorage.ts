export const localStorageService = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  },

  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  },

  getJSON: (key: string) => {
    const item = localStorageService.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  setJSON: (key: string, value: unknown) => {
    localStorageService.setItem(key, JSON.stringify(value));
  }
};
