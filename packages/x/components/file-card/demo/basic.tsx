import { FileCard } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App = () => {
  return (
    <Flex vertical gap="middle">
      <FileCard name="excel-file.xlsx" size={1024} />
      <FileCard name="word-file.docx" size={1024} />
      <FileCard name="pdf-file.pdf" size={1024} />
      <FileCard name="ppt-file.pptx" size={1024} />
      <FileCard name="zip-file.zip" size={1024} />
      <FileCard name="txt-file.txt" size={1024} />
      <FileCard name="markdown-file.md" size={1024} />
    </Flex>
  );
};

export default App;
