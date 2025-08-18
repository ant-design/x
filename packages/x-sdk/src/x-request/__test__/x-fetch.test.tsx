import xFetch from '../x-fetch';

global.fetch = jest.fn();

describe('xFetch', () => {
  const baseURL = 'https://api.example.com';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return response on successful fetch', async () => {
    const mockResponse = new Response('{"data": "test"}', { status: 200 });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await xFetch(baseURL, {});

    expect(response).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(baseURL, {});
  });

  it('should call middlewares', async () => {
    const mockResponse = new Response('{"data": "test"}', { status: 200 });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const middlewares = {
      onRequest: jest.fn(async (url) => [url, { method: 'POST' }]),
      onResponse: jest.fn(async () => new Response('{"data": "modified"}', { status: 200 })),
    };

    const response = await xFetch(baseURL, { middlewares } as any);

    expect(middlewares.onRequest).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(baseURL, { method: 'POST' });
    expect(middlewares.onResponse).toHaveBeenCalled();
    expect(await response.text()).toBe('{"data": "modified"}');
  });

  it('should throw an error while options.onResponse not return a Response instance', async () => {
    await expect(
      xFetch(baseURL, { middlewares: { onResponse: () => new Date() as any } }),
    ).rejects.toThrow('The options.onResponse must return a Response instance!');
  });

  it('should throw an error on non-200 status', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 404 }));

    await expect(xFetch(baseURL, {})).rejects.toThrow('Fetch failed with status 404');
  });

  it('should throw an error on empty response body', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 200 }));

    await expect(xFetch(baseURL, {})).rejects.toThrow('The response body is empty.');
  });

  it('should throw an error if fetch is not a function', async () => {
    await expect(xFetch(baseURL, { fetch: 'not_a_function' as any })).rejects.toThrow(
      'The options.fetch must be a typeof fetch function!',
    );
  });

  it('should use global fetch if no fetch option provided', async () => {
    const mockResponse = new Response('{"data": "test"}', { status: 200 });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await xFetch(baseURL, {});

    expect(response).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(baseURL, {});
  });
});
