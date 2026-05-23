import type { XRequestCallbacks, XRequestOptions } from '../index';
import XRequest from '../index';

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

describe('XRequest Class', () => {
  test('should throw error when abort', async () => {
    const fetchMock = jest.fn((_url, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted. ', 'AbortError'));
        });
      });
    });
    const request = XRequest(baseURL, {
      ...options,
      fetch: fetchMock,
    });
    request.abort();
    await request.asyncHandler;
    expect(callbacks.onError).toHaveBeenCalledWith(
      new DOMException('The operation was aborted. ', 'AbortError'),
    );
  });
});
