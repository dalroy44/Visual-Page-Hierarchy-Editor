'use client';

import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import HomeSections from './home-sections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LayoutList, Trash2 } from 'lucide-react';
import { Section } from '@/types';

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

interface PageNodeData {
  label: string;
  icon: string;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  onAddPage?: (name: string) => void;
  onDeletePage?: () => void;
}

const PageNode = ({ data }: NodeProps<PageNodeData>) => {
  const Icon = iconMap[data.icon] || iconMap.Default;
  const [showAddPage, setShowAddPage] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddPage = () => {
    if (data.onAddPage && newPageName.trim()) {
      data.onAddPage(newPageName.trim());
      setNewPageName('');
      setShowAddPage(false);
    }
  };

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const newSectionId = newSectionName.trim().toLowerCase().replace(/\s+/g, '-');
    if (data.sections.find(s => s.id === newSectionId)) {
      setNewSectionName('');
      setShowAddSection(false);
      return;
    }
    const newSection: Section = {
      id: newSectionId,
      name: newSectionName.trim(),
    };
    data.setSections([...data.sections, newSection]);
    setNewSectionName('');
    setShowAddSection(false);
  };

  return (
    <Card className="w-[250px] shadow-lg border-primary/50">
      <Handle type="target" position={Position.Top} className="!bg-primary w-4 !-ml-2" />
      <CardHeader className="p-3 bg-primary/10 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {data.label}
        </CardTitle>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => setShowAddSection((v) => !v)}
            title="Add Section"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
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
      {showAddSection && (
        <div className="px-3 pb-2 flex gap-2 items-center">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Section name"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAddSection();
            }}
            autoFocus
          />
          <Button size="sm" variant="outline" onClick={handleAddSection}>
            Add
          </Button>
        </div>
      )}
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
        {data.sections.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center py-4">
            No sections yet. Click <span className="inline-flex items-center"><LayoutList className="w-4 h-4 mx-1 inline" />Add Section</span> to get started.
          </div>
        ) : (
          <HomeSections
            sections={data.sections}
            setSections={data.setSections}
          />
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-primary w-4 !-ml-2" />
    </Card>
  );
};

export default memo(PageNode);
