import React, { useState } from 'react';
import { Card } from 'antd';
import { Conversations } from '@ant-design/x';
import type { ConversationProps } from '@ant-design/x';
import { GithubOutlined, CarOutlined } from '@ant-design/icons';

const data: ConversationProps[] = [
  // 基础示例
  {
    key: 'demo1',
    label: 'What is Ant Design X ?',
    icon: <GithubOutlined />,
  },
  // 超长 label 示例
  {
    key: 'demo3',
    label: 'Tour Xinjiang north and south big circle travel plan !',
    icon: <CarOutlined />,
  },
  // 禁用示例
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    disabled: true,
  },
];

const App = () => {
  const [activeKey, setActiveKey] = useState<string>();

  return (
    <Card style={{ width: 320 }}>
      <Conversations
        defaultActiveKey="demo3"
        activeKey={activeKey}
        onActiveChange={(v) => setActiveKey(v)}
        data={data}
      />
    </Card>
  )
}

export default App;
