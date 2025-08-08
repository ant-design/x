import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  return (
    <Flex vertical gap="middle">
      <FileCard name="pdf-file.pdf" byte={1024} size='small' />
      <FileCard name="pdf-file.pdf" byte={1024} size='default' />
    </Flex>
  );
};

export default App;
