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
    description: '按时间趋势分析',
    icon: <ClockCircleOutlined style={{ color: '#1890FF' }} />,
  },
  {
    key: 'region',
    label: '按地区',
    description: '按地域分布分析',
    icon: <GlobalOutlined style={{ color: '#52C41A' }} />,
  },
  {
    key: 'category',
    label: '按品类',
    description: '按商品类别分析',
    icon: <TagOutlined style={{ color: '#722ED1' }} />,
  },
  {
    key: 'channel',
    label: '按渠道',
    description: '按销售渠道分析',
    icon: <AppstoreOutlined style={{ color: '#FA8C16' }} />,
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="请选择数据分析维度"
      description="选择最符合您需求的维度"
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
