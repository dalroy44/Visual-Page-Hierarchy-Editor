import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageNode from '@/components/app/page-node';
import { type NodeProps, ReactFlow, Position } from 'reactflow';
import type { PageNodeData, Section } from '@/types';

// Mock Lucide icons
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        Users: (props: any) => <svg data-testid="icon-users" {...props} />,
        File: (props: any) => <svg data-testid="icon-file" {...props} />,
        Plus: (props: any) => <svg data-testid="icon-plus" {...props} />,
        LayoutList: (props: any) => <svg data-testid="icon-layout-list" {...props} />,
        Trash2: (props: any) => <svg data-testid="icon-trash" {...props} />,
        Cog: (props: any) => <svg data-testid="icon-cog" {...props} />,
        Mail: (props: any) => <svg data-testid="icon-mail" {...props} />,
        Newspaper: (props: any) => <svg data-testid="icon-newspaper" {...props} />,
        Home: (props: any) => <svg data-testid="icon-home" {...props} />,
        Info: (props: any) => <svg data-testid="icon-info" {...props} />,
        Briefcase: (props: any) => <svg data-testid="icon-briefcase" {...props} />,
        MessageSquare: (props: any) => <svg data-testid="icon-message-square" {...props} />,
    };
});

// Mock HomeSections component
jest.mock('../home-sections', () => {
    return {
        __esModule: true,
        default: ({ sections }: { sections: Section[] }) => (
            <div data-testid="home-sections-mock">
                {sections.map(s => <div key={s.id}>{s.name}</div>)}
            </div>
        ),
    };
});


describe('PageNode', () => {
  const mockSetSections = jest.fn();
  const mockOnAddPage = jest.fn();
  const mockOnDeletePage = jest.fn();

  const defaultProps: NodeProps<PageNodeData> = {
    id: 'test-node',
    data: {
      label: 'Test Page',
      icon: 'Users',
      sections: [],
      setSections: mockSetSections,
      onAddPage: mockOnAddPage,
      onDeletePage: mockOnDeletePage,
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    dragging: false,
    zIndex: 1,
    type: 'pageNode',
    selected: false,
    isConnectable: false,
    xPos: 0,
    yPos: 0,
  };

  const renderInFlow = (props: NodeProps<PageNodeData>) => {
    return render(
      <div style={{ width: 500, height: 500 }}>
        <ReactFlow
          nodes={[
            {
              ...props,
              position: { x: 0, y: 0 },
            }
          ]}
          nodeTypes={{ pageNode: PageNode }}
          fitView
        />
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the node with correct label and icon', () => {
    renderInFlow(defaultProps);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByTestId('icon-users')).toBeInTheDocument();
  });

  it('shows placeholder text when there are no sections', () => {
    renderInFlow(defaultProps);
    expect(screen.getByText(/No sections yet/)).toBeInTheDocument();
  });
  
  it('shows and handles adding a new section', () => {
    renderInFlow(defaultProps);

    const addSectionButton = screen.getByTitle('Add Section');
    fireEvent.click(addSectionButton);

    const input = screen.getByPlaceholderText('Section name');
    const addButton = screen.getByText('Add', { selector: 'button' });
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New Test Section' } });
    fireEvent.click(addButton);

    expect(mockSetSections).toHaveBeenCalledWith([
      { id: 'new-test-section', name: 'New Test Section' },
    ]);
  });
  
  it('shows and handles adding a new page', () => {
    renderInFlow(defaultProps);

    const addPageButton = screen.getByTitle('Add Page');
    fireEvent.click(addPageButton);

    const input = screen.getByPlaceholderText('Page name');
    const addButton = screen.getByText('Add', { selector: 'button' });
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New Sub Page' } });
    fireEvent.click(addButton);

    expect(mockOnAddPage).toHaveBeenCalledWith('New Sub Page');
  });

  it('calls onDeletePage when delete button is clicked', () => {
    renderInFlow(defaultProps);
    
    const deleteButton = screen.getByTitle('Delete Page');
    fireEvent.click(deleteButton);
    
    expect(mockOnDeletePage).toHaveBeenCalledTimes(1);
  });

  it('renders sections when they are passed in data', () => {
    const sections = [
        { id: 'section-1', name: 'Section One' },
        { id: 'section-2', name: 'Section Two' },
    ];
    const propsWithSections = {
        ...defaultProps,
        data: {
            ...defaultProps.data,
            sections: sections,
        }
    };
    renderInFlow(propsWithSections);

    expect(screen.getByTestId('home-sections-mock')).toBeInTheDocument();
    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();
  });

  it('does not render delete button if onDeletePage is not provided', () => {
    const propsWithoutDelete = { ...defaultProps, data: { ...defaultProps.data, onDeletePage: undefined } };
    renderInFlow(propsWithoutDelete);
    expect(screen.queryByTitle('Delete Page')).not.toBeInTheDocument();
  });
});
