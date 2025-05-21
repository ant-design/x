import React from 'react';
import { fireEvent, render, renderHook, waitFakeTimer } from '../../../tests/utils';
import useXAgent, { RequestFn } from '../../use-x-agent';
import { MessageStatus, SimpleType, XChatConfig } from '../index';
import useXChat from '../index';

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

  function Demo<Message extends SimpleType = string>({
    request,
    ...config
  }: Partial<XChatConfig<Message>> & {
    request?: RequestFn<Message, Message, Message>;
  }) {
    const [agent] = useXAgent({
      request: request || requestNeverEnd,
    });

    const { parsedMessages, onRequest } = useXChat({ agent, ...config });

    return (
      <>
        <pre>{JSON.stringify(parsedMessages)}</pre>
        <input
          onChange={(e) => {
            onRequest(e.target.value);
          }}
        />
      </>
    );
  }

  function DemoForCustomMessage<Message extends SimpleType = string>({
    request,
    ...config
  }: Partial<XChatConfig<Message>> & {
    request?: RequestFn<Message, Message, Message>;
  }) {
    const [agent] = useXAgent({
      request: request || requestNeverEnd,
    });

    const { parsedMessages, onRequest } = useXChat({ agent, ...config });

    return (
      <>
        <pre>{JSON.stringify(parsedMessages)}</pre>
        <input
          onChange={(e) => {
            onRequest({ message: e.target.value as Message, stream: true });
          }}
        />
      </>
    );
  }

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
    const { container } = render(
      <Demo
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
      const errorTransform = new TransformStream({
        transform() {
          throw new Error('Transform error');
        },
      });
      const { container } = render(
        <Demo requestPlaceholder="bamboo" transformStream={errorTransform} />,
      );
      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(requestNeverEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'little',
          messages: ['little'],
        }),
        expect.anything(),
        expect.any(TransformStream),
      );

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
    });

    it('callback', () => {
      const requestPlaceholder = jest.fn(() => 'light');
      const transformStream = new TransformStream();
      const { container } = render(
        <Demo
          request={requestNeverEnd}
          transformStream={transformStream}
          requestPlaceholder={requestPlaceholder}
        />,
      );

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(requestNeverEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'little',
          messages: ['little'],
        }),
        expect.anything(),
        expect.any(TransformStream),
      );

      expect(requestPlaceholder).toHaveBeenCalledWith('little', {
        messages: ['little'],
      });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('light', 'loading'),
      ]);
    });
  });

  describe('requestFallback', () => {
    const requestFailed = jest.fn(async (_, { onError }) => {
      setTimeout(() => {
        onError(new Error('failed'));
      }, 100);
    });

    it('static', async () => {
      const { container } = render(<Demo request={requestFailed} requestFallback="bamboo" />);

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      await waitFakeTimer();

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'error'),
      ]);
    });

    it('callback', async () => {
      const requestFallback = jest.fn(async () => 'light');
      const { container } = render(
        <Demo request={requestFailed} requestFallback={requestFallback} />,
      );

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      await waitFakeTimer();

      expect(requestFallback).toHaveBeenCalledWith('little', {
        error: new Error('failed'),
        messages: ['little'],
      });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('light', 'error'),
      ]);
    });

    it('without fallback', async () => {
      const request = jest.fn((_, { onUpdate, onError }) => {
        onUpdate('bamboo');

        setTimeout(() => {
          onError(new Error('error'));
        }, 100);
      });
      const { container } = render(<Demo request={request} />);

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'loading'),
      ]);

      await waitFakeTimer();
      expect(getMessages(container)).toEqual([expectMessage('little', 'local')]);
    });
  });

  it('parser return multiple messages', async () => {
    const { container } = render(<Demo parser={(msg) => [`0_${msg}`, `1_${msg}`]} />);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'light' } });
    await waitFakeTimer();

    console.log(container.innerHTML);

    expect(getMessages(container)).toEqual([
      expectMessage('0_light', 'local'),
      expectMessage('1_light', 'local'),
    ]);
  });

  it('update to success', async () => {
    const request = jest.fn((_, { onUpdate, onSuccess }) => {
      onUpdate('bamboo');

      setTimeout(() => {
        onSuccess(['bamboo']);
      }, 100);
    });
    const { container } = render(<Demo request={request} />);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
    expect(getMessages(container)).toEqual([
      expectMessage('little', 'local'),
      expectMessage('bamboo', 'loading'),
    ]);

    await waitFakeTimer();
    expect(getMessages(container)).toEqual([
      expectMessage('little', 'local'),
      expectMessage('bamboo', 'success'),
    ]);
  });

  it('should throw an error if onRequest is called without an agent', () => {
    const { result } = renderHook(() =>
      useXChat({
        defaultMessages: [{ message: 'Hello' }],
      }),
    );

    expect(() => result.current?.onRequest('Hello')).toThrow(
      'The agent parameter is required when using the onRequest method in an agent generated by useXAgent.',
    );
  });

  it('transformStream', () => {
    const transformStream = new TransformStream();
    const { container } = render(
      <Demo request={requestNeverEnd} transformStream={transformStream} />,
    );
    fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

    expect(requestNeverEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'little',
        messages: ['little'],
      }),
      expect.anything(),
      expect.any(TransformStream),
    );

    expect(getMessages(container)).toEqual([expectMessage('little', 'local')]);
  });
  it('custom require called resolveAbortController', (done) => {
    const transformStream = new TransformStream();
    const resolveAbortController = jest.fn(() => {});
    const request = jest.fn((_, { onStream }) => {
      setTimeout(() => {
        onStream(resolveAbortController);
      }, 100);
    });

    const { container } = render(
      <Demo
        request={request}
        transformStream={transformStream}
        resolveAbortController={resolveAbortController}
      />,
    );
    fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
    expect(resolveAbortController).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    done();
    expect(resolveAbortController).toHaveBeenCalled();
  });

  it('custom message type', () => {
    const transformStream = new TransformStream();
    const resolveAbortController = jest.fn(() => {});
    const { container } = render(
      <DemoForCustomMessage<{ message: string; stream: boolean }>
        transformStream={transformStream}
        resolveAbortController={resolveAbortController}
      />,
    );
    fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });
    expect(getMessages(container)).toEqual([expectMessage('little', 'local')]);
  });

  describe('transformMessage', () => {
    const requestFailed = jest.fn(async (_, { onUpdate, onSuccess }) => {
      onUpdate({ data: { content: 'bamboo' } });
      setTimeout(() => {
        onSuccess([{ data: { content: 'bamboo' } }]);
      }, 200);
    });

    const transformMessage = jest.fn((info) => {
      const { originMessage, chunk } = info || {};
      if (chunk?.data) {
        return (originMessage || '') + chunk?.data?.content;
      }
      return originMessage;
    });

    it('with transformMessageFn', async () => {
      const { container } = render(
        <Demo
          request={requestFailed}
          transformMessage={transformMessage}
          requestFallback="bamboo"
        />,
      );
      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
      await waitFakeTimer();
      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'success'),
      ]);
    });

    const requestFailedWithUnknownType = jest.fn(async (_, { onUpdate, onSuccess }) => {
      onUpdate('bamboo');
      setTimeout(() => {
        onSuccess('bamboo_success');
      }, 200);
    });

    it('with unknown type chunks transformMessageFn', async () => {
      const { container } = render(
        <Demo request={requestFailedWithUnknownType} requestFallback="bamboo" />,
      );
      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
      await waitFakeTimer();
      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo_success', 'success'),
      ]);
    });

    const requestFailedOnlySuccess = jest.fn(async (_, { onSuccess }) => {
      setTimeout(() => {
        onSuccess(['bamboo_success']);
      }, 200);
    });

    it('only width success transformMessageFn', async () => {
      const { container } = render(
        <Demo request={requestFailedOnlySuccess} requestFallback="bamboo" />,
      );
      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(getMessages(container)).toEqual([expectMessage('little', 'local')]);
      await waitFakeTimer();
      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo_success', 'success'),
      ]);
    });
  });
});
