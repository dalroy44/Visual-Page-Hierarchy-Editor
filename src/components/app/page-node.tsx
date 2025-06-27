'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import SectionList from './section-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LayoutList, Trash2 } from 'lucide-react';
import type { PageNodeData } from '@/types';

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Users: LucideIcons.Users,
  Cog: LucideIcons.Cog,
  Mail: LucideIcons.Mail,
  Newspaper: LucideIcons.Newspaper,
  Default: LucideIcons.File,
  Home: LucideIcons.Home,
  Info: LucideIcons.Info,
  Briefcase: LucideIcons.Briefcase,
  MessageSquare: LucideIcons.MessageSquare,
};

const PageNode = ({ data, id }: NodeProps<PageNodeData>) => {
  const Icon = iconMap[data.icon || 'Default'] || iconMap.Default;
  const [showAddPage, setShowAddPage] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const isRootNode = id === 'home';

  const handleAddPage = () => {
    if (data.onAddPage && newPageName.trim()) {
      data.onAddPage(newPageName.trim());
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  const handleAddSection = () => {
    data.onAddSection(newSectionName);
    setNewSectionName('');
  };

  return (
    <Card className="w-[250px] shadow-lg border-primary/50">
      <Handle type="target" position={Position.Top} className="!bg-primary w-4 !-ml-2" />
      <CardHeader className="p-3 bg-primary/10 flex flex-row items-center justify-between custom-drag-handle cursor-grab">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {data.label}
        </CardTitle>
        <div className="flex gap-1">
          {!isRootNode && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setShowAddSection((v) => !v)}
              title="Add Section"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          )}
          {data.onAddPage && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setShowAddPage((v) => !v)}
              title="Add Page"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
          {data.onDeletePage && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={data.onDeletePage}
              title="Delete Page"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardHeader>

      {showAddPage && (
        <div className="px-3 pb-2 flex gap-2 items-center border-b">
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

      {(showAddSection || isRootNode) && (
        <div className="px-3 py-3 flex gap-2 items-center border-b">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="New section name"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddSection();
            }}
          />
          <Button size="sm" variant="outline" onClick={handleAddSection}>
            Add Section
          </Button>
        </div>
      )}
      
      <CardContent className="p-3 pt-2">
        {(data.sections || []).length === 0 ? (
          <div className="text-muted-foreground text-sm text-center py-4">
            No sections yet.
          </div>
        ) : (
          <SectionList
            sections={data.sections}
            setSections={data.setSections}
            onDeleteSection={data.onDeleteSection}
          />
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary w-4 !-ml-2" />
    </Card>
  );
};

export default memo(PageNode);