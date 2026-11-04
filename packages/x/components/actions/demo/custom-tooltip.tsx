import { EditOutlined, RedoOutlined, StarOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import React from 'react';

const App: React.FC = () => {
  const items = [
    {
      key: 'retry',
      icon: <RedoOutlined />,
      label: 'Retry',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      // Use a custom tooltip string instead of the label
      tooltip: 'Edit this item',
    },
    {
      key: 'star',
      icon: <StarOutlined />,
      label: 'Star',
      // Disable the tooltip entirely
      tooltip: false,
    },
    {
      key: 'share',
      icon: <EditOutlined />,
      label: 'Share',
      // Pass extra Tooltip props, title falls back to label by default
      tooltip: { placement: 'bottom', color: 'blue' },
    },
  ];

  return <Actions items={items} />;
};

export default App;
