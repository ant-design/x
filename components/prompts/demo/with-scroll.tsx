import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import { BulbOutlined, InfoCircleOutlined, WarningOutlined, RocketOutlined, CheckCircleOutlined, CoffeeOutlined, SmileOutlined, FireOutlined, ThunderboltOutlined, HeartOutlined } from '@ant-design/icons';

const data: PromptsProps['data'] = [
  {
    key: "1",
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,  
    label: "Ignite Your Creativity",
  },
  {
    key: "2",
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,  
    label: "Uncover Background Info",
  },
  {
    key: "3",
    icon: <WarningOutlined style={{ color: '#FF4D4F' }} />,  
    label: "Troubleshooting Guide",
  },
  {
    key: "4",
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,  
    label: "Efficiency Boost Battle",
  },
  {
    key: "5",
    icon: <CheckCircleOutlined style={{ color: '#52C41A' }} />,  
    label: "Task Completion Secrets",
  },
  {
    key: "6",
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,  
    label: "Time for a Coffee Break",
  },
  {
    key: "7",
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,  
    label: "Smile Through Challenges",
  },
  {
    key: "8",
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,  
    label: "High-Pressure Rescue",
  },
  {
    key: "9",
    icon: <ThunderboltOutlined style={{ color: '#1890FF' }} />,  
    label: "Emergency Guide",
  },
  {
    key: "10",
    icon: <HeartOutlined style={{ color: '#EB2F96' }} />,  
    label: "Magic of Teamwork",
  },
];


const App = () => (
  <Prompts
    data={data}
    flex={{
      style: {
        overflow: 'scroll',
      },
    }}
  />
);

export default App;





