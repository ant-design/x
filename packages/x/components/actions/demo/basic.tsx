import { EditOutlined, RedoOutlined } from '@ant-design/icons';
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
    key: 'edit',
    icon: <EditOutlined />,
    label: 'Edit',
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
