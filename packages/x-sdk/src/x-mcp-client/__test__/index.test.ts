import { XRequestCallbacks, XRequestOptions } from '../../x-request';
import xFetch from '../../x-request/x-fetch';
import XMCPClient from '../index';

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
const mockTools = [
  {
    name: 'TestTool',
    description: 'A test tool',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    annotations: {
      title: 'Test Tool',
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
  },
];

describe('XMCPClient Function', () => {
  const mockedXFetch = xFetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error on invalid baseURL', () => {
    expect(() => XMCPClient('')).toThrow('The baseURL is not valid!');
  });

  test('should call tools method successfully', async () => {
    mockedXFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json; charset=utf-8'),
      },
      json: jest.fn().mockResolvedValueOnce(mockTools),
    });
    const client = XMCPClient(baseURL, options);
    const tools = await client.tools();
    expect(tools).toEqual(mockTools);
  });
});
