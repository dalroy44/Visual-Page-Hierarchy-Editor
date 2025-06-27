import { getLayoutedElements } from '@/lib/layout';
import { type Node, type Edge, Position } from 'reactflow';

describe('getLayoutedElements', () => {
  it('should return empty arrays for no nodes or edges', () => {
    const { nodes, edges } = getLayoutedElements([], []);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it('should return layouted nodes with position properties', () => {
    const initialNodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
      { id: '2', position: { x: 0, y: 0 }, data: { label: 'Node 2' } },
    ];
    const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

    const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);

    nodes.forEach(node => {
      expect(node).toHaveProperty('position');
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
      expect(node.targetPosition).toBe(Position.Top);
      expect(node.sourcePosition).toBe(Position.Bottom);
    });
  });

  it('should handle a more complex graph structure', () => {
    const initialNodes: Node[] = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
      { id: '2', position: { x: 0, y: 0 }, data: { label: '2' } },
      { id: '3', position: { x: 0, y: 0 }, data: { label: '3' } },
      { id: '4', position: { x: 0, y: 0 }, data: { label: '4' } },
    ];
    const initialEdges: Edge[] = [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
    ];

    const { nodes } = getLayoutedElements(initialNodes, initialEdges);

    expect(nodes).toHaveLength(4);
    // A simple check to ensure positions are being calculated and are not the default 0,0
    // The exact positions depend on the dagre library and are complex to predict precisely.
    nodes.forEach(node => {
      expect(node.position.x).not.toBe(0);
    });
  });
});
