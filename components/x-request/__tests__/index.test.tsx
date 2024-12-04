import XRequest from '../index';
import xFetch from '../x-fetch';

jest.mock('../x-fetch', () => jest.fn());

const sseChunks = ['event:message\ndata:{"id":"0","content":"He"}\n\n'];

function mockReadableStream() {
  return new ReadableStream({
    async start(controller) {
      for (const chunk of sseChunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

describe('XRequest Class', () => {
  const baseURL = 'https://api.example.com/v1/chat';
  const model = 'gpt-3.5-turbo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with valid options', () => {
    const request = XRequest({ baseURL, model });

    expect(request.baseURL).toBe(baseURL);
    expect(request.model).toBe(model);
  });

  test('should throw error on invalid baseURL', () => {
    expect(() => XRequest({ baseURL: '', model })).toThrow('The baseURL is not valid!');
  });

  test('should create request and handle successful JSON response', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onUpdate = jest.fn();

    const params = { messages: [{ role: 'user', content: 'Hello' }] };

    const mockedXFetch = xFetch as jest.Mock;

    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValueOnce({ response: 'Hi there!' }),
    });

    const request = XRequest({ baseURL, model });
    await request.create(params, { onSuccess, onError, onUpdate });

    expect(onSuccess).toHaveBeenCalledWith([{ response: 'Hi there!' }]);
    expect(onError).not.toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalled();
  });

  test('should create request and handle streaming response', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onUpdate = jest.fn();
    const params = { messages: [{ role: 'user', content: 'Hello' }] };

    const mockedXFetch = xFetch as jest.Mock;
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('text/event-stream'),
      },
      body: mockReadableStream(),
    });

    const request = XRequest({ baseURL, model });
    await request.create(params, { onSuccess, onError, onUpdate });

    const sseEvent = { event: 'message', data: '{"id":"0","content":"He"}' };

    expect(onSuccess).toHaveBeenCalledWith([sseEvent]);
    expect(onError).not.toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalledWith(sseEvent);
  });

  test('should handle error response', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onUpdate = jest.fn();
    const params = { messages: [{ role: 'user', content: 'Hello' }] };

    const mockedXFetch = xFetch as jest.Mock;
    mockedXFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    const request = XRequest({ baseURL, model });
    await request.create(params, { onSuccess, onError, onUpdate }).catch(() => {});

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(new Error('Fetch failed'));
  });

  test('should throw error for unsupported content type', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onUpdate = jest.fn();
    const params = { messages: [{ role: 'user', content: 'Hello' }] };

    const mockedXFetch = xFetch as jest.Mock;
    mockedXFetch.mockResolvedValueOnce({
      headers: {
        get: jest.fn().mockReturnValue('text/plain'),
      },
    });

    const request = XRequest({ baseURL, model });
    await request.create(params, { onSuccess, onError, onUpdate }).catch(() => {});

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      new Error('The response content-type: text/plain is not support!'),
    );
  });
});
