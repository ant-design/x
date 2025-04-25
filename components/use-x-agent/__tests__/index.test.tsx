import React from 'react';
import { render } from '../../../tests/utils';
import type { XAgent } from '../index';
import useXAgent from '../index';

describe('useXAgent', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('custom', () => {
    const request = jest.fn();

    const Demo = React.forwardRef((_, ref: React.Ref<XAgent>) => {
      const [agent] = useXAgent({
        request,
      });

      React.useImperativeHandle(ref, () => agent, [agent]);

      return null;
    });

    it('continue update', () => {
      const agentRef = React.createRef<XAgent>();
      render(<Demo ref={agentRef} />);

      // Mock request
      request.mockImplementation((_, { onUpdate, onSuccess }) => {
        onStream(new AbortController());
        onUpdate('bamboo');
        onUpdate('little');
        onSuccess('light');
        onUpdate('tiny');
        onSuccess('apple');
      });

      // Trigger
      const onUpdate = jest.fn();
      const onSuccess = jest.fn();
      const onError = jest.fn();
      const onStream = jest.fn();

      agentRef.current?.request({} as any, {
        onUpdate,
        onSuccess,
        onError,
        onStream,
      });

      // Test
      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(0);
      expect(onStream).toHaveBeenCalledTimes(1);
    });

    it('error', () => {
      const agentRef = React.createRef<XAgent>();
      render(<Demo ref={agentRef} />);

      // Mock request
      request.mockImplementation((_, { onError, onSuccess, onStream }) => {
        onStream(new AbortController());
        onError(new Error('noop'));
        onSuccess('light');
        onStream(new AbortController());
      });

      // Trigger
      const onUpdate = jest.fn();
      const onSuccess = jest.fn();
      const onError = jest.fn();
      const onStream = jest.fn();

      agentRef.current?.request({} as any, {
        onUpdate,
        onStream,
        onSuccess,
        onError,
      });

      // Test
      expect(onUpdate).toHaveBeenCalledTimes(0);
      expect(onSuccess).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onStream).toHaveBeenCalledTimes(1);
    });

    it('requesting', () => {
      const agentRef = React.createRef<XAgent>();
      render(<Demo ref={agentRef} />);

      // Mock request
      request.mockImplementation((_, { onUpdate, onSuccess }) => {
        onUpdate('bamboo');
        expect(agentRef.current?.isRequesting()).toBeTruthy();

        onSuccess('light');
        expect(agentRef.current?.isRequesting()).toBeFalsy();
      });

      agentRef.current?.request({} as any, {
        onUpdate: () => {},
        onSuccess: () => {},
        onError: () => {},
      });
    });
  });
});
