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
      <FileCard.List
        items={new Array(6).fill({
          name: 'image-file.png',
          src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })}
      />
      <FileCard.List
        styles={{ file: { width: 230, height: 230 } }}
        items={new Array(3).fill({
          name: 'image-file.png',
          src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        })}
      />
    </Flex>
  );
};

export default App;
