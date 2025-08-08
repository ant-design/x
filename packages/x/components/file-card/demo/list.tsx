import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  const files = [
    {
      name: 'excel-file.xlsx',
      byte: 1024,
    },
    {
      name: 'word-file.docx',
      byte: 1024,
    },
    {
      name: 'pdf-file.pdf',
      byte: 1024,
    },
    {
      name: 'ppt-file.pptx',
      byte: 1024,
    },
    {
      name: 'zip-file.zip',
      byte: 1024,
    },
    {
      name: 'txt-file.txt',
      byte: 1024,
    },
  ];

  return (
    <Flex vertical gap="middle" style={{ width: '900px' }}>
      <FileCard.List items={files} removable />
      <FileCard.List items={files} removable size="small" />
    </Flex>
  );
};

export default App;
