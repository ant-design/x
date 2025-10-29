import { Bubble } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <Bubble content="filled - default" />
      <Bubble content="filled - round" shape="round" />
      <Bubble content="filled - corner left" shape="corner" />
      <Bubble content="filled - corner right" shape="corner" placement="end" />
    </Flex>
    <Flex gap="small" wrap>
      <Bubble content="outlined - default" variant="outlined" />
      <Bubble content="outlined - round" variant="outlined" shape="round" />
      <Bubble content="outlined - corner left" variant="outlined" shape="corner" />
      <Bubble content="outlined - corner right" variant="outlined" shape="corner" placement="end" />
    </Flex>
    <Flex gap="small" wrap>
      <Bubble content="shadow - default" variant="shadow" />
      <Bubble content="shadow - round" variant="shadow" shape="round" />
      <Bubble content="shadow - corner left" variant="shadow" shape="corner" />
      <Bubble content="shadow - corner right" variant="shadow" shape="corner" placement="end" />
    </Flex>
    <Flex gap="small" wrap style={{ marginTop: 8 }}>
      <Bubble content={<span>borderless bubble</span>} variant="borderless" />
    </Flex>
  </Flex>
);

export default App;
