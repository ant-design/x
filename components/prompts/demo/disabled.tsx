import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';

const items: PromptsProps['items'] = [
   {
    key: "5",
    icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,  
    label: "Task Completion Secrets",
    description: "What are some tricks for getting tasks done?",
    disabled: true,
  },
  {
    key: "6",
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,  
    label: "Time for a Coffee Break",
    description: "How to rest effectively after long hours of work?",
    disabled: false,
  },
];

const App = () => (<Prompts title="☕️ It's time to relax!" items={items} />);

export default App;
