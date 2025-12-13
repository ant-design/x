import React, { useImperativeHandle } from 'react';
import { fireEvent, render, renderHook, sleep, waitFakeTimer } from '../../../tests/utils';
import { DefaultChatProvider } from '../../chat-providers';
import XRequest from '../../x-request';
import useXChat, { MessageStatus, SimpleType, XChatConfig } from '../index';
import { chatMessagesStoreHelper } from '../store';

interface ChatInput {
  query: string;
  [PropertyKey: string]: any;
}

describe('useXChat', () => {
  const requestNeverEnd = jest.fn(() => {});

  beforeAll(() => {
    requestNeverEnd.mockClear();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const Demo = React.forwardRef(function Demo<
    ChatMessage extends SimpleType = string,
    ParsedMessage extends SimpleType = string,
    Input = ChatInput,
    Output = string,
  >({ provider, ...config }: XChatConfig<ChatMessage, ParsedMessage, Input, Output>, ref: any) {
    const { messages, parsedMessages, onRequest, onReload, isRequesting, abort } = useXChat({
      provider,
      ...config,
    });

    useImperativeHandle(ref, () => ({
      messages,
      parsedMessages,
      onRequest,
      onReload,
      isRequesting,
      abort,
    }));

    return (
      <>
        <pre>{JSON.stringify(parsedMessages)}</pre>
        <input
          onChange={(e) => {
            onRequest(
              {
                query: e.target.value,
              } as Input,
              {
                extraInfo: {
                  feedback: 'like',
                },
              },
            );
          }}
        />
      </>
    );
  });

  function getMessages(container: HTMLElement) {
    return JSON.parse(container.querySelector('pre')!.textContent!);
  }

  function expectMessage<T = string>(message: T, status?: MessageStatus) {
    const obj: any = { message };
    if (status) {
      obj.status = status;
    }
    return expect.objectContaining(obj);
  }

  it('defaultMessages', () => {
    const provider = new DefaultChatProvider<string, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
      }),
    });
    const { container } = render(
      <Demo
        provider={provider}
        defaultMessages={[
          {
            message: 'default',
          },
        ]}
      />,
    );

    expect(getMessages(container)).toEqual([
      {
        id: 'default_0',
        message: 'default',
        status: 'local',
      },
    ]);
  });

  describe('requestPlaceholder', () => {
    it('static', () => {
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            await sleep(1000);
            return Promise.resolve(new Response('{}'));
          },
        }),
      });
      const { container } = render(<Demo provider={provider} requestPlaceholder="bamboo" />);
      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(getMessages(container)).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
    });

    it('callback', () => {
      const requestPlaceholder = jest.fn(() => 'light');
      const transformStream = new TransformStream();
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          transformStream: transformStream,
          fetch: async () => {
            await sleep(1000);
            return Promise.resolve(new Response('{}'));
          },
        }),
      });
      const { container } = render(
        <Demo provider={provider} requestPlaceholder={requestPlaceholder} />,
      );

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(requestPlaceholder).toHaveBeenCalledWith(
        { query: 'little' },
        {
          messages: [{ query: 'little' }],
        },
      );

      expect(getMessages(container)).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('light', 'loading'),
      ]);
    });
  });

  describe('requestFallback', () => {
    it('static', async () => {
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            throw new Error('failed');
          },
        }),
      });
      const { container } = render(<Demo provider={provider} requestFallback="bamboo" />);

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
      await sleep(1000);
      expect(getMessages(container)).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('bamboo', 'error'),
      ]);
    });

    it('callback', async () => {
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            throw new Error('failed');
          },
        }),
      });
      const requestFallback = jest.fn(async () => 'light');
      const { container } = render(<Demo provider={provider} requestFallback={requestFallback} />);

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      await sleep(1000);

      expect(requestFallback).toHaveBeenCalledWith(
        { query: 'little' },
        {
          message: undefined,
          error: new Error('failed'),
          messages: [{ query: 'little' }],
        },
      );

      expect(getMessages(container)).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('light', 'error'),
      ]);
    });
  });

  it('parser return multiple messages', async () => {
    const provider = new DefaultChatProvider<ChatInput, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
      }),
    });
    const { container } = render(
      <Demo
        provider={provider}
        parser={(msg) => [`0_${JSON.stringify(msg)}`, `1_${JSON.stringify(msg)}`]}
      />,
    );

    fireEvent.change(container.querySelector('input')!, { target: { value: 'light' } });
    await waitFakeTimer();

    expect(getMessages(container)).toEqual([
      expectMessage('0_{"query":"light"}', 'local'),
      expectMessage('1_{"query":"light"}', 'local'),
    ]);
  });

  it('should throw an error if onRequest,onReload,abort is called without an agent', () => {
    const { result } = renderHook(() =>
      useXChat({
        defaultMessages: [{ message: 'Hello' }],
      }),
    );

    expect(() => result.current?.onRequest({ query: 'Hello' })).toThrow('provider is required');
    expect(() =>
      result.current?.onReload(
        'key1',
        { query: 'Hello' },
        {
          extraInfo: {
            feedback: 'dislike',
          },
        },
      ),
    ).toThrow('provider is required');
    expect(() => result.current?.abort()).toThrow('provider is required');
  });

  it('should setMessage work successfully', async () => {
    const { result } = renderHook(() =>
      useXChat<string, ChatInput, any, any>({
        defaultMessages: [{ message: 'Hello' }],
      }),
    );
    result.current?.setMessage('default_0', { message: 'Hello2', extraInfo: { feedback: 'like' } });
    result.current?.setMessage('default_1', { message: 'Hello3' });
    await sleep(100);
    expect(result.current?.messages.length).toBe(1);
    expect(result.current?.messages[0].message).toEqual('Hello2');
  });

  it('should reload, isRequesting work successfully', async () => {
    let count = 0;
    const provider = new DefaultChatProvider<ChatInput, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
        fetch: async () => {
          count = count + 1;
          let res = '{"content": "bamboo"}';
          if (count > 1) {
            res = '{"content": "bamboo2"}';
          }
          return Promise.resolve(
            new Response(res, {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          );
        },
      }),
    });
    const ref = React.createRef<any>();
    const { container } = render(
      <Demo ref={ref} provider={provider} requestPlaceholder="bamboo placeholder" />,
    );

    fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
    expect(ref.current?.isRequesting).toBe(true);
    await sleep(200);
    expect(ref.current?.isRequesting).toBe(false);
    expect(getMessages(container)).toEqual([
      expectMessage({ query: 'little' }, 'local'),
      expectMessage({ content: 'bamboo' }, 'success'),
    ]);

    ref.current.onReload(
      ref.current.parsedMessages[1].id,
      {},
      {
        extraInfo: {
          feedback: 'dislike',
        },
      },
    );
    expect(() => ref.current?.onReload('fake id', { query: 'Hello' })).toThrow(
      'message [fake id] is not found',
    );
    await sleep(200);
    expect(getMessages(container)).toEqual([
      expectMessage({ query: 'little' }, 'local'),
      expectMessage({ content: 'bamboo2' }, 'success'),
    ]);
  });

  it('should chat messages store(dep conversationKey) work successfully', async () => {
    renderHook(() =>
      useXChat<string, ChatInput, any, any>({
        defaultMessages: [{ message: 'Hello' }],
        conversationKey: 'conversation-1',
      }),
    );
    await sleep(100);
    const store = chatMessagesStoreHelper.get('conversation-1');
    expect(store).toBeTruthy();
    expect(store?.getMessages()).toEqual([{ id: 'default_0', message: 'Hello', status: 'local' }]);

    store?.addMessage({
      id: 'msg_1',
      message: 'Kitty',
      status: 'local',
    });
    expect(store?.getMessages().length).toBe(2);
    expect(
      store?.addMessage({
        id: 'msg_1',
        message: 'Kitty2',
        status: 'local',
      }),
    ).toBe(false);
    expect(store?.getMessages().length).toBe(2);

    store?.removeMessage('msg_1');
    expect(store?.getMessages().length).toBe(1);
    expect(store?.removeMessage('msg_2')).toBe(false);

    const messages = chatMessagesStoreHelper.getMessages('conversation-1');
    expect(messages).toEqual([{ id: 'default_0', message: 'Hello', status: 'local' }]);

    chatMessagesStoreHelper.delete('conversation-1');
    expect(chatMessagesStoreHelper.get('conversation-1')).toBeFalsy();
  });
});
