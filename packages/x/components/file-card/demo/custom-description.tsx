import { DownloadOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import { Button, Flex, message, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const fileData = [
    {
      name: 'Project Document.docx',
      byte: 2457600,
      src: '/downloads/project-document.docx',
    },
    {
      name: 'Design Files.sketch',
      byte: 10485760,
      src: '/downloads/design-files.sketch',
    },
    {
      name: 'Product Prototype.fig',
      byte: 5242880,
      src: '/downloads/product-prototype.fig',
    },
  ];

  const handleDownload = (url: string, fileName: string) => {
    messageApi.info(`Clicked download: ${fileName},${url}`);
  };

  return (
    <>
      {contextHolder}
      <Flex vertical gap="middle">
        {fileData.map((file, index) => (
          <FileCard
            key={index}
            name={file.name}
            src={file.src}
            byte={file.byte}
            description={({ size, src, name }) => (
              <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Size: {size}
                </Text>
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={
                    src && name
                      ? (e) => {
                          e.stopPropagation();
                          handleDownload(src, name);
                        }
                      : undefined
                  }
                  style={{
                    fontSize: 12,
                    padding: '2px 8px',
                    height: 'auto',
                    lineHeight: 1.5,
                  }}
                >
                  Download
                </Button>
              </Flex>
            )}
            styles={{
              file: {
                width: 300,
                padding: '12px 16px',
              },
              description: {
                marginTop: 4,
                lineHeight: 1.5,
              },
            }}
          />
        ))}
      </Flex>
    </>
  );
};

export default App;
