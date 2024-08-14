import React from 'react';
import { Card } from 'antd';
import { Conversations } from '@ant-design/x';
import type { ConversationsProps } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';
import type { GetProp } from 'antd';

const items: GetProp<ConversationsProps, 'items'> = [
  // Basic
  {
    key: 'item1',
    label: 'What is Ant Design X?',
    icon: <GithubOutlined />,
  },
  // label as ReactNode
  {
    key: 'item2',
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
  // Auto ellipsis
  {
    key: 'item3',
    label: 'In Docker, use 🐑 Ollama and initialize',
    icon: <DockerOutlined />,
  },
  // Disabled
  {
    key: 'item4',
    label: 'Expired, please go to the recycle bin to check',
    disabled: true,
  },
];

const App = () => (
  <Card style={{ width: 320 }} size="small">
    <Conversations items={items} defaultActiveKey="item1" />
  </Card>
);

export default App;
