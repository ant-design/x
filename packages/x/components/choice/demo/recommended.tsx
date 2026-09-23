import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'performance',
    label: '性能优化',
    description: '提升系统响应速度和吞吐量',
    recommended: true,
    recommendedReason: 'AI 评分: 92',
  },
  {
    key: 'security',
    label: '安全加固',
    description: '修复已知漏洞，增强安全策略',
  },
  {
    key: 'feature',
    label: '功能迭代',
    description: '按需求优先级推进新功能',
    recommended: 'secondary',
    recommendedReason: '次级推荐',
  },
  {
    key: 'debt',
    label: '技术债清理',
    description: '重构遗留代码，改善可维护性',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="推荐方案"
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
