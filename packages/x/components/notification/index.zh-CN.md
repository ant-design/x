---
category: Components
group:
  title: 通用
  order: 0
title: Notification
subtitle: 系统通知
description: 系统级别发送在页面外部显示的通知。
cover: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Oj-bTbVXtpQAAAAAAAAAAAAADgCCAQ/original
coverDark: https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*qwdtSKWXeikAAAAAAAAAAAAADgCCAQ/original
demo:
  cols: 1
---

## 何时使用

- 在智能体执行复杂任务时，可推送系统级别通知，使用户随时掌握任务进展。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/hooks.tsx">Hooks调用</code> 
<code src="./demo/duration.tsx">自动关闭延迟</code> 
<code src="./demo/close_tag.tsx">关闭指定通知</code> 
<code src="./demo/static-method.tsx">静态方法</code>

## API

成功发送通知需要确保已授权当前域名通知权限，

### XNotification

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| permission | 表明当前用户是否授予当前来源（origin）显示 web 通知的权限。 | NotificationPermission | - | - |
| requestPermission| 向用户为当前来源请求显示通知的权限。 | ()=> Promise\<NotificationPermission\> | - | - |
|open |向用户推送一个通知|(arg: XNotificationArgs['openConfig'])=> void | - | - |
|close|关闭已推送的通知，可以传入tag列表关闭指定通知，没有参数则会关闭所有通知|(arg?: XNotificationArgs['closeConfig'])=> void | - | - |

#### NotificationPermission

```tsx | pure
type NotificationPermission =
  | 'granted' // 用户已明确授予当前源显示系统通知的权限。
  | 'denied' // 用户已明确拒绝当前源显示系统通知的权限。
  | 'default'; // 用户决定未知；在这种情况下，应用程序的行为就像权限被“拒绝”一样。
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

# 注意

- XNotification 是由扩展 `window.Notification`实现的，如果浏览器环境不支持Notification，XNotification的方法调用将无任何效果。
- XNotification 通知样式与效果均已当前浏览器环境对Notification的支持为准，例如`dir`属性会被大部分浏览器忽略。
- XNotification 仅对当前实例下的通知进行关闭管理，实例变更后（例：浏览器页面刷新）对已发送的通知无管理关闭能力。

# FAQ

## 已经获取了当前来源`origin`显示系统通知的权限，`onShow` 回调也触发了，为何还是无法展示推送的通知？

`Notification`为系统通知，需要确保设备开启了对应浏览器应用的通知权限。
