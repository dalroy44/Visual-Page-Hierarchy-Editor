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
        Users: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-users" {...props} />,
        File: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file" {...props} />,
        Plus: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-plus" {...props} />,
        LayoutList: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-layout-list" {...props} />,
        Trash2: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-trash" {...props} />,
        Cog: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-cog" {...props} />,
        Mail: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-mail" {...props} />,
        Newspaper: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-newspaper" {...props} />,
        Home: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-home" {...props} />,
        Info: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-info" {...props} />,
        Briefcase: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-briefcase" {...props} />,
        MessageSquare: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-message-square" {...props} />,
    };
});

// Mock SectionList component
jest.mock('../section-list', () => {
    return {
        __esModule: true,
        default: ({ sections, onDeleteSection }: { sections: Section[], onDeleteSection?: (id: string) => void }) => (
            <div data-testid="section-list-mock">
                {sections.map(s => (
                    <div key={s.id}>
                        {s.name}
                        <button onClick={() => onDeleteSection?.(s.id)}>Delete {s.name}</button>
                    </div>
                ))}
            </div>
        ),
    };
});


describe('PageNode', () => {
  const mockSetSections = jest.fn();
  const mockOnAddPage = jest.fn();
  const mockOnDeletePage = jest.fn();
  const mockOnAddSection = jest.fn();
  const mockOnDeleteSection = jest.fn();

  const defaultProps: NodeProps<PageNodeData> = {
    id: 'test-node',
    data: {
      label: 'Test Page',
      icon: 'Users',
      sections: [],
      setSections: mockSetSections,
      onAddPage: mockOnAddPage,
      onDeletePage: mockOnDeletePage,
      onAddSection: mockOnAddSection,
      onDeleteSection: mockOnDeleteSection,
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

  it('falls back to default icon for invalid icon name', () => {
    renderInFlow({
        ...defaultProps,
        data: {
            ...defaultProps.data,
            icon: 'InvalidIconName'
        }
    });
    expect(screen.getByTestId('icon-file')).toBeInTheDocument();
  });

  it('shows placeholder text when there are no sections', () => {
    renderInFlow(defaultProps);
    expect(screen.getByText(/No sections yet/)).toBeInTheDocument();
  });
  
  it('toggles the add section form and adds a section on click', () => {
    renderInFlow(defaultProps);
    const addSectionButton = screen.getByTitle('Add Section');
    
    // Form is initially hidden
    expect(screen.queryByPlaceholderText('New section name')).not.toBeInTheDocument();

    // Show form
    fireEvent.click(addSectionButton);
    const input = screen.getByPlaceholderText('New section name');
    const addButton = screen.getByText('Add Section', { selector: 'button' });
    expect(input).toBeInTheDocument();

    // Add section
    fireEvent.change(input, { target: { value: 'New Test Section' } });
    fireEvent.click(addButton);
    expect(mockOnAddSection).toHaveBeenCalledWith('New Test Section');

    // Hide form
    fireEvent.click(addSectionButton);
    expect(screen.queryByPlaceholderText('New section name')).not.toBeInTheDocument();
  });

  it('adds a section on Enter key press', () => {
    renderInFlow(defaultProps);
    fireEvent.click(screen.getByTitle('Add Section'));
    
    const input = screen.getByPlaceholderText('New section name');
    fireEvent.change(input, { target: { value: 'Enter Key Section' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnAddSection).toHaveBeenCalledWith('Enter Key Section');
  });
  
  it('toggles the add page form and adds a page on click', () => {
    renderInFlow(defaultProps);
    const addPageButton = screen.getByTitle('Add Page');
    
    // Form is initially hidden
    expect(screen.queryByPlaceholderText('Page name')).not.toBeInTheDocument();

    // Show form
    fireEvent.click(addPageButton);
    const input = screen.getByPlaceholderText('Page name');
    const addButton = screen.getByText('Add', { selector: 'button' });
    expect(input).toBeInTheDocument();

    // Add page
    fireEvent.change(input, { target: { value: 'New Sub Page' } });
    fireEvent.click(addButton);
    expect(mockOnAddPage).toHaveBeenCalledWith('New Sub Page');
    expect(screen.queryByPlaceholderText('Page name')).not.toBeInTheDocument(); // Form should hide after adding
  });

  it('adds a page on Enter key press', () => {
    renderInFlow(defaultProps);
    fireEvent.click(screen.getByTitle('Add Page'));

    const input = screen.getByPlaceholderText('Page name');
    fireEvent.change(input, { target: { value: 'Enter Key Page' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnAddPage).toHaveBeenCalledWith('Enter Key Page');
  });

  it('calls onDeletePage when delete button is clicked', () => {
    renderInFlow(defaultProps);
    
    const deleteButton = screen.getByTitle('Delete Page');
    fireEvent.click(deleteButton);
    
    expect(mockOnDeletePage).toHaveBeenCalledTimes(1);
  });

  it('renders sections and handles deletion', () => {
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

    expect(screen.getByTestId('section-list-mock')).toBeInTheDocument();
    expect(screen.getByText('Section One')).toBeInTheDocument();
    
    // Test that the delete button in the mocked child works
    fireEvent.click(screen.getByText('Delete Section One'));
    expect(mockOnDeleteSection).toHaveBeenCalledWith('section-1');
  });

  describe('Home Node behavior', () => {
    const homeProps = {
        ...defaultProps, 
        id: 'home', 
        data: { 
            ...defaultProps.data,
            label: 'Home',
            icon: 'Home',
            onDeletePage: undefined, // Home can't be deleted
            sections: [{ id: 'hero', name: 'Hero' }],
        } 
    };
    
    it('does not render delete button for the home node', () => {
        renderInFlow(homeProps);
        expect(screen.queryByTitle('Delete Page')).not.toBeInTheDocument();
      });
    
      it('always shows the add section form for the home node', () => {
        renderInFlow(homeProps);
        expect(screen.getByPlaceholderText('New section name')).toBeInTheDocument();
        expect(screen.queryByTitle('Add Section')).not.toBeInTheDocument();
      });

      it('adds a section from the always-on form', () => {
        renderInFlow(homeProps);
        const input = screen.getByPlaceholderText('New section name');
        const addButton = screen.getByText('Add Section', { selector: 'button' });
        
        fireEvent.change(input, { target: { value: 'Home Section' } });
        fireEvent.click(addButton);
        
        expect(mockOnAddSection).toHaveBeenCalledWith('Home Section');
      });
  });

});