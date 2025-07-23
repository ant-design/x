import { CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { message } from 'antd';
import React from 'react';

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

const App: React.FC = () => {
  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    // Logic for handling click events
    message.success(`you clicked ${keyPath.join(',')}`);
  };
  return <Actions items={actionItems} onClick={onClick} />;
};

export default App;
