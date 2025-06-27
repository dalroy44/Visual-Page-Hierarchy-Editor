import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortableSection } from '@/components/app/sortable-section';

// Mock Lucide icons
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        GripVertical: () => <div data-testid="icon-grip" />,
        Trash2: () => <div data-testid="icon-trash" />,
    };
});

// Mock useSortable hook
jest.mock('@dnd-kit/sortable', () => {
    const originalModule = jest.requireActual('@dnd-kit/sortable');
    return {
        ...originalModule,
        useSortable: () => ({
            attributes: {},
            listeners: {},
            setNodeRef: jest.fn(),
            transform: null,
            transition: null,
            isDragging: false,
        }),
    };
});


describe('SortableSection', () => {
  const mockOnDelete = jest.fn();
  const sectionProps = {
    id: 'section-1',
    name: 'Test Section',
    onDelete: mockOnDelete,
  };

  const renderComponent = () => {
    return render(
      <DndContext>
        <SortableContext items={['section-1']}>
          <SortableSection {...sectionProps} />
        </SortableContext>
      </DndContext>
    );
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('renders the section name', () => {
    renderComponent();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders the drag handle icon', () => {
    renderComponent();
    expect(screen.getByTestId('icon-grip')).toBeInTheDocument();
  });

  it('calls onDelete with the correct id when the delete button is clicked', () => {
    renderComponent();
    const deleteButton = screen.getByTitle('Delete "Test Section" section');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('section-1');
  });
});
