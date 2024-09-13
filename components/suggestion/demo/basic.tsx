import React from 'react';
import { Suggestion, Sender } from '@ant-design/x';
import type { GetProp } from 'antd';

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, Function>;

const suggestions: SuggestionItems = [
  { label: '写一篇报告，关于：', value: 'report' },
  { label: '画一幅画：', value: 'draw' },
  {
    label: '查一个知识……',
    value: 'knowledge',
    children: [
      {
        label: '关于 React',
        value: 'react',
      },
      {
        label: '关于 Ant Design',
        value: 'antd',
      },
    ],
  },
];

const Demo: React.FC = () => {
  const [value, setValue] = React.useState('');

  return (
    <Suggestion
      items={suggestions}
      onSelect={(itemVal) => {
        setValue(`[${itemVal}]:`);
      }}
    >
      {({ onTrigger, onKeyDown }) => {
        return (
          <Sender
            value={value}
            onChange={(nextVal) => {
              if (nextVal === '/') {
                onTrigger();
              }
              setValue(nextVal);
            }}
            onKeyDown={onKeyDown}
            placeholder="输入 / 获取建议"
          />
        );
      }}
    </Suggestion>
  );
};

export default Demo;
