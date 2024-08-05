import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { BulbOutlined, InfoCircleOutlined, WarningOutlined, RocketOutlined, CheckCircleOutlined, CoffeeOutlined, SmileOutlined, FireOutlined } from '@ant-design/icons';

const data: PromptsProps['data'] = [
  {
    key: "1",
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,  
    description: "Got any sparks for a new project?",
  },
  {
    key: "2",
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,  
    description: "Help me understand the background of this topic.",
  },
  {
    key: "3",
    icon: <WarningOutlined style={{ color: '#FF4D4F' }} />,  
    description: "How to solve common issues? Share some tips!",
  },
  {
    key: "4",
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,  
    description: "How can I work faster and better?",
  },
  {
    key: "5",
    icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,  
    description: "What are some tricks for getting tasks done?",
  },
  {
    key: "6",
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,  
    description: "How to rest effectively after long hours of work?",
  },
  {
    key: "7",
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,  
    description: "What are the secrets to maintaining a positive mindset?",
  },
  {
    key: "8",
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,  
    description: "How to stay calm under immense pressure?",
  },
];


const App = () => (<Prompts title="✨ Inspirational Sparks and Marvelous Tips" data={data} flex={{ wrap: 'wrap' }} />);

export default App;

