import { Sender } from '@ant-design/x';
import { App } from 'antd';
import React, { useState } from 'react';

const Demo: React.FC = () => {
  const [value, setValue] = useState<string>('Try for longer text');

  const { message } = App.useApp();

  return (
    <Sender
      value={value}
      onChange={(v) => {
        setValue(v);
      }}
      onSubmit={() => {
        setValue('');
        message.success('Send message successfully!');
      }}
      autoSize={{ minRows: 4, maxRows: 6 }}
      lengthLimit={{
        maxLength: 100,
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
