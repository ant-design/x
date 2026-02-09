---
name: x-request
version: 2.2.0-beta.1
description: 专注讲解 XRequest 的实际配置和使用，基于官方文档提供准确的配置说明
---

# 🎯 技能定位

**本技能专注解决**：如何正确配置 XRequest 来适配各种流式接口需求。

## 📦 技术栈概览

| 包名                  | 作用            | 使用场景     |
| --------------------- | --------------- | ------------ |
| **@ant-design/x**     | React UI 组件库 | 构建聊天界面 |
| **@ant-design/x-sdk** | 开发工具包      | 数据流管理   |
| **XRequest**          | 请求工具        | 处理网络通信 |

## 🚀 快速开始

### 安装依赖

```bash
# 推荐使用 tnpm
tnpm install @ant-design/x-sdk

# 或使用 npm
npm add @ant-design/x-sdk
```

---

# 📋 XRequest 配置指南

## 基础配置

> ⚠️ **注意**：配置需基于[官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md)实时更新

### 全局配置

XRequest 支持全局配置，只需设置一次即可在多处使用，避免重复配置：

```typescript
import { setXRequestGlobalOptions } from '@ant-design/x-sdk';

// 只需配置一次，全局生效
setXRequestGlobalOptions({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
```

**配置优势**：

- ✅ **一次配置，多处使用**：避免在每个请求中重复设置相同参数
- ✅ **统一管理**：便于维护和修改全局配置
- ✅ **灵活覆盖**：单个请求仍可覆盖全局配置

### 重要说明

| 配置项 | 说明 | 建议 |
| --- | --- | --- |
| `stream` | `true` 返回 `text/event-stream`，`false` 返回 `application/json` | 根据接口需求设置，这是一般模型服务商通用的配置，但是如果为具体的业务默认是 `text/event-stream` 无需配置此字段 |
| `Authorization` | **⚠️ 前端环境禁止配置 token，Node.js 环境可配置** | 详见下方安全指南 |
| `manual` | 是否手动控制发出请求 | **在provider中使用时必须设置为`true`**，否则会立即发送请求 |
| 基础协议 | 基于 `window.fetch` 封装，支持所有 fetch 配置 | 可直接使用 fetch 参数 |

> ⚠️ **关键提醒**：如果不配置 `manual: true` 则会创建一个立即发送的请求。因此如果要放在 provider 里使用，就一定要配置 `manual: true`。

### 🔐 Authorization 安全指南

#### 不同环境的安全配置

**❌ 禁止：前端浏览器环境**

```typescript
// 永远不要在前端直接配置 token
const unsafeConfig = {
  headers: {
    Authorization: 'Bearer your-secret-token', // ❌ 危险！
  },
};
```

**✅ 推荐：Node.js 环境**

```typescript
// Node.js 环境可以安全使用 token
const safeNodeConfig = {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`, // ✅ 安全
  },
};
```

**✅ 推荐：前端环境使用代理**

```typescript
// 前端通过代理服务，不直接暴露 token
const safeBrowserConfig = {
  baseURL: '/api/proxy/chat', // 通过同域代理
  headers: {
    // 不需要 Authorization，由代理服务处理
  },
};
```

---

## 🔧 API详解

> 💡 **提示**：API可能会随版本更新，建议查看[官方文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md)获取最新信息

### 核心API速览

参阅 [API.md](reference/API.md) 获取所有方法。

## 🛠️ 使用示例

参阅 [EXAMPLES.md](reference/EXAMPLES.md) 获取所有示例。

## 一些模型服务商的配置示例

参阅 [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md) 获取所有示例。

## 🔧 调试配置

### 调试模板

```typescript
// 安全的调试配置（Node.js 环境）
const debugRequest = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: `Bearer ${process.env.DEBUG_API_KEY}`,
  },
  params: { query: '测试消息' },
});

// 安全的调试配置（前端环境）
const debugRequest = XRequest('/api/debug/chat', {
  params: { query: '测试消息' },
});
```

### useXChat 集成安全指南

**⚠️ 重要警告：使用 useXChat 是一定是前端环境，XRequest 配置中万万不可包含 Authorization！**

```typescript
// ❌ 极度危险：useXChat 前端使用时的错误配置
import { useXChat } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';

const unsafeRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
  headers: {
    Authorization: 'Bearer sk-xxxxxxxxxxxxxx', // ❌ 密钥会直接暴露给浏览器
  },
  manual: true,
});

