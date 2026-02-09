### 1️⃣ OpenAI 标准格式

**Node.js 环境（安全）**

```typescript
const openAIRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Node.js 环境变量
  },
  params: {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: '你好' }],
    stream: true,
  },
});
```

**前端环境（使用代理）**

```typescript
// ❌ 危险：不要在前端直接配置 token
// const openAIRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
//   headers: {
//     'Authorization': 'Bearer sk-xxxxxxxx', // ❌ 会暴露密钥
//   },
// });

// ✅ 安全：通过同域代理
const openAIRequest = XRequest('/api/proxy/openai', {
  headers: {
    'Content-Type': 'application/json',
    // 不需要 Authorization，由代理服务添加
  },
  params: {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: '你好' }],
    stream: true,
  },
});
```

### 2️⃣ 阿里云百炼（通义千问）

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
        messages: [{ role: 'user', content: '你好' }],
      },
      parameters: {
        result_format: 'message',
        incremental_output: true,
      },
    },
  },
);
```

### 3️⃣ 百度千帆（文心一言）

```typescript
const qianfanRequest = XRequest(
  'https://api.example-baidu.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  {
    params: {
      messages: [{ role: 'user', content: '你好' }],
      stream: true,
    },
  },
);
```

### 4️⃣ 智谱 AI（ChatGLM）

```typescript
const zhipuRequest = XRequest('https://api.example-zhipu.com/api/paas/v4/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'glm-4',
    messages: [{ role: 'user', content: '你好' }],
    stream: true,
  },
});
```

### 5️⃣ 讯飞星火

```typescript
const sparkRequest = XRequest('https://api.example-spark.com/v1/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'generalv3.5',
    messages: [{ role: 'user', content: '你好' }],
    stream: true,
  },
});
```

### 6️⃣ 字节豆包

```typescript
const doubaoRequest = XRequest('https://api.example-doubao.com/api/v3/chat/completions', {
  headers: {
    Authorization: 'Bearer API_KEY',
  },
  params: {
    model: 'doubao-lite-4k',
    messages: [{ role: 'user', content: '你好' }],
    stream: true,
  },
});
```

### 7️⃣ 本地私有 API

```typescript
const localRequest = XRequest('http://localhost:3000/api/chat', {
  headers: {
    'X-API-Key': 'your-local-key',
  },
  params: {
    prompt: '你好',
    max_length: 1000,
    temperature: 0.7,
  },
});
```
