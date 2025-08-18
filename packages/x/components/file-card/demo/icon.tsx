import { AndroidOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  return (
    <Flex vertical gap="middle">
      <FileCard icon={'pdf'} name="txt-file.txt" byte={1024} />
      <FileCard
        icon={<AndroidOutlined style={{ fontSize: 36, color: '#22b35e' }} />}
        name="android-file.apk"
        byte={1024}
      />
    </Flex>
  );
};

export default App;
