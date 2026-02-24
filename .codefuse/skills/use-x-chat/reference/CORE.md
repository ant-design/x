### 1. 消息管理

#### 获取消息列表

```ts
const { messages } = useXChat({ provider });
// messages 结构: MessageInfo<MessageType>[]
// 实际消息数据在 msg.message 中
```

#### 手动设置消息

```ts
const { setMessages } = useXChat({ provider });

// 清空消息
setMessages([]);

// 添加欢迎消息 - 注意是 MessageInfo 结构
setMessages([
  {
    id: 'welcome',
    message: {
      content: '欢迎使用 AI 助手',
      role: 'assistant',
    },
    status: 'success',
  },
]);
```

#### 更新单条消息

```ts
const { setMessage } = useXChat({ provider });

// 更新消息内容 - 需要更新 message 对象
setMessage('msg-id', {
  message: { content: '新的内容', role: 'assistant' },
});

// 标记为错误 - 更新 status
setMessage('msg-id', { status: 'error' });
```

### 2. 请求控制

#### 发送消息

```ts
const { onRequest } = useXChat({ provider });

// 基础使用
onRequest({ query: '用户问题' });

// 带额外参数
onRequest({
  query: '用户问题',
  context: '之前的对话内容',
  userId: 'user123',
});
```

#### 中断请求

```ts
const { abort, isRequesting } = useXChat({ provider });

// 中断当前请求
<button onClick={abort} disabled={!isRequesting}>
  停止生成
</button>
```

#### 重新发送

重新发送功能允许用户重新生成特定消息的回复，这在AI回答不满意或出现错误时非常有用。

#### 基础使用

```tsx
const ChatComponent = () => {
  const { messages, onReload } = useXChat({ provider });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <span>{msg.message.content}</span>
          {msg.message.role === 'assistant' && (
            <button onClick={() => onReload(msg.id)}>重新生成</button>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### 完整示例：带状态管理的重新发送

```tsx
import { useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Button } from '@ant-design/x';

const ChatWithRegenerate = () => {
  const { messages, onReload, isRequesting } = useXChat({
    provider,
    requestFallback: (_, { error }) => ({
      message: {
        content: error.name === 'AbortError' ? '已取消生成' : '生成失败，请重试',
        role: 'assistant',
      },
      status: 'error',
    }),
  });

  // 跟踪正在重新生成的消息ID
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const handleRegenerate = (messageId: string | number) => {
    setRegeneratingId(messageId);
    onReload(
      messageId,
      {},
      {
        extra: { regenerate: true },
      },
    );
  };

  return (
    <div>
      <Bubble.List
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message.content,
          role: msg.message.role,
          loading: msg.status === 'loading',
          footer: msg.message.role === 'assistant' && (
            <Button
              type="text"
              size="small"
              loading={regeneratingId === msg.id && isRequesting}
              onClick={() => handleRegenerate(msg.id)}
              disabled={isRequesting && regeneratingId !== msg.id}
            >
              {regeneratingId === msg.id ? '生成中...' : '重新生成'}
            </Button>
          ),
        }))}
      />
    </div>
  );
};
```

#### 重新发送的注意事项

1. **只能重新生成AI回复**：通常只能对 `role === 'assistant'` 的消息使用重新发送
2. **状态管理**：重新发送会将对应消息状态设为 `loading`
3. **参数传递**：可以通过 `extra` 参数传递额外信息给Provider
4. **错误处理**：建议配合 `requestFallback` 处理重新发送失败的情况

### 3. 错误处理

#### 统一错误处理

```ts
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, messageInfo }) => {
    // 网络错误
    if (!navigator.onLine) {
      return {
        message: {
          content: '网络连接失败，请检查网络',
          role: 'assistant',
        },
        status: 'error',
      };
    }

    // 用户中断
    if (error.name === 'AbortError') {
      return {
        message: {
          content: '已取消生成',
          role: 'assistant',
        },
        status: 'error',
      };
    }

    // 服务器错误
    return {
      message: {
        content: '服务暂时不可用，请稍后重试',
        role: 'assistant',
      },
      status: 'error',
    };
  },
});
```

### 4. 请求中的消息展示

一般情况下无需配置，默认配合 Bubble 组件的 loading 状态使用，如需自定义 loading 时的内容可参考：

````tsx
const ChatComponent = () => {
  const { messages, onRequest } = useXChat({ provider });

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

#### 自定义请求占位符

```ts
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      message: {
        content: '正在生成中...',
        role: 'assistant',
      },
      status: 'loading',
    };
  },
});
````

### 📊 完整示例项目

```tsx
import React, { useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Sender, Conversations } from '@ant-design/x';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: '新对话' }]);
  const [activeKey, setActiveKey] = useState('1');

  const { messages, onRequest, isRequesting, abort } = useXChat({
    provider,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: '已取消', role: 'assistant', status: 'error' };
      }
      return { content: '请求失败', role: 'assistant', status: 'error' };
    },
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 会话列表 */}
      <Conversations items={conversations} activeKey={activeKey} onActiveChange={setActiveKey} />

      {/* 聊天区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Bubble.List
          items={messages.map((msg) => ({
            key: msg.id,
            content: msg.content,
            role: msg.role,
            loading: msg.status === 'loading',
          }))}
        />

        <Sender
          loading={isRequesting}
          onSubmit={(content) => onRequest({ query: content })}
          onCancel={abort}
          placeholder="输入消息..."
        />
      </div>
    </div>
  );
};
```
