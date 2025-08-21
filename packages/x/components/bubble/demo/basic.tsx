import { AntDesignOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import { Avatar } from 'antd';
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

const text = `Hello World\nNext line\nT   a   b indent`;

const App = () => (
  <Bubble
    content={text}
    typing={{ effect: 'fade-in', suffix: '...' }}
    components={{
      header: <h5>Ant Design X</h5>,
      footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
      avatar: <Avatar icon={<AntDesignOutlined />} />,
    }}
  />
);

export default App;
