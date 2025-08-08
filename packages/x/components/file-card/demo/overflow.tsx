import { FileCard, type FileCardListProps } from '@ant-design/x';
import { Flex, Segmented } from 'antd';
import React from 'react';

const App = () => {

  const images = Array.from({ length: 20 }).map((_, index) => ({
    name: `image-file-${index}.png`,
    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    byte: 1024,
  }));

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
      <FileCard.List items={images} removable overflow={overflow} />
    </Flex>
  );
};

export default App;
