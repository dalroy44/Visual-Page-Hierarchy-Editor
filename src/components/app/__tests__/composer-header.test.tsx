import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComposerHeader } from '@/components/app/composer-header';
import { useTheme } from '@/hooks/use-theme';

// Mock the useTheme hook
jest.mock('@/hooks/use-theme', () => ({
  useTheme: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        Save: (props: any) => <svg data-testid="icon-save" {...props} />,
        FolderOpen: (props: any) => <svg data-testid="icon-folder-open" {...props} />,
        Download: (props: any) => <svg data-testid="icon-download" {...props} />,
        RotateCcw: (props: any) => <svg data-testid="icon-rotate-ccw" {...props} />,
        UploadIcon: (props: any) => <svg data-testid="icon-upload" {...props} />,
        Sun: (props: any) => <svg data-testid="icon-sun" {...props} />,
        Moon: (props: any) => <svg data-testid="icon-moon" {...props} />,
    };
});

describe('ComposerHeader', () => {
  const mockOnSave = jest.fn();
  const mockOnLoad = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnExport = jest.fn();
  const mockOnLoadFromFile = jest.fn();
  const mockToggleTheme = jest.fn();
  const fileInputRef = { current: { click: jest.fn() } as unknown as HTMLInputElement };

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });
    jest.clearAllMocks();
  });

  it('renders the header title', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    expect(screen.getByText('Visual Hierarchy Composer')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    fireEvent.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('calls onLoad when load button is clicked', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    fireEvent.click(screen.getByText('Load'));
    expect(mockOnLoad).toHaveBeenCalledTimes(1);
  });
  
//   it('triggers file input when "From File" is clicked', () => {
//     render(
//       <ComposerHeader
//         onSave={mockOnSave}
//         onLoad={mockOnLoad}
//         onReset={mockOnReset}
//         onExport={mockOnExport}
//         onLoadFromFile={mockOnLoadFromFile}
//         fileInputRef={fileInputRef}
//       />
//     );
//     fireEvent.click(screen.getByText('From File'));
//     expect(fileInputRef.current.click).toHaveBeenCalledTimes(1);
//   });

  it('calls onReset when reset button is clicked', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('calls onExport when export button is clicked', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    fireEvent.click(screen.getByText('Export JSON'));
    expect(mockOnExport).toHaveBeenCalledTimes(1);
  });
  
  it('calls toggleTheme when theme button is clicked', () => {
    render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    fireEvent.click(screen.getByTitle('Switch to Light Mode'));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('displays the correct theme icon', () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme });
    const { rerender } = render(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-moon')).not.toBeInTheDocument();

    (useTheme as jest.Mock).mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
    rerender(
      <ComposerHeader
        onSave={mockOnSave}
        onLoad={mockOnLoad}
        onReset={mockOnReset}
        onExport={mockOnExport}
        onLoadFromFile={mockOnLoadFromFile}
        fileInputRef={fileInputRef}
      />
    );
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-sun')).not.toBeInTheDocument();
  });
});
