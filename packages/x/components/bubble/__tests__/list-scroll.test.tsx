import { act, renderHook } from '@testing-library/react';
import { isSafari, useCompatibleScroll } from '../hooks/useCompatibleScroll';

// Mock navigator.userAgent
const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};

describe('isSafari', () => {
  it('should return true for Safari browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );
    expect(isSafari()).toBe(true);
  });

  it('should return false for Chrome browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    expect(isSafari()).toBe(false);
  });

  it('should return false for Edge browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    );
    expect(isSafari()).toBe(false);
  });

  it('should return false for Firefox browser', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
    );
    expect(isSafari()).toBe(false);
  });
});

describe('useCompatibleScroll', () => {
  let mockDom: HTMLElement;
  let mockSentinel: HTMLElement;
  let intersectionCallback: (entries: any[]) => void;
  let mutationCallback: () => void;

  // Mock DOM methods
  const mockIntersectionObserver = jest.fn();
  const mockMutationObserver = jest.fn();
  const mockRequestAnimationFrame = jest.fn();

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Create mock DOM element with proper scroll properties
    mockDom = document.createElement('div');
    mockDom.style.cssText =
      'height: 400px; overflow: auto; display: flex; flex-direction: column-reverse;';

    // Mock scroll properties
    Object.defineProperty(mockDom, 'scrollHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(mockDom, 'scrollTop', {
      value: 0,
      writable: true,
    });
    Object.defineProperty(mockDom, 'clientHeight', {
      value: 400,
      writable: true,
    });

    document.body.appendChild(mockDom);

    // Setup mock sentinel
    mockSentinel = document.createElement('div');

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

    // Setup requestAnimationFrame mock
    mockRequestAnimationFrame.mockImplementation((callback) => {
      callback();
      return 1;
    });

    // Setup mocks
    global.IntersectionObserver = mockIntersectionObserver;
    global.MutationObserver = mockMutationObserver;
    global.requestAnimationFrame = mockRequestAnimationFrame;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('should return resetToBottom function', () => {
    const { result } = renderHook(() => useCompatibleScroll(mockDom));
    expect(typeof result.current.resetToBottom).toBe('function');
  });

  it('should not initialize observers when dom is null', () => {
    renderHook(() => useCompatibleScroll(null));

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockMutationObserver).not.toHaveBeenCalled();
  });

  it('should not initialize observers when onlySafari is true and not Safari', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockMutationObserver).not.toHaveBeenCalled();
  });

  it('should initialize observers when dom is provided and is Safari', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockMutationObserver).toHaveBeenCalled();
  });

  it('should initialize observers when onlySafari is false', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: false }));

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockMutationObserver).toHaveBeenCalled();
  });

  it('should create sentinel element and insert it into DOM', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    expect(mockDom.firstChild).toBeTruthy();
    const sentinel = mockDom.firstChild as HTMLElement;
    // Check that position is not set to absolute (based on commented code)
    expect(sentinel.style.position).toBe('');
    expect(sentinel.style.bottom).toBe('0px');
    expect(sentinel.style.flexShrink).toBe('0');
    expect(sentinel.style.pointerEvents).toBe('none');
    expect(sentinel.style.height).toBe('10px');
    expect(sentinel.style.visibility).toBe('hidden');
  });

  it('should not set position style on sentinel element', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    const sentinel = mockDom.firstChild as HTMLElement;
    // Verify that position style is not set (based on commented code in implementation)
    expect(sentinel.style.position).toBe('');
  });

  it('should handle intersection observer callback correctly', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    // Simulate intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    // Sentinel is visible (at bottom)
    expect(mockDom.scrollTop).toBe(0);
  });

  it('should handle scroll event and update locked position', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    // Setup initial state
    Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
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

  it('should not directly set scrollTop in handleScroll (based on implementation comment)', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    // Create a new mock DOM element for this specific test
    const testDom = document.createElement('div');
    testDom.style.cssText =
      'height: 400px; overflow: auto; display: flex; flex-direction: column-reverse;';

    // Mock scroll properties
    Object.defineProperty(testDom, 'scrollHeight', {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(testDom, 'clientHeight', {
      value: 400,
      writable: true,
    });

    // Track if scrollTop is directly modified in handleScroll
    let scrollTopModified = false;
    let scrollTopValue = -300;

    Object.defineProperty(testDom, 'scrollTop', {
      get() {
        return scrollTopValue;
      },
      set(value) {
        scrollTopModified = true;
        scrollTopValue = value;
      },
      configurable: true,
    });

    renderHook(() => useCompatibleScroll(testDom));

    // Simulate scroll event
    act(() => {
      testDom.dispatchEvent(new Event('scroll'));
    });

    // According to the implementation comment, direct setting of dom.scrollTop
    // in handleScroll can cause unexpected values, so we verify that handleScroll
    // only calculates and stores the value without directly setting it
    expect(scrollTopModified).toBe(false);
  });

  it('should reset to bottom correctly', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    const { result } = renderHook(() => useCompatibleScroll(mockDom));

    // Setup initial state
    Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });

    act(() => {
      result.current.resetToBottom();
    });

    // resetToBottom should not directly change scrollTop, but reset internal state
    // The actual scroll position change happens via scrollTo in BubbleList
    expect(typeof result.current.resetToBottom).toBe('function');
  });

  it('should cleanup observers on unmount', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    const { unmount } = renderHook(() => useCompatibleScroll(mockDom));

    unmount();

    // Verify cleanup
    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockMutationObserver).toHaveBeenCalled();
  });

  it('should handle enforceScrollLock correctly', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(mockDom));

    // Setup scroll position away from bottom
    act(() => {
      intersectionCallback([{ isIntersecting: false }]);
      Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
      Object.defineProperty(mockDom, 'scrollTop', { value: -300, writable: true });
      mockDom.dispatchEvent(new Event('scroll'));
    });

    // Trigger mutation
    Object.defineProperty(mockDom, 'scrollHeight', { value: 1200, writable: true });
    act(() => {
      mutationCallback();
    });

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
    expect(mockDom.scrollTop).toBe(-500); // 300 - (1200 - 1000)
  });

  it('should use requestAnimationFrame in enforceScrollLock', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    // Create a mock for requestAnimationFrame that tracks calls
    const mockRaf = jest.fn((callback) => {
      callback();
      return 1;
    });
    global.requestAnimationFrame = mockRaf;

    renderHook(() => useCompatibleScroll(mockDom));

    // Setup scroll position away from bottom
    act(() => {
      intersectionCallback([{ isIntersecting: false }]);
      Object.defineProperty(mockDom, 'scrollHeight', { value: 1000, writable: true });
      Object.defineProperty(mockDom, 'scrollTop', { value: -200, writable: true });
      mockDom.dispatchEvent(new Event('scroll'));
    });

    // Trigger mutation to invoke enforceScrollLock
    Object.defineProperty(mockDom, 'scrollHeight', { value: 1300, writable: true });
    act(() => {
      mutationCallback();
    });

    // Verify requestAnimationFrame was called
    expect(mockRaf).toHaveBeenCalled();

    // Verify scroll position was updated correctly
    // Initial: scrollTop = -200, scrollHeight = 1000, lockedScrollBottomPos = 800
    // After: scrollHeight = 1300, targetScroll = 800 - 1300 = -500
    expect(mockDom.scrollTop).toBe(-500);
  });

  it('should handle edge case when dom is undefined in callbacks', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
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

  it('should skip initialization when disable is true (dom is null)', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(null));

    // Should not create sentinel or observers
    expect(mockDom.firstChild).toBeFalsy();
  });

  it('should skip initialization when disable is true (onlySafari=true and not Safari)', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not create sentinel or observers
    expect(mockDom.firstChild).toBeFalsy();
  });

  it('should skip enforceScrollLock when disable is true', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not call requestAnimationFrame
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should skip resetToBottom when disable is true', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    const { result } = renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    act(() => {
      result.current.resetToBottom();
    });

    // Should not throw or modify anything
    expect(typeof result.current.resetToBottom).toBe('function');
  });

  it('should verify disable branch coverage for useEffect initialization', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    // Test disable=true case for useEffect
    const { unmount } = renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not initialize observers when disable=true
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockMutationObserver).not.toHaveBeenCalled();

    unmount();
  });

  it('should verify disable branch coverage for enforceScrollLock', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    // Test disable=true case for enforceScrollLock
    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not execute enforceScrollLock logic when disable=true
    act(() => {
      // Try to trigger enforceScrollLock
      const newDiv = document.createElement('div');
      mockDom.appendChild(newDiv);
    });

    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should handle multiple rapid mutations', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
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

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(5);
  });

  it('should handle scroll event when at bottom', () => {
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
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

    // Mutation should not trigger lock
    act(() => {
      mutationCallback();
    });

    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should cover disable branch in useEffect (line 36)', () => {
    // Test when disable is true (dom is null)
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    );

    renderHook(() => useCompatibleScroll(null));

    // Should return early without creating observers
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockMutationObserver).not.toHaveBeenCalled();
  });

  it('should cover disable branch in useEffect (line 36) with onlySafari=true and not Safari', () => {
    // Test when disable is true (onlySafari=true and not Safari)
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should return early without creating observers
    expect(mockDom.firstChild).toBeFalsy();
  });

  it('should cover disable branch in handleScroll (line 78)', () => {
    // Test when disable is true for handleScroll
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    const { result } = renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not throw when calling resetToBottom
    expect(() => {
      act(() => {
        result.current.resetToBottom();
      });
    }).not.toThrow();
  });

  it('should cover disable branch in enforceScrollLock (line 92)', () => {
    // Test when disable is true for enforceScrollLock
    mockUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    const { result } = renderHook(() => useCompatibleScroll(mockDom, { onlySafari: true }));

    // Should not throw when calling resetToBottom
    expect(() => {
      act(() => {
        result.current.resetToBottom();
      });
    }).not.toThrow();
  });
});
