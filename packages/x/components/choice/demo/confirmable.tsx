import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'detail',
    label: '查看详细报告',
    description: '查看完整的分析报告',
  },
  {
    key: 'fix',
    label: '立即修复',
    description: '自动修复检测到的问题',
    recommended: true,
    recommendedReason: '检测到 3 个高危问题',
  },
  {
    key: 'schedule',
    label: '加入排期',
    description: '加入后续冲刺排期',
  },
  {
    key: 'ignore',
    label: '暂时忽略',
    description: '跳过本次处理',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="下一步您希望如何继续？"
      description="诊断完成，以下是建议的后续步骤"
      mode="multiple"
      maxCount={2}
      confirmable
      confirmText="确认选择"
      items={items}
      onConfirm={(value) => {
        message.success(`Confirmed: ${(value as Array<string | number>).join(', ')}`);
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
