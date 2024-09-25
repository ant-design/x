import React from 'react';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import { MessageStatus, SimpleType, XAgentConfig } from '../index';
import useXChat from '../index';

describe('useXChat', () => {
  const requestNeverEnd = jest.fn(() => new Promise<any>(() => {}));

  beforeAll(() => {
    requestNeverEnd.mockClear();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function Demo<Message extends SimpleType = string>(config: Partial<XAgentConfig<Message>>) {
    const { messages, onRequest } = useXChat<Message>({
      request: requestNeverEnd,
      ...config,
    });
    return (
      <>
        <pre>{JSON.stringify(messages)}</pre>
        <input
          onChange={(e) => {
            onRequest(e.target.value as Message);
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
      const { container } = render(<Demo request={requestNeverEnd} requestPlaceholder="bamboo" />);

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(requestNeverEnd).toHaveBeenCalledWith('little', { messages: [] });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
    });

    it('callback', () => {
      const requestPlaceholder = jest.fn(() => 'light');
      const { container } = render(
        <Demo request={requestNeverEnd} requestPlaceholder={requestPlaceholder} />,
      );

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      expect(requestNeverEnd).toHaveBeenCalledWith('little', { messages: [] });
      expect(requestPlaceholder).toHaveBeenCalledWith('little', {
        messages: [expectMessage('little')],
      });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('light', 'loading'),
      ]);
    });
  });

  describe('requestFallback', () => {
    const requestFailed = jest.fn(() => Promise.reject(new Error('failed')));

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
      const requestFallback = jest.fn(() =>
        // Force to success
        Promise.resolve({
          message: 'light',
          status: 'success',
        } as const),
      );
      const { container } = render(
        <Demo request={requestFailed} requestFallback={requestFallback} />,
      );

      fireEvent.change(container.querySelector('input')!, { target: { value: 'little' } });

      await waitFakeTimer();

      expect(requestFallback).toHaveBeenCalledWith('little', {
        error: new Error('failed'),
        messages: [expectMessage('little')],
      });

      expect(getMessages(container)).toEqual([
        expectMessage('little', 'local'),
        expectMessage('light', 'success'),
      ]);
    });
  });

  it('multiple return messages', async () => {
    const request = jest.fn(() =>
      Promise.resolve([
        'cute',
        {
          message: ['little', 'bamboo'],
          status: 'loading',
        },
      ]),
    );

    const { container } = render(<Demo request={request} />);

    fireEvent.change(container.querySelector('input')!, { target: { value: 'light' } });
    await waitFakeTimer();

    expect(getMessages(container)).toEqual([
      expectMessage('light', 'local'),
      expectMessage('cute', 'success'),
      expectMessage('little', 'loading'),
      expectMessage('bamboo', 'loading'),
    ]);
  });
});
