import { FileCard } from '@ant-design/x';
import { Button, Flex, Space } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState('');

  return (
    <Flex gap="middle" vertical>
      <Space>
        <Button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setSrc('');
          }}
        >
          Start Loading
        </Button>
        <Button
          onClick={() => {
            setSrc(`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png`);
            const timer = setTimeout(() => {
              timer && clearTimeout(timer);
              setLoading(false);
            }, 400);
          }}
        >
          Load Complete
        </Button>
      </Space>

      <FileCard
        loading={loading}
        styles={{
          file: {
            width: 200,
          },
        }}
        spinProps={{
          size: 'small',
        }}
        imageProps={{
          placeholder: (
            <FileCard
              imageProps={{
                alt: 'placeholder image',
                preview: false,
              }}
              name="image-file-placeholder.png"
              src={
                src
                  ? `${src}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`
                  : ''
              }
            />
          ),
        }}
        name="image-file.png"
        src={src ? `${src}?${Date.now()}` : ''}
      />
      <FileCard
        loading={loading}
        imageProps={{
          placeholder: (
            <FileCard
              imageProps={{
                alt: 'placeholder image',
                preview: false,
              }}
              name="image-file-placeholder.png"
              src={
                src
                  ? `${src}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`
                  : ''
              }
            />
          ),
        }}
        name="image-file.png"
        src={src ? `${src}?${Date.now()}` : ''}
      />
    </Flex>
  );
};

export default App;
