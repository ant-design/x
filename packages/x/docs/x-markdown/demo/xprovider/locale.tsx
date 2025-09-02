import type { XProviderProps } from '@ant-design/x';
import { XProvider } from '@ant-design/x';
import enUS_X from '@ant-design/x/locale/en_US';
import zhCN_X from '@ant-design/x/locale/zh_CN';
import XMarkdown from '@ant-design/x-markdown';
import Mermaid from '@ant-design/x-markdown/plugins/Mermaid';
import { Card, Flex, Radio, RadioChangeEvent, Typography } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React, { useState } from 'react';

type Locale = XProviderProps['locale'];

const content = `
Here are several Mermaid diagram examples 

#### 1. Flowchart (Vertical)

\`\`\` mermaid
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b
\`\`\`

#### 2. Sequence Diagram

\`\`\` mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: POST /api/data
    Server->>Database: INSERT record
    Database-->>Server: Success
    Server-->>Client: 201 Created
\`\`\`

#### 3. Quadrant Chart

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
\`\`\`
`;

const Code = (props: { class: string; children: string }) => {
  const { class: className, children } = props;
  const lang = className?.replace('language-', '');
  if (lang === 'mermaid') {
    return <Mermaid>{children}</Mermaid>;
  }
  return <code>{children}</code>;
};

export default () => {
  const [localeType, setLocaleType] = useState<'zh' | 'en'>('zh');

  // 如果您的项目使用了antd 那么可以将antd的locale合并传入XProvider
  // If your project uses antd, you need to merge antd's locale into XProvider
  const [locale, setLocal] = useState<Locale>({ ...zhCN, ...zhCN_X });
  const changeLocale = (e: RadioChangeEvent) => {
    const localeValue = e.target.value;
    setLocaleType(localeValue);
    setLocal(localeValue === 'zh' ? { ...zhCN, ...zhCN_X } : { ...enUS, ...enUS_X });
  };

  return (
    <>
      <Flex gap={12} style={{ marginBottom: 16 }} align="center">
        <Typography.Text>Change locale of components:</Typography.Text>
        <Radio.Group value={localeType} onChange={changeLocale}>
          <Radio.Button value="en">English</Radio.Button>
          <Radio.Button value="zh">中文</Radio.Button>
        </Radio.Group>
      </Flex>
      <XProvider locale={locale}>
        <Flex gap={12} vertical>
          <Card>
            <XMarkdown
              components={{
                code: Code,
              }}
            >
              {content}
            </XMarkdown>
          </Card>
        </Flex>
      </XProvider>
    </>
  );
};
