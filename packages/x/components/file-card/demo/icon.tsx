import { JavaOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  return (
    <Flex vertical gap="middle">
      <FileCard icon={'pdf'} name="txt-file.txt" size={1024} />
      <FileCard
        icon={<JavaOutlined style={{ fontSize: 36, color: '#1677ff' }} />}
        name="java-file.java"
        size={1024}
      />
    </Flex>
  );
};

export default App;
