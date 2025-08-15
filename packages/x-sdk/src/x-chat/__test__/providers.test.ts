import { AnyObject } from '../../_util/type';
import XRequest, { XRequestClass } from '../../x-request';
import { DeepSeekChatProvider, DefaultChatProvider, OpenAIChatProvider } from '../providers';

const baseURL = 'http://localhost:3000';

describe('DefaultChatProvider test', () => {
  const headers = new Headers();
  headers.set('content-type', 'text/event-stream');

  it('should initialize successfully', () => {
    const defaultProvider = new DefaultChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });

    expect(defaultProvider).not.toBeNull();
  });

  it('should transformParams throw error when requestParams is not an object', () => {
    const defaultProvider = new DefaultChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    expect(() => {
      defaultProvider.transformParams('test' as any, {
        params: {
          test: 'test',
        },
      });
    }).toThrow('requestParams must be an object');
  });

  it('should transformParams work successfully', () => {
    const defaultProvider = new DefaultChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    const defaultTransformParams = defaultProvider.transformParams(
      {
        test2: 'test2',
      },
      {
        params: {
          test: 'test',
        },
      },
    );
    expect(defaultTransformParams).toEqual({ test: 'test', test2: 'test2' });
  });

  it('should transformLocalMessage work successfully', () => {
    const defaultProvider = new DefaultChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    const defaultMsg = defaultProvider.transformLocalMessage({ test: 'test' });
    expect(defaultMsg).toEqual({ test: 'test' });
  });

  it('should transformMessage work successfully', () => {
    const defaultProvider = new DefaultChatProvider<string, AnyObject, string>({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    let chunk: any = 'test';
    let defaultMsg = defaultProvider.transformMessage({
      originMessage: '',
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(defaultMsg).toEqual('test');

    chunk = 'test2';
    defaultMsg = defaultProvider.transformMessage({
      originMessage: '',
      chunk: '',
      chunks: [chunk],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(defaultMsg).toEqual('test2');

    chunk = 'test3';
    defaultMsg = defaultProvider.transformMessage({
      originMessage: '',
      chunk: '',
      chunks: chunk,
      status: 'loading',
      responseHeaders: headers,
    });
    expect(defaultMsg).toEqual('test3');
  });
});

describe('OpenAiChatProvider test', () => {
  const headers = new Headers();
  headers.set('content-type', 'text/event-stream');

  it('should initialize successfully', () => {
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });

    expect(openAIProvider).not.toBeNull();
  });

  it('should transformParams work successfully', () => {
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    openAIProvider.injectGetMessages(() => [
      {
        role: 'user',
        content: 'test',
      },
    ]);
    const openAITransformParams = openAIProvider.transformParams(
      {
        test2: 'test2',
      },
      {
        params: {
          test3: 'test3',
        },
      },
    );
    expect(openAITransformParams).toEqual({
      test2: 'test2',
      test3: 'test3',
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });
  });

  it('should transformLocalMessage work successfully', () => {
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    const openAIMsg = openAIProvider.transformLocalMessage({
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });
    expect(openAIMsg).toEqual({
      role: 'user',
      content: 'test',
    });
  });

  it('should transformMessage not throw error', () => {
    let chunk = {};
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    // error json format
    chunk = {
      data: 'test',
    };
    const openAIMsg = openAIProvider.transformMessage({
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: '' });
  });

  it('should transformMessage work successfully', () => {
    let chunk = {};
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    // test for streaming
    chunk = {
      data: '{"choices":[{"delta":{"role":"assistant","content":"test2"}}]}',
    };
    let openAIMsg = openAIProvider.transformMessage({
      originMessage: {
        role: 'assistant',
        content: 'test',
      },
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest2' });

    // test for normal http
    chunk = {
      data: '{"choices":[{"message":{"role":"assistant","content":"test3"}}]}',
    };
    openAIMsg = openAIProvider.transformMessage({
      originMessage: {
        role: 'assistant',
        content: 'test',
      },
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest3' });
  });
});

describe('DeepSeekChatProvider test', () => {
  const headers = new Headers();
  headers.set('content-type', 'text/event-stream');

  it('should initialize successfully', () => {
    const openAIProvider = new DeepSeekChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });

    expect(openAIProvider).not.toBeNull();
  });

  it('should transformParams work successfully', () => {
    const openAIProvider = new DeepSeekChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    openAIProvider.injectGetMessages(() => [
      {
        role: 'user',
        content: 'test',
      },
    ]);
    const openAITransformParams = openAIProvider.transformParams(
      {
        test2: 'test2',
      },
      {
        params: {
          test3: 'test3',
        },
      },
    );
    expect(openAITransformParams).toEqual({
      test2: 'test2',
      test3: 'test3',
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });
  });

  it('should transformLocalMessage work successfully', () => {
    const openAIProvider = new DeepSeekChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    const openAIMsg = openAIProvider.transformLocalMessage({
      messages: [
        {
          role: 'user',
          content: 'test',
        },
      ],
    });
    expect(openAIMsg).toEqual({
      role: 'user',
      content: 'test',
    });
  });

  it('should transformMessage not throw error', () => {
    let chunk = {};
    const openAIProvider = new DeepSeekChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    // error json format
    chunk = {
      data: 'test',
    };
    const openAIMsg = openAIProvider.transformMessage({
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: '' });
  });

  it('should transformMessage work successfully', () => {
    let chunk = {};
    const openAIProvider = new DeepSeekChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });
    // test for streaming
    chunk = {
      data: '{"choices":[{"delta":{"role":"assistant","content":"test2"}}]}',
    };
    let openAIMsg = openAIProvider.transformMessage({
      originMessage: {
        role: 'assistant',
        content: 'test',
      },
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest2' });

    // test for normal http
    chunk = {
      data: '{"choices":[{"message":{"role":"assistant","content":"test3"}}]}',
    };
    openAIMsg = openAIProvider.transformMessage({
      originMessage: {
        role: 'assistant',
        content: 'test',
      },
      chunk,
      chunks: [],
      status: 'loading',
      responseHeaders: headers,
    });
    expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest3' });
  });
});

describe('AbstractChatProvider test', () => {
  it('should get request instance successfully', () => {
    const provider = new DefaultChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });

    expect(provider.request).toBeInstanceOf(XRequestClass);
  });

  it('should throw error when manual is not true', () => {
    expect(() => {
      new DefaultChatProvider({
        request: XRequest(baseURL, {}),
      });
    }).toThrow('request must be manual');
  });

  it('should injectRequest work successfully', async () => {
    const onSuccess = jest.fn();
    const onUpdate = jest.fn();
    const provider = new DefaultChatProvider({
      request: XRequest('baseURL', {
        manual: true,
        callbacks: {
          onError: jest.fn(),
          onSuccess,
          onUpdate,
        },
        fetch: async () => {
          return Promise.resolve(
            new Response('{}', {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          );
        },
      }),
    });

    const onSuccess2 = jest.fn();
    const onUpdate2 = jest.fn();
    provider.injectRequest({
      onError: jest.fn(),
      onSuccess: onSuccess2,
      onUpdate: onUpdate2,
    });
    provider.request.run();
    await provider.request.asyncHandler;

    expect(provider.request.isRequesting).toBeFalsy();
    expect(onSuccess).toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalled();
    expect(onSuccess2).toHaveBeenCalled();
    expect(onUpdate2).toHaveBeenCalled();

    const onError = jest.fn();
    const onError2 = jest.fn();
    const provider2 = new DefaultChatProvider({
      request: XRequest('baseURL', {
        manual: true,
        callbacks: {
          onError,
          onSuccess,
          onUpdate,
        },
        fetch: async () => {
          throw new Error();
        },
      }),
    });
    provider2.injectRequest({
      onError: onError2,
      onSuccess: onSuccess2,
      onUpdate: onUpdate2,
    });
    provider2.request.run();
    await provider2.request.asyncHandler;

    expect(onError).toHaveBeenCalled();
    expect(onError2).toHaveBeenCalled();
  });
});
