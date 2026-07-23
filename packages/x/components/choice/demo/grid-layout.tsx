import {
  AppstoreOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  TagOutlined,
} from '@ant-design/icons';
import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'time',
    label: '按时间',
    description: '趋势分析',
    icon: <ClockCircleOutlined style={{ color: '#1890FF' }} />,
  },
  {
    key: 'region',
    label: '按地区',
    description: '地域分布',
    icon: <GlobalOutlined style={{ color: '#52C41A' }} />,
  },
  {
    key: 'category',
    label: '按品类',
    description: '类别分析',
    icon: <TagOutlined style={{ color: '#722ED1' }} />,
  },
  {
    key: 'channel',
    label: '按渠道',
    description: '渠道分析',
    icon: <AppstoreOutlined style={{ color: '#FA8C16' }} />,
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="选择您感兴趣的方向"
      layout="grid"
      items={items}
      onChange={(value) => {
        message.info(`Selected: ${value}`);
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
