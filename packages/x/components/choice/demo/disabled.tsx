import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'time',
    label: '按时间',
    description: '按时间趋势分析',
  },
  {
    key: 'channel',
    label: '按渠道',
    description: '按销售渠道分析',
    disabled: true,
    disabledReason: '当前冲刺无排期',
  },
  {
    key: 'region',
    label: '按地区',
    description: '按地域分布分析',
  },
  {
    key: 'manual',
    label: '手动配置',
    description: '自定义分析维度',
    disabled: true,
    disabledReason: '需要管理员权限',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="请选择数据分析维度"
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