// 这样使用会导致密钥泄漏！
const { messages, sendMessage } = useXChat({
  request: unsafeRequest,
});
```

**✅ 安全做法：前端 useXChat 使用代理服务**

```typescript
// 前端安全配置
import { useXChat } from '@ant-design/x';
import { XRequest } from '@ant-design/x-sdk';

const safeRequest = XRequest('/api/proxy/openai', {
  headers: {
    'Content-Type': 'application/json',
    // 不需要 Authorization
  },
  params: {
    model: 'gpt-3.5-turbo',
    stream: true,
  },
  manual: true,
});

const { messages, sendMessage } = useXChat({
  request: safeRequest,
});
```

**✅ Node.js 环境安全配置**

```typescript
// Node.js 环境可以安全使用密钥
import { XRequest } from '@ant-design/x-sdk';

const nodeRequest = XRequest('https://api.example-openai.com/v1/chat/completions', {
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  manual: true,
});
```

---

# ✅ 配置检查清单

使用 XRequest 前请确认以下**全局配置**已正确设置（无需重复设置相同配置）：

## 安全配置检查（⚠️ 必看）

### 环境安全检查

| 检查项       | 浏览器环境      | Node.js 环境  | 说明                                          |
| ------------ | --------------- | ------------- | --------------------------------------------- |
| API 地址     | ✅              | ✅            | 已在 `XRequest(baseURL)` 中设置               |
| **认证信息** | ❌ **禁止配置** | ✅ **可配置** | **前端禁止配置 Authorization，Node.js 可用**  |
| 请求方法     | ✅              | ✅            | 已在全局配置中设置，默认为 POST               |
| Content-Type | ✅              | ✅            | 已在全局配置中设置，默认为 `application/json` |
| 请求体格式   | ✅              | ✅            | 已在 `params` 参数中设置                      |
| 接口可用性   | ✅              | ✅            | 已通过测试验证                                |
| manual配置   | ✅              | ✅            | **在provider中使用时必须设置为`true`**        |

### 安全验证工具

```typescript
// 使用前运行此检查
const validateSecurity = (config: any) => {
  const isBrowser = typeof window !== 'undefined';
  const hasAuth = config.headers?.Authorization || config.headers?.authorization;

  if (isBrowser && hasAuth) {
    throw new Error('❌ 前端环境禁止配置 Authorization，存在密钥泄漏风险！');
  }

  console.log('✅ 安全配置检查通过');
  return true;
};

// 使用示例
validateSecurity({
  headers: {
    'Content-Type': 'application/json',
    // 不要包含 Authorization
  },
});
```

**注意**：以上配置只需在全局配置中设置一次，后续使用无需重复配置。

**代码质量检查**：

- ✅ 确保所有 TypeScript 类型正确
- ✅ 删除未使用的导出项
- ✅ 类名和接口类型匹配
- ✅ 使用的方法和功能正确

# 🚨 开发规则

## 测试用例规则

- **如果用户没有明确需要测试用例，则不要添加测试文件**
- **仅在用户明确要求时才创建测试用例**

## 代码质量规则

- **完成编写后必须检查类型**：运行 `tsc --noEmit` 确保无类型错误
- **删除无用导出**：清理所有未使用的 `export` 语句和类型定义
- **保持代码整洁**：移除所有未使用的变量和导入

## 📋 技能定位和使用场景

x-request 是通用配置工具，可以独立使用，也可以配合其他技能：

必要时需要主动调用 x-chat-provider 和 use-x-chat

```
x-request → x-chat-provider → use-x-chat
```

| 使用方式 | 配合技能 | 作用 | 示例 |
| --- | --- | --- | --- |
| **独立使用** | 无 | 直接发起网络请求 | 测试接口可用性 |
| **配合 x-chat-provider** | x-chat-provider | 为自定义 Provider 配置请求 | 配置私有 API |
| **配合 use-x-chat** | use-x-chat | 为内置 Provider 配置请求 | 配置 OpenAI API |
| **完整 AI 应用** | x-request → x-chat-provider → use-x-chat | 为整个系统配置请求 | 完整 AI 对话应用 |

## 🔗 相关资源

| 资源名称 | 链接 | 说明 | 依赖关系 |
| --- | --- | --- | --- |
| **官方文档** | [XRequest 文档](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md) | 最新功能说明 | 独立资源 |
| **x-chat-provider** | 自定义 Chat Provider | 创建自定义聊天提供者 | **需要** x-request 配置请求 |
| **use-x-chat** | useXChat Hook 使用 | 消息管理最佳实践 | **需要** x-request 配置请求 |
