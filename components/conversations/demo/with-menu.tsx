import React from 'react';
import { Conversations } from '@ant-design/x';
import type { ConversationProps, ConversationsProps } from '@ant-design/x';
import { EditOutlined, DeleteOutlined, GithubOutlined, CarOutlined, AlipayCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

const dataSource: ConversationProps[] = [
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

const App = () => {

  const [data, setData] = React.useState(dataSource);

  const menuConfig: ConversationsProps['menu'] = (convInfo) => ({
    items: [
     
      {
        label: '重命名',
        key: 'mod',
        icon: <EditOutlined />,
        disabled: typeof convInfo.label !== 'string',

      },
      {
        label: '删除',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      switch (menuInfo.key) {
        case 'delete':
          setData(data.filter((item) => convInfo.key !== item.key));
          break;
        case 'mod':
          message.info(`${menuInfo.key} ${convInfo.key}`);
          break;
        default:
          break;
      }

    },
  });

  return (
    <Conversations
      menu={menuConfig}
      defaultActiveKey="demo3"
      data={data}
    />
  )
}

export default App;
