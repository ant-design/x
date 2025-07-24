import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  const files = [
    {
      name: 'excel-file.xlsx',
      size: 1024,
    },
    {
      name: 'word-file.docx',
      size: 1024,
    },
    {
      name: 'pdf-file.pdf',
      size: 1024,
    },
    {
      name: 'ppt-file.pptx',
      size: 1024,
    },
    {
      name: 'zip-file.zip',
      size: 1024,
    },
    {
      name: 'txt-file.txt',
      size: 1024,
    },
  ];

  return (
    <Flex vertical gap="middle" style={{ width: '600px' }}>
      <FileCard.List items={files} removable />
      <FileCard.List items={files} removable size="small" />
    </Flex>
  );
};

export default App;
