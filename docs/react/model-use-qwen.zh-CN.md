---
group:
  title: 模型接入
title: 通义千问
order: 1
---

通义千问提供了兼容 OpenAI 的模型推理服务。[阿里云 - 通义千问](https://help.aliyun.com/zh/dashscope/developer-reference/compatibility-of-openai-with-dashscope?spm=a2c4g.11186623.0.i10)

## 什么是「兼容 OpenAI 的模型」？

是指在接口设计和使用方式上与 OpenAI 的 API 保持一致的模型推理服务。

这意味着开发者可以使用与调用 OpenAI 模型相同的代码和方法，来调用这些兼容服务，从而减少开发接入成本。

## 方式一: 使用 useXAgent

该方式是 Ant Dssign X 提供的 **在 React 环境下开箱即用的使用方式**。

```tsx
import { useXAgent } from '@ant-design/x';

// ... react env
const [agent] = useXAgent({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  // 请谨慎在生产环境使用！
  dangerouslyApiKey: 'DASHSCOPE_API_KEY',
});

function request() {
  agent.request(
    {
      // 对话消息
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
      // 是否流式渲染
      stream: true,
    },
    {
      // 成功回调
      onSuccess: (sseChunks) => {
        // 在请求完成时触发
        // 这里将得到已经解析好的 sseChunks
      },
      onError: (error) => {
        // 在请求异常时触发
      },
      onUpdate: (sse) => {
        // 在流更新时触发
        // 这里将得到已经解析好的 sse 对象
      },
    },
  );
}
```

## 方式二: 使用 XRequest

该方式是 Ant Dssign X 提供的 **在 JS 环境下开箱即用的使用方式**。

```tsx
import { XRequest } from '@ant-design/x';

const xRequest = XRequest({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  model: 'qwen-plus',
  // 请谨慎在生产环境使用！
  dangerouslyApiKey: 'DASHSCOPE_API_KEY',
});

function request() {
  xRequest.create(
    {
      // 对话消息
      messages: [
        {
          role: 'user',
          content: 'Hello',
        },
      ],
      // 是否流式渲染
      stream: true,
    },
    {
      // 成功回调
      onSuccess: (sseChunks) => {
        // 在请求完成时触发
        // 这里将得到已经解析好的 sseChunks
      },
      onError: (error) => {
        // 在请求异常时触发
      },
      onUpdate: (sse) => {
        // 在流更新时触发
        // 这里将得到已经解析好的 sse 对象
      },
    },
  );
}
```
