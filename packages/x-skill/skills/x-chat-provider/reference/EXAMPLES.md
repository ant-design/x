## Scenario1: OpenAI Format

OpenAI format uses built-in Provider, use OpenAIProvider:

```ts
import { OpenAIProvider } from '@ant-design/x-sdk';

const provider = new OpenAIProvider({
  request: XRequest('https://api.openai.com/v1/chat/completions'),
});
```

## Scenario2 DeepSeek Format

DeepSeek format uses built-in Provider, use DeepSeekProvider:

```ts
import { DeepSeekProvider } from '@ant-design/x-sdk';

const provider = new DeepSeekProvider({
  request: XRequest('https://api.deepseek.com/v1/chat/completions'),
});
```

## Scenario3: Custom Provider

### 1. Custom Error Format

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
  // Other normal processing logic
  } catch (error) {
  return {
      ...originMessage,
      status: 'error',
    };
  }
}
```

### 2. Multi-field Response

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
    metadata: chunk.metadata, // Can extend MyMessage type
  };
}
```
