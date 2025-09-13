export const Adx_Markdown_Zh = `
# Ant Design X

Ant Design X 是一款AI应用复合工具集，融合了 UI 组件库、流式 Markdown 渲染引擎和 AI SDK，为开发者提供构建下一代 AI 驱动应用的完整工具链。

**\`@ant-design/x\` - 智能界面构建框架**

基于 Ant Design 设计体系的 React UI 库、专为 AI 驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面，查看详情请点击[这里](/components/introduce-cn/)。

**\`@ant-design/x-markdown\` - 高性能流式渲染引擎**

专为流式内容优化的 Markdown 渲染解决方案、强大的扩展能力，支持公式、代码高亮、mermaid 图表等极致性能表现，确保流畅的内容展示体验。查看详情请点击[这里](/markdowns/introduce-cn)。

**\`@ant-design/x-sdk\` - AI 对话数据流管理**

提供完整的工具 API 集合、开箱即用的 AI 对话应用数据流管理、简化开发流程，提升开发效率。查看详情请点击[这里](/sdks/introduce-cn)。

---

## @ant-design/x

### ✨ **核心特性**  

- 🌈 **源自企业级 AI 产品的最佳实践**：基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 **灵活多样的原子组件**：覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ **开箱即用的模型对接能力**：配合[X SDK](/sdks/introduce-cn) 轻松对接模型和智能体服务
- 📦 **丰富的样板间支持**：提供多种模板，快速启动 LUI 应用开发
- 🛡 **TypeScript 全覆盖**：采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 **深度主题定制能力**：支持细粒度的样式调整，满足各种场景的个性化需求 

---

### 🧩 **核心组件分类**  
#### 1. **通用组件**
| 组件          | 功能                                |  
|---------------|-------------------------------------|  
| Bubble      | 消息气泡，支持用户/AI 消息布局        |  
| Conversations  [^1][^3][^9] | 管理多轮对话历史记录                |
| Notification | 系统通知｜

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

#### 5. **确认组件**
| 组件           | 功能                                |  
|----------------|-------------------------------------|  
| Think [^2][^9] | 思考过程  | 
| ThoughtChain | 思维链 |

#### 5. **反馈组件**
| 组件           | 功能                                |  
|----------------|-------------------------------------|  
| Actions [^2][^9] | 操作列表  |
| FileCard | 文件卡片|

---

### 🛠️ **安装与基础示例**  
\`\`\`bash
npm install @ant-design/x --save  # React 版本
\`\`\`

## @ant-design/-sdk

### 特性

- **会话管理**：提供 \`useConversations\` Hook 管理会话列表，支持创建、删除
- **统一数据流管理**：提供 \`useXChat\` Hook 管理会话数据，支持消息解析、状态管理和操作API
- **强大的请求处理**：内置 \`XRequest\` API 支持流式响应、中间件、全局配置和手动控制
- **多模型支持**：通过 \`Chat Provider\` 机制支持不同AI模型的无缝接入，内置DeepSeek、OpenAI兼容方案
- **多会话并存**：支持同时管理多个会话，每个会话独立数据流
## 示例

\`\`\`tsx
import React from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = React.useState<'string'>('');
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  useEffect(() => {
    setStatus('pending');

    XRequest('https://api.example.com/chat', {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      callbacks: {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
    });
  }, []);

  return (
    <div>
      <div>Status: {status}</div>
      <div>Lines: {lines.length}</div>
    </div>
  );
};
\`\`\`
`;

export const Adx_Markdown_En = `
# Ant Design X

Ant Design X is a comprehensive AI application toolkit, integrating a UI component library, streaming Markdown rendering engine, and AI SDK, providing developers with a complete toolchain for building next-generation AI-driven applications.

**\`@ant-design/x\` - Intelligent Interface Framework**

A React UI library based on the Ant Design system, designed for AI-driven interfaces. Out-of-the-box intelligent conversation components, seamless API integration, and rapid smart UI building. See details [here](/components/introduce/).

**\`@ant-design/x-markdown\` - High-performance Streaming Renderer**

A Markdown rendering solution optimized for streaming content, with powerful extensibility. Supports formulas, code highlighting, mermaid diagrams, and more for excellent performance and smooth content display. See details [here](/markdowns/introduce).

**\`@ant-design/x-sdk\` - AI Conversation Data Flow Management**

Provides a complete set of tool APIs for out-of-the-box AI conversation data flow management, simplifying development and improving efficiency. See details [here](/sdks/introduce).

---

## @ant-design/x

### ✨ **Core Features**  

- 🌈 **Best practices from enterprise-level AI products**: Based on RICH interaction paradigms, providing excellent AI interaction experience
- 🧩 **Flexible atomic components**: Covering most AI conversation scenarios, helping you quickly build personalized AI interaction pages
- ⚡ **Out-of-the-box model integration**: Easily connect models and agents with [X SDK](/sdks/introduce)
- 📦 **Rich template support**: Multiple templates for quick LUI app development
- 🛡 **Full TypeScript coverage**: Developed with TypeScript, providing complete type support for better experience and reliability
- 🎨 **Deep theme customization**: Fine-grained style adjustments for personalized needs in various scenarios 

---

### 🧩 **Core Component Categories**  
#### 1. **General Components**
| Component      | Function                                 |  
|---------------|------------------------------------------|  
| Bubble        | Message bubble, supports user/AI layout   |  
| Conversations [^1][^3][^9] | Manage multi-turn conversation history |
| Notification  | System notification |

#### 2. **Awakening Components**
| Component     | Function                                 |  
|---------------|------------------------------------------|  
| Welcome       | Initial greeting, guides user to understand AI capabilities |  
| Prompts [^1][^7][^9] | Display context-related question suggestions |

#### 3. **Expression Components**
| Component      | Function                                 |  
|---------------|------------------------------------------|  
| Sender        | Message input box, supports custom styles and attachments |  
| Attachments   | Manage file upload and display           |  
| Suggestion [^1][^6][^9] | Provide quick input options (e.g. FAQ templates) | 

#### 4. **Confirmation Components**
| Component      | Function                                 |  
|---------------|------------------------------------------|  
| Think [^2][^9]| Thinking process | 
| ThoughtChain  | Chain of thought |

#### 5. **Feedback Components**
| Component      | Function                                 |  
|---------------|------------------------------------------|  
| Actions [^2][^9] | Action list  |
| FileCard      | File card|

---

### 🛠️ **Installation & Basic Example**  
\`\`\`bash
npm install @ant-design/x --save  # React version
\`\`\`

## @ant-design/x-sdk

### Features

- **Conversation management**: Provides \`useConversations\` Hook to manage conversation list, supports create and delete
- **Unified data flow management**: Provides \`useXChat\` Hook to manage conversation data, supports message parsing, state management, and operation APIs
- **Powerful request handling**: Built-in \`XRequest\` API supports streaming response, middleware, global config, and manual control
- **Multi-model support**: Seamlessly connect different AI models via \`Chat Provider\`, built-in DeepSeek and OpenAI compatible solutions
- **Multiple conversations**: Manage multiple conversations simultaneously, each with independent data flow
## Example

\`\`\`tsx
import React from 'react';
import { XRequest } from '@ant-design/x-sdk';

export default () => {
  const [status, setStatus] = React.useState<'string'>('');
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  useEffect(() => {
    setStatus('pending');

    XRequest('https://api.example.com/chat', {
      params: {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
      },
      callbacks: {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
    });
  }, []);

  return (
    <div>
      <div>Status: {status}</div>
      <div>Lines: {lines.length}</div>
    </div>
  );
};
\`\`\`
`;
