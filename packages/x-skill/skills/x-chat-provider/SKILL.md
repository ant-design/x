---
name: x-chat-provider
version: 2.2.0-beta.1
description: 专注于自定义 Chat Provider 的实现，帮助将任意流式接口适配为 Ant Design X 标准格式
---

# 🎯 技能定位

**本技能专注解决一个问题**：如何将你的流式接口快速适配为 Ant Design X 的 Chat Provider。

**不涉及的**：useXChat 的使用教程（那是另一个技能）。

## 📦 技术栈概览

### Ant Design X 生态

| 包名                       | 作用            | 使用场景     |
| -------------------------- | --------------- | ------------ |
| **@ant-design/x**          | React UI 组件库 | 构建聊天界面 |
| **@ant-design/x-sdk**      | 开发工具包      | 数据流管理   |
| **@ant-design/x-markdown** | Markdown 渲染器 | 内容展示     |

> ⚠️ **重要提醒**：这三个包功能不同，请从正确的包导入所需功能

### 核心概念

- **Chat Provider**：数据适配器，将任意接口转换为标准格式
- **useXChat**：React Hook，管理对话状态
- **XRequest**：请求工具，处理网络通信

## 🚀 快速开始

### 依赖管理

#### 📋 系统要求

- **@ant-design/x-sdk**: 2.2.1+（自动安装）
- **@ant-design/x**: 最新版（UI组件，自动安装）

#### ⚠️ 版本问题自动修复

如果检测到版本不匹配，技能会自动：

- ✅ 当前安装的版本
- ✅ 是否符合最低要求（≥2.2.1）
- ✅ 提供修复建议
- ✅ 友好的错误提示

**🛠️ 版本问题修复**

如果检测到版本不匹配，技能会提供具体的修复命令：

```bash
# 自动提示的修复命令
npm install @ant-design/x-sdk@latest
```

### 内置 Provider

Ant Design X 已内置以下 Provider：

- **OpenAI Provider**：适配 OpenAI API
- **DeepSeek Provider**：适配 DeepSeek API

### 何时需要自定义 Provider

✅ **需要自定义**：

- 使用私有 API
- 接口格式特殊
- 需要额外处理逻辑

❌ **不需要自定义**：

- 使用标准 OpenAI 格式
- 使用标准 DeepSeek 格式

# 📋 三步实现自定义 Provider

## 步骤1：分析接口格式（2分钟）

**收集你的接口信息**：

- 接口URL：`https://your-api.com/chat`
- 请求格式：POST JSON
- 响应格式：Server-Sent Events

**示例接口格式**：

```ts
// 请求格式
{
  "query": "用户问题",
  "context": "对话历史"
}

// 响应格式
data: {"content": "回答片段"}
data: {"content": "继续回答"}
data: [DONE]
```

## 步骤2：创建 Provider 类（5分钟）

如果用户要求使用内置 Provider，直接使用内置的 OpenAI 或 DeepSeek Provider。

**🚨 强制要求**：**禁止实现 request 方法**！必须让 XRequest 处理所有网络请求，这是最佳实践！

实现 AbstractChatProvider 这个抽象类，**只需要实现三个抽象方法**，网络请求完全交给 XRequest 处理。

**复制模板，修改3个地方即可**：

```ts
import { AbstractChatProvider } from '@ant-design/x-sdk';

// 1. 根据你的接口修改这三个类型
interface MyInput {
  query: string;
  model?: string;
  stream?: boolean;
}

interface MyOutput {
  content: string;
}

interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

// 2. 修改类名，保持其他不变
export class MyChatProvider extends AbstractChatProvider<MyMessage, MyInput, MyOutput> {
  transformParams(
    requestParams: Partial<Input>,
    options: XRequestOptions<Input, Output, MyMessage>,
  ): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }

  transformLocalMessage(requestParams: Partial<MyInput>): MyMessage {
    return {
      content: requestParams.query || '',
      role: 'user',
      timestamp: Date.now(),
    };
  }

  transformMessage(info): MyMessage {
    const { originMessage, chunk } = info || {};

    // 3. 根据你的响应格式修改这里
    if (!chunk?.content || chunk.content === '[DONE]') {
      return { ...originMessage, status: 'success' };
    }

    return {
      ...originMessage,
      content: `${originMessage.content || ''}${chunk.content || ''}`,
      role: 'assistant',
      status: 'loading',
    };
  }
}
```

## 步骤3：检查文件（1分钟）

**检查文件内容**：

