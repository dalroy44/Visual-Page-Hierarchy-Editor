'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';
import PageNode from './page-node';

interface VisualHierarchyProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export default function VisualHierarchy({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: VisualHierarchyProps) {
  const nodeTypes = useMemo(
    () => ({
      pageNode: PageNode,
    }),
    []
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        {/* <MiniMap nodeColor={(n) => (n.id === 'home' ? 'hsl(var(--primary))' : '#ddd')} nodeStrokeWidth={3} zoomable pannable /> */}
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
