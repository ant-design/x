import React from 'react';
import { Prompts } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import {
  BulbOutlined,
  InfoCircleOutlined,
  SmileOutlined,
  FileTextOutlined,
  FireOutlined,
  CoffeeOutlined,
  CalendarOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const items: PromptsProps['items'] = [
  {
    key: '1',
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    label: 'Get Inspired',
  },
  {
    key: '10',
    icon: <SettingOutlined style={{ color: '#EB2F96' }} />,
    label: 'Settings',
  },
  {
    key: '2',
    icon: <InfoCircleOutlined style={{ color: '#1890FF' }} />,
    label: 'Background Info',
  },
  {
    key: '3',
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
    label: 'Send a Compliment',
  },
  {
    key: '4',
    icon: <FileTextOutlined style={{ color: '#52C41A' }} />,
    label: 'Draft a Message',
  },
  {
    key: '5',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    label: 'Send an Alert',
  },
  {
    key: '6',
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
    label: 'Take a Break',
  },
  {
    key: '7',
    icon: <CalendarOutlined style={{ color: '#722ED1' }} />,
    label: 'Schedule a Meeting',
  },
  {
    key: '8',
    icon: <HistoryOutlined style={{ color: '#1890FF' }} />,
    label: 'View History',
  },
  {
    key: '9',
    icon: <ShareAltOutlined style={{ color: '#52C41A' }} />,
    label: 'Share Content',
  },
];

const App = () => <Prompts items={items} />;

export default App;
