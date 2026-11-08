import type { ChoiceProps } from '@ant-design/x';
import { Bubble, Choice } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const items: ChoiceProps['items'] = [
  {
    key: 'summary',
    label: '生成摘要',
    description: '提取关键信息生成摘要',
    recommended: true,
  },
  {
    key: 'translate',
    label: '翻译全文',
    description: '将内容翻译为目标语言',
  },
  {
    key: 'analyze',
    label: '深度分析',
    description: '对内容进行深度结构化分析',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  return (
    <Bubble.List
      items={[
        {
          key: 'ai',
          role: 'AI',
          content: '我已完成文档处理，接下来您希望如何继续？',
        },
        {
          key: 'choice',
          role: 'AI',
          content: (
            <Choice
              title="请选择后续操作"
              items={items}
              onChange={(value) => {
                message.info(`Selected: ${value}`);
              }}
            />
          ),
        },
      ]}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
