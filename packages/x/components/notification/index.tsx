import { useState } from 'react';
import type { useNotificationType, XNotificationOpenArgs } from './interface';

let uuid = 0;

class XNotification {
  private static permissionMap: Map<string, any> = new Map();
  static permissible: boolean;
  constructor() {
    XNotification.permissible = !!globalThis?.Notification;
    if (!XNotification.permissible) {
      console.warn('Notification API is not supported in this environment.');
    }
  }

  public get permission(): NotificationPermission {
    if (!XNotification.permissible) {
      return 'denied';
    }
    return globalThis.Notification?.permission;
  }

  public open(arg: XNotificationOpenArgs): void {
    if (!XNotification.permissible) return;
    const { title, tag, onClick, duration, onClose, onError, onShow, ...config } = arg || {};
    if (tag && XNotification.permissionMap.has(tag)) return;
    uuid += 1;
    const mergeKey = tag || `x_notification_${uuid}`;
    const notification: Notification = new globalThis.Notification(title, config || {});
    const close = notification.close.bind(notification);

    if (typeof duration === 'number') {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        close();
      }, duration * 1000);
    }
    notification.onclick = (event) => {
      onClick?.(event, close);
    };

    notification.onshow = (event) => {
      onShow?.(event);
      XNotification.permissionMap.set(mergeKey, {
        close,
      });
    };

    notification.onclose = (event) => {
      onClose?.(event);
      XNotification.permissionMap.delete(mergeKey);
    };

    notification.onerror = (event) => {
      onError?.(event);
    };
  }

  public async requestPermission(): Promise<NotificationPermission> {
    return this._requestPermission();
  }
  private async _requestPermission(
    setPermissionState?: React.Dispatch<React.SetStateAction<NotificationPermission>>,
  ): Promise<NotificationPermission> {
    if (!XNotification.permissible) {
      return 'denied';
    }
    const permissionRes = await globalThis.Notification.requestPermission();

    if (typeof setPermissionState === 'function') {
      setPermissionState?.(permissionRes);
    }
    return permissionRes;
  }

  public useNotification(): useNotificationType {
    const [permission, setPermission] = useState<NotificationPermission>(this?.permission);
    return [
      {
        permission,
      },
      {
        open: this.open,
        close: this.close,
        requestPermission: () => this._requestPermission.call(this, setPermission),
      },
    ];
  }
  public close(tags?: string[]): void {
    if (!XNotification.permissible) return;
    Array.from(XNotification.permissionMap.keys()).forEach((key) => {
      if (tags === undefined) {
        XNotification.permissionMap.get(key)?.close?.();
      }
      if (tags?.includes(key)) {
        XNotification.permissionMap.get(key)?.close?.();
      }
    });
  }
}

export type { XNotificationOpenArgs };
export default new XNotification();
export { XNotification };
