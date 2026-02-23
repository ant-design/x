### 1️⃣ OpenAI Standard Format

**Node.js Environment (Safe)**

```typescript
const openAIRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Node.js environment variable
  },
  params: {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
    stream: true,
  },
});
```

**Frontend Environment (Using Proxy)**

```typescript
// ❌ Dangerous: Don't configure token directly in frontend
// const openAIRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
//   headers: {
//     'Authorization': 'Bearer sk-xxxxxxxx', // ❌ Will expose keys
//   },
// });

// ✅ Safe: Through same-origin proxy
const openAIRequest = XRequest('/api/proxy/openai', {
  params: {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello' }],
    stream: true,
  },
});
```

### 2️⃣ Alibaba Cloud Bailian (Tongyi Qianwen)

```typescript
const bailianRequest = XRequest(
  'https://api.example-aliyun.com/api/v1/services/aigc/text-generation/generation',
  {
    headers: {
      Authorization: 'Bearer API_KEY',
    },
    params: {
      model: 'qwen-turbo',
      input: {
        messages: [{ role: 'user', content: 'Hello' }],
      },
      parameters: {
        result_format: 'message',
        incremental_output: true,
      },
    },
  },
);
```

### 3️⃣ Baidu Qianfan (Wenxin Yiyan)

```typescript
const qianfanRequest = XRequest(
  'https://api.example-baidu.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  {
    params: {
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
    },
  },
);
```

### 4️⃣ Zhipu AI (ChatGLM)

```typescript
const zhipuRequest = XRequest('https://api.example-zhipu.com/api/paas/v4/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'glm-4',
    messages: [{ role: 'user', content: 'Hello' }],
    stream: true,
  },
});
```

### 5️⃣ Xunfei Spark

```typescript
const sparkRequest = XRequest('https://api.example-spark.com/v1/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'generalv3.5',
    messages: [{ role: 'user', content: 'Hello' }],
    stream: true,
  },
});
```

### 6️⃣ ByteDance Doubao

```typescript
const doubaoRequest = XRequest('https://api.example-doubao.com/api/v3/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'doubao-lite-4k',
    messages: [{ role: 'user', content: 'Hello' }],
    stream: true,
  },
});
```

### 7️⃣ Local Private API

```typescript
const localRequest = XRequest('http://localhost:3000/api/chat', {
  headers: {
    'X-API-Key': 'your-local-key',
  },
  params: {
    prompt: 'Hello',
    max_length: 1000,
    temperature: 0.7,
  },
});
```
