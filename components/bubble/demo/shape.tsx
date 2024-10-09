import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Prompts, PromptsProps } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const items: PromptsProps['items'] = [
  {
    key: '6',
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
    description: 'How to rest effectively after long hours of work?',
  },
  {
    key: '7',
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
    description: 'What are the secrets to maintaining a positive mindset?',
  },
  {
    key: '8',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    description: 'How to stay calm under immense pressure?',
  },
];

const App = () => (
  <Flex vertical gap="middle">
    <Bubble avatar={{ icon: <UserOutlined /> }} content="shape: default" />
    <Bubble avatar={{ icon: <UserOutlined /> }} content="shape: round" shape="round" />
    <Bubble avatar={{ icon: <UserOutlined /> }} content="shape: corner" shape="corner" />
  </Flex>
);

export default App;
