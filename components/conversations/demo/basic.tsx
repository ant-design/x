import React from 'react';
import { Card } from 'antd';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';

const data: GetProp<ConversationsProps, 'data'> = [
  // 基础示例
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <GithubOutlined />,
  },
  // 自定义 label 示例
  {
    key: 'demo2',
    label: (
      <div>
        Getting Started:{' '}
        <a target="_blank" href="https://ant-design.antgroup.com/index-cn" rel="noreferrer">
          Ant Design !
        </a>
      </div>
    ),
    icon: <AlipayCircleOutlined />,
  },
  // 长 label 示例
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    icon: <DockerOutlined />,
  },
  // 禁用示例
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    disabled: true,
  },
];

const App = () => (
  <Card style={{ width: 320 }}>
    <Conversations data={data} defaultActiveKey="demo1" />
  </Card>
);

export default App;
