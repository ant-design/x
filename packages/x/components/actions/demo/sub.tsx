import { DeleteOutlined, EditOutlined, RedoOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { Modal, message } from 'antd';
import React from 'react';

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    label: 'Retry',
    icon: <RedoOutlined />,
  },
  {
    key: 'edit',
    icon: <EditOutlined />,
    label: 'Edit',
  },
  {
    key: 'more',
    subItems: [
      {
        key: 'share',
        label: 'Share',
        icon: <ShareAltOutlined />,
      },
      { key: 'import', label: 'Import' },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        onItemClick: () => {
          Modal.confirm({
            title: 'Are you sure want to delete?',
            content: 'Some descriptions',
            onOk() {
              message.success('Delete successfully');
            },
            onCancel() {
              message.info('Cancel');
            },
          });
        },
        danger: true,
      },
    ],
  },
  {
    key: 'clear',
    label: 'Clear',
    icon: <DeleteOutlined />,
    danger: true,
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
