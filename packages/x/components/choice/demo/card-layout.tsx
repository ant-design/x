import {
  FireOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import type { ChoiceProps } from '@ant-design/x';
import { Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'performance',
    label: '性能优化',
    description: '提升系统响应速度和吞吐量',
    icon: <RocketOutlined style={{ color: '#722ED1' }} />,
    recommended: true,
    recommendedReason: 'AI 评分: 92',
  },
  {
    key: 'security',
    label: '安全加固',
    description: '修复已知漏洞，增强安全策略',
    icon: <SafetyCertificateOutlined style={{ color: '#52C41A' }} />,
  },
  {
    key: 'feature',
    label: '功能迭代',
    description: '按需求优先级推进新功能',
    icon: <FireOutlined style={{ color: '#FA541C' }} />,
    recommended: 'secondary',
  },
  {
    key: 'debt',
    label: '技术债清理',
    description: '重构遗留代码，改善可维护性',
    icon: <ToolOutlined style={{ color: '#8C8C8C' }} />,
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Choice
      title="推荐方案"
      mode="multiple"
      maxCount={3}
      layout="card"
      items={items}
      onChange={(value) => {
        message.info(`Selected: ${(value as Array<string | number>).join(', ')}`);
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
