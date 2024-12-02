import {
  CopyOutlined,
  DeleteOutlined,
  RedoOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { message } from 'antd';
import React from 'react';

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    label: '重试',
    icon: <RedoOutlined />,
  },
  {
    key: 'copy',
    label: '复制',
    icon: <CopyOutlined />,
  },
  {
    key: 'more',
    // icon:  <EllipsisOutlined />, // 不传使用默认的icon
    children: [
      {
        key: 'share',
        label: '分享',
        icon: <ShareAltOutlined />,
        children: [
          { key: 'qq', label: 'QQ' },
          { key: 'wechat', label: '微信' },
        ],
      },
      { key: 'import', label: '引用' },
      { key: 'delete', label: '删除', icon: <DeleteOutlined />, onClick: () => {}, danger: true },
    ],
  },
  {
    key: 'clear',
    label: '清空',
    icon: <ReloadOutlined />,
  },
];

const Demo: React.FC = () => {
  const onClick: ActionsProps['onClick'] = ({ key, keyPath, item }) => {
    message.success(`you click ${keyPath}`);
  };
  return <Actions items={actionItems} onClick={onClick} />;
};

export default Demo;
