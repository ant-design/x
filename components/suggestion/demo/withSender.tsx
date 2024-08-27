import React, { useState } from 'react';
import { Sender, Suggestions, type Suggestion } from '@ant-design/x';
import { App } from 'antd';
import { OpenAIFilled } from '@ant-design/icons';

const suggestions: Suggestion[] = [
  { id: '1', label: '写一篇报告，关于：', value: '写一篇报告，关于：', icon: <OpenAIFilled /> },
  { id: '2', label: '画一幅画：', value: '画一幅画：' },
  { id: '3', label: '查一个知识：', value: '查一个知识：', extra: <div>ExtraLink</div> },
];

const Demo: React.FC = () => {
  const [value, setValue] = useState<string>('');
  return (
    <Suggestions suggestions={suggestions} onChange={setValue}>
      <Sender value={value} onChange={setValue} />
    </Suggestions>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
