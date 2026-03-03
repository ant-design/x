import type { XNotification } from '.';

type TypeOpen = NotificationOptions & {
  title: string;
  onClick?: (event: Event, close?: Notification['close']) => void;
  onClose?: (event: Event) => void;
  onError?: (event: Event) => void;
  onShow?: (event: Event) => void;
  duration?: number;
};

export type useNotificationType = [
  {
    permission: NotificationPermission;
  },
  {
    open: XNotification['open'];
    close: XNotification['close'];
    requestPermission: () => Promise<NotificationPermission>;
  },
];

export type XNotificationOpenArgs = TypeOpen;
