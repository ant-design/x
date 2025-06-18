import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => (
  <Flex vertical gap="small">
    <Bubble content="Hello ice !" extra={<LoadingOutlined spin />} />
    <Bubble
      placement="end"
      content="Hello Ant Design X !"
      extra={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
    />
  </Flex>
);

export default App;
