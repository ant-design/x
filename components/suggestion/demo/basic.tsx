import React from 'react';
import { Suggestions } from '@ant-design/x';
import type { GetProp } from 'antd';

type Suggestion = GetProp<typeof Suggestions, 'suggestions'>[number];

const suggestions: Suggestion[] = [
  { id: '1', label: '写一篇报告，关于：', value: '写一篇报告，关于：' },
  { id: '2', label: '画一幅画：', value: '画一幅画：' },
  { id: '3', label: '查一个知识：', value: '查一个知识：', extra: <div>ExtraLink</div> },
];

const Demo: React.FC = () => <Suggestions suggestions={suggestions} />;

export default Demo;
