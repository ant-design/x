import type { BubbleListProps } from '@ant-design/x';
import { Bubble, Sender } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { DefaultChatProvider, useXChat, XRequest } from '@ant-design/x-sdk';
import { Button, Row } from 'antd';
import React, { useMemo, useState } from 'react';
import { mockFetch, useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const fullContent = `
### Link链接 🔗
内部链接：[Ant Design X](https://github.com/ant-design/x)

邮箱链接：<contact@example.com>

### Image图片 🖼️
![示例图片](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)

### Heading标题  📑
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

### Emphasis强调 ✨
*斜体文本*

**粗体文本**

***粗斜体文本***

###  Strong强调
**这是strong标签的效果**

__这也是strong的效果__

### XML标签
\`\`\`xml
<user>
  <name>张三</name>
  <age>25</age>
  <email>zhangsan@example.com</email>
</user>
\`\`\`

### Code代码 💻
\`console.log('Hello World')\`

#### 行内代码
使用 \`console.log('Hello World')\` 输出信息

#### 代码块
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

### Hr水平线 📏
---
***
___

#### 有序列表
1. 第一步
2. 第二步
   1. 子步骤2.1
   2. 子步骤2.2
3. 第三步

#### 混合列表
1. 主要任务
   - 子任务1
   - 子任务2
     - [x] 已完成子任务
     - [ ] 未完成子任务

---

*以上展示了所有支持的Markdown格式*
`;

const roles: BubbleListProps['role'] = {
  ai: {
    placement: 'start',
  },
  user: {
    placement: 'end',
  },
};

interface MessageType {
  role: 'ai' | 'user';
  content: string;
}

const App = () => {
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [content, setContent] = React.useState('');
  const [className] = useMarkdownTheme();

  let chunks = '';
  const provider = useMemo(
    () =>
      new DefaultChatProvider<MessageType, MessageType, MessageType>({
        request: XRequest('https://api.example.com/chat', {
          manual: true,
          fetch: () => mockFetch(fullContent),
          transformStream: new TransformStream<string, MessageType>({
            transform(chunk, controller) {
              chunks += chunk;
              controller.enqueue({
                content: chunks,
                role: 'ai',
              });
            },
          }),
        }),
      }),
    [content],
  );

  const { onRequest, messages, isRequesting } = useXChat({
    provider: provider,
  });

  return (
    <>
      <Row justify="end" style={{ marginBottom: 24 }}>
        <Button
          style={{ marginRight: 8 }}
          onClick={() => {
            setEnableStreaming(!enableStreaming);
          }}
        >
          Streaming: {enableStreaming ? 'On' : 'Off'}
        </Button>
      </Row>
      <div
        style={{
          height: 400,
          paddingBlock: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Bubble.List
          role={roles}
          items={messages.map(({ id, message, status }) => ({
            key: id,
            role: message.role,
            content: message.content,
            status,
            contentRender:
              message.role === 'user'
                ? (content) => content
                : (content, { status }) => (
                    <XMarkdown
                      className={className}
                      content={content as string}
                      streaming={{ hasNextChunk: enableStreaming && status === 'updating' }}
                    />
                  ),
          }))}
        />
        <Sender
          loading={isRequesting}
          value={content}
          onChange={setContent}
          style={{ marginTop: 48 }}
          onSubmit={(nextContent) => {
            onRequest({
              content: nextContent,
              role: 'user',
            });
            setContent('');
          }}
        />
      </div>
    </>
  );
};

export default App;
