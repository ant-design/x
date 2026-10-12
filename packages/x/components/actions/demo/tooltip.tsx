import { CopyOutlined, DeleteOutlined, EditOutlined, RedoOutlined } from '@ant-design/icons';
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
    tooltip: 'Edit the item',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
    tooltip: { title: 'Copy the item', color: 'blue' },
  },
  {
    key: 'delete',
    icon: <DeleteOutlined />,
    label: 'Delete',
    tooltip: false as const,
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
