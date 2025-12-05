import { Sender, Suggestion, SuggestionProps } from '@ant-design/x';
import { message, Tag } from 'antd';
import React, { useState } from 'react';

type SuggestionItems = Exclude<SuggestionProps['items'], () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    extra: <Tag>Extra Info</Tag>,
    other: 'other data',
  },
];

const Demo: React.FC = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
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
          <>
            {contextHolder}
            <Sender
              loading={loading}
              value={value}
              onSubmit={(value) => {
                messageApi.success(`message send success: ${value}`);
                setValue('');
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                }, 3000);
              }}
              onChange={(nextVal) => {
                if (nextVal === '/') {
                  onTrigger();
                } else if (!nextVal) {
                  onTrigger(false);
                }
                setValue(nextVal);
              }}
              onKeyDown={onKeyDown}
              placeholder="输入 / 获取建议"
            />
          </>
        );
      }}
    </Suggestion>
  );
};

export default Demo;
