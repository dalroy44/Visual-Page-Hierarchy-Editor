import { StorageService } from '@/services/storage';
import { STORAGE_KEY } from '@/constants';
import type { HierarchyData } from '@/types';

describe('StorageService', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => localStorageMock[key] || null);
    global.Storage.prototype.removeItem = jest.fn((key) => {
      delete localStorageMock[key];
    });
  });

  afterEach(() => {
    (global.Storage.prototype.setItem as jest.Mock).mockClear();
    (global.Storage.prototype.getItem as jest.Mock).mockClear();
    (global.Storage.prototype.removeItem as jest.Mock).mockClear();
  });

  const testData: HierarchyData = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } } as any],
    edges: [],
    sectionsMap: { '1': [] },
  };

  it('should save data to localStorage', () => {
    StorageService.save(testData);
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(testData));
    expect(localStorageMock[STORAGE_KEY]).toBe(JSON.stringify(testData));
  });

  it('should load data from localStorage', () => {
    localStorageMock[STORAGE_KEY] = JSON.stringify(testData);
    const loadedData = StorageService.load();
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(loadedData).toEqual(testData);
  });

  it('should return null if no data is in localStorage', () => {
    const loadedData = StorageService.load();
    expect(loadedData).toBeNull();
  });

  it('should return null and log an error for invalid JSON', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock[STORAGE_KEY] = 'invalid-json';
    const loadedData = StorageService.load();
    expect(loadedData).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should clear data from localStorage', () => {
    localStorageMock[STORAGE_KEY] = JSON.stringify(testData);
    StorageService.clear();
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(localStorageMock[STORAGE_KEY]).toBeUndefined();
  });

  describe('loadFromFile', () => {
    it('should successfully load and parse a JSON file', async () => {
      const file = new File([JSON.stringify(testData)], 'test.json', { type: 'application/json' });
      const data = await StorageService.loadFromFile(file);
      expect(data).toEqual(testData);
    });

    it('should reject with an error for an invalid JSON file', async () => {
      const file = new File(['invalid-json'], 'test.json', { type: 'application/json' });
      await expect(StorageService.loadFromFile(file)).rejects.toThrow('Invalid JSON file');
    });

    it('should reject with an error if file reading fails', async () => {
        const file = new File([JSON.stringify(testData)], 'test.json', { type: 'application/json' });
        
        const mockReader = {
            readAsText: jest.fn(),
            onload: null as ((e: ProgressEvent<FileReader>) => void) | null,
            onerror: null as (() => void) | null,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);
        
        const promise = StorageService.loadFromFile(file);
        
        // Simulate an error
        if(mockReader.onerror) {
            mockReader.onerror();
        }

        await expect(promise).rejects.toThrow('Failed to read file');

        ((global.FileReader as unknown) as jest.Mock).mockRestore();
    });
  });
});
