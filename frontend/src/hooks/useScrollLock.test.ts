import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.setAttribute('style', '');
    Object.defineProperty(window, 'scrollY', {
      value: 42,
      configurable: true,
      writable: true,
    });
    window.scrollTo = jest.fn();
  });

  it('freezes the body when locked is true', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-42px');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores on unmount and scrolls back', () => {
    const { unmount } = renderHook(() =>
      useScrollLock(true),
    );
    unmount();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 42);
  });

  it('does nothing when not locked', () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.position).toBe('');
  });
});
