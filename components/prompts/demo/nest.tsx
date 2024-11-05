import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { App, Card, ConfigProvider, Space, theme } from 'antd';
import React from 'react';

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
    description: 'What are you interested in?',
    children: [
      {
        key: '1-1',
        description: `What's new in X?`,
      },
      {
        key: '1-2',
        description: `What's AGI?`,
      },
      {
        key: '1-3',
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
  {
    key: '3',
    label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Start Creating'),
    description: 'How to start a new project?',
    children: [
      {
        key: '3-1',
        label: 'Fast Start',
        description: `Install Ant Design X`,
      },
      {
        key: '3-2',
        label: 'Online Playground',
        description: `Play on the web without installing`,
      },
    ],
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Card style={{ borderRadius: 0, border: 0 }}>
        <Prompts
          title="Do you want?"
          items={items}
          wrap
          styles={{
            item: {
              flex: 'none',
              width: 'calc(30% - 6px)',
              backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
              border: 0,
            },
            subItem: {
              background: 'rgba(255,255,255,0.45)',
              border: '1px solid #FFF',
            },
          }}
          onItemClick={(info) => {
            message.success(`You clicked a prompt: ${info.data.key}`);
          }}
        />
      </Card>
    </ConfigProvider>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
