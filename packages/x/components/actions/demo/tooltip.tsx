import { EditOutlined, RedoOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import React from 'react';

const App: React.FC = () => {
  return (
    <Actions
      items={[
        {
          key: 'retry',
          icon: <RedoOutlined />,
          label: 'Retry',
          // Custom tooltip text
          tooltip: 'Click to retry',
        },
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: 'Edit',
          // Custom tooltip props (e.g. placement, color)
          tooltip: {
            title: 'Edit content',
            placement: 'bottom',
            color: 'blue',
          },
        },
        {
          key: 'share',
          icon: <EditOutlined />,
          label: 'Share',
          // Disable tooltip
          tooltip: false,
        },
      ]}
    />
  );
};

export default App;