- 类名是否正确
- 接口类型是否匹配
- 使用的方法和功能是否正确

## 步骤4：使用 Provider（1分钟）

**使用 XRequest 创建 Provider 实例**：

XRequest

```ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// 使用 XRequest 配置你的 API
// 这部分由 x-request 技能负责
const request = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: 'Bearer your-token', // 如果需要认证
  },
  manual: true,
  param: {
    model: 'openai/gpt-4o',
    stream: true,
  },
  // 其他 XRequest 配置...
});

// 创建 Provider 实例 - 直接传入 XRequest 实例
const provider = new MyChatProvider({
  request,
});

// 现在可以配合 useXChat 使用了
// 这部分由 use-x-chat 技能负责
```

> ✅ **优势**：使用 XRequest 后，你无需关心网络请求的具体实现，XRequest 会处理所有底层细节！

# 🔧 常见场景适配

参阅 [EXAMPLES.md](reference/EXAMPLES.md) 获取所有示例。

# 📋 联合技能使用

| 技能 | 前置要求 | 后续配合 | 使用场景 |
| --- | --- | --- | --- |
| use-x-chat | 需要 Provider（自建或内置） | 可配合 x-request 配置请求 | 构建AI对话界面 |
| x-chat-provider | 无 | **必须**配合 use-x-chat 使用 | 适配私有API接口 |
| x-request | 无 | 可配合任意技能 | 配置请求参数、认证等 |

## 🎯 组合使用场景

### 场景1：完整AI对话应用

```
x-chat-provider → use-x-chat → x-request
```

- 先用 x-chat-provider 创建 Provider
- 再用 use-x-chat 使用 Provider
- 最后用 x-request 配置请求参数

### 场景2：仅创建Provider

```
x-chat-provider
```

- 只需要创建自定义 Provider
- 后续配合其他框架使用

### 场景3：使用内置Provider

```
use-x-chat → x-request
```

- 使用内置 Provider（如 OpenAI）
- 用 x-request 配置请求参数

## ⚠️ 重要提醒

### 🚨 强制规则：禁止自己写 request 方法！

**强制要求**：

- 🚫 **绝对禁止**在 Provider 中实现 `request` 方法
- ✅ **必须使用** XRequest 来处理所有网络请求
- ✅ **只关注**数据转换逻辑（transformParams、transformLocalMessage、transformMessage）

**❌ 严重错误（绝对禁止）**：

```ts
// ❌ 严重错误：自己实现 request 方法
class MyProvider extends AbstractChatProvider {
  async request(params: any) {
    // 禁止自己写网络请求逻辑！
    const response = await fetch(this.url, { ... });
    return response;
  }
}
```

**✅ 强制要求（唯一正确方式）**：

```ts
// ✅ 强制要求：使用 XRequest，禁止实现 request 方法
class MyProvider extends AbstractChatProvider {
  // 禁止实现 request 方法！
  transformParams(params) {
    /* ... */
  }
  transformLocalMessage(params) {
    /* ... */
  }
  transformMessage(info) {
    /* ... */
  }
}

// 强制使用 XRequest：
const provider = new MyProvider({
  request: XRequest('https://your-api.com/chat'),
});
```

# ⚡ 快速检查清单

创建 Provider 前，确认：

- [ ] 已获取接口文档
- [ ] 已确认请求/响应格式
- [ ] 已定义好消息结构
- [ ] 已测试接口可用性
- [ ] **已决定使用 XRequest**（避免自己写 request 方法！）

完成后：

- [ ] Provider 类可以正常实例化
- [ ] **只实现了三个必需方法**（transformParams、transformLocalMessage、transformMessage）
- [ ] **绝对禁止实现 request 方法**（强制使用 XRequest 处理网络请求）
- [ ] 已处理边界情况（空数据、错误响应）
- [ ] **类型检查通过**（确保所有 TypeScript 类型正确）
- [ ] **删除无用导出**（清理未使用的导出项）

# 🚨 开发规则

## 测试用例规则

- **如果用户没有明确需要测试用例，则不要添加测试文件**
- **仅在用户明确要求时才创建测试用例**

## 代码质量规则

- **完成编写后必须检查类型**：运行 `tsc --noEmit` 确保无类型错误
- **删除无用导出**：清理所有未使用的 `export` 语句和类型定义
- **保持代码整洁**：移除所有未使用的变量和导入

# 参考文件

### SDK文档

- useXChat: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.zh-CN.md
- XRequest: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md
- chat provider: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.zh-CN.md

### 示例代码

- custom provider width ui: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx
