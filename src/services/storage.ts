import type { HierarchyData } from '../types';
import { STORAGE_KEY } from '../constants';

export class StorageService {
  static save(data: HierarchyData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  static load(): HierarchyData | null {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('Failed to parse saved data:', error);
          return null;
        }
      }
    }
    return null;
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  static loadFromFile(file: File): Promise<HierarchyData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}