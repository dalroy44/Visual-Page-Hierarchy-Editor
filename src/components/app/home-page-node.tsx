'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Home, Plus } from 'lucide-react';
import HomeSections from './home-sections';
import type { Section } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HomePageNodeData {
  label: string;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  onAddPage?: (name: string) => void;
}

const HomePageNode = ({ data }: NodeProps<HomePageNodeData>) => {
  const { toast } = useToast();
  const [newSectionName, setNewSectionName] = useState('');
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
        toast({
            title: 'Error',
            description: 'Section name cannot be empty.',
            variant: 'destructive',
        });
        return;
    }
    const newSectionId = newSectionName.trim().toLowerCase().replace(/\s+/g, '-');
    if (data.sections.find(s => s.id === newSectionId)) {
        toast({
            title: 'Error',
            description: 'A section with this name already exists.',
            variant: 'destructive',
        });
        return;
    }

    const newSection: Section = {
        id: newSectionId,
        name: newSectionName.trim(),
    };

    if (data.setSections) {
        data.setSections([...data.sections, newSection]);
    }
    setNewSectionName('');
    toast({
        title: 'Section Added',
        description: `The section "${newSectionName.trim()}" has been added.`,
    });
  };

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast({
        title: 'Error',
        description: 'Page name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    if (data.onAddPage) {
      data.onAddPage(newPageName.trim());
      toast({
        title: 'Page Added',
        description: `The page "${newPageName.trim()}" has been added.`,
      });
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  return (
    <Card className="w-[250px] shadow-lg border-primary/50">
      <Handle type="target" position={Position.Top} className="!bg-primary w-4 !-ml-2" />
      <CardHeader className="p-3 bg-primary/10 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Home className="w-5 h-5 text-primary" />
          {data.label}
        </CardTitle>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setShowAddPage((v) => !v)}
          title="Add Page"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      {showAddPage && (
        <div className="px-3 pb-2 flex gap-2 items-center">
          <Input
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddPage();
            }}
            autoFocus
          />
          <Button size="sm" variant="outline" onClick={handleAddPage}>
            Add
          </Button>
        </div>
      )}
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground mb-2">Reorder sections:</p>
        {data.sections && data.setSections && (
          <HomeSections sections={data.sections} setSections={data.setSections} />
        )}
        <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">Add new section:</p>
            <div className="flex items-center gap-2">
                <Input
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Section name"
                    className="h-8 text-sm"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddSection(); }}
                />
                <Button onClick={handleAddSection} size="sm" variant="outline">Add</Button>
            </div>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary w-4 !-ml-2" />
    </Card>
  );
};

export default memo(HomePageNode);
