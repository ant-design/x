import { Sender } from '@ant-design/x';
import { Button, Flex, type GetRef } from 'antd';
import React, { useRef } from 'react';

const App: React.FC = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);

  const senderProps = {
    defaultValue: 'Hello, welcome to use Ant Design X!',
    ref: senderRef,
  };

  return (
    <Flex wrap gap={12}>
      <Button
        onClick={() => {
          senderRef.current!.insert('some text');
        }}
      >
        Insert Text
      </Button>
      <Button
        onClick={() => {
          senderRef.current!.insert('some text', 'end');
        }}
      >
        Insert Text End
      </Button>
      <Button
        onClick={() => {
          senderRef.current!.insert('some text', 'start');
        }}
      >
        Insert Text Start
      </Button>
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
      <Button
        onClick={() => {
          senderRef.current!.blur();
        }}
      >
        Blur
      </Button>
      <Sender {...senderProps} />
    </Flex>
  );
};

export default App;
