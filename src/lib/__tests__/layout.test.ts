import { getLayoutedElements } from '../layout';
import { Position, type Node, type Edge } from 'reactflow';

describe('getLayoutedElements', () => {
  const nodes: Node[] = [
    { id: '1', data: {}, position: { x: 0, y: 0 }, type: 'default' },
    { id: '2', data: {}, position: { x: 0, y: 0 }, type: 'default' },
    { id: '3', data: {}, position: { x: 0, y: 0 }, type: 'default' },
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ];

  it('returns nodes and edges with layouted positions', () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);

    expect(layoutedNodes).toHaveLength(3);
    expect(layoutedEdges).toEqual(edges);

    layoutedNodes.forEach((node) => {
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
      expect(node.targetPosition).toBe(Position.Top);
      expect(node.sourcePosition).toBe(Position.Bottom);
    });
  });

  it('handles empty nodes and edges', () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements([], []);
    expect(layoutedNodes).toEqual([]);
    expect(layoutedEdges).toEqual([]);
  });

  it('does not mutate the original nodes array', () => {
    const nodesCopy = JSON.parse(JSON.stringify(nodes));
    getLayoutedElements(nodes, edges);
    expect(nodes).toEqual(nodesCopy);
  });

  it('positions are centered relative to node size', () => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);
    layoutedNodes.forEach((node) => {
      // The position should be offset by half nodeWidth and nodeHeight
      expect(node.position.x).not.toBe(0);
      expect(node.position.y).not.toBe(0);
    });
  });
});