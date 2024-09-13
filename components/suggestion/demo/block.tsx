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
    extra: 'Ctrl + K',
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
      block
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
