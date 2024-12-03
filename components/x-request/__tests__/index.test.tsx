import XRequest from '../index';
import xFetch from '../x-fetch';

import type { SSEOutput } from '../../x-stream';
import type { XRequestCallbacks, XRequestOptions } from '../index';

jest.mock('../x-fetch', () => jest.fn());

const SSE_SEPARATOR = '\n\n';

const ND_JSON_SEPARATOR = '\n';

const sseEvent: SSEOutput = { event: 'message', data: '{"id":"0","content":"He"}' };

const sseData = `${Object.keys(sseEvent)
  .map((key) => `${key}:${sseEvent[key as keyof SSEOutput]}`)
  .join(ND_JSON_SEPARATOR)}${SSE_SEPARATOR}`;

const ndJsonData = `${JSON.stringify(sseEvent)}${ND_JSON_SEPARATOR}${JSON.stringify({ ...sseEvent, event: 'delta' })}`;

const options: XRequestOptions = {
  baseURL: 'https://api.example.com/v1/chat',
  model: 'gpt-3.5-turbo',
  dangerouslyApiKey: 'dangerouslyApiKey',
};

const params = { messages: [{ role: 'user', content: 'Hello' }] };

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

describe('XRequest Class', () => {
  const callbacks: XRequestCallbacks<any> = {
    onSuccess: jest.fn(),
    onError: jest.fn(),
    onUpdate: jest.fn(),
  };

  const mockedXFetch = xFetch as jest.Mock;

  let request: ReturnType<typeof XRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    request = XRequest(options);
  });

  test('should initialize with valid options', () => {
    expect(request.baseURL).toBe(options.baseURL);
    expect(request.model).toBe(options.model);
  });

  test('should throw error on invalid baseURL', () => {
    expect(() => XRequest({ baseURL: '' })).toThrow('The baseURL is not valid!');
  });

  test('should create request and handle successful JSON response', async () => {
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValueOnce(params),
    });
    await request.create(params, callbacks);
    expect(callbacks.onSuccess).toHaveBeenCalledWith([params]);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(params);
  });

  test('should create request and handle streaming response', async () => {
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('text/event-stream'),
      },
      body: mockSSEReadableStream(),
    });
    await request.create(params, callbacks);
    expect(callbacks.onSuccess).toHaveBeenCalledWith([sseEvent]);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(sseEvent);
  });

  test('should create request and handle custom response, e.g. application/x-ndjson', async () => {
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('application/x-ndjson'),
      },
      body: mockNdJsonReadableStream(),
    });
    await request.create(params, callbacks, new TransformStream());
    expect(callbacks.onSuccess).toHaveBeenCalledWith([
      ndJsonData.split(ND_JSON_SEPARATOR)[0],
      ndJsonData.split(ND_JSON_SEPARATOR)[1],
    ]);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(ndJsonData.split(ND_JSON_SEPARATOR)[0]);
    expect(callbacks.onUpdate).toHaveBeenCalledWith(ndJsonData.split(ND_JSON_SEPARATOR)[1]);
  });

  test('should handle error response', async () => {
    mockedXFetch.mockRejectedValueOnce(new Error('Fetch failed'));
    await request.create(params, callbacks).catch(() => {});
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
    await request.create(params, callbacks).catch(() => {});
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(
      new Error(`The response content-type: ${contentType} is not support!`),
    );
  });
});
