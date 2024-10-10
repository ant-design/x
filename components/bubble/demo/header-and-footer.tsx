import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Button, Space, theme } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Bubble
      content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
      avatar={{ icon: <UserOutlined /> }}
      header="Ant Design X"
      footer={
        <Space size={token.paddingXXS}>
          <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
          <Button color="default" variant="text" size="small" icon={<CopyOutlined />} />
        </Space>
      }
    />
  );
};

export default App;
