## 场景1：OpenAI 格式

OpenAI 格式使用内置 Provider，使用 OpenAIProvider：

```ts
import { OpenAIProvider } from '@ant-design/x-sdk';

const provider = new OpenAIProvider({
  request: XRequest('https://api.openai.com/v1/chat/completions'),
});
```

## 场景2 DeepSeek 格式

DeepSeek 格式使用内置 Provider，使用 DeepSeekProvider：

```ts
import { DeepSeekProvider } from '@ant-design/x-sdk';

const provider = new DeepSeekProvider({
  request: XRequest('https://api.deepseek.com/v1/chat/completions'),
});
```

## 场景3：自定义 provider

### 1. 自定义错误格式

```ts
transformMessage(info) {
  const { originMessage, chunk } = info || {};
  const data = JSON.parse(chunk.data);
  try {
   if (data.error) {
    return {
      ...originMessage,
      content: data.error.message,
      status: 'error',
    };
  }
  // 其他正常处理逻辑
  } catch (error) {
  return {
      ...originMessage,
      status: 'error',
    };
  }
}
```

### 2. 多字段响应

```ts
interface MyOutput {
  content: string;
  metadata?: {
    confidence: number;
    source: string;
  };
}

transformMessage(info) {
  const { originMessage, chunk } = info || {};

  return {
    ...originMessage,
    content: chunk.content,
    metadata: chunk.metadata, // 可以扩展 MyMessage 类型
  };
}
```
