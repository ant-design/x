import { FireOutlined, ReadOutlined, RocketOutlined } from '@ant-design/icons';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { Space } from 'antd';
import React from 'react';

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space>
    {icon}
    <span>{title}</span>
  </Space>
);

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
    description: 'Got any sparks for a new project?',
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
    description: 'Help me understand the background of this topic.',
  },
  {
    key: '3',
    label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Start Creating'),
    description: 'How can I work faster and better?',
  },
];

const App = () => (
  <Prompts
    title="Do you want?"
    items={items}
    wrap
    styles={{
      item: {
        flex: 'none',
        width: 'calc(33% - 6px)',
      },
    }}
  />
);

export default App;
