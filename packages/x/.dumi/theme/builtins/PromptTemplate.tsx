import { XMarkdown } from '@ant-design/x-markdown';
import { Card, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const PromptTemplate: React.FC<{
  title: string;
  children: React.ReactNode;
}> = (props) => {
  // ======================== Render ========================
  return (
    <Card
      title={props.title}
      extra={<Text copyable={{ text: props.children as string }} />}
      style={{ width: 300 }}
    >
      <XMarkdown content={props.children as string} />
    </Card>
  );
};

export default PromptTemplate;
