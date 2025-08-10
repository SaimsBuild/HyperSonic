import { AppData } from '@shared/schema';

export const STORAGE_KEY = 'hypersonic-data';

export const loadAppData = (): AppData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading app data from localStorage:', error);
    return null;
  }
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data to localStorage:', error);
  }
};
