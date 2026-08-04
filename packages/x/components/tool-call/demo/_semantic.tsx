import { ToolCall } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    header: '头部',
    status: '状态',
    name: '工具名称',
    description: '描述',
    actions: '操作区',
    details: '详情区',
    arguments: '参数',
    result: '结果',
    error: '错误',
  },
  en: {
    root: 'Root',
    header: 'Header',
    status: 'Status',
    name: 'Tool name',
    description: 'Description',
    actions: 'Actions',
    details: 'Details',
    arguments: 'Arguments',
    result: 'Result',
    error: 'Error',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="ToolCall"
      semantics={Object.entries(locale).map(([name, desc]) => ({ name, desc }))}
    >
      <ToolCall
        defaultExpanded
        item={{
          id: 'semantic',
          name: 'queryOrder',
          description: 'Order query',
          status: 'failed',
          arguments: { orderId: '20260803001' },
          error: { message: 'Service unavailable', retryable: true },
        }}
        onRetry={() => {}}
      />
    </SemanticPreview>
  );
};

export default App;
