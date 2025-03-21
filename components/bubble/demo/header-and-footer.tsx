import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Space, message, theme } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();

  // 豆包中生成的图片也是不支持复制的 如果期望的是复制待md格式的内容?
  const onCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    message.success('文本复制成功');
  };

  return (
    <Bubble
      content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
      avatar={{ icon: <UserOutlined /> }}
      header="Ant Design X"
      footer={(messageContext) => (
        <Space size={token.paddingXXS}>
          <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
          <Button
            // onClick={() => console.log('Copy message:', messageContext.content)}
            onClick={() => onCopy(messageContext)}
            color="default"
            variant="text"
            size="small"
            icon={<CopyOutlined />}
          />
        </Space>
      )}
    />
  );
};

export default App;
