import React from 'react';
import { Card } from 'antd';
import type { ConversationProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';

const data: ConversationProps[] = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <GithubOutlined />,
    group: 'Group1',
  },
  {
    key: 'demo2',
    label: <div>Getting Started: <a target="_blank" href='https://ant-design.antgroup.com/index-cn' rel="noreferrer">Ant Design !</a></div>,
    icon: <AlipayCircleOutlined />,
    group: 'Group1',
  },
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    icon: <DockerOutlined />,
    group: 'Group2',
  },
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    group: 'Group2',
  },
];

const App = () => (
  <Card style={{ width: 320 }}>
    <Conversations
      groupable
      defaultActiveKey="demo1"
      data={data}
    />
  </Card>
);

export default App;
