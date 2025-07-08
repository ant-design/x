import { notification, XNotificationOpenArgs } from '@ant-design/x';
import { Button, Flex } from 'antd';
import React from 'react';

const DescribeInfo: Record<NotificationPermission, string> = {
  denied:
    'Notification permission has been denied, You need to manually reset the notification permissions in the website settings to trigger the permission request pop-up.',
  granted:
    'Notification permission has been granted, you can click the "Open a notification" button to push a  notification.',
  default: 'Please Request Permission,After the request is approved, you can push notifications.',
};

const openData: XNotificationOpenArgs = {
  title: 'Task completed',
  body: 'The task was completed at 13:12',
  icon: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  onClick: (event, close) => {
    console.log('onClick', event, close);
    close?.();
  },
  onClose: (event) => {
    console.log('onClose', event);
  },
  onError: (event) => {
    console.log('onError', event);
  },
  onShow: (event) => {
    console.log('onShow', event);
  },
};

const App = () => {
  const [{ permission }, { open, requestPermission, close }] = notification.useNotification();

  return (
    <Flex vertical gap="middle">
      {DescribeInfo[permission]}
      <Flex gap="middle">
        <Button
          disabled={permission !== 'default'}
          type="primary"
          onClick={() => requestPermission()}
        >
          {permission === 'default'
            ? 'Please Request Permission'
            : `Notification permission has been ${permission}`}
        </Button>
        <Button
          disabled={permission !== 'granted'}
          type="primary"
          onClick={() => {
            open(openData);
          }}
        >
          Open a notification
        </Button>
        <Button danger disabled={permission !== 'granted'} onClick={() => close()}>
          Destroy All
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
