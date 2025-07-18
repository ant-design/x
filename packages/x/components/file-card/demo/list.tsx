import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  const files = [
    {
      key: '1',
      name: 'excel-file.xlsx',
      size: 1024,
    },
    {
      key: '2',
      name: 'word-file.docx',
      size: 1024,
    },
    {
      key: '3',
      name: 'pdf-file.pdf',
      size: 1024,
    },
    {
      key: '4',
      name: 'ppt-file.pptx',
      size: 1024,
    },
    {
      key: '5',
      name: 'zip-file.zip',
      size: 1024,
    },
    {
      key: '6',
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
