import React from 'react';
import { message } from 'antd';
import { Conversations } from '@ant-design/x';
import type { ConversationProps } from '@ant-design/x';
import { EditOutlined, DeleteOutlined, GithubOutlined, CarOutlined, AlipayCircleOutlined } from '@ant-design/icons';

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
  // 超长 label 示例
  {
    key: 'demo3',
    label: 'Tour Xinjiang north and south big circle travel plan !',
    timestamp: 794621000,
    icon: <CarOutlined />,
  },
  // 禁用示例
  {
    key: 'demo5',
    label: 'Expired, please go to the recycle bin to check',
    timestamp: 794621200,
    disabled: true,
  },
];

const menuItems = [
  {
    label: '重命名',
    key: 'mod',
    icon: <EditOutlined />,
  },
  {
    label: '删除',
    key: 'delete',
    icon: <DeleteOutlined />,
    danger: true,
  },
];

const App = () => (
  <div>
    <Conversations
      menu={{
        items: menuItems,
        onClick: (v) => {
          message.info(`${v.key} clicked`);
        },
      }}
      defaultActiveKey="demo2"
      data={data}
    />
  </div>
);

export default App;
