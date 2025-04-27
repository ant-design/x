import { CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { message } from 'antd';
import React from 'react';

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: '重试',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: '复制',
  },
];

const Demo: React.FC = () => {
  const onClick: ActionsProps['onClick'] = ({ key, keyPath, item }) => {
    message.success(`you click ${keyPath.join(',')}`);
  };
  return <Actions items={actionItems} onClick={onClick} />;
};

export default Demo;
