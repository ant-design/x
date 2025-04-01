import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Space, message, theme } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();
  const onCopy = (textToCopy: any) => {
    if (!textToCopy) return message.success('文本为空');
    navigator.clipboard.writeText(textToCopy);
    message.success('文本复制成功');
  };
  return (
    <Bubble
      content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
      avatar={{ icon: <UserOutlined /> }}
      header={(messageContext) => {
        return (
          <Space size={token.paddingXXS}>
            <div>{messageContext.content as string} </div>
          </Space>
        );
      }}
      footer={(messageContext) => {
        return (
          <Space size={token.paddingXXS}>
            <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
            <Button
              color="default"
              variant="text"
              size="small"
              onClick={() => onCopy(messageContext.content)}
              icon={<CopyOutlined />}
            />
          </Space>
        );
      }}
    />
  );
};

export default App;
