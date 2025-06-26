import React from 'react';
import { render, screen } from '@testing-library/react';
import VisualHierarchy from '@/components/app';
import { type Node, type Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';

// Minimal mock of ReactFlow
jest.mock('reactflow', () => {
    const originalModule = jest.requireActual('reactflow');
    return {
        ...originalModule,
        __esModule: true,
        default: jest.fn(({ nodes, edges, children }) => (
            <div data-testid="react-flow-mock">
                <div data-testid="nodes-container">
                    {nodes.map((n: Node) => <div key={n.id}>{n.data.label}</div>)}
                </div>
                <div data-testid="edges-container">
                    {edges.map((e: Edge) => <div key={e.id}>{e.id}</div>)}
                </div>
                {children}
            </div>
        )),
        Controls: () => <div data-testid="controls-mock" />,
        Background: () => <div data-testid="background-mock" />,
        MiniMap: () => <div data-testid="minimap-mock" />,
    };
});

describe('VisualHierarchy', () => {
    const mockOnNodesChange = jest.fn();
    const mockOnEdgesChange = jest.fn();
    const mockOnConnect = jest.fn();

    const nodes: Node[] = [
        { id: '1', type: 'pageNode', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
        { id: '2', type: 'homePageNode', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    ];

    const edges: Edge[] = [
        { id: 'e1-2', source: '1', target: '2' },
    ];

    it('renders the ReactFlow component with nodes and edges', () => {
        render(
            <VisualHierarchy
                nodes={nodes}
                edges={edges}
                onNodesChange={mockOnNodesChange}
                onEdgesChange={mockOnEdgesChange}
                onConnect={mockOnConnect}
            />
        );

        expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();
        expect(screen.getByText('Node 1')).toBeInTheDocument();
        expect(screen.getByText('Node 2')).toBeInTheDocument();
        expect(screen.getByText('e1-2')).toBeInTheDocument();
    });

    it('renders the Controls and Background components', () => {
        render(
            <VisualHierarchy
                nodes={nodes}
                edges={edges}
                onNodesChange={mockOnNodesChange}
                onEdgesChange={mockOnEdgesChange}
                onConnect={mockOnConnect}
            />
        );

        expect(screen.getByTestId('controls-mock')).toBeInTheDocument();
        expect(screen.getByTestId('background-mock')).toBeInTheDocument();
        // MiniMap is commented out in the component, so we shouldn't find it.
        expect(screen.queryByTestId('minimap-mock')).not.toBeInTheDocument();
    });
});
