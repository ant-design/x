---
name: use-x-chat
version: 2.7.0
description: 专注讲解如何使用 useXChat Hook，包括自定义 Provider 的集成、消息管理、错误处理、多会话管理等
---

# 🎯 技能定位

> **核心定位**：使用 `useXChat` Hook 构建专业级 AI 对话应用 **前置要求**：已具备自定义 Chat Provider（参考 [x-chat-provider 技能](../x-chat-provider)）

## 目录导航

- [🚀 快速开始](#-快速开始)
- [🧩 核心概念](#-核心概念)
  - [数据模型](#数据模型)
  - [配置项](#useXChat-配置项)
  - [返回值](#useXChat-返回值)
- [🔧 核心功能详解](#-核心功能详解)
- [🗂️ 多会话管理](#️-多会话管理)
- [📋 使用前提和依赖](#-使用前提和依赖)
- [🚨 开发规则](#-开发规则)
- [🔗 参考资源](#-参考资源)

# 🚀 快速开始

## 1. 依赖管理

- **@ant-design/x-sdk**: 2.2.2+
- **@ant-design/x**: 最新版（UI 组件）

```bash
npm install @ant-design/x-sdk@latest @ant-design/x@latest
```

## 2. 三步集成

### 步骤1：准备 Provider

由 x-chat-provider 技能负责。注意 `XRequest` 必须传 `manual: true`：

```ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// ⚠️ manual: true 是必须的
const provider = new MyChatProvider({
  request: XRequest('https://your-api.com/chat', { manual: true }),
});
```

### 步骤2：基础使用

```tsx
import { useXChat } from '@ant-design/x-sdk';

const ChatComponent = () => {
  const { messages, onRequest, isRequesting } = useXChat({
    provider,
    requestPlaceholder: (_, { messages }) => ({
      content: '正在思考中...',
      role: 'assistant',
    }),
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || '已取消回复', role: 'assistant' };
      }
      return { content: '网络异常，请稍后重试', role: 'assistant' };
    },
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.message.role}: {msg.message.content}
        </div>
      ))}
      <button onClick={() => onRequest({ query: '你好' })}>发送</button>
    </div>
  );
};
```

### 步骤3：UI 集成

> ⚠️ `messages` 是 `MessageInfo<ChatMessage>[]`，不能直接传给 `Bubble.List`。需要映射为 `{ key, role, content, loading }` 格式。 **`Bubble.List` 使用 `role` 属性**（不是 `roles`）配置角色样式。

```tsx
import { Bubble, Sender } from '@ant-design/x';

const ChatUI = () => {
  const { messages, onRequest, isRequesting, abort } = useXChat({ provider });

  return (
    <div style={{ height: 600 }}>
      <Bubble.List
        // ✅ 正确：使用 role（不是 roles）
        role={{
          user: { placement: 'end' },
          assistant: { placement: 'start' },
        }}
        items={messages.map(({ id, message, status }) => ({
          key: id,
          role: message.role, // 用于匹配 role 配置
          content: message.content, // 消息内容
          loading: status === 'loading', // 加载动画
        }))}
      />
      <Sender
        loading={isRequesting}
        onSubmit={(content) => onRequest({ query: content })}
        onCancel={abort}
      />
    </div>
  );
};
```

#### 当 ChatMessage 是对象类型时（非字符串）

当 `ChatMessage` 是复杂对象（如有 `content`、`attachments` 等字段），需用 `contentRender` 渲染：

```tsx
<Bubble.List
  role={{
    assistant: {
      placement: 'start',
      // contentRender 接收 content 参数，就是 message 字段本身
      contentRender(content: MyMessage) {
        return (
          <div>
            <div>{content.content}</div>
            {content.attachments?.map((a) => (
              <FileCard key={a.url} name={a.name} />
            ))}
          </div>
        );
      },
    },
    user: {
      placement: 'end',
      contentRender(content: MyMessage) {
        return content.content;
      },
    },
  }}
  items={messages.map(({ id, message, status }) => ({
    key: id,
    role: message.role,
    content: message, // ⚠️ 传整个 message 对象，contentRender 会处理渲染
    loading: status === 'loading',
  }))}
/>
```

# 🧩 核心概念

## 数据模型

> ⚠️ **重要**：`messages` 类型是 `MessageInfo<ChatMessage>[]`，消息内容在 `msg.message` 中

```ts
interface MessageInfo<ChatMessage> {
  id: number | string; // 消息唯一标识
  message: ChatMessage; // 实际消息内容（你的 ChatMessage 类型）
  status: MessageStatus; // 消息状态
  extraInfo?: AnyObject; // 扩展信息（注意：是 extraInfo，不是 extra）
}

type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
// local: 用户发送的本地消息
// loading: AI 回复占位中（requestPlaceholder 对应此状态）
// updating: AI 正在流式输出
// success: AI 回复完成
// error: 请求失败
// abort: 用户主动取消
```

## useXChat 配置项

| 配置项 | 类型 | 说明 |
| --- | --- | --- |
| `provider` | `AbstractChatProvider<ChatMessage, Input, Output>` | **必填**，Provider 实例 |
| `conversationKey` | `string` | 会话唯一标识，多会话必填 |
| `defaultMessages` | `DefaultMessageInfo[] \| () => ... \| async () => ...` | 默认展示消息，支持异步加载 |
| `requestPlaceholder` | `ChatMessage \| (requestParams, { messages }) => ChatMessage` | 请求中的占位消息 |
| `requestFallback` | `ChatMessage \| (requestParams, { error, errorInfo, messages, messageInfo }) => ChatMessage \| Promise<ChatMessage>` | 请求失败/中止时的兜底消息 |
| `parser` | `(message: ChatMessage) => BubbleMessage \| BubbleMessage[]` | 将 ChatMessage 转为组件消费格式，支持一转多 |

> `requestFallback` 中 `messageInfo` 类型为 `MessageInfo<ChatMessage>`，是请求失败时正在更新的那条消息。 `requestFallback` 同时处理网络错误（`error`）和主动取消（`error.name === 'AbortError'`）。

## useXChat 返回值

| 返回值 | 类型 | 说明 |
| --- | --- | --- |
| `messages` | `MessageInfo<ChatMessage>[]` | 消息列表，需映射后传给 `Bubble.List` |
| `parsedMessages` | `MessageInfo<ParsedMessage>[]` | 经过 `parser` 转译后的消息列表（有 parser 时用这个） |
| `onRequest` | `(params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | 添加消息并触发请求 |
| `isRequesting` | `boolean` | 是否正在请求 |
| `abort` | `() => void` | 中止当前请求 |
| `setMessages` | `(messages: Partial<MessageInfo<ChatMessage>>[]) => void` | 直接修改消息列表，不触发请求 |
| `setMessage` | `(id: string \| number, info: Partial<MessageInfo<ChatMessage>>) => void` | 修改单条消息，不触发请求 |
| `removeMessage` | `(id: string \| number) => boolean` | 删除某条消息，返回是否删除成功 |
| `onReload` | `(id: string \| number, params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | 重新生成某条 AI 回复 |
| `queueRequest` | `(conversationKey: string \| symbol, params: Partial<Input>, opts?: { extraInfo: AnyObject }) => void` | 队列化请求，等待会话初始化后发送 |
| `isDefaultMessagesRequesting` | `boolean` | 默认消息是否在异步加载中 |

# 🔧 核心功能详解

核心功能参考 [CORE.md](reference/CORE.md)

# 🗂️ 多会话管理

### useXConversations Hook

`useXConversations` 是 `@ant-design/x-sdk` 提供的会话列表管理 Hook，与 `useXChat` 配合实现多会话：

```ts
import { useXConversations } from '@ant-design/x-sdk';
import type { ConversationData } from '@ant-design/x-sdk';

const {
  conversations, // ConversationData[]：会话列表
  activeConversationKey, // string：当前激活会话的 key
  setActiveConversationKey, // (key: string) => void：切换会话
  addConversation, // ( ConversationData, placement?) => boolean
  removeConversation, // (key: string) => boolean
  setConversation, // (key: string, data: ConversationData) => boolean
  getConversation, // (key: string) => ConversationData | undefined
  setConversations, // (list: ConversationData[]) => void
  getMessages, // (key: string) => MessageInfo[] | undefined（跨组件读取消息）
} = useXConversations({
  defaultConversations: [
    { key: 'conv-1', label: '会话 1' },
    { key: 'conv-2', label: '会话 2' },
  ],
  defaultActiveConversationKey: 'conv-1',
});
```

### 多会话完整模式

```tsx
import { useXChat, useXConversations } from '@ant-design/x-sdk';
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';
import { Bubble, Conversations, Sender } from '@ant-design/x';
import React, { useEffect, useRef } from 'react';

// ⚠️ 每个会话必须有独立的 Provider 实例，否则状态会混用
const providerCache = new Map<string, OpenAIChatProvider>();

function getProvider(key: string): OpenAIChatProvider {
  if (!providerCache.has(key)) {
    providerCache.set(
      key,
      new OpenAIChatProvider({
        request: XRequest(BASE_URL, { manual: true, params: { model: 'gpt-4o', stream: true } }),
      }),
    );
  }
  return providerCache.get(key)!;
}

const App = () => {
  const senderRef = useRef<any>(null);

  const { conversations, activeConversationKey, setActiveConversationKey, addConversation } =
    useXConversations({
      defaultConversations: [{ key: 'conv-1', label: '新对话' }],
      defaultActiveConversationKey: 'conv-1',
    });

  const { messages, onRequest, isRequesting, abort, queueRequest } = useXChat({
    provider: getProvider(activeConversationKey),
    conversationKey: activeConversationKey,
    // 异步加载默认消息
    defaultMessages: async ({ conversationKey }) => {
      // 根据 conversationKey 从服务器加载历史消息
      return [];
    },
    requestFallback: (_, { error, messageInfo }) => {
      if (error.name === 'AbortError') {
        return { content: messageInfo?.message?.content || '已取消', role: 'assistant' };
      }
      return { content: '请求失败', role: 'assistant' };
    },
  });

  // 切换会话时清空输入框
  useEffect(() => {
    senderRef.current?.clear?.();
  }, [activeConversationKey]);

  const handleNewConversation = () => {
    const newKey = `conv-${Date.now()}`;
    addConversation({ key: newKey, label: `新对话 ${conversations.length + 1}` });
    setActiveConversationKey(newKey);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Conversations
        items={conversations}
        activeKey={activeConversationKey}
        onActiveChange={setActiveConversationKey}
        creation={{ onClick: handleNewConversation }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Bubble.List
          role={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
          items={messages.map(({ id, message, status }) => ({
            key: id,
            role: message.role,
            content: message.content,
            loading: status === 'loading',
          }))}
        />
        <Sender
          ref={senderRef}
          loading={isRequesting}
          onCancel={abort}
          onSubmit={(val) => {
            onRequest({ messages: [{ role: 'user', content: val }] });
          }}
        />
      </div>
    </div>
  );
};
```

### queueRequest：会话切换后延迟发送

```tsx
// 场景：用户切换到新会话，同时触发一条初始消息
// queueRequest 会等 defaultMessages 异步加载完成后，再发送请求

const handleNewConversationWithFirstMessage = () => {
  const newKey = `conv-${Date.now()}`;
  addConversation({ key: newKey, label: '新对话' });
  setActiveConversationKey(newKey);

  // 把消息加入队列，等 newKey 会话的 defaultMessages 加载完后自动发送
  queueRequest(newKey, {
    messages: [{ role: 'user', content: '你好！请自我介绍' }],
  });
};
```

# 📋 使用前提和依赖

| 使用场景        | 需要的技能/Provider                          | 使用顺序        |
| --------------- | -------------------------------------------- | --------------- |
| **私有API适配** | x-chat-provider → use-x-chat                 | 先创建 Provider |
| **标准API**     | 内置 Provider + use-x-chat                   | 直接使用        |
| **多会话**      | Provider 工厂 + useXConversations + useXChat | 配合使用        |

# 🚨 开发规则

使用 use-x-chat 前必须确认：

- [ ] **已有 Provider**（自定义或内置 Provider）
- [ ] Provider 中的 XRequest 已配置 `manual: true`
- [ ] 已了解 `MessageInfo` 数据结构（消息内容在 `msg.message` 中）
- [ ] `Bubble.List` 使用 `role` 属性（**不是 `roles`**）
- [ ] 多会话场景：每个会话有独立的 Provider 实例

### 测试用例规则

- **如果用户没有明确需要测试用例，则不要添加测试文件**

### 代码质量规则

- **完成编写后必须检查类型**：运行 `tsc --noEmit` 确保无类型错误
- **保持代码整洁**：移除所有未使用的变量和导入

# 🔗 参考资源

## 📚 核心参考文档

- [API.md](reference/API.md) - 完整的 API 参考文档
- [CORE.md](reference/CORE.md) - 核心功能详解
- [EXAMPLES.md](reference/EXAMPLES.md) - 实战示例代码

## 🌐 SDK 官方文档

- [useXChat 官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.zh-CN.md)
- [XRequest 官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md)
- [Chat Provider 官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.zh-CN.md)

## 💻 示例代码

- [with-x-chat.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-conversations/with-x-chat.tsx) - 多会话完整示例
- [openai-callback.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-chat/openai-callback.tsx) - callbacks + removeMessage 示例
- [developer.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/x-chat/developer.tsx) - 含 developer 角色的系统提示示例
- [custom-provider-width-ui.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx) - 自定义 Provider 完整示例
