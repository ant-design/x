### 基础使用

```typescript
import { XRequest } from '@ant-design/x-sdk';

// ⚠️ 注意：以下示例适用于 Node.js 环境
// 前端环境请使用代理服务避免 token 泄漏
const request = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: 'Bearer your-token', // ⚠️ 仅 Node.js 环境使用
  },
  params: {
    query: '你好',
  },
  manual: true, // ⚠️ 在provider中使用时必须设置为true
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
```

> ⚠️ **重要提醒**：当 XRequest 用于 x-chat-provider 或 use-x-chat 的 provider 中时，`manual: true` 是必须的配置项，否则会立即发送请求而不是等待调用。

````

### 带 URL 参数

```typescript
const request = XRequest('https://your-api.com/chat', {
  method: 'GET',
  params: {
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
  },
});
````

### 动态请求头

```typescript
// ❌ 不安全：前端直接暴露 API key
// const request = XRequest('https://your-api.com/chat', {
//   headers: {
//     'Authorization': `Bearer ${apiKey}`, // 不要这样做！
//   },
//   params: {
//     messages: [{ role: 'user', content: '你好' }],
//   },
// });

// ✅ 安全：Node.js 环境使用环境变量
const request = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`, // Node.js 环境安全
  },
  params: {
    messages: [{ role: 'user', content: '你好' }],
  },
});

// ✅ 安全：前端使用代理服务
const request = XRequest('/api/proxy/chat', {
  headers: {
    // 不需要 Authorization，由后端代理处理
  },
  params: {
    messages: [{ role: 'user', content: '你好' }],
  },
});
```

### 自定义流转换器

当 AI 服务商返回非标准格式时，使用 `transformStream` 自定义数据转换。

#### 基础示例

```typescript
const request = XRequest('https://api.example.com/chat', {
  params: { message: '你好' },
  transformStream: () =>
    new TransformStream({
      transform(chunk, controller) {
        // TextDecoder 将二进制数据转换为字符串
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data !== '[DONE]') {
              // TextEncoder 将字符串转回二进制
              controller.enqueue(new TextEncoder().encode(data));
            }
          }
        }
      },
    }),
});
```

#### 常用转换模板

```typescript
// OpenAI 格式
const openaiStream = () =>
  new TransformStream({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      const data = JSON.parse(text);
      const content = data.choices?.[0]?.delta?.content || '';
      controller.enqueue(new TextEncoder().encode(content));
    },
  });

// 使用示例
const request = XRequest(url, {
  params: { message: '你好' },
  transformStream: openaiStream,
});
```

> ⚠️ **注意**：ReadableStream 只能被一个 reader 锁定，避免重复使用同一实例。

#### 🔍 TextDecoder/TextEncoder 说明

**什么时候需要它们？**

| 场景               | 数据类型            | 是否需要转换        |
| ------------------ | ------------------- | ------------------- |
| **标准 fetch API** | `Uint8Array` 二进制 | ✅ 需要 TextDecoder |
| **XRequest 封装**  | 可能是字符串        | ❌ 可能不需要       |
| **自定义流处理**   | 取决于实现          | 🤔 需要判断类型     |

**实际使用建议：**

```typescript
transformStream: () =>
  new TransformStream({
    transform(chunk, controller) {
      // 安全做法：先判断类型
      const text = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);

      // 现在 text 一定是字符串了
      controller.enqueue(text);
    },
  });
```
