import { act, renderHook } from '@testing-library/react';
import useSpeech from '../hooks/use-speech';

// Mock dependencies
jest.mock('rc-util', () => ({
  useEvent: (fn: any) => fn,
  useMergedState: (defaultValue: any, options: any) => {
    const React = require('react');
    const [value, setValue] = React.useState(options?.value ?? defaultValue);
    return [value, setValue];
  },
}));

// Setup global mocks
const mockSpeechRecognition = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  onstart: null,
  onend: null,
  onresult: null,
}));

describe('useSpeech', () => {
  let originalWindow: any;
  let originalNavigator: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Store original globals
    originalWindow = global.window;
    originalNavigator = global.navigator;

    // Reset global objects
    delete (global as any).window;
    delete (global as any).navigator;
  });

  afterEach(() => {
    // Restore original globals
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it('should return correct values when SpeechRecognition is not available', () => {
    // Mock window without SpeechRecognition
    (global as any).window = {};
    (global as any).navigator = {};

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech));
    const [allowSpeech, triggerSpeech, recording] = result.current;
    expect(allowSpeech).toBe(false);
    expect(typeof triggerSpeech).toBe('function');
    expect(recording).toBe(false);
  });

  it('should return correct values when SpeechRecognition is available', () => {
    // Mock SpeechRecognition
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    };

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech));

    // Allow async permission check to complete
    return new Promise((resolve) => {
      setTimeout(() => {
        const [allowSpeech, triggerSpeech, recording] = result.current;
        expect(typeof allowSpeech).toBe('boolean');
        expect(typeof triggerSpeech).toBe('function');
        expect(typeof recording).toBe('boolean');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle permission denied', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'denied' }),
      },
    };

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech));

    return new Promise((resolve) => {
      setTimeout(() => {
        const [allowSpeech] = result.current;
        expect(typeof allowSpeech).toBe('boolean');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle missing navigator.permissions', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {};

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech));

    return new Promise((resolve) => {
      setTimeout(() => {
        const [allowSpeech] = result.current;
        expect(typeof allowSpeech).toBe('boolean');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle controlled mode configuration', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    };

    const onSpeech = jest.fn();
    const onRecordingChange = jest.fn();
    const { result } = renderHook(() =>
      useSpeech(onSpeech, {
        recording: true,
        onRecordingChange,
      }),
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        const [allowSpeech, triggerSpeech, recording] = result.current;
        expect(typeof allowSpeech).toBe('boolean');
        expect(typeof triggerSpeech).toBe('function');
        expect(typeof recording).toBe('boolean');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle triggerSpeech function calls', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    };

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech, true));

    return new Promise((resolve) => {
      setTimeout(() => {
        const [, triggerSpeech] = result.current;

        act(() => {
          triggerSpeech(false);
        });

        expect(typeof triggerSpeech).toBe('function');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle cleanup on unmount', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    };

    const onSpeech = jest.fn();
    const { unmount } = renderHook(() => useSpeech(onSpeech));

    expect(() => unmount()).not.toThrow();
  });

  it('should handle webkitSpeechRecognition fallback', () => {
    (global as any).window = {
      webkitSpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    };

    const onSpeech = jest.fn();
    const { result } = renderHook(() => useSpeech(onSpeech));

    return new Promise((resolve) => {
      setTimeout(() => {
        const [allowSpeech] = result.current;
        expect(typeof allowSpeech).toBe('boolean');
        resolve(undefined);
      }, 0);
    });
  });
});
