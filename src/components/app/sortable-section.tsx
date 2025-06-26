'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
  id: string;
  name: string;
}

export function SortableSection({ id, name }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="p-2 flex items-center bg-card/50 hover:bg-card/90 transition-colors">
          <button {...listeners} className="cursor-grab active:cursor-grabbing p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <GripVertical size={16} />
          </button>
          <span className="flex-grow">{name}</span>
      </Card>
    </div>
  );
}
