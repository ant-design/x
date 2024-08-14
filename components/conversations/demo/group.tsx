import React from 'react';
import { Card, type GetProp } from 'antd';
import { Conversations, type ConversationsProps } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';

const data: GetProp<ConversationsProps, 'data'> = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <GithubOutlined />,
    group: 'Group1',
  },
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
  <Card style={{ width: 320 }} size="small">
    <Conversations groupable defaultActiveKey="demo1" data={data} />
  </Card>
);

export default App;
