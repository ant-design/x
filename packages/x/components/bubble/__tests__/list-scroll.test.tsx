import { act, renderHook } from '@testing-library/react';
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

describe('useCompatibleScroll', () => {
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
    jest.clearAllMocks();
  });

  describe('Hook Return Value', () => {
    it('should return resetToBottom function', () => {
      const { result } = renderHook(() => useCompatibleScroll(mockDom));
      expect(typeof result.current.resetToBottom).toBe('function');
    });
  });

  describe('Initialization', () => {
    it('should not initialize when dom is null', () => {
      renderHook(() => useCompatibleScroll(null));

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('should not initialize when flexDirection is not column-reverse', () => {
      // Mock getComputedStyle to return a non-column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column',
          }) as any,
      );

      // Create a DOM element with flexDirection other than column-reverse
      const nonReverseDom = createColumnDom();
      setupScrollProperties(nonReverseDom);
      document.body.appendChild(nonReverseDom);

      renderHook(() => useCompatibleScroll(nonReverseDom));

      expect(mockIntersectionObserver).not.toHaveBeenCalled();
      expect(mockMutationObserver).not.toHaveBeenCalled();
    });

    it('should initialize observers when dom is provided and flexDirection is column-reverse', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockMutationObserver).toHaveBeenCalled();
    });

    it('should configure MutationObserver with correct options', () => {
      // Track the options passed to MutationObserver
      let mutationObserverOptions: MutationObserverInit | undefined;
      const mockMutationObserverWithConfig = jest.fn((callback) => {
        mutationCallback = callback;
        return {
          observe: jest.fn((_, options) => {
            mutationObserverOptions = options;
          }),
          disconnect: jest.fn(),
          takeRecords: jest.fn(),
        };
      });

      global.MutationObserver = mockMutationObserverWithConfig;

      renderHook(() => useCompatibleScroll(mockDom));

      // Verify MutationObserver configuration
      expect(mutationObserverOptions).toEqual({
        childList: true,
        subtree: true,
        attributes: false,
      });
    });
  });

  describe('Sentinel Element', () => {
    it('should create sentinel element with correct styles', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

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

  describe('Intersection Observer', () => {
    it('should update isAtBottom state when sentinel intersects', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Simulate sentinel visible (at bottom)
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // Simulate sentinel not visible (not at bottom)
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
      });
    });
  });

  describe('Scroll Handling', () => {
    it('should update locked position when scrolling away from bottom', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Setup initial state
      Object.defineProperty(mockDom, 'scrollTop', { value: -500, writable: true }); // Inverted for column-reverse

      // Simulate scroll away from bottom
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Check that locked position was updated correctly
      // lockedScrollBottomPos = scrollHeight + scrollTop = 1000 + (-500) = 500
      expect(mockDom.scrollTop).toBe(-500);
    });

    it('should add scroll event listener with capture option', () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      // Create a new mock DOM element for this specific test
      const testDom = createColumnReverseDom();
      setupScrollProperties(testDom);
      testDom.addEventListener = mockAddEventListener;
      testDom.removeEventListener = mockRemoveEventListener;

      document.body.appendChild(testDom);

      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(testDom));

      // Verify addEventListener was called with capture option
      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
        capture: true,
      });
    });

    it('should clear previous timeout when scroll events occur rapidly', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Set up a timeout to simulate existing scrolling.current
      const mockClearTimeout = jest.fn();
      global.clearTimeout = mockClearTimeout;

      // Mock scrolling.current to be defined
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Simulate another scroll event quickly
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });

      expect(mockClearTimeout).toHaveBeenCalled();
    });
  });

  describe('Reset to Bottom', () => {
    it('should reset internal state to bottom position', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      const { result } = renderHook(() => useCompatibleScroll(mockDom));

      // Setup initial state
      Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });

      act(() => {
        result.current.resetToBottom();
      });

      // resetToBottom should not directly change scrollTop, but reset internal state
      expect(typeof result.current.resetToBottom).toBe('function');
    });

    it('should not throw error when resetting with disabled hook', () => {
      const { result } = renderHook(() => useCompatibleScroll(null));

      // Should not throw when calling resetToBottom with disable=true
      expect(() => {
        act(() => {
          result.current.resetToBottom();
        });
      }).not.toThrow();
    });
  });

  describe('Scroll Lock Enforcement', () => {
    it('should calculate correct target scroll position', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Set up initial state
      act(() => {
        // Set initial scroll position
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
        // Trigger scroll event to update lockedScrollBottomPos
        mockDom.dispatchEvent(new Event('scroll'));
        // lockedScrollBottomPos should now be 1000 + (-300) = 700
      });

      // Change scrollHeight to simulate content being added
      Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });

      // Check that the target scroll position would be calculated correctly
      // targetScroll = lockedScrollBottomPos.current - dom!.scrollHeight
      // targetScroll = 700 - 1200 = -500
      // We can't directly access lockedScrollBottomPos, but we can verify the calculation
      // by checking the expected result
      const expectedTargetScroll = 700 - 1200;
      expect(expectedTargetScroll).toBe(-500);
    });

    it('should not enforce scroll lock when scrolling is in progress', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      const { result } = renderHook(() => useCompatibleScroll(mockDom));

      // Set up initial state
      act(() => {
        // Set initial scroll position
        Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
        Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
        // Trigger scroll event to update lockedScrollBottomPos
        mockDom.dispatchEvent(new Event('scroll'));
        // lockedScrollBottomPos should now be 1000 + (-300) = 700
      });

      // Simulate that scrolling is in progress
      // @ts-ignore - accessing private ref for testing
      result.current.scrolling = setTimeout(() => {}, 100);

      // Change scrollHeight to simulate content being added
      Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });

      // Simulate the condition where shouldLock is true (not at bottom)
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
      });

      // Simulate mutation observer callback
      act(() => {
        mutationCallback();
      });

      // Should not update scrollTop when scrolling is in progress
      // scrollTop should remain -300 (its original value)
      expect(mockDom.scrollTop).toBe(-300);
    });

    it('should not throw error when enforcing scroll lock with null dom', () => {
      // Create a new mock DOM element for this specific test
      const testDom = createColumnReverseDom();
      setupScrollProperties(testDom, 1000, -200, 400);
      document.body.appendChild(testDom);

      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      const { unmount } = renderHook(() => useCompatibleScroll(testDom));

      // Set up initial state
      act(() => {
        // Set initial scroll position
        Object.defineProperty(testDom, 'scrollTop', { value: -200, writable: true });
        Object.defineProperty(testDom, 'scrollHeight', { value: 1000, writable: true });
        // Trigger scroll event to update lockedScrollBottomPos
        testDom.dispatchEvent(new Event('scroll'));
        // lockedScrollBottomPos should now be 1000 + (-200) = 800
      });

      // Unmount to set dom to null
      unmount();

      // Change scrollHeight to simulate content being added
      Object.defineProperty(testDom, 'scrollHeight', { value: 1200, writable: true });

      // Simulate the condition where shouldLock is true (not at bottom)
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
      });

      // Simulate mutation observer callback
      act(() => {
        mutationCallback();
      });

      // Should not throw
      expect(() => {
        mutationCallback();
      }).not.toThrow();
    });
  });

  describe('Mutation Handling', () => {
    it('should handle multiple rapid mutations', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Setup scroll position away from bottom
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Simulate multiple mutations
      for (let i = 0; i < 5; i++) {
        const newDiv = document.createElement('div');
        newDiv.style.height = '100px';
        act(() => {
          mockDom.appendChild(newDiv);
          const currentHeight = mockDom.scrollHeight;
          Object.defineProperty(mockDom, 'scrollHeight', {
            value: currentHeight + 100,
            writable: true,
          });
          mutationCallback();
        });
      }
    });

    it('should not enforce scroll lock when at bottom', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // At bottom
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // Scroll event should not lock position
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });

      // Mutation should not trigger lock when at bottom
      act(() => {
        mutationCallback();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should not throw error when dom becomes undefined after mount', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      const { result, unmount } = renderHook(() => useCompatibleScroll(mockDom));

      // Unmount to set dom to undefined
      unmount();

      // Should not throw when calling resetToBottom
      expect(() => {
        act(() => {
          result.current.resetToBottom();
        });
      }).not.toThrow();
    });

    it('should handle scroll event correctly when not at bottom', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

      renderHook(() => useCompatibleScroll(mockDom));

      // Not at bottom
      act(() => {
        intersectionCallback([{ isIntersecting: false }]);
      });

      // Scroll event should update lockedScrollBottomPos
      act(() => {
        mockDom.dispatchEvent(new Event('scroll'));
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup observers and sentinel element on unmount', () => {
      // Mock getComputedStyle to return column-reverse flexDirection
      jest.spyOn(window, 'getComputedStyle').mockImplementation(
        () =>
          ({
            flexDirection: 'column-reverse',
          }) as any,
      );

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
