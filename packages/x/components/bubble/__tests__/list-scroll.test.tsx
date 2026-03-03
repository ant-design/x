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
  // as contentDom height 990 (1000-10, 10 for sentinel)
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
  let contentDom: HTMLElement;
  let intersectionCallback: (entries: any[]) => void;
  let resizeCallback: () => void;

  // Mock DOM methods
  const mockIntersectionObserver = jest.fn();
  const mockResizeObserver = jest.fn();

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Create mock DOM element with proper scroll properties
    mockDom = createColumnReverseDom();
    contentDom = document.createElement('div');
    contentDom.style.height = '990px';
    mockDom.appendChild(contentDom);
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

    // Setup ResizeObserver mock
    mockResizeObserver.mockImplementation((callback) => {
      resizeCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      };
    });

    // Setup mocks
    global.IntersectionObserver = mockIntersectionObserver;
    global.ResizeObserver = mockResizeObserver;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should not initialize when dom is null', () => {
      renderHook(() => useCompatibleScroll(null, null));

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockResizeObserver).not.toHaveBeenCalled();

      renderHook(() => useCompatibleScroll(mockDom, null));
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockResizeObserver).not.toHaveBeenCalled();

      renderHook(() => useCompatibleScroll(null, contentDom));
      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockResizeObserver).not.toHaveBeenCalled();
    });

    it('should initialize when flexDirection is column-reverse', () => {
      // Mock getComputedStyle to return a non-column-reverse flexDirection
      spyOnGetComputedStyle(false);

      // Create a DOM element with flexDirection other than column-reverse
      const nonReverseDom = createColumnDom();
      const nonReverseContentDom = document.createElement('div');
      nonReverseDom.appendChild(nonReverseContentDom);
      document.body.appendChild(nonReverseDom);

      renderHook(() => useCompatibleScroll(nonReverseDom, nonReverseContentDom));

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockResizeObserver).toHaveBeenCalled();
    });

    it('should initialize observers when dom is provided and flexDirection is column-reverse', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockResizeObserver).toHaveBeenCalled();
    });
  });

  describe('Sentinel Element', () => {
    it('should create sentinel element with correct styles', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

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

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

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

      const { result } = renderHook(() => useCompatibleScroll(mockDom, contentDom));

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

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      await waitFakeTimer(100, 1);

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      expect(mockDom.scrollTop).toBe(-500);
    });

    it('should lock scroll when not at bottom and content resize', async () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      await waitFakeTimer(100, 1);

      act(() => {
        // got 200px smaller
        Object.defineProperty(contentDom, 'height', { value: 790, writable: true });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 800, writable: true });
        resizeCallback();
      });

      await waitFakeTimer(100, 1);
      expect(mockDom.scrollTop).toBe(-300 + 200);

      act(() => {
        // then got 200px bigger
        Object.defineProperty(contentDom, 'height', { value: 990, writable: true });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
        resizeCallback();
      });

      await waitFakeTimer(100, 1);
      expect(mockDom.scrollTop).toBe(-300 + 200 - 200);
    });

    it('should not lock scroll when scrolling', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      mockDom.scrollTo = jest.fn();

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      expect(mockDom.scrollTop).toBe(-300);
    });

    it('should keep going bottom when content mutating and scrolling', async () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      mockDom.scrollTo = jest.fn();

      const { result } = renderHook(() => useCompatibleScroll(mockDom, contentDom));
      const spyScrollTo = jest.spyOn(mockDom, 'scrollTo');

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
      });

      await waitFakeTimer(100);

      act(() => {
        result.current.scrollTo({ top: 0 });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      // wait for raf
      await waitFakeTimer(100);

      expect(spyScrollTo).toHaveBeenCalledTimes(2);
    });

    it('should keep going bottom by scrollIntoView in column-reverse when content mutating and scrolling', async () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      const { result } = renderHook(() => useCompatibleScroll(mockDom, contentDom));

      const child = document.createElement('div');
      child.style.height = '100px';
      contentDom.appendChild(child);

      const spyScrollTo = jest.spyOn(mockDom, 'scrollTo');

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
      });

      await waitFakeTimer(100);

      act(() => {
        result.current.scrollTo({ intoViewDom: child, intoView: { block: 'end' } });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      // wait for raf
      await waitFakeTimer(100);

      expect(spyScrollTo).toHaveBeenCalledTimes(1);
    });

    it('should keep going bottom by scrollIntoView in column when content mutating and scrolling', async () => {
      // Mock getComputedStyle to return column flexDirection
      spyOnGetComputedStyle(false);

      const { result } = renderHook(() => useCompatibleScroll(mockDom, contentDom));

      const child = document.createElement('div');
      child.style.height = '100px';
      contentDom.appendChild(child);

      const spyScrollTo = jest.spyOn(mockDom, 'scrollTo');

      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
      });

      await waitFakeTimer(100);

      act(() => {
        result.current.scrollTo({ intoViewDom: child, intoView: { block: 'end' } });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      // wait for raf
      await waitFakeTimer(100);

      expect(spyScrollTo).toHaveBeenCalledTimes(1);
    });

    it('should onScroll return early after call enforceScrollLock', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      jest.spyOn(global, 'setTimeout');
      jest.spyOn(global, 'clearTimeout');

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      // set view not at bottom
      act(() => {
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        intersectionCallback([{ isIntersecting: false }]);
      });

      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      expect(clearTimeout).not.toHaveBeenCalled();
      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('should not lock scroll when at bottom', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      renderHook(() => useCompatibleScroll(mockDom, contentDom));

      // At bottom
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // Scroll event should not lock position
      act(() => {
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
        resizeCallback();
      });

      expect(mockDom.scrollTop).toBe(0);
    });

    it('should not throw error when enforcing scroll lock with null dom', () => {
      // Create a new mock DOM element for this specific test
      const testDom = createColumnReverseDom();
      const testContentDom = document.createElement('div');
      testDom.appendChild(testContentDom);
      setupScrollProperties(testDom, 1000, -200, 400);
      document.body.appendChild(testDom);

      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      const { unmount } = renderHook(() => useCompatibleScroll(testDom, testContentDom));

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
        resizeCallback();
      });

      // Should not throw
      expect(() => {
        resizeCallback();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge cases correctly', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      spyOnGetComputedStyle();

      // Test 1: Should not throw error when dom becomes undefined after mount
      const { result, unmount } = renderHook(() => useCompatibleScroll(mockDom, contentDom));

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

      const { unmount } = renderHook(() => useCompatibleScroll(mockDom, contentDom));

      // Verify sentinel was created
      expect(mockDom.firstChild).toBeTruthy();

      unmount();

      // Verify cleanup
      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockResizeObserver).toHaveBeenCalled();
    });
  });
});
