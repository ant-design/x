import { XRequestCallbacks, XRequestOptions } from '../../x-request';
import xFetch from '../../x-request/x-fetch';
import XModel from '../index';

jest.mock('../../x-request/x-fetch', () => jest.fn());

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

describe('XModel Function', () => {
  const mockedXFetch = xFetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error on invalid baseURL', () => {
    expect(() =>
      XModel('', {
        params: {
          model: 'GPT-3.5-turbo',
          messages: [],
        },
      }),
    ).toThrow('The baseURL is not valid!');
  });

  test('should create request and handle successful JSON response', async () => {
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
      },
      json: jest.fn().mockResolvedValueOnce(options.params),
    });
    const request = XModel(baseURL, options);
    await request.asyncHandler;
    expect(callbacks.onSuccess).toHaveBeenCalledWith([options.params]);
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(callbacks.onUpdate).toHaveBeenCalledWith(options.params);
  });
});
