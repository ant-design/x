import { FileCard, type FileCardListProps } from '@ant-design/x';
import { Flex, Segmented } from 'antd';
import React from 'react';

const App = () => {
  const images = Array.from({ length: 11 }).map((_, index) => ({
    name: `image-file-${index}.png`,
    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    byte: 1024,
  }));
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

  const [overflow, setOverflow] = React.useState<FileCardListProps['overflow']>('wrap');

  return (
    <Flex vertical gap="middle">
      <Segmented
        options={[
          { value: 'wrap', label: 'Wrap' },
          { value: 'scrollX', label: 'Scroll X' },
          { value: 'scrollY', label: 'Scroll Y' },
        ]}
        value={overflow}
        onChange={setOverflow}
        style={{ marginInlineEnd: 'auto' }}
      />
      <FileCard.List items={[...images, ...files]} removable overflow={overflow} />
    </Flex>
  );
};

export default App;
