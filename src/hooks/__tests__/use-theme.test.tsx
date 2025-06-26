import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../use-theme';
import { ThemeProvider } from '@/context/themeContext';
import type { ReactNode } from 'react';

// Wrapper component that includes the ThemeProvider
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme', () => {
  it('should return the default theme (dark)', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle the theme from dark to light', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should toggle the theme from light back to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // First toggle to light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');

    // Toggle back to dark
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
  });

  it('should throw an error if used outside of a ThemeProvider', () => {
    // Hide console.error for this test, as we expect it to be called
    const consoleError = console.error;
    console.error = jest.fn();
    
    // We expect this to throw
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within a ThemeProvider');
    
    // Restore console.error
    console.error = consoleError;
  });
});
