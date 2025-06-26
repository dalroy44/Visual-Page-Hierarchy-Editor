import { render, screen } from '@testing-library/react';
import ComposerPage from '../page';

// Mock dependencies
jest.mock('@/components/app', () => () => <div data-testid="visual-hierarchy" />);
jest.mock('@/components/app/composer-header', () => ({
  ComposerHeader: (props: any) => <div data-testid="composer-header" {...props} />,
}));
jest.mock('@/hooks/use-hierarchy-logic', () => ({
  useHierarchyLogic: jest.fn(),
}));

describe('ComposerPage', () => {
  const mockUseHierarchyLogic = require('@/hooks/use-hierarchy-logic').useHierarchyLogic;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when not client', () => {
    mockUseHierarchyLogic.mockReturnValue({ isClient: false });
    render(<ComposerPage />);
    expect(screen.getByText(/Loading Composer/i)).toBeInTheDocument();
  });

  it('renders ComposerHeader and VisualHierarchy when client', () => {
    mockUseHierarchyLogic.mockReturnValue({
      isClient: true,
      nodes: [],
      edges: [],
            fileInputRef: { current: null },
      onNodesChange: jest.fn(),
      onEdgesChange: jest.fn(),
      onConnect: jest.fn(),
      handleLoad: jest.fn(),
      handleSave: jest.fn(),
      handleReset: jest.fn(),
      handleExport: jest.fn(),
      handleLoadFromFile: jest.fn(),
    });

    render(<ComposerPage />);
    expect(screen.getByTestId('composer-header')).toBeInTheDocument();
    expect(screen.getByTestId('visual-hierarchy')).toBeInTheDocument();
  });
});