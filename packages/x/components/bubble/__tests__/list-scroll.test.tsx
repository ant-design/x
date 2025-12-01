import { act, renderHook } from '@testing-library/react';
import { waitFakeTimer } from '../../../tests/utils';
import { useCompatibleScroll } from '../hooks/useCompatibleScroll';

// Create a DOM element with column-reverse flex direction
const createColumnReverseDom = () => {
  const dom = document.createElement('div');
  dom.style.cssText =
    'height: 400px; overflow: auto; display: flex; flex-direction: column-reverse;';

  return dom;
};

// Create a DOM element with column flex direction
const createColumnDom = () => {
  const dom = document.createElement('div');
  dom.style.cssText = 'height: 400px; overflow: auto; display: flex; flex-direction: column;';
  return dom;
};

// Setup scroll properties for a DOM element
const setupScrollProperties = (
  dom: HTMLElement,
  scrollHeight = 1000,
  scrollTop = 0,
  clientHeight = 400,
) => {
  Object.defineProperty(dom, 'scrollHeight', {
    value: scrollHeight,
    writable: true,
  });
  Object.defineProperty(dom, 'scrollTop', {
    value: scrollTop,
    writable: true,
  });
  Object.defineProperty(dom, 'clientHeight', {
    value: clientHeight,
    writable: true,
  });
};

function spyOnGetComputedStyle(reverse = true) {
  jest.spyOn(window, 'getComputedStyle').mockImplementation(
    () =>
      ({
        flexDirection: reverse ? 'column-reverse' : 'column',
      }) as any,
  );
}

describe('useCompatibleScroll', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  let mockDom: HTMLElement;
  let intersectionCallback: (entries: any[]) => void;
  let mutationCallback: () => void;

  // Mock DOM methods
  const mockIntersectionObserver = jest.fn();
  const mockMutationObserver = jest.fn();

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Create mock DOM element with proper scroll properties
    mockDom = createColumnReverseDom();
    setupScrollProperties(mockDom);

    document.body.appendChild(mockDom);

    // Setup IntersectionObserver mock
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      };
    });

    // Setup MutationObserver mock
    mockMutationObserver.mockImplementation((callback) => {
      mutationCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn(),
      };
    });

    // Setup mocks
    global.IntersectionObserver = mockIntersectionObserver;
    global.MutationObserver = mockMutationObserver;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should not initialize when dom is null', () => {
      renderHook(() => useCompatibleScroll(null));

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('should not initialize when flexDirection is not column-reverse', () => {
      // Mock getComputedStyle to return a non-column-reverse flexDirection
      spyOnGetComputedStyle(false);

      // Create a DOM element with flexDirection other than column-reverse
      const nonReverseDom = createColumnDom();
      document.body.appendChild(nonReverseDom);

      renderHook(() => useCompatibleScroll(nonReverseDom));

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('should initialize observers when dom is provided and flexDirection is column-reverse', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom));

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockMutationObserver).toHaveBeenCalled();
    });
  });

  describe('Sentinel Element', () => {
    it('should create sentinel element with correct styles', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom));

      expect(mockDom.firstChild).toBeTruthy();
      const sentinel = mockDom.firstChild as HTMLElement;
      expect(sentinel.style.position).toBe('');
      expect(sentinel.style.bottom).toBe('0px');
      expect(sentinel.style.flexShrink).toBe('0');
      expect(sentinel.style.pointerEvents).toBe('none');
      expect(sentinel.style.height).toBe('10px');
      expect(sentinel.style.visibility).toBe('hidden');
    });
  });

  describe('Scroll Handling', () => {
    it('should handle scroll events correctly', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      // Create a mock setTimeout return value
      const mockTimeoutId = 12345;
      jest.spyOn(global, 'setTimeout').mockImplementation(() => mockTimeoutId as any);
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');

      renderHook(() => useCompatibleScroll(mockDom));

      // Set initial state
      Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });

      // First scroll event to set up the timeout
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Verify setTimeout was called
      expect(setTimeout).toHaveBeenCalled();

      // Second scroll event should clear the previous timeout
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Verify clearTimeout was called with the correct timeout ID
      expect(mockClearTimeout).toHaveBeenCalledWith(mockTimeoutId);
    });
  });

  describe('Reset to Bottom', () => {
    it('should reset internal state', () => {
      spyOnGetComputedStyle();

      const { result } = renderHook(() => useCompatibleScroll(mockDom));

      act(() => {
        result.current.reset();
      });

      expect(result.current.reset).not.toThrow();
    });
  });

  describe('Scroll Lock Enforcement', () => {
    it('should lock scroll when not at bottom', async () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      await waitFakeTimer(100, 1);

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        mutationCallback();
      });

      expect(mockDom.scrollTop).toBe(-500);
    });

    it('should not lock scroll when scrolling', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        mutationCallback();
      });

      expect(mockDom.scrollTop).toBe(-300);
    });

    it('should onScroll return early after call enforceScrollLock', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      jest.spyOn(global, 'setTimeout');
      jest.spyOn(global, 'clearTimeout');

      renderHook(() => useCompatibleScroll(mockDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        mutationCallback();
      });

      expect(clearTimeout).not.toHaveBeenCalled();
      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('should not lock scroll when at bottom', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom));

      // At bottom
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // Scroll event should not lock position
      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        mutationCallback();
      });

      expect(mockDom.scrollTop).toBe(0);
    });

    it('should not throw error when enforcing scroll lock with null dom', () => {
      // Create a new mock DOM element for this specific test
      const testDom = createColumnReverseDom();
      setupScrollProperties(testDom, 1000, -200, 400);
      document.body.appendChild(testDom);

      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      const { unmount } = renderHook(() => useCompatibleScroll(testDom));

      // Set up initial state
      act(() => {
        // Set initial scroll position
        Object.defineProperty(testDom, 'scrollTop', { value: -200, writable: true });
        Object.defineProperty(testDom, 'scrollHeight', { value: 1000, writable: true });
        // Trigger scroll event to update lockedScrollBottomPos
        testDom.dispatchEvent(new Event('scroll'));
      });

      // Unmount to set dom to null
      unmount();

      // Change scrollHeight to simulate content being added
      Object.defineProperty(testDom, 'scrollHeight', { value: 1200, writable: true });

      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
        mutationCallback();
      });

      // Should not throw
      expect(() => {
        mutationCallback();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge cases correctly', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      // Test 1: Should not throw error when dom becomes undefined after mount
      const { result, unmount } = renderHook(() => useCompatibleScroll(mockDom));

      // Unmount to set dom to undefined
      unmount();

      // Should not throw when calling reset
      expect(() => {
        act(() => {
          result.current.reset();
        });
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup observers and sentinel element on unmount', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      const { unmount } = renderHook(() => useCompatibleScroll(mockDom));

      // Verify sentinel was created
      expect(mockDom.firstChild).toBeTruthy();

      unmount();

      // Verify cleanup
      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockMutationObserver).toHaveBeenCalled();
    });
  });
});
