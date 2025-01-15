import { Sender } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const Demo: React.FC = () => {
  const { message } = App.useApp();

  return (
    <Sender
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
      allowSpeech
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
