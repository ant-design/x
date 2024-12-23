import { Sender } from '@ant-design/x';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';

import type { SenderRef } from '@ant-design/x';

const App: React.FC = () => {
  const senderRef = useRef<SenderRef>(null);

  const senderProps = {
    defaultValue: 'Hello, welcome to use Ant Design X!',
    ref: senderRef,
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'start',
            });
          }}
        >
          Focus at first
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'end',
            });
          }}
        >
          Focus at last
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              cursor: 'all',
            });
          }}
        >
          Focus to select all
        </Button>
        <Button
          onClick={() => {
            senderRef.current!.focus({
              preventScroll: true,
            });
          }}
        >
          Focus prevent scroll
        </Button>
      </Space>
      <Sender {...senderProps} />
    </Space>
  );
};

export default App;
