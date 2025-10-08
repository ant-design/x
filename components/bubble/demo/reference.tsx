import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

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
      references={[
        {
          title: 'Ant Design',
          url: 'https://ant.design',
          description: 'Ant Design official website',
        },
        {
          title: 'React',
          url: 'https://react.dev',
          description: 'React official documentation',
        },
        {
          title: 'GitHub',
          url: 'https://github.com',
          description: 'GitHub homepage',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com',
        },
      ]}
    />
    <Bubble
      placement="start"
      content="What a beautiful day!"
      styles={{ avatar: hideAvatar }}
      avatar={{}}
      references={[
        {
          title: 'React',
          url: 'https://react.dev',
          description: 'React official documentation',
        },
        {
          title: 'GitHub',
          url: 'https://github.com',
          description: 'GitHub homepage',
        },
        {
          title: 'GitHub - Maifee Ul Asad',
          url: 'https://github.com/maifeeulasad',
        },
      ]}
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
