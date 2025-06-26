'use client';

import VisualHierarchy from '@/components/app';
import { ComposerHeader } from '@/components/app/composer-header';
import { useHierarchyLogic } from '@/hooks/use-hierarchy-logic';
import 'reactflow/dist/style.css';

export default function ComposerPage() {
  const {
    nodes,
    edges,
    isClient,
    fileInputRef,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleLoad,
    handleSave,
    handleReset,
    handleExport,
    handleLoadFromFile,
  } = useHierarchyLogic();

  if (!isClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Loading Composer...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background font-body">
      <ComposerHeader
        onSave={handleSave}
        onLoad={() => handleLoad(false)}
        onReset={handleReset}
        onExport={handleExport}
        onLoadFromFile={handleLoadFromFile}
        fileInputRef={fileInputRef}
      />
      <main className="flex-grow">
        <VisualHierarchy
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </main>
    </div>
  );
}