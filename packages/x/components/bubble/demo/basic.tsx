import { AntDesignOutlined, RedoOutlined } from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import { Avatar } from 'antd';
import React from 'react';

const actionItems = (content: string) => [
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => {
      return <Actions.Copy text={content} />;
    },
  },
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
];

const text = `Hello World\nNext line\nTab\tindent`;

const App = () => (
  <Bubble
    content={text}
    typing={{ effect: 'fade-in', suffix: '...' }}
    components={{
      header: <h5>Ant Design X</h5>,
      footer: (content) => (
        <Actions items={actionItems(content)} onClick={() => console.log(content)} />
      ),
      avatar: <Avatar icon={<AntDesignOutlined />} />,
    }}
  />
);

export default App;
