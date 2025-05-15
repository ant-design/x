import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { Bubble } from '@ant-design/x';

const fooAvatar: React.CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

const barAvatar: React.CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
};

const hideAvatar: React.CSSProperties = {
  visibility: 'hidden',
};

const App: React.FC = () => (
  <Flex gap="middle" vertical>
    <Bubble
      placement="start"
      content="Good morning, how are you?"
      avatar={{ icon: <UserOutlined />, style: fooAvatar }}
    />
    <Bubble
      placement="start"
      content="What a beautiful day!"
      styles={{ avatar: hideAvatar }}
      avatar={{}}
    />
    <Bubble
      placement="end"
      content="Hi, good morning, I'm fine!"
      avatar={{ icon: <UserOutlined />, style: barAvatar }}
    />
    <Bubble placement="end" content="Thank you!" styles={{ avatar: hideAvatar }} avatar={{}} />
  </Flex>
);

export default App;
