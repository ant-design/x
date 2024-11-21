---
group:
  title: Advanced
order: 2
title: Integrating Services Compatible with OpenAI Models
---

## What is a "Service Compatible with OpenAI Models"?

It refers to a model inference service whose interface design and usage are consistent with OpenAI's API.

This means developers can use the same code and methods as they would for OpenAI models to interact with these compatible services, significantly reducing integration costs.

Examples of services compatible with OpenAI models:

- [Alibaba Cloud - Tongyi Qianwen](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope?spm=a2c4g.11186623.0.i10)

## Method 1: Using `useXAgent`

This method is **a ready-to-use solution for React environments** provided by Ant Design X.

```tsx
import { useXAgent } from '@ant-design/x';

// ... react env
const [agent] = useXAgent({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  // Use cautiously in production!
  dangerouslyApiKey: 'DASHSCOPE_API_KEY',
});

function request() {
  agent.request(
    {
      // Conversation messages
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
      // Enable streaming
      stream: true,
    },
    {
      // Success callback
      onSuccess: (sseChunks) => {
        // Triggered when the request completes
        // This will contain the parsed sseChunks
      },
      onError: (error) => {
        // Triggered in case of an error
      },
      onUpdate: (sse) => {
        // Triggered during stream updates
        // This will contain the parsed SSE object
      },
    },
  );
}
```

## Method 2: Using `XRequest`

This method is **a ready-to-use solution for JavaScript environments** provided by Ant Design X.

```tsx
import { XRequest } from '@ant-design/x';

const xRequest = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  // Use cautiously in production!
  dangerouslyApiKey: 'DASHSCOPE_API_KEY',
});

function request() {
  xRequest.create(
    {
      // Conversation messages
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
      // Enable streaming
      stream: true,
    },
    {
      // Success callback
      onSuccess: (sseChunks) => {
        // Triggered when the request completes
        // This will contain the parsed sseChunks
      },
      onError: (error) => {
        // Triggered in case of an error
      },
      onUpdate: (sse) => {
        // Triggered during stream updates
        // This will contain the parsed SSE object
      },
    },
  );
}
```
