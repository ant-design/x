import React from 'react';
import { Conversations } from '@ant-design/x';
import type { ConversationProps } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';

const data: ConversationProps[] = [
  // 基础示例
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    timestamp: 794620800,
    icon: <GithubOutlined />,
  },
  // 自定义 label 示例
  {
    key: 'demo2',
    label: <div>Getting Started: <a target="_blank" href='https://ant-design.antgroup.com/index-cn' rel="noreferrer">Ant Design !</a></div>,
    timestamp: 794620900,
    icon: <AlipayCircleOutlined />,
  },
  // 长 label 示例
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    timestamp: 794621100,
    icon: <DockerOutlined />,
  },
  // 禁用示例
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    timestamp: 794621200,
    disabled: true,
  },
];

const App = () => <Conversations data={data} defaultActiveKey="demo1" />;

export default App;
