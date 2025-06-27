import { renderHook, act } from '@testing-library/react';
import { useHierarchyLogic } from '../use-hierarchy-logic';
import { StorageService } from '@/services/storage';
import * as layout from '@/lib/layout';
import * as hierarchy from '@/lib/hierarchy';
import { useToast } from '../use-toast';
import { initialNodesData, initialHomeSectionsData } from '@/constants';

// Mocks
jest.mock('@/services/storage');
jest.mock('@/lib/layout');
jest.mock('../use-toast');
jest.mock('@/lib/hierarchy', () => ({
  ...jest.requireActual('@/lib/hierarchy'),
  downloadJsonFile: jest.fn(),
}));

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;
const mockGetLayoutedElements = layout.getLayoutedElements as jest.Mock;
const mockUseToast = useToast as jest.Mock;
const mockDownloadJsonFile = hierarchy.downloadJsonFile as jest.Mock;

describe('useHierarchyLogic', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockGetLayoutedElements.mockImplementation((nodes, edges) => ({ nodes, edges }));
    jest.spyOn(hierarchy, 'generateNodeId').mockImplementation(name => name.trim().toLowerCase().replace(/\s+/g, '-'));
    mockStorageService.load.mockReturnValue(null); // Ensure storage is empty before each test
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize and load default data when no saved data exists', () => {
    mockStorageService.load.mockReturnValue(null);
    const { result } = renderHook(() => useHierarchyLogic());
    act(() => {}); // Let useEffect run
    
    const homeNode = result.current.nodes.find(n => n.id === 'home');
    expect(homeNode?.data.sections).toEqual(initialHomeSectionsData);
    expect(result.current.nodes.length).toBe(initialNodesData.length);
  });

  it('should load data from storage if it exists', () => {
    const savedData = {
      nodes: [{ id: 'saved-node', position: { x: 0, y: 0 }, data: { label: 'Saved' } }],
      edges: [],
      sectionsMap: { 'saved-node': [{ id: 'saved-section', name: 'Saved Section' }] },
    };
    mockStorageService.load.mockReturnValue(savedData);
    const { result } = renderHook(() => useHierarchyLogic());
    act(() => {});
    
    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].data.label).toBe('Saved');
    expect(result.current.nodes[0].data.sections[0].name).toBe('Saved Section');
  });

  it('should save the current state to storage', () => {
    const { result } = renderHook(() => useHierarchyLogic());
    act(() => { result.current.handleSave(); });
    
    expect(mockStorageService.save).toHaveBeenCalledTimes(1);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Structure Saved' }));
  });

  it('should reset the state to initial data', () => {
    const { result } = renderHook(() => useHierarchyLogic());
    
    act(() => {
      const contactNode = result.current.nodes.find(n => n.id === 'contact');
      contactNode?.data.onDeletePage?.();
    });
    expect(result.current.nodes.find(n => n.id === 'contact')).toBeUndefined();
    
    act(() => { result.current.handleReset(); });

    expect(result.current.nodes).toHaveLength(initialNodesData.length);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Structure Reset' }));
  });

  it('should export the current state as a JSON file', () => {
    const { result } = renderHook(() => useHierarchyLogic());
    act(() => { result.current.handleExport(); });

    expect(mockDownloadJsonFile).toHaveBeenCalledWith(expect.any(Object), 'page-hierarchy.json');
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Exported to JSON' }));
  });

  describe('addPage', () => {
      it('should add a new page and a corresponding edge', () => {
        // Ensure storage is empty for this test
        mockStorageService.load.mockReturnValue(null);
  
        const { result } = renderHook(() => useHierarchyLogic());
        const initialNodeCount = result.current.nodes.length;
  
        act(() => {
          const homeNode = result.current.nodes.find(n => n.id === 'home');
          homeNode?.data.onAddPage?.('New Awesome Page');
        });
  
        expect(result.current.nodes).toHaveLength(initialNodeCount + 1);
        expect(result.current.nodes.find(n => n.id === 'new-awesome-page')).toBeDefined();
        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Page Added' }));
      });

    it('should show an error toast if a page with the same name exists', () => {
      const { result } = renderHook(() => useHierarchyLogic());
      act(() => {
        const homeNode = result.current.nodes.find(n => n.id === 'home');
        homeNode?.data.onAddPage?.('Duplicate Page');
      });
      const initialNodeCount = result.current.nodes.length;
      
      act(() => {
        const homeNode = result.current.nodes.find(n => n.id === 'home');
        homeNode?.data.onAddPage?.('Duplicate Page');
      });

      expect(result.current.nodes).toHaveLength(initialNodeCount);
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Error', variant: 'destructive' }));
    });
  });

  describe('addSection', () => {
    it('should add a new section to a node', () => {
      const { result } = renderHook(() => useHierarchyLogic());
      act(() => {
        const homeNode = result.current.nodes.find(n => n.id === 'home');
        homeNode?.data.onAddSection?.('My New Section');
      });
      const homeNode = result.current.nodes.find(n => n.id === 'home');
      expect(homeNode?.data.sections.find(s => s.id === 'my-new-section')).toBeDefined();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Section Added' }));
    });

    it('should show an error for empty section names', () => {
      const { result } = renderHook(() => useHierarchyLogic());
      act(() => {
        const homeNode = result.current.nodes.find(n => n.id === 'home');
        homeNode?.data.onAddSection?.('   ');
      });
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ description: 'Section name cannot be empty.', variant: 'destructive' }));
    });
  });

  describe('deletePage', () => {
    it('should delete a page and all its descendants', () => {
      const { result } = renderHook(() => useHierarchyLogic());
      const initialNodeCount = result.current.nodes.length;
      act(() => {
        const servicesNode = result.current.nodes.find(n => n.id === 'services');
        servicesNode?.data.onDeletePage?.();
      });
      expect(result.current.nodes).toHaveLength(initialNodeCount - 3);
      expect(result.current.nodes.find(n => n.id === 'services')).toBeUndefined();
      expect(result.current.nodes.find(n => n.id === 'service-detail-1')).toBeUndefined();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Page Deleted' }));
    });
  });
  
  describe('deleteSection', () => {
    it('should delete a section from a node', () => {
      const { result } = renderHook(() => useHierarchyLogic());
      const homeNodeBefore = result.current.nodes.find(n => n.id === 'home');
      const initialSectionCount = homeNodeBefore?.data.sections.length || 0;

      act(() => {
        homeNodeBefore?.data.onDeleteSection?.('hero');
      });

      const homeNodeAfter = result.current.nodes.find(n => n.id === 'home');
      expect(homeNodeAfter?.data.sections.length).toBe(initialSectionCount - 1);
      expect(homeNodeAfter?.data.sections.find(s => s.id === 'hero')).toBeUndefined();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Section Deleted' }));
    });
  });

  describe('handleLoadFromFile', () => {
    it('should load data from a valid file', async () => {
        const fileContent = { nodes: [{ id: 'file-node', data: {} }], edges: [], sectionsMap: { 'file-node': [] } };
        const file = new File([JSON.stringify(fileContent)], 'hierarchy.json', { type: 'application/json' });
        const mockEvent = { target: { files: [file], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
        mockStorageService.loadFromFile.mockResolvedValue(fileContent as any);
        
        const { result } = renderHook(() => useHierarchyLogic());
        await act(async () => {
            await result.current.handleLoadFromFile(mockEvent);
        });

        expect(result.current.nodes[0].id).toBe('file-node');
        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Structure Loaded' }));
    });

    it('should show an error for an invalid file', async () => {
        const file = new File(['invalid json'], 'hierarchy.json', { type: 'application/json' });
        const mockEvent = { target: { files: [file], value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>;
        mockStorageService.loadFromFile.mockRejectedValue(new Error('Invalid JSON'));

        const { result } = renderHook(() => useHierarchyLogic());
        await act(async () => {
            await result.current.handleLoadFromFile(mockEvent);
        });

        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Invalid File', variant: 'destructive' }));
    });
  });
});
