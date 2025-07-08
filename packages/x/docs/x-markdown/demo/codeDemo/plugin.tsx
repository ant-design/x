import { Token, XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import 'github-markdown-css/github-markdown-light.css';
import './plugin.css';
import '@ant-design/x-markdown/themes/light.css';
import { Popover } from 'antd';

const content = `
## Custom Plugin
识别脚注并自定义渲染

### 🚀 **Ant Design X 概述**  
Ant Design X 是 Ant Design 团队推出的 **专为 AI 驱动的用户界面设计的 React UI 库**，基于 Ant Design 设计体系，提供模块化组件和工具链，帮助开发者高效构建智能交互界面。其核心创新在于 **RICH 设计范式**（Role 角色、Intention 意图、Conversation 对话、Hybrid UI 混合界面）[^1][^4][^7]。

---

### ✨ **核心特性**  
1. **RICH 设计范式**  
   - **Role**：通过头像、语言风格等组件为 AI 设定角色（如客服、分析师）[^7][^8]。
   - **Intention**：使用 \`Prompts\` 等组件引导用户明确需求（如推荐问题示例）[^1][^9]。  
   - **Conversation**：管理多轮对话流程，支持欢迎语、追问选项等交互[^1][^3]。  
   - **Hybrid UI**：融合图形操作（GUI）与自然语言交互（如文档编辑界面嵌入对话）[^1][^7]。  

2. **开箱即用的 AI 集成**  
   - 支持对接符合 OpenAI 标准的模型服务（如 GPT-3.5），通过 \`useXAgent\` 简化 API 调用[^1][^5][^8]。  

3. **企业级开发支持**  
   - 完整的 TypeScript 类型定义，提升可靠性[^1][^4]。  
   - 深度主题定制能力，支持暗色/亮色模式切换[^4][^5]。  

---

### 🧩 **核心组件分类**  
#### 1. **通用组件**
| 组件          | 功能                                |  
|---------------|-------------------------------------|  
| Bubble      | 消息气泡，支持用户/AI 消息布局        |  
| Conversations  [^1][^3][^9] | 管理多轮对话历史记录                |

#### 2. **唤醒组件**
| 组件       | 功能                                |  
|------------|-------------------------------------|  
| Welcome  | 会话初始欢迎语，引导用户理解 AI 能力 |  
| Prompts  [^1][^7][^9]  | 展示上下文相关的问题建议            |

#### 3. **表达组件**
| 组件          | 功能                                |  
|---------------|-------------------------------------|  
| Sender      | 消息输入框，支持自定义样式和附件    |  
| Attachments | 管理文件上传与展示                  |  
| Suggestion [^1][^6][^9]  | 提供快捷输入选项（如常见问题模板）  | 

#### 4. **过程与反馈组件**
| 组件           | 功能                                |  
|----------------|-------------------------------------|  
| ThoughtChain [^2][^9] | 可视化 AI 推理过程（如思维链调试）  | 

#### 5. **工具类组件/钩子**
| 组件/Hook      | 功能                                |  
|----------------|-------------------------------------|  
| useXAgent  [^1][^5][^8]  | 对接 AI 模型服务，管理请求与响应    |  
| useXChat     | 管理对话数据流，维护消息状态        |  
| XProvider    | 全局配置组件（主题、API 地址等）     | 

---

### 🛠️ **安装与基础示例**  
\`\`\`bash
npm install @ant-design/x --save  # React 版本
\`\`\`
`;

const referenceList = [
  { url: 'https://x.ant.design', title: 'link1' },
  { url: 'https://x.ant.design', title: 'link2' },
  { url: 'https://x.ant.design', title: 'link3' },
  { url: 'https://x.ant.design', title: 'link4' },
  { url: 'https://x.ant.design', title: 'link5' },
  { url: 'https://x.ant.design', title: 'link6' },
  { url: 'https://x.ant.design', title: 'link7' },
  { url: 'https://x.ant.design', title: 'link8' },
  { url: 'https://x.ant.design', title: 'link9' },
];

const App = () => {
  const footNoteExtension = {
    name: 'footnote',
    level: 'inline' as const,
    tokenizer(src: string) {
      const match = src.match(/^\[\^(\d+)\]/);
      if (match) {
        const content = match[0].trim();
        return {
          type: 'footnote',
          raw: content,
          text: content?.replace(/^\[\^(\d+)\]/g, '$1'),
          renderType: 'component',
        };
      }
    },
    renderer(token: Token) {
      if (!referenceList) {
        return '';
      }
      const { text } = token;
      const order = Number(text) - 1;
      const currentUrl = referenceList?.[order]?.url;
      const currentTitle = referenceList?.[order]?.title;
      if (!currentUrl) {
        return null;
      }
      return `<footnote href="${currentUrl}" title="${currentTitle}" >${text}</footnote>`;
    },
  };

  return (
    <XMarkdown
      className="x-markdown-theme-light"
      plugins={{ extensions: [footNoteExtension] }}
      components={{
        footnote: (props: { children: string; href: string; title: string }) => {
          return (
            <Popover content={props?.title} title="Footnote" trigger="hover">
              <span onClick={() => window.open(props.href)} className="markdown-cite">
                {props?.children}
              </span>
            </Popover>
          );
        },
      }}
    >
      {content}
    </XMarkdown>
  );
};

export default App;
