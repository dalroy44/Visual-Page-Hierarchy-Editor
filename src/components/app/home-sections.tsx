'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './sortable-section';
import type { Section } from '@/types';

interface HomeSectionsProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export default function HomeSections({ sections, setSections, onDeleteSection }: HomeSectionsProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            setSections(arrayMove(sections, oldIndex, newIndex));
        }
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {sections.map((section) => (
                        <SortableSection 
                            key={section.id} 
                            id={section.id} 
                            name={section.name} 
                            onDelete={(id) => onDeleteSection?.(id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
