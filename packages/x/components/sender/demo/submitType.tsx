import { Sender } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const Demo: React.FC = () => {
  const { message } = App.useApp();

  return (
    <Sender
      submitType="shiftEnter"
      placeholder="Press Shift + Enter to send message"
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
