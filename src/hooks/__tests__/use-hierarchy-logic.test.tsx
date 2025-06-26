import { renderHook, act } from '@testing-library/react';
import { useHierarchyLogic } from '../use-hierarchy-logic';
import { StorageService } from '@/services/storage';
import * as layout from '@/lib/layout';
import * as hierarchy from '@/lib/hierarchy';
import { useToast } from '../use-toast';
import { initialNodesData, initialEdgesData, initialHomeSectionsData } from '@/constants';

// Mocks
jest.mock('@/services/storage');
jest.mock('@/lib/layout');
jest.mock('../use-toast');

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;
const mockGetLayoutedElements = layout.getLayoutedElements as jest.Mock;
const mockUseToast = useToast as jest.Mock;

describe('useHierarchyLogic', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockGetLayoutedElements.mockImplementation((nodes, edges) => ({ nodes, edges }));
    // Mock generateNodeId to be deterministic
    jest.spyOn(hierarchy, 'generateNodeId').mockImplementation(name => name.toLowerCase().replace(/\s+/g, '-'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize and load default data when no saved data exists', () => {
    mockStorageService.load.mockReturnValue(null);
    const { result } = renderHook(() => useHierarchyLogic());
    
    act(() => {
        // useEffect calls handleLoad, let's wait for it
    });

    expect(result.current.nodes).toHaveLength(initialNodesData.length);
    expect(result.current.edges).toHaveLength(initialEdgesData.length);
    expect(result.current.homeSections).toEqual(initialHomeSectionsData);
  });

  it('should load data from storage if it exists', () => {
    const savedData = {
      nodes: [{ id: 'saved-node', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Saved' } }],
      edges: [],
      homeSections: [{ id: 'saved-section', name: 'Saved Section' }],
      sectionsMap: { 'saved-node': [] },
    };
    mockStorageService.load.mockReturnValue(savedData);

    const { result } = renderHook(() => useHierarchyLogic());

    act(() => {});

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].id).toBe('saved-node');
    expect(result.current.homeSections).toEqual(savedData.homeSections);
    expect(result.current.sectionsMap).toEqual(savedData.sectionsMap);
  });

  it('should save the current state to storage', () => {
    const { result } = renderHook(() => useHierarchyLogic());

    act(() => {
      result.current.handleSave();
    });

    expect(mockStorageService.save).toHaveBeenCalledTimes(1);
    expect(mockStorageService.save).toHaveBeenCalledWith({
      nodes: expect.any(Array),
      edges: expect.any(Array),
      sectionsMap: expect.any(Object),
    });
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Structure Saved' }));
  });

  it('should reset the state to initial data', () => {
    const { result } = renderHook(() => useHierarchyLogic());
    
    // Some action to change state
    act(() => {
      const { result: hookResult } = renderHook(() => useHierarchyLogic());
      hookResult.current.onNodesChange([{ id: 'home', type: 'remove' }]);
    });
    
    act(() => {
        result.current.handleReset();
    });

    expect(result.current.nodes).toHaveLength(initialNodesData.length);
    expect(result.current.edges).toHaveLength(initialEdgesData.length);
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Structure Reset' }));
  });
});
