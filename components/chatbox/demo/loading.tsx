import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Flex, Switch } from 'antd';
import { Chatbox } from '@ant-design/x';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  return (
    <Flex gap="large" vertical>
      <Chatbox
        loading={loading}
        content="hello world !"
        avatar={<Avatar size={32} icon={<UserOutlined />} />}
      />
      <Flex gap="large" wrap>
        Loading state:
        <Switch checked={loading} onChange={setLoading} />
      </Flex>
    </Flex>
  );
};

export default App;
