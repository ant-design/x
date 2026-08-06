import { Task } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根元素',
    header: '头部',
    status: '状态',
    summary: '摘要',
    title: '标题',
    description: '描述',
    progress: '进度',
    actions: '操作区',
    details: '详情',
    content: '自定义内容',
    result: '结果',
    error: '错误',
    reason: '取消原因',
  },
  en: {
    root: 'Root',
    header: 'Header',
    status: 'Status',
    summary: 'Summary',
    title: 'Title',
    description: 'Description',
    progress: 'Progress',
    actions: 'Actions',
    details: 'Details',
    content: 'Custom content',
    result: 'Result',
    error: 'Error',
    reason: 'Cancellation reason',
  },
};

const App = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={Object.entries(locale).map(([name, desc]) => ({ name, desc }))}
      componentName="Task"
    >
      <Task
        item={{
          id: 'semantic',
          title: 'Analyze repository',
          description: 'Collecting component metadata',
          status: 'running',
          progress: 0.65,
          result: { components: 18 },
        }}
      >
        Task detail content
      </Task>
    </SemanticPreview>
  );
};

export default App;
