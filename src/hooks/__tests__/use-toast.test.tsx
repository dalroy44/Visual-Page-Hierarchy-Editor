
import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';
import type { ToastProps } from '@/components/ui/toast';

// Helper to create a toast with required props for the reducer test
const createToast = (props: Partial<ToastProps & { id: string }>): any => ({
  id: '1',
  open: true,
  onOpenChange: jest.fn(),
  ...props,
});


describe('useToast', () => {
  // The toast state is a singleton, so we need to clean it up after each test
  // to prevent tests from interfering with each other.
  afterEach(() => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismiss();
    });
  });

  it('should start with an empty list of toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast when toast() is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Hello World' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Hello World');
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('should dismiss a toast when dismiss() is called', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string | undefined;
    act(() => {
      const newToast = toast({ title: 'Test Toast' });
      toastId = newToast.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });
    
    // Dismiss sets `open` to false, it doesn't remove the toast immediately
    expect(result.current.toasts[0].open).toBe(false);
  });
  
  it('should update a toast when update() is called', () => {
    const { result } = renderHook(() => useToast());

    let newToast: { id: string; dismiss: () => void; update: (props: any) => void; };
    act(() => {
      newToast = toast({ title: 'Initial Title' });
    });

    expect(result.current.toasts[0].title).toBe('Initial Title');
    
    act(() => {
      newToast.update({ id: newToast.id, title: 'Updated Title' });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Updated Title');
  });

  it('should respect the toast limit', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
    });

    // The limit is 1 in the hook, so only the last toast should remain
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });
});


describe('toast reducer', () => {
  it('should remove all toasts when REMOVE_TOAST is called without an id', () => {
    const initialState = {
      toasts: [
        createToast({ id: '1', title: 'Toast 1' }),
        createToast({ id: '2', title: 'Toast 2' }),
      ]
    };
    const action = { type: 'REMOVE_TOAST' as const };
    const state = reducer(initialState, action);
    expect(state.toasts).toEqual([]);
  });
});
