import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePageNode from '@/components/app/home-page-node';
import { type NodeProps, ReactFlow, Position } from 'reactflow';
import type { Section } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Mock useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        Home: (props: any) => <svg data-testid="icon-home" {...props} />,
        Plus: (props: any) => <svg data-testid="icon-plus" {...props} />,
    };
});

// Mock HomeSections component
jest.mock('../home-sections', () => {
  return {
      __esModule: true,
      default: ({ sections, setSections }: { sections: Section[], setSections: (s: Section[]) => void }) => (
          <div data-testid="home-sections-mock">
              {sections.map(s => <div key={s.id}>{s.name}</div>)}
              <button onClick={() => setSections([])}>Clear</button>
          </div>
      ),
  };
});

describe('HomePageNode', () => {
  const mockSetSections = jest.fn();
  const mockOnAddPage = jest.fn();
  const mockToast = jest.fn();

  const defaultProps: NodeProps = {
    id: 'home-node',
    data: {
      label: 'Home',
      sections: [],
      setSections: mockSetSections,
      onAddPage: mockOnAddPage,
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    dragging: false,
    zIndex: 1,
    type: 'homePageNode',
    selected: false,
    isConnectable: false,
    xPos: 0,
    yPos: 0,
  };

  const renderInFlow = (props: NodeProps) => {
    return render(
      <div style={{ width: 500, height: 500 }}>
        <ReactFlow nodes={[{ ...props, position: { x: 0, y: 0 } }]} nodeTypes={{ homePageNode: HomePageNode }} fitView />
      </div>
    );
  };

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    jest.clearAllMocks();
  });

  it('renders the node with correct label and icon', () => {
    renderInFlow(defaultProps);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('adds a new section when form is submitted', () => {
    renderInFlow(defaultProps);
    const input = screen.getByPlaceholderText('Section name');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Section' } });
    fireEvent.click(addButton);

    expect(mockSetSections).toHaveBeenCalledWith([{ id: 'new-section', name: 'New Section' }]);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Section Added',
      description: 'The section "New Section" has been added.',
    });
  });

  it('shows a toast error for empty section name', () => {
    renderInFlow(defaultProps);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    
    expect(mockSetSections).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Section name cannot be empty.',
      variant: 'destructive',
    });
  });

  it('adds a new page when form is submitted', () => {
    renderInFlow(defaultProps);
    fireEvent.click(screen.getByTitle('Add Page'));

    const input = screen.getByPlaceholderText('Page name');
    const addPageButton = screen.getAllByText('Add').find(btn => btn.closest('div')?.querySelector('input[placeholder="Page name"]'));

    expect(addPageButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'New Page' } });
    fireEvent.click(addPageButton!);

    expect(mockOnAddPage).toHaveBeenCalledWith('New Page');
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Page Added',
      description: 'The page "New Page" has been added.',
    });
  });
  
  it('shows a toast error for empty page name', () => {
    renderInFlow(defaultProps);
    fireEvent.click(screen.getByTitle('Add Page'));
    
    const addPageButton = screen.getAllByText('Add').find(btn => btn.closest('div')?.querySelector('input[placeholder="Page name"]'));

    fireEvent.click(addPageButton!);

    expect(mockOnAddPage).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Page name cannot be empty.',
      variant: 'destructive',
    });
  });

  it('renders HomeSections with sections data', () => {
    const sections = [{ id: 'hero', name: 'Hero Section' }];
    const propsWithSections = { ...defaultProps, data: { ...defaultProps.data, sections } };
    renderInFlow(propsWithSections);

    expect(screen.getByTestId('home-sections-mock')).toBeInTheDocument();
    expect(screen.getByText('Hero Section')).toBeInTheDocument();
  });
});
