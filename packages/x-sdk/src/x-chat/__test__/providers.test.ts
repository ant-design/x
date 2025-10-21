import { AnyObject } from '../../_util/type';
import XRequest, { XRequestClass } from '../../x-request';
import { DeepSeekChatProvider, DefaultChatProvider, OpenAIChatProvider } from '../providers';

const baseURL = 'http://localhost:3000';

interface DefaultInput {
  test?: string;
  test2?: string;
}

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
    const defaultProvider = new DefaultChatProvider<
      Record<string, any>,
      DefaultInput,
      Record<string, any>
    >({
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
    const defaultProvider = new DefaultChatProvider<
      Record<string, any>,
      DefaultInput,
      Record<string, any>
    >({
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
    const defaultProvider = new DefaultChatProvider<
      Record<string, any>,
      DefaultInput,
      Record<string, any>
    >({
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
  const jsonHeaders = new Headers();
  jsonHeaders.set('content-type', 'application/json');

  it('should initialize successfully', () => {
    const openAIProvider = new OpenAIChatProvider({
      request: XRequest(baseURL, {
        manual: true,
      }),
    });

    expect(openAIProvider).not.toBeNull();
    expect(openAIProvider).toBeInstanceOf(OpenAIChatProvider);
  });

  describe('transformParams', () => {
    it('should transformParams work successfully with basic parameters', () => {
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

    it('should transformParams work with empty requestParams', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      openAIProvider.injectGetMessages(() => [
        {
          role: 'user',
          content: 'hello',
        },
      ]);
      const result = openAIProvider.transformParams({}, { params: { model: 'gpt-3.5-turbo' } });
      expect(result).toEqual({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'hello',
          },
        ],
      });
    });

    it('should transformParams work with empty options params', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      openAIProvider.injectGetMessages(() => [
        {
          role: 'assistant',
          content: 'response',
        },
      ]);
      const result = openAIProvider.transformParams({ temperature: 0.7 }, {});
      expect(result).toEqual({
        temperature: 0.7,
        messages: [
          {
            role: 'assistant',
            content: 'response',
          },
        ],
      });
    });

    it('should transformParams override options params with requestParams', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      openAIProvider.injectGetMessages(() => []);
      const result = openAIProvider.transformParams(
        { temperature: 0.9, max_tokens: 100 },
        { params: { temperature: 0.7, model: 'gpt-4' } },
      );
      expect(result).toEqual({
        temperature: 0.9,
        max_tokens: 100,
        model: 'gpt-4',
        messages: [],
      });
    });
  });

  describe('transformLocalMessage', () => {
    it('should transformLocalMessage work successfully with single message', () => {
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
      expect(openAIMsg).toEqual([
        {
          role: 'user',
          content: 'test',
        },
      ]);
    });

    it('should transformLocalMessage work with multiple messages', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformLocalMessage({
        messages: [
          { role: 'user', content: 'hello' },
          { role: 'assistant', content: 'hi there' },
          { role: 'user', content: 'how are you?' },
        ],
      });
      expect(openAIMsg).toEqual([
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'hi there' },
        { role: 'user', content: 'how are you?' },
      ]);
    });

    it('should transformLocalMessage return empty array when no messages', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformLocalMessage({});
      expect(openAIMsg).toEqual([]);
    });

    it('should transformLocalMessage handle empty messages array', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformLocalMessage({ messages: [] });
      expect(openAIMsg).toEqual([]);
    });
  });

  describe('transformMessage', () => {
    it('should transformMessage not throw error with invalid JSON', () => {
      const chunk = {
        data: 'invalid json',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const openAIMsg = openAIProvider.transformMessage({
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: '' });
    });

    it('should transformMessage work successfully with streaming response', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"role":"assistant","content":"test2"}}]}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'test',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest2' });
    });

    it('should transformMessage work with normal HTTP response', () => {
      const chunk = {
        choices: [{ message: { role: 'assistant', content: 'test3' } }],
      } as any;
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'test',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: jsonHeaders,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'testtest3' });
    });

    it('should transformMessage handle [DONE] signal in streaming', () => {
      const chunk = {
        data: '[DONE]',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'completed response',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'completed response' });
    });

    it('should transformMessage handle multiple choices in streaming', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"role":"assistant","content":"part1"}},{"delta":{"role":"assistant","content":"part2"}}]}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'start',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'startpart1part2' });
    });

    it('should transformMessage handle empty delta content', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"role":"assistant","content":""}}]}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'existing',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'existing' });
    });

    it('should transformMessage handle missing role in delta', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"content":"new content"}}]}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: 'previous',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'previousnew content' });
    });

    it('should transformMessage handle chunks array fallback', () => {
      const chunk = { choices: [{ message: { role: 'user', content: 'fallback' } }] };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: undefined,
        chunk: undefined as any,
        chunks: [chunk] as any,
        status: 'loading',
        responseHeaders: jsonHeaders,
      });
      expect(openAIMsg).toEqual({ role: 'user', content: 'fallback' });
    });

    it('should transformMessage handle null originMessage', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"role":"system","content":"initial message"}}]}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: undefined,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'system', content: 'initial message' });
    });

    it('should transformMessage handle complex nested structure', () => {
      const chunk = {
        data: '{"choices":[{"delta":{"role":"assistant","content":"Hello, world!"}}],"usage":{"prompt_tokens":10,"completion_tokens":5}}',
      };
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });
      const openAIMsg = openAIProvider.transformMessage({
        originMessage: {
          role: 'assistant',
          content: '',
        } as any,
        chunk,
        chunks: [],
        status: 'loading',
        responseHeaders: headers,
      });
      expect(openAIMsg).toEqual({ role: 'assistant', content: 'Hello, world!' });
    });

    it('should handle real-world OpenAI streaming response format', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      // Simulate streaming chunks
      const chunks = [
        {
          data: '{"choices":[{"delta":{"role":"assistant"}}],"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890}',
        },
        {
          data: '{"choices":[{"delta":{"content":"Hello"}}],"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890}',
        },
        {
          data: '{"choices":[{"delta":{"content":", world!"}}],"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890}',
        },
        { data: '[DONE]' },
      ];

      let result = { role: 'assistant', content: '' } as any;

      chunks.forEach((chunk) => {
        if (chunk.data !== '[DONE]') {
          result = openAIProvider.transformMessage({
            originMessage: result,
            chunk,
            chunks: [],
            status: 'loading',
            responseHeaders: headers,
          });
        }
      });

      expect(result).toEqual({ role: 'assistant', content: 'Hello, world!' });
    });

    it('should handle real-world OpenAI non-streaming response format', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const response = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'This is a complete response from OpenAI.',
            },
            finish_reason: 'stop',
            index: 0,
          },
        ],
        usage: {
          prompt_tokens: 20,
          completion_tokens: 10,
          total_tokens: 30,
        },
        id: 'chatcmpl-456',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
      } as any;

      const result = openAIProvider.transformMessage({
        originMessage: undefined,
        chunk: response,
        chunks: [],
        status: 'loading',
        responseHeaders: jsonHeaders,
      });

      expect(result).toEqual({
        role: 'assistant',
        content: 'This is a complete response from OpenAI.',
      });
    });

    it('should handle function call responses', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const response = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: null,
              function_call: {
                name: 'get_weather',
                arguments: '{"location": "San Francisco, CA"}',
              },
            },
          },
        ],
      } as any;

      const result = openAIProvider.transformMessage({
        originMessage: undefined,
        chunk: response,
        chunks: [],
        status: 'loading',
        responseHeaders: jsonHeaders,
      });

      expect(result).toEqual({
        role: 'assistant',
        content: '',
      });
    });

    it('should handle tool call responses', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const response = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: null,
              tool_calls: [
                {
                  id: 'call_123',
                  type: 'function',
                  function: {
                    name: 'get_weather',
                    arguments: '{"location": "San Francisco, CA"}',
                  },
                },
              ],
            },
          },
        ],
      } as any;

      const result = openAIProvider.transformMessage({
        originMessage: undefined,
        chunk: response,
        chunks: [],
        status: 'loading',
        responseHeaders: jsonHeaders,
      });

      expect(result).toEqual({
        role: 'assistant',
        content: '',
      });
    });

    it('should handle edge case with malformed choices', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const response = {
        choices: [{ delta: { content: 'valid' } }, { invalid: 'structure' }, null],
      } as any;

      const result = openAIProvider.transformMessage({
        originMessage: { role: 'assistant', content: 'start' } as any,
        chunk: response,
        chunks: [],
        status: 'loading',
        responseHeaders: jsonHeaders,
      });

      expect(result).toEqual({
        role: 'assistant',
        content: 'startvalid',
      });
    });

    it('should handle empty response gracefully', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      const testCases = [
        {},
        { choices: [] },
        { choices: [null] },
        { choices: [{}] },
        { choices: [{ delta: {} }] },
        { choices: [{ message: {} }] },
      ];

      testCases.forEach((testCase) => {
        const result = openAIProvider.transformMessage({
          originMessage: { role: 'assistant', content: 'existing' } as any,
          chunk: testCase as any,
          chunks: [],
          status: 'loading',
          responseHeaders: jsonHeaders,
        });
        expect(result).toEqual({ role: 'assistant', content: 'existing' });
      });
    });
  });

  describe('Integration tests', () => {
    it('should handle complete conversation flow', () => {
      const openAIProvider = new OpenAIChatProvider({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      // Setup messages
      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the weather like?' },
      ] as any;
      openAIProvider.injectGetMessages(() => messages);

      // Test parameter transformation
      const params = openAIProvider.transformParams({ temperature: 0.7, max_tokens: 150 } as any, {
        params: { model: 'gpt-3.5-turbo' },
      });
      expect(params).toEqual({
        temperature: 0.7,
        max_tokens: 150,
        model: 'gpt-3.5-turbo',
        messages,
      });

      // Test local message extraction
      const localMsg = openAIProvider.transformLocalMessage({ messages });
      expect(localMsg).toEqual([
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the weather like?' },
      ]);
    });

    it('should handle type safety with generic types', () => {
      interface CustomMessage {
        role: 'user' | 'assistant' | 'system';
        content: string;
        metadata?: Record<string, any>;
      }

      interface CustomParams {
        model: string;
        temperature?: number;
        max_tokens?: number;
        messages: CustomMessage[];
      }

      const openAIProvider = new OpenAIChatProvider<CustomMessage, CustomParams, any>({
        request: XRequest(baseURL, {
          manual: true,
        }),
      });

      openAIProvider.injectGetMessages(() => [
        { role: 'user', content: 'test', metadata: { test: true } },
      ]);

      const params = openAIProvider.transformParams({ temperature: 0.8 } as any, {
        params: { model: 'gpt-4', messages: [] },
      });

      expect(params.model).toBe('gpt-4');
      expect(params.temperature).toBe(0.8);
      expect(params.messages).toHaveLength(1);
    });
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
      } as any,
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
      } as any,
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
