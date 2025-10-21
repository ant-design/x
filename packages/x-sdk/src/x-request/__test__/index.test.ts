import type { SSEOutput } from '../../x-stream';
import type { XRequestCallbacks, XRequestOptions } from '../index';
import XRequest, { setXRequestGlobalOptions } from '../index';
import xFetch from '../x-fetch';

jest.mock('../x-fetch', () => jest.fn());

const SSE_SEPARATOR = '\n\n';

const ND_JSON_SEPARATOR = '\n';

const sseEvent: SSEOutput = { event: 'message', data: '{"id":"0","content":"He"}' };

const sseData = `${Object.keys(sseEvent)
  .map((key) => `${key}:${sseEvent[key as keyof SSEOutput]}`)
  .join(ND_JSON_SEPARATOR)}${SSE_SEPARATOR}`;

const ndJsonData = `${JSON.stringify(sseEvent)}${ND_JSON_SEPARATOR}${JSON.stringify({ ...sseEvent, event: 'delta' })}`;

const baseURL = 'https://api.example.com/v1/chat';
const callbacks: XRequestCallbacks<any> = {
  onSuccess: jest.fn(),
  onError: jest.fn(),
  onUpdate: jest.fn(),
};
const options: XRequestOptions = {
  params: {
    model: 'gpt-3.5-turbo',
    dangerouslyApiKey: 'dangerouslyApiKey',
    messages: [{ role: 'user', content: 'Hello' }],
  },
  callbacks,
};

function mockSSEReadableStream() {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseData.split(SSE_SEPARATOR)) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

function mockNdJsonReadableStream() {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of ndJsonData.split(ND_JSON_SEPARATOR)) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

function mockSSEReadableStreamTimeout() {
  return new ReadableStream({
    async start(controller) {
      const chunks = sseData.split(SSE_SEPARATOR);
      controller.enqueue(new TextEncoder().encode(chunks[0]));
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('');
        }, 2000);
      });
      controller.enqueue(new TextEncoder().encode(chunks[1]));
      controller.close();
    },
  });
}

