import { StorageService } from '../storage';
import { STORAGE_KEY } from '../../constants';

const mockData = { foo: 'bar' };

describe('StorageService', () => {
  beforeEach(() => {
    // @ts-ignore
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    };
    // @ts-ignore
    global.FileReader = class {
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
      readAsText = jest.fn(function (this: any, file: File) {
        if (this.onload) {
          this.onload({ target: { result: '{"foo":"bar"}' } } as any);
        }
      });
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('saves data to localStorage', () => {
      StorageService.save(mockData as any);
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(mockData));
    });
  });

  describe('load', () => {
    it('loads and parses data from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockData));
      expect(StorageService.load()).toEqual(mockData);
    });

    it('returns null if no data is found', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      expect(StorageService.load()).toBeNull();
    });

    it('returns null and logs error if JSON is invalid', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (localStorage.getItem as jest.Mock).mockReturnValue('not-json');
      expect(StorageService.load()).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('clear', () => {
    it('removes data from localStorage', () => {
      StorageService.clear();
      expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('loadFromFile', () => {
    it('resolves with parsed data for valid JSON file', async () => {
      const file = new File(['{"foo":"bar"}'], 'test.json', { type: 'application/json' });
      const data = await StorageService.loadFromFile(file);
      expect(data).toEqual({ foo: 'bar' });
    });

    it('rejects with error for invalid JSON file', async () => {
      // @ts-ignore
      global.FileReader = class {
        onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
        onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
        readAsText = jest.fn(function (this: any, file: File) {
          if (this.onload) {
            this.onload({ target: { result: 'not-json' } } as any);
          }
        });
      };
      const file = new File(['not-json'], 'test.json', { type: 'application/json' });
      await expect(StorageService.loadFromFile(file)).rejects.toThrow('Invalid JSON file');
    });

    it('rejects with error if file reading fails', async () => {
      // @ts-ignore
      global.FileReader = class {
        onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
        onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
        readAsText = jest.fn(function (this: any, file: File) {
          if (this.onerror) {
            this.onerror(new Event('error'));
          }
        });
      };
      const file = new File([''], 'test.json', { type: 'application/json' });
      await expect(StorageService.loadFromFile(file)).rejects.toThrow('Failed to read file');
    });
  });
});