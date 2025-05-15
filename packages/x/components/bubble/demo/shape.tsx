import { Bubble, type BubbleProps } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const sharedLongTextProps: BubbleProps = {
  placement: 'end',
  content:
    'This is a long text message to show the multiline view of the bubble component. '.repeat(3),
  styles: { content: { maxWidth: 500 } },
};

const App = () => (
  <Flex gap="middle" vertical>
    <Bubble content="shape: default" />
    <Bubble {...sharedLongTextProps} />
    <Bubble content="shape: round" shape="round" />
    <Bubble {...sharedLongTextProps} shape="round" />
    <Bubble content="shape: corner" shape="corner" />
    <Bubble {...sharedLongTextProps} shape="corner" />
  </Flex>
);

export default App;
