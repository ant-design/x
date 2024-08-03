import React from 'react';
import type { ConversationProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';

const data: ConversationProps[] = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    timestamp: 794620800,
    icon: <GithubOutlined />,
    group: 'Pinned',
  },
  {
    key: 'demo2',
    label: <div>Getting Started: <a target="_blank" href='https://ant-design.antgroup.com/index-cn' rel="noreferrer">Ant Design !</a></div>,
    timestamp: 794620900,
    icon: <AlipayCircleOutlined />,
    group: 'Pinned',
  },
  // 默认分组
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    timestamp: 794621100,
    icon: <DockerOutlined />,
  },
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    timestamp: 794621200,
    disabled: true,
    group: 'Expired',
  },
];

const App = () => (
  <div
    style={{
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
      padding: 12,
      width: 268
    }}
  >
    <Conversations
      groupable={{
        sort(a, b) {
          if (a === b) return 0;

          return a === 'Pinned' ? -1 : 1;
        }
      }}
      defaultActiveKey="demo1"
      data={data}
    />
  </div>
);

export default App;
