import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from 'reactflow';
import { useToast } from '@/hooks/use-toast';
import type { Section, EnrichedNode } from '@/types';
import { getLayoutedElements } from '@/lib/layout';
import { StorageService } from '@/services/storage';
import { getAllDescendantIds, generateNodeId, downloadJsonFile } from '@/lib/hierarchy';
import { initialHomeSectionsData, initialNodesData, initialEdgesData } from '@/constants';

export const useHierarchyLogic = () => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [sectionsMap, setSectionsMap] = useState<{ [id: string]: Section[] }>({
    home: initialHomeSectionsData,
  });
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const setNodeSections = (id: string, sections: Section[]) => {
    setSectionsMap((prev) => ({ ...prev, [id]: sections }));
  };

  const handleLoad = useCallback((silent = false) => {
    const savedData = StorageService.load();
    if (savedData) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(savedData.nodes, savedData.edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setSectionsMap(savedData.sectionsMap || { home: initialHomeSectionsData });
      if (!silent) {
        toast({
          title: 'Structure Loaded',
          description: 'Your page hierarchy has been loaded from local storage.',
        });
      }
    } else {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodesData, initialEdgesData);
      const initialSections = initialNodesData.reduce((acc, node) => {
        acc[node.id] = node.id === 'home' ? initialHomeSectionsData : [];
        return acc;
      }, {} as { [id: string]: Section[] });
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setSectionsMap(initialSections);
    }
  }, [setNodes, setEdges, toast]);

  const handleSave = useCallback(() => {
    const data = { nodes, edges, sectionsMap };
    StorageService.save(data);
    toast({
      title: 'Structure Saved',
      description: 'Your page hierarchy has been saved to local storage.',
      style: {
        backgroundColor: 'hsl(var(--accent))',
        color: 'hsl(var(--accent-foreground))',
        border: '1px solid hsl(var(--accent-foreground))'
      }
    });
  }, [nodes, edges, sectionsMap, toast]);

  const handleReset = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodesData, initialEdgesData);
    const initialSections = initialNodesData.reduce((acc, node) => {
      acc[node.id] = node.id === 'home' ? initialHomeSectionsData : [];
      return acc;
    }, {} as { [id: string]: Section[] });
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setSectionsMap(initialSections);
    toast({
      title: 'Structure Reset',
      description: 'The hierarchy has been reset to the default structure.',
    });
  }, [setNodes, setEdges, toast]);

  const handleExport = useCallback(() => {
    const data = { nodes, edges, sectionsMap };
    downloadJsonFile(data, 'page-hierarchy.json');
    toast({
      title: 'Exported to JSON',
      description: 'Your page hierarchy has been downloaded.',
    });
  }, [nodes, edges, sectionsMap, toast]);

  const handleLoadFromFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await StorageService.loadFromFile(file);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(data.nodes, data.edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setSectionsMap(data.sectionsMap || { home: initialHomeSectionsData });
      toast({
        title: 'Structure Loaded',
        description: 'Your page hierarchy has been loaded from file.',
      });
    } catch (error) {
      toast({
        title: 'Invalid File',
        description: 'Could not parse the selected JSON file.',
        variant: 'destructive',
      });
    }
    // Reset input so same file can be loaded again if needed
    e.target.value = '';
  }, [setNodes, setEdges, setSectionsMap, toast]);

  const addPage = useCallback((parentNodeId: string, name: string) => {
    const newNodeId = generateNodeId(name);
    if (nodes.find(n => n.id === newNodeId)) {
      toast({
        title: 'Error',
        description: 'A page with this name already exists.',
        variant: 'destructive',
      });
      return;
    }

    const newNode: Node = {
      id: newNodeId,
      type: 'pageNode',
      position: { x: 0, y: 0 },
      data: { label: name.trim(), icon: 'Default' },
    };

    const newEdge: Edge = {
      id: `e-${parentNodeId}-${newNodeId}`,
      source: parentNodeId,
      target: newNodeId,
      animated: true,
      style: { strokeWidth: 2 },
    };

    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setSectionsMap((prev) => ({ ...prev, [newNodeId]: [] }));
    
    toast({
      title: 'Page Added',
      description: `The page "${name.trim()}" has been added.`,
    });
  }, [nodes, edges, setNodes, setEdges, toast]);

  const deletePage = useCallback((nodeId: string) => {
    const toDelete = [nodeId, ...getAllDescendantIds(nodeId, edges)];
    setNodes(nodes.filter(n => !toDelete.includes(n.id)));
    setEdges(edges.filter(e => !toDelete.includes(e.source) && !toDelete.includes(e.target)));
    setSectionsMap(prev => {
      const updated = { ...prev };
      toDelete.forEach(id => delete updated[id]);
      return updated;
    });
    toast({
      title: 'Page Deleted',
      description: `Page and its child pages have been deleted.`,
      variant: 'destructive',
    });
  }, [nodes, edges, setNodes, setEdges, toast]);

  const deleteSection = useCallback((nodeId: string, sectionId: string) => {
    setSectionsMap(prev => {
        const currentSections = prev[nodeId] || [];
        const updatedSections = currentSections.filter(s => s.id !== sectionId);
        return { ...prev, [nodeId]: updatedSections };
    });
    toast({
        title: 'Section Deleted',
        description: `The section has been deleted.`,
    });
  }, [setSectionsMap, toast]);

  const enrichedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        dragHandle: '.custom-drag-handle',
        sections: sectionsMap[node.id] || [],
        setSections: (sections: Section[]) => setNodeSections(node.id, sections),
        onDeleteSection: (sectionId: string) => deleteSection(node.id, sectionId),
        onAddPage: (name: string) => addPage(node.id, name),
        onDeletePage: node.id === 'home' ? undefined : () => deletePage(node.id)
      }
    })) as EnrichedNode[];
  }, [nodes, sectionsMap, addPage, deletePage, deleteSection]);

  useEffect(() => {
    setIsClient(true);
    handleLoad(true);
  }, [handleLoad]);

  return {
    // State
    nodes: enrichedNodes,
    edges,
    isClient,
    fileInputRef,
    
    // Handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleLoad,
    handleSave,
    handleReset,
    handleExport,
    handleLoadFromFile,
  };
};
