---
category: Components
group:
  title: Common
  order: 0
title: Notification
description: System-level notifications displayed outside the page.
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Oj-bTbVXtpQAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*qwdtSKWXeikAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## When to Use

- Push system-level notifications to keep users informed of task progress, especially when agents are performing complex tasks.

## Examples

<!-- prettier-ignore -->
<code src="./demo/hooks.tsx">Hooks Usage</code> 
<code src="./demo/duration.tsx">Auto Close Delay</code> 
<code src="./demo/close_tag.tsx">Close Specific Notification</code> 
<code src="./demo/static-method.tsx">Static Method</code>

## API

To send notifications successfully, make sure the current domain has notification permission.

### XNotification

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| permission | Indicates whether the user has granted permission to display web notifications for the current origin. | NotificationPermission | - | - |
| requestPermission| Requests permission from the user to display notifications for the current origin. | ()=> Promise</NotificationPermission/> | - | - |
| open |Push a notification to the user| (arg: XNotificationArgs['openConfig'])=> void | - | - |
| close|Close pushed notifications. You can pass a tag list to close specific notifications, or call without arguments to close all.| (arg?: XNotificationArgs['closeConfig'])=> void | - | - |

#### NotificationPermission

```tsx | pure
type NotificationPermission =
  | 'granted' // The user has explicitly granted permission to display system notifications for the current origin.
  | 'denied' // The user has explicitly denied permission.
  | 'default'; // The user's decision is unknown; in this case, the app behaves as if permission is denied.
```

#### XNotificationArgs

```tsx | pure
type XNotificationArgs = {
  openConfig: NotificationOptions & {
    title: string;
    onClick?: (event: Event, close?: Notification['close']) => void;
    onClose?: (event: Event) => void;
    onError?: (event: Event) => void;
    onShow?: (event: Event) => void;
    duration?: number;
  };
  closeConfig: NotificationOptions['tag'][];
};
```

#### NotificationOptions

```tsx | pure
interface NotificationOptions {
  badge?: string;
  body?: string;
  data?: any;
  dir?: NotificationDirection;
  icon?: string;
  lang?: string;
  requireInteraction?: boolean;
  silent?: boolean | null;
  tag?: string;
}
```

### useNotification

```tsx | pure
type useNotification = [
  { permission: XNotification['permission'] },
  {
    open: XNotification['open'];
    close: XNotification['close'];
    requestPermission: XNotification['requestPermission'];
  },
];
```

# Notes

- XNotification is an extension of `window.Notification`. If the browser does not support Notification, all XNotification methods will have no effect.
- The style and effect of XNotification notifications depend on the browser's support for Notification. For example, the `dir` property is ignored by most browsers.
- XNotification can only manage notifications sent in the current instance. After the instance changes (e.g., page refresh), it cannot manage or close previously sent notifications.

# FAQ

## I have granted notification permission for the current origin and the `onShow` callback is triggered, but why can't I see the notification?

`Notification` is a system-level feature. Please ensure that notifications are enabled for the browser application on your device.
