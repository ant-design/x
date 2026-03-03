---
category: Components
group:
  title: Common
  order: 0
title: Notification
description: Send system-level notifications that are displayed outside the page.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*cRmqTY4nKPEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*W3RmSov-xVMAAAAAAAAAAAAADrJ8AQ/original
tag: 2.0.0
---

## When to Use

- When the agent is performing complex tasks, system-level application notifications can be pushed to keep users informed of the task progress.
- Controlled by the operating system's notification permissions, it is only used for weak notifications.

## Note

- **`Notification` is a system application notification and is controlled by the operating system's notification permissions. If the system notification permission is turned off, the `open` method call of XNotification will have no effect. [System Permission Settings](#system-permission-settings).**
- XNotification is implemented by extending `window.Notification`. If the browser environment does not support Notification, the method calls of XNotification will have no effect.
- The style and effect of XNotification notifications are subject to the current browser environment's support for Notification. For example, the `dir` attribute will be ignored by most browsers.
- XNotification only manages the closing of notifications under the current instance. After the instance changes (for example, the browser page is refreshed), it has no ability to manage and close the sent notifications.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/hooks.tsx">Hooks Call</code>
<code src="./demo/duration.tsx">Auto Close Delay</code>
<code src="./demo/close_tag.tsx">Close Specified Notification</code>
<code src="./demo/static-method.tsx">Static Method</code>

## API

To successfully send a notification, you need to ensure that the current domain has been granted notification permission.

### XNotification

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| permission | Indicates whether the user has granted permission to display web notifications for the current origin. | NotificationPermission | - | - |
| requestPermission| Requests permission from the user to display notifications for the current origin. | ()=> Promise</NotificationPermission/> | - | - |
| open |Push a notification to the user| (config: XNotificationOpenArgs)=> void | - | - |
| close|Close pushed notifications. You can pass a tag list to close specific notifications, or call without arguments to close all.| (config?: string[])=> void | - | - |

#### NotificationPermission

```tsx | pure
type NotificationPermission =
  | 'granted' // The user has explicitly granted the current origin permission to display system notifications.
  | 'denied' // The user has explicitly denied the current origin permission to display system notifications.
  | 'default'; // The user's decision is unknown; in this case, the application behaves as if the permission was "denied".
```

#### XNotificationOpenArgs

```tsx | pure
type XNotificationOpenArgs = {
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

## System Permission Settings

### Change `Notification` settings on Windows

The setting path for different versions of the Windows system will be different. You can refer to the approximate path: "Start" menu > "Settings" > "System" > and then select "Notifications & actions" on the left, after which you can operate on global notifications and application notifications.

### Change `Notification` settings on Mac

On a Mac, use the "Notifications" settings to specify the period during which you do not want to be disturbed by notifications, and control how notifications are displayed in the "Notification Center". To change these settings, choose "Apple" menu > "System Settings", then click "Notifications" in the sidebar (you may need to scroll down).

## FAQ

### I have obtained the permission for the current `origin` to display system notifications, and the `onShow` callback has also been triggered. Why can't the pushed notification be displayed?

`Notification` is a system-level feature. Please ensure that notifications are enabled for the browser application on your device.
