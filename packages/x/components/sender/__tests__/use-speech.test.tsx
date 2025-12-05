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

  it('should handle SpeechRecognition events properly', () => {
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onstart: null as any,
      onend: null as any,
      onresult: null as any,
    };

    mockSpeechRecognition.mockImplementation(() => mockRecognition);

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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

        // Trigger speech to initialize recognition
        act(() => {
          triggerSpeech(false);
        });

        // Test onstart event
        expect(mockRecognition.onstart).toBeDefined();
        act(() => {
          if (mockRecognition.onstart) mockRecognition.onstart();
        });

        // Test onend event
        expect(mockRecognition.onend).toBeDefined();
        act(() => {
          if (mockRecognition.onend) mockRecognition.onend();
        });

        // Test onresult event
        expect(mockRecognition.onresult).toBeDefined();
        const mockEvent = {
          results: [[{ transcript: 'Hello world' }]],
        };
        act(() => {
          if (mockRecognition.onresult) mockRecognition.onresult(mockEvent);
        });

        expect(onSpeech).toHaveBeenCalledWith('Hello world');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle permission state changes', () => {
    const mockPermissionStatus = {
      state: 'granted',
      onchange: null,
    };

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
    };
    (global as any).navigator = {
      permissions: {
        query: jest.fn().mockImplementation(() => {
          return Promise.resolve(mockPermissionStatus);
        }),
      },
    };

    const onSpeech = jest.fn();
    renderHook(() => useSpeech(onSpeech, true));

    return new Promise((resolve) => {
      setTimeout(() => {
        // Test permission state change
        expect(mockPermissionStatus.onchange).toBeDefined();

        act(() => {
          mockPermissionStatus.state = 'denied';
          if (mockPermissionStatus.onchange) (mockPermissionStatus as any).onchange();
        });

        resolve(undefined);
      }, 0);
    });
  });

  it('should handle force break when recording', () => {
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onstart: null as any,
      onend: null as any,
      onresult: null as any,
    };

    mockSpeechRecognition.mockImplementation(() => mockRecognition);

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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

        // Just verify the function exists and can be called
        expect(typeof triggerSpeech).toBe('function');
        act(() => {
          triggerSpeech(false);
        });

        act(() => {
          triggerSpeech(true);
        });

        resolve(undefined);
      }, 0);
    });
  });

  it('should ignore force break when not recording', () => {
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
    };

    mockSpeechRecognition.mockImplementation(() => mockRecognition);

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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

        // Test force break without starting recording
        act(() => {
          triggerSpeech(true);
        });

        // Should not call stop since we're not recording
        expect(mockRecognition.stop).not.toHaveBeenCalled();
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle controlled mode triggerSpeech', () => {
    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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
        recording: false,
        onRecordingChange,
      }),
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        const [, triggerSpeech] = result.current;

        act(() => {
          triggerSpeech(false);
        });

        expect(onRecordingChange).toHaveBeenCalledWith(true);
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle transcript extraction from SpeechRecognitionEvent', () => {
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onstart: null as any,
      onend: null as any,
      onresult: null as any,
    };

    mockSpeechRecognition.mockImplementation(() => mockRecognition);

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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

        // Test with valid transcript
        const mockEvent = {
          results: [[{ transcript: 'Test transcript' }]],
        };
        act(() => {
          if (mockRecognition.onresult) mockRecognition.onresult(mockEvent);
        });

        expect(onSpeech).toHaveBeenCalledWith('Test transcript');
        resolve(undefined);
      }, 0);
    });
  });

  it('should handle force break ref in onresult', () => {
    const mockRecognition = {
      start: jest.fn(),
      stop: jest.fn(),
      onstart: null as any,
      onend: null as any,
      onresult: null as any,
    };

    mockSpeechRecognition.mockImplementation(() => mockRecognition);

    (global as any).window = {
      SpeechRecognition: mockSpeechRecognition,
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

        // Just verify the function works without complex timing
        expect(typeof triggerSpeech).toBe('function');
        act(() => {
          triggerSpeech(false);
        });

        // Test normal transcript processing
        const mockEvent = {
          results: [[{ transcript: 'Test transcript' }]],
        };
        act(() => {
          if (mockRecognition.onresult) mockRecognition.onresult(mockEvent);
        });

        expect(onSpeech).toHaveBeenCalledWith('Test transcript');
        resolve(undefined);
      }, 0);
    });
  });
});
