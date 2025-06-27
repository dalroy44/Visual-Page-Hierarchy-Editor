import { getAllDescendantIds, generateNodeId, downloadJsonFile } from '@/lib/hierarchy';
import type { Edge } from 'reactflow';

describe('hierarchy utilities', () => {
  describe('getAllDescendantIds', () => {
    const edges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e2-4', source: '2', target: '4' },
      { id: 'e3-5', source: '3', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
    ];

    it('should return all descendant IDs for a given parent', () => {
      const descendants = getAllDescendantIds('1', edges);
      expect(descendants).toHaveLength(5);
      expect(descendants).toEqual(expect.arrayContaining(['2', '3', '4', '5', '6']));
    });

    it('should return descendants for a mid-level node', () => {
      const descendants = getAllDescendantIds('3', edges);
      expect(descendants).toHaveLength(2);
      expect(descendants).toEqual(expect.arrayContaining(['5', '6']));
    });

    it('should return an empty array for a leaf node', () => {
      const descendants = getAllDescendantIds('4', edges);
      expect(descendants).toHaveLength(0);
    });

    it('should return an empty array for a non-existent node', () => {
      const descendants = getAllDescendantIds('99', edges);
      expect(descendants).toHaveLength(0);
    });
  });

  describe('generateNodeId', () => {
    it('should convert a name to a slug-like ID', () => {
      expect(generateNodeId('About Us')).toBe('about-us');
    });

    it('should handle single words', () => {
      expect(generateNodeId('Home')).toBe('home');
    });

    it('should handle multiple spaces', () => {
      expect(generateNodeId('My  New   Page')).toBe('my-new-page');
    });

    it('should trim whitespace', () => {
      expect(generateNodeId('  Contact  ')).toBe('contact');
    });

    it('should convert to lowercase', () => {
      expect(generateNodeId('UPPERCASE PAGE')).toBe('uppercase-page');
    });
  });

  describe('downloadJsonFile', () => {
    it('should create and click a link to download a JSON file', () => {
      const mockData = { foo: 'bar' };
      const mockFilename = 'test.json';
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };

      // Mock document.createElement and appendChild
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      
      downloadJsonFile(mockData, mockFilename);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe(`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(mockData, null, 2))}`);
      expect(mockLink.download).toBe(mockFilename);
      expect(mockLink.click).toHaveBeenCalledTimes(1);

      // Clean up mock
      (document.createElement as jest.Mock).mockRestore();
    });
  });
});