describe('XRequest Class', () => {
  const mockedXFetch = xFetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error on invalid baseURL', () => {
    expect(() => XRequest('')).toThrow('The baseURL is not valid!');
  });

  test('should create request and handle successful JSON response', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
    };
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers,
      json: jest.fn().mockResolvedValueOnce(options.params),
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledWith([options.params], headers);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(options.params, headers);
  });

  test('should handle JSON response with success false and custom error fields', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
    };
    const errorResponse = {
      success: false,
      name: 'ValidationError',
      message: 'Invalid input parameters',
    };
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 400,
      headers,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).not.toHaveBeenCalled();
    const error = new Error('Invalid input parameters');
    error.name = 'ValidationError';
    expect(callbacks.onError).toHaveBeenCalledWith(error);
  });

  test('should handle JSON response with success false and default error fields', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
    };
    const errorResponse = {
      success: false,
    };
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 500,
      headers,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).not.toHaveBeenCalled();
    const error = new Error('System error');
    error.name = 'SystemError';
    expect(callbacks.onError).toHaveBeenCalledWith(error);
  });

  test('should handle JSON response with success false and partial error fields', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
    };
    const errorResponse = {
      success: false,
      message: 'Custom error message',
    };
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 422,
      headers,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).not.toHaveBeenCalled();
    const error = new Error('Custom error message');
    error.name = 'SystemError';
    expect(callbacks.onError).toHaveBeenCalledWith(error);
  });

  test('should create request and handle streaming response', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('text/event-stream'),
    };
    mockedXFetch.mockResolvedValueOnce({
      headers,
      body: mockSSEReadableStream(),
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledWith([sseEvent], headers);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(sseEvent, headers);
  });

  test('should create request and handle custom response, e.g. application/x-ndjson', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/x-ndjson'),
    };
    mockedXFetch.mockResolvedValueOnce({
      headers,
      body: mockNdJsonReadableStream(),
    });
    const request = XRequest(baseURL, {
      ...options,
      transformStream: new TransformStream(),
    });
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      [ndJsonData.split(ND_JSON_SEPARATOR)[0], ndJsonData.split(ND_JSON_SEPARATOR)[1]],
      headers,
    );
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(
      ndJsonData.split(ND_JSON_SEPARATOR)[0],
      headers,
    );
    expect(callbacks.onUpdate).toHaveBeenCalledWith(
      ndJsonData.split(ND_JSON_SEPARATOR)[1],
      headers,
    );
  });

  test('should create request and handle custom response by response headers', async () => {
    const headers = {
      get: jest.fn().mockReturnValue('application/x-custom'),
    };
    mockedXFetch.mockResolvedValueOnce({
      headers,
      body: mockNdJsonReadableStream(),
    });
    const request = XRequest(baseURL, {
      ...options,
      transformStream: (_, headers) => {
        if (headers.get('Content-Type') === 'application/x-custom') {
          return new TransformStream();
        }
      },
    });
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      [ndJsonData.split(ND_JSON_SEPARATOR)[0], ndJsonData.split(ND_JSON_SEPARATOR)[1]],
      headers,
    );
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(
      ndJsonData.split(ND_JSON_SEPARATOR)[0],
      headers,
    );
    expect(callbacks.onUpdate).toHaveBeenCalledWith(
      ndJsonData.split(ND_JSON_SEPARATOR)[1],
      headers,
    );
  });

  test('should handle error response', async () => {
    mockedXFetch.mockRejectedValueOnce(new Error('Fetch failed'));
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(new Error('Fetch failed'));
  });

  test('should throw error for unsupported content type', async () => {
    const contentType = 'text/plain';
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue(contentType),
      },
    });
    const request = XRequest(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(
      new Error(`The response content-type: ${contentType} is not support!`),
    );
  });

  test('should handle TransformStream errors', async () => {
    const errorTransform = new TransformStream({
      transform() {
        throw new Error('Transform error');
      },
    });

    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('application/x-ndjson'),
      },
      body: mockNdJsonReadableStream(),
    });
    const request = XRequest(baseURL, {
      ...options,
      transformStream: errorTransform,
    });
    await request.asyncHandler;
    expect(callbacks.onError).toHaveBeenCalledWith(new Error('Transform error'));
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).not.toHaveBeenCalled();
  });

  test('global options should effective after set', async () => {
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
      },
      json: jest.fn().mockResolvedValueOnce(options.params),
    });
    setXRequestGlobalOptions({
      headers: { global: 'globalValue' },
    });
    const request = XRequest(baseURL, {
      ...options,
      middlewares: {
        onRequest: async (_baseURL, options) => {
          // ts-ignore
          expect((options?.headers as any)?.global as any).toEqual('globalValue');
          return Promise.resolve([_baseURL, options]);
        },
      },
    });
    await request.asyncHandler;
  });

  test('should throw error when timeout', async () => {
    mockedXFetch.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            status: 200,
            headers: {
              get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
            },
            json: jest.fn().mockResolvedValueOnce(options.params),
          });
        }, 3000);
      });
    });
    const request = XRequest(baseURL, {
      ...options,
      timeout: 1500,
    });
    expect(request.isTimeout).toBe(false);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(new Error(`TimeoutError`));
    expect(request.isTimeout).toBe(true);
  });

  test('should throw error when stream timeout', async () => {
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('text/event-stream'),
      },
      body: mockSSEReadableStreamTimeout(),
    });
    const request = XRequest(baseURL, {
      ...options,
      streamTimeout: 1500,
    });
    expect(request.isStreamTimeout).toBe(false);
    await request.asyncHandler;
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(new Error(`StreamTimeoutError`));
    expect(request.isStreamTimeout).toBe(true);
  });
});
