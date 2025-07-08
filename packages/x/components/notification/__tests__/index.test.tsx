import React from 'react';
import { act, render } from '../../../tests/utils';

class MockNotification {
  title: string;
  options?: NotificationOptions;
  close: jest.Mock;
  onclick: ((this: MockNotification, ev: Event) => any) | null;
  _onclose: ((this: MockNotification, ev: Event) => any) | null;
  private _onshow: ((this: Notification, ev: Event) => any) | null;
  _onerror: ((this: Notification, ev: Event) => any) | null;
  badge: string;
  static permission: NotificationPermission = 'default';
  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options;
    this.close = jest.fn(() => {
      const event = new Event('show');
      this.onclose?.(event);
    });
    this.onclick = null;
    this._onclose = null;
    this._onshow = null;
    this._onerror = null;
    this.badge = '';
  }

  get onshow(): (this: Notification, ev: Event) => any {
    return this._onshow ?? (() => {});
  }
  set onshow(callback: (this: Notification, ev: Event) => any) {
    this._onshow = callback;
    if (this._onshow) {
      const event = new Event('show');
      this._onshow.call(this as unknown as Notification, event);
    }
  }

  get onclose(): (this: any, ev: Event) => any {
    return this._onclose ?? (() => {});
  }
  set onclose(callback: (this: MockNotification, ev: Event) => any) {
    this._onclose = callback;
  }
  get onerror(): (this: Notification, ev: Event) => any {
    return this._onerror ?? (() => {});
  }
  set onerror(callback: (this: Notification, ev: Event) => any) {
    this._onerror = callback;
    if (this._onerror) {
      const event = new Event('error');
      this._onerror.call(this as unknown as Notification, event);
    }
  }
  static requestPermission() {
    const permission = Promise.resolve('granted');
    MockNotification.permission = 'granted';
    return permission;
  }
}

let notification: any = null;
let XNotification: any = null;

describe('XNotification', () => {
  beforeEach(() => {
    (globalThis.Notification as any) = MockNotification;
    notification = require('../index').default;
    XNotification = require('../index').XNotification;
    (XNotification as any).permissionMap = new Map();
  });

  describe('open', () => {
    let mockFn: jest.Mock;
    beforeEach(() => {
      mockFn = jest
        .fn()
        .mockImplementation((title, options) => new MockNotification(title, options));
      globalThis.Notification = mockFn as any;
      notification = require('../index').default;
      XNotification = require('../index').XNotification;
    });

    it('should create notification with title', () => {
      notification.open({ title: 'Test' });
      expect(globalThis.Notification).toHaveBeenCalledWith('Test', {});
    });

    it('should not create duplicate notification with same key', () => {
      notification.open({ title: 'Test', tag: 'test-tag' });
      notification.open({ title: 'Test', tag: 'test-tag' });
      expect(globalThis.Notification).toHaveBeenCalledTimes(1);
    });

    it('should call onClick callback', () => {
      const onClick = jest.fn();
      notification.open({ title: 'Test', onClick });

      // 获取 open 创建的 Notification 实例
      const instance = (globalThis.Notification as unknown as jest.Mock).mock.results[0].value;
      instance?.onclick?.({} as any);
      expect(onClick).toHaveBeenCalled();
    });

    it('should auto close after duration', () => {
      jest.useFakeTimers();
      notification.open({ title: 'Test', duration: 5 });
      const instance = (globalThis.Notification as unknown as jest.Mock).mock.results[0].value;
      // 手动触发 onshow，保证 permissionMap 正确
      instance?.onshow?.({} as any);
      jest.advanceTimersByTime(5000);
      expect(instance.close).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close all notifications', () => {
      notification.open({ title: 'Test1', tag: 'key1' });
      notification.open({ title: 'Test2', tag: 'key2' });
      expect(XNotification.permissionMap.size).toBe(2);
      notification.close();
      expect(XNotification.permissionMap.size).toBe(0);
    });
  });

  describe('requestPermission', () => {
    it('should update permission state', async () => {
      const permission = await notification.requestPermission();
      expect(permission).toEqual('granted');
      expect(notification.permission).toEqual('granted');
    });
  });

  describe('useNotification', () => {
    beforeEach(() => {
      (globalThis as any).Notification = MockNotification;
      MockNotification.permission = 'default';

      (XNotification as any).permissionMap = new Map();
    });

    it('should return permission state and methods', () => {
      const TestComponent = () => {
        const [{ permission }, { open }] = notification.useNotification();
        return (
          <>
            <div data-testid="permission">{permission}</div>
            <div data-testid="open">{typeof open === 'function' ? 'open' : ''}</div>
          </>
        );
      };
      const { getByTestId } = render(<TestComponent />);

      expect(getByTestId('permission').textContent).not.toBeNull();
      expect(getByTestId('open').textContent).not.toBeNull();
    });

    describe('in React components', () => {
      it('should update when permission changes', async () => {
        const TestComponent = () => {
          const [{ permission }] = notification.useNotification();
          return <div data-testid="permission">{permission}</div>;
        };
        const { getByTestId } = render(<TestComponent />);
        expect(getByTestId('permission').textContent).toBe('default');

        await act(async () => {
          await notification.requestPermission();
        });

        expect(globalThis.Notification.permission).toBe('granted');
      });

      it('should share state between components', () => {
        const ComponentA = () => {
          const [{ permission }] = notification.useNotification();
          return <div data-testid="compA">{permission}</div>;
        };

        const ComponentB = () => {
          const [{ permission }] = notification.useNotification();
          return <div data-testid="compB">{permission}</div>;
        };

        const { getByTestId } = render(
          <>
            <ComponentA />
            <ComponentB />
          </>,
        );

        expect(getByTestId('compA').textContent).toBe('default');
        expect(getByTestId('compB').textContent).toBe('default');
      });

      it('should handle component unmount', () => {
        const TestComponent = () => {
          const [{ permission }] = notification.useNotification();
          return <div data-testid="permission">{permission}</div>;
        };
        const { unmount } = render(<TestComponent />);

        expect(() => unmount()).not.toThrow();
      });
    });
  });
});

describe('XNotification with not permission able', () => {
  beforeEach(() => {
    (globalThis.Notification as any) = null;
    notification = require('../index').default;
    XNotification = require('../index').XNotification;
    XNotification.permissible = !!globalThis.Notification;
  });
  it('should permission is denied', async () => {
    notification.requestPermission();
    expect(notification.permission).toBe('denied');
  });
});
