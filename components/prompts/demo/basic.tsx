import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { BulbOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons';

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    label: 'Ignite Your Creativity',
    description: 'Got any sparks for a new project?',
    disabled: false,
  },
  {
    key: '2',
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
    label: 'Uncover Background Info',
    description: 'Help me understand the background of this topic.',
    disabled: false,
  },
  {
    key: '3',
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,
    label: 'Efficiency Boost Battle',
    description: 'How can I work faster and better?',
    disabled: false,
  },
];

const App = () => <Prompts title="✨ Inspirational Sparks and Marvelous Tips" items={items} />;

export default App;
