import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  return (
    <Flex vertical gap="middle">
      <FileCard
        name="image-file.png"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
      <FileCard
        type="file"
        name="image-file.png"
        size={1024}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      />
    </Flex>
  );
};

export default App;
