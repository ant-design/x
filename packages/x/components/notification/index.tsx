import { useState } from 'react';
import type { XNotificationArgs, useNotificationType } from './interface';
let uuid = 0;

class XNotification {
  private static permissionMap: Map<XNotificationArgs['openConfig']['tag'], any> = new Map();
  static permissionAble: boolean;
  constructor() {
    XNotification.permissionAble = !!globalThis?.Notification;
    if (!XNotification.permissionAble) {
      console.warn('Notification API is not supported in this environment.');
    }
  }

  public get permission(): NotificationPermission {
    if (!XNotification.permissionAble) {
      return 'denied';
    }
    return globalThis.Notification?.permission;
  }

  public open(arg: XNotificationArgs['openConfig']): void {
    if (!XNotification.permissionAble) return;
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

  public async requestPermission(
    setPermissionState?: React.Dispatch<React.SetStateAction<NotificationPermission>>,
  ): Promise<NotificationPermission> {
    if (!XNotification.permissionAble) {
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
        requestPermission: () => this.requestPermission.call(this, setPermission),
      },
    ];
  }
  public close(tags?: XNotificationArgs['closeConfig']): void {
    if (!XNotification.permissionAble) return;
    Array.from(XNotification.permissionMap.keys()).forEach((key) => {
      if (tags?.includes(key)) {
        XNotification.permissionMap.get(key)?.close?.();
      }
      if (tags === undefined) {
        XNotification.permissionMap.get(key)?.close?.();
      }
    });
  }
}

export type { XNotificationArgs };
export default new XNotification();
export { XNotification };
