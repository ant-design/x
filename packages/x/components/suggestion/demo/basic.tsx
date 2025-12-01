import { OpenAIFilled } from '@ant-design/icons';
import { Sender, Suggestion } from '@ant-design/x';
import { type GetProp, message } from 'antd';
import React, { useState } from 'react';

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      {
        label: 'About React',
        value: 'react',
      },
      {
        label: 'About Ant Design',
        value: 'antd',
      },
    ],
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
