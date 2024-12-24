import { Sender } from '@ant-design/x';
import { Button, Flex } from 'antd';
import React, { useRef } from 'react';

import type { SenderRef } from '@ant-design/x';

const App: React.FC = () => {
  const senderRef = useRef<SenderRef>(null);

  const senderProps = {
    defaultValue: 'Hello, welcome to use Ant Design X!',
    ref: senderRef,
  };

  return (
    <Flex wrap gap={12}>
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
      <Sender {...senderProps} />
    </Flex>
  );
};

export default App;
