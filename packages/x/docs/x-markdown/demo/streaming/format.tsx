import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, Skeleton } from 'antd';
import React, { useState } from 'react';
import { useMarkdownTheme } from '../_utils';

const demos = [
  {
    title: 'Mixed Syntax',
    content:
      "# Complex Mixed Syntax\n\nThis is a **comprehensive example** with:\n\n- **Bold items** with [Ant Design X](https://github.com/ant-design/x)\n- *Italic text* with `inline code`\n- Images: ![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)\n\n## Code Example\n\n```javascript\nimport { XProvider } from '@ant-design/x';\n\nconst App = () => (\n  <XProvider>\n    <YourComponent />\n  </XProvider>\n);\n```\n\n> **Note**: This is a *blockquote* with **mixed** syntax. \n\n ## Table: \n | 特性维度 | 说明 |\n|----------|------|\n| **定位** | 基于 Ant Design 的 React 扩展库，专注企业级中后台交互与视觉一致性 |\n| **核心能力** | 提供高级组件（如高级表格、表单、图表、权限控制等）与业务模板，弥补 Ant Design 基础组件的覆盖盲区 |\n| **技术栈** | React + TypeScript，完全兼容 Ant Design 设计体系与工程化方案 |\n| **设计原则** | 延续 Ant Design 的「自然」「确定性」「意义感」「生长性」四大设计价值观，保持交互与视觉一致性 |\n| **安装使用** | `npm i @ant-design/x` 或 `yarn add @ant-design/x`，引入后即可与 Ant Design 组件混合使用 |\n| **开源协议** | MIT |",
  },
  {
    title: 'Image Syntax',
    content:
      'This is Image:\n\n ![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)',
  },
  {
    title: 'Link Syntax',
    content: 'Visit [Ant Design X](https://github.com/ant-design/x) for more details.',
  },
  {
    title: 'Atx Heading',
    content:
      '# Heading1 \n ## Heading2 \n ### Heading3 \n #### Heading4 \n ##### Heading5 \n ###### Heading6',
  },
  {
    title: 'Emphasis',
    content:
      'This is **bold text** and this is *italic text*. You can also use ***bold and italic***.',
  },
  {
    title: 'Html',
    content:
      'Html: <div data-title="XComponent"><Conversations placeholder="欢迎使用 Ant Design X" />欢迎使用 Ant Design X</div>',
  },
  {
    title: 'Table',
    content: `Table: 

| 特性维度 | 说明 |
|:----------|------:|
| **定位** | 基于 Ant Design 的 React 扩展库，专注企业级中后台交互与视觉一致性 |
| **核心能力** | 提供高级组件（如高级表格、表单、图表、权限控制等）与业务模板，弥补 Ant Design 基础组件的覆盖盲区 |
| **技术栈** | React + TypeScript，完全兼容 Ant Design 设计体系与工程化方案 |
| **设计原则** | 延续 Ant Design 的「自然」「确定性」「意义感」「生长性」四大设计价值观，保持交互与视觉一致性 |
| **安装使用** | \`npm i @ant-design/x\` 或 \`yarn add @ant-design/x\`，引入后即可与 Ant Design 组件混合使用 |
| **开源协议** | MIT |`,
  },
];

const ImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />;

const LinkSkeleton = () => (
  <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
);

const TableSkeleton = () => <Skeleton.Node active style={{ width: 160 }} />;

const HtmlSkeleton = () => (
  <Skeleton.Button active size="small" style={{ margin: '4px 0', width: 16, height: 16 }} />
);

const StreamDemo: React.FC<{ content: string }> = ({ content }) => {
  const [displayText, setDisplayText] = useState(content);
  const [isStreaming, setIsStreaming] = useState(false);
  const [className] = useMarkdownTheme();

  const startStream = React.useCallback(() => {
    setDisplayText('');
    setIsStreaming(true);
    let index = 0;

    const stream = () => {
      if (index <= content.length) {
        setDisplayText(content.slice(0, index));
        index++;
        setTimeout(stream, 30);
      } else {
        setIsStreaming(false);
      }
    };

    stream();
  }, [content]);

  React.useEffect(() => {
    startStream();
  }, [startStream]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card title="Markdown Source" size="small">
        <div
          style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            fontSize: 13,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            maxHeight: 800,
            overflow: 'auto',
          }}
        >
          {displayText || 'Click Stream to start'}
        </div>
      </Card>

      <Card
        title="Rendered Output"
        size="small"
        extra={
          <Button type="primary" onClick={startStream} loading={isStreaming}>
            Re-Render
          </Button>
        }
      >
        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 4,
            padding: 12,
            maxHeight: 800,
            overflow: 'auto',
          }}
        >
          <XMarkdown
            content={displayText}
            className={className}
            paragraphTag="div"
            components={{
              'incomplete-image': ImageSkeleton,
              'incomplete-link': LinkSkeleton,
              'incomplete-table': TableSkeleton,
              'incomplete-html': HtmlSkeleton,
            }}
            streaming={{ hasNextChunk: isStreaming }}
          />
        </div>
      </Card>
    </div>
  );
};

const App = () => {
  const [currentDemo, setCurrentDemo] = useState(0);

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        {demos.map((demo, index) => (
          <Button
            key={index}
            type={currentDemo === index ? 'primary' : 'default'}
            onClick={() => setCurrentDemo(index)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            {demo.title}
          </Button>
        ))}
      </div>

      <StreamDemo key={currentDemo} content={demos[currentDemo].content} />
    </div>
  );
};

export default App;
