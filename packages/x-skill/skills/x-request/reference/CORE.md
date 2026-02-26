# 1. Built-in Default Configuration

XRequest has built-in reasonable default configurations, **no additional configuration needed to use**.

<<<<<<< HEAD **Built-in Default Values**: ======= **Built-in Defaults**:

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

- `method: 'POST'`
- `headers: { 'Content-Type': 'application/json' }`

# 2. Security Configuration

## 🔐 Authentication Configuration Comparison

| Environment Type | Configuration Method | Security | Example |
| ---------------- | -------------------- | -------- | ------- |

<<<<<<< HEAD | **Frontend Browser** | ❌ Prohibit direct configuration | Dangerous | Keys will be exposed to users | ======= | **Browser Frontend** | ❌ Prohibit direct configuration | Dangerous | Keys will be exposed to users |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8 | **Node.js** | ✅ Environment variables | Safe | `process.env.API_KEY` | | **Proxy Service** | ✅ Same-origin proxy | Safe | `/api/proxy/chat` |

## 🛡️ Security Configuration Templates

**Node.js Environment Security Configuration**:

```typescript
const nodeConfig = {
  baseURL: 'https://api.openai.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
};
```

**Frontend Environment Security Configuration**:

```typescript
const browserConfig = {
  baseURL: '/api/proxy/openai', // Through same-origin proxy
};
```

# 3. Basic Usage

```typescript
import { XRequest } from '@ant-design/x-sdk';

// ⚠️ Note: The following examples apply to Node.js environment
<<<<<<< HEAD
// For frontend environments, use proxy services to avoid token leakage
=======
// Frontend environment please use proxy service to avoid token leakage
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
const request = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: 'Bearer your-token', // ⚠️ Only for Node.js environment
  },
  params: {
    query: 'Hello',
  },
  manual: true, // ⚠️ Must be set to true when used in provider
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

<<<<<<< HEAD

> ⚠️ **Important Reminder**: When XRequest is used in x-chat-provider or use-x-chat's provider, `manual: true` is a mandatory configuration item, otherwise the request will be sent immediately instead of waiting for invocation.

````
=======
> ⚠️ **Important Reminder**: When XRequest is used in x-chat-provider or use-x-chat's provider, `manual: true` is a required configuration item, otherwise the request will be sent immediately instead of waiting for invocation.
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

### With URL Parameters

```typescript
const request = XRequest('https://your-api.com/chat', {
  method: 'GET',
  params: {
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
  },
});
<<<<<<< HEAD
````

=======

````
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

# 4. Streaming Configuration

## 🔄 Streaming Response Configuration

```typescript
<<<<<<< HEAD
// Streaming response configuration (AI conversation scenarios)
=======
// Streaming response configuration (AI chat scenarios)
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
const streamConfig = {
  params: {
    stream: true, // Enable streaming response
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
  },
  manual: true, // Manual control of requests
};

// Non-streaming response configuration (regular API scenarios)
const jsonConfig = {
  params: {
    stream: false, // Disable streaming response
  },
};
````

# 5. Dynamic Request Headers

```typescript
// ❌ Unsafe: Frontend directly exposes API key
// const request = XRequest('https://your-api.com/chat', {
//   headers: {
//     'Authorization': `Bearer ${apiKey}`, // Don't do this!
//   },
//   params: {
//     messages: [{ role: 'user', content: 'Hello' }],
//   },
// });

// ✅ Safe: Node.js environment uses environment variables
const request = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`, // Safe for Node.js environment
  },
  params: {
    messages: [{ role: 'user', content: 'Hello' }],
  },
});

// ✅ Safe: Frontend uses proxy service
const request = XRequest('/api/proxy/chat', {
  headers: {
    // No Authorization needed, handled by backend proxy
  },
  params: {
    messages: [{ role: 'user', content: 'Hello' }],
  },
});
```

# 6. Custom Stream Transformer

When AI service providers return non-standard formats, use `transformStream` for custom data transformation.

#### Basic Example

```typescript
const request = XRequest('https://api.example.com/chat', {
  params: { message: 'Hello' },
  transformStream: () =>
    new TransformStream({
      transform(chunk, controller) {
        // TextDecoder converts binary data to string
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data !== '[DONE]') {
              // TextEncoder converts string back to binary
              controller.enqueue(new TextEncoder().encode(data));
            }
          }
        }
      },
    }),
});
```

#### Common Transformation Templates

```typescript
// OpenAI format
const openaiStream = () =>
  new TransformStream({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      const data = JSON.parse(text);
      const content = data.choices?.[0]?.delta?.content || '';
      controller.enqueue(new TextEncoder().encode(content));
    },
  });

// Usage example
const request = XRequest(url, {
  params: { message: 'Hello' },
  transformStream: openaiStream,
});
```

> ⚠️ **Note**: ReadableStream can only be locked by one reader, avoid reusing the same instance.

#### 🔍 TextDecoder/TextEncoder Explanation

<<<<<<< HEAD **When do you need them?**

| Scenario                     | Data Type                 | Need Conversion?          |
| ---------------------------- | ------------------------- | ------------------------- |
| **Standard fetch API**       | `Uint8Array` binary       | ✅ Need TextDecoder       |
| **XRequest wrapper**         | May be string             | ❌ May not need           |
| **Custom stream processing** | Depends on implementation | 🤔 Need to determine type |

======= **When are they needed?**

| Scenario                     | Data Type                 | Need Conversion       |
| ---------------------------- | ------------------------- | --------------------- |
| **Standard fetch API**       | `Uint8Array` binary       | ✅ Need TextDecoder   |
| **XRequest wrapper**         | May be string             | ❌ May not need       |
| **Custom stream processing** | Depends on implementation | 🤔 Need to judge type |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

**Practical usage suggestions:**

```typescript
transformStream: () =>
  new TransformStream({
    transform(chunk, controller) {
      // Safe approach: check type first
      const text = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);

<<<<<<< HEAD
      // Now text is definitely a string
=======
      // Now text is definitely string
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
      controller.enqueue(text);
    },
  });
```
