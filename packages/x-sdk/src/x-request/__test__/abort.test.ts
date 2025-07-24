import { enableFetchMocks } from 'jest-fetch-mock';
import XRequest from '../index';
import type { XRequestCallbacks, XRequestOptions } from '../index';

enableFetchMocks();

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
    // already mocked by jest-fetch-mock
    (fetch as any).mockResponseOnce(() => {
      return Promise.resolve({
        body: '{}',
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
      });
    });
    const request = XRequest(baseURL, {
      ...options,
    });
    request.abort();
    await request.asyncHandler;
    expect(callbacks.onError).toHaveBeenCalledWith(
      new DOMException('The operation was aborted. ', 'AbortError'),
    );
  });
});
