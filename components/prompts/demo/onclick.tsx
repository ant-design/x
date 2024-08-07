import React from 'react';
import { message } from 'antd';
import { Prompts } from '@ant-design/x';
import { RocketOutlined, CheckCircleOutlined, CoffeeOutlined } from '@ant-design/icons';
import type { PromptsProps } from '@ant-design/x';

const data: PromptsProps['data'] = [
   {
    key: "4",
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,  
    label: "Efficiency Boost Battle",
    description: "How can I work faster and better?",
  },
  {
    key: "5",
    icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,  
    label: "Task Completion Secrets",
    description: "What are some tricks for getting tasks done?",
  },
  {
    key: "6",
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,  
    label: "Time for a Coffee Break",
    description: "How to rest effectively after long hours of work?",
  },
];


const App = () => (
  <Prompts
    data={data}
    onClick={(event, info) => {
      console.log(event);
      message.open({
        icon: info.icon,
        content: info.description,
      })
    }}
  />
);

export default App;
