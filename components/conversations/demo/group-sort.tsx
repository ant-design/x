import React from 'react';
import { Card, Space, type GetProp } from 'antd';
import type { ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import { GithubOutlined, AlipayCircleOutlined, DockerOutlined } from '@ant-design/icons';

const items: GetProp<ConversationsProps, 'items'> = [
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <GithubOutlined />,
    group: 'Pinned',
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
    group: 'Pinned',
  },
  // 默认分组
  {
    key: 'demo4',
    label: 'In Docker, use 🐑 Ollama and initialize',
    icon: <DockerOutlined />,
  },
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    disabled: true,
    group: 'Expired',
  },
];

const App = () => (
  <Card style={{ width: 320 }} size="small">
    <Conversations
      groupable={{
        sort(a, b) {
          if (a === b) return 0;

          return a === 'Pinned' ? -1 : 1;
        },
        title: (group, { components: { GroupTitle } }) =>
          group ? (
            <GroupTitle>
              <Space>🔥{group}</Space>
            </GroupTitle>
          ) : (
            <GroupTitle />
          ),
      }}
      defaultActiveKey="demo1"
      items={items}
    />
  </Card>
);

export default App;
