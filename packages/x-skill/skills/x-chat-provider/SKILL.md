---
name: x-chat-provider
version: 2.2.2-beta.6
description: Focuses on implementing custom Chat Providers to adapt any streaming API to Ant Design X standard format
---

# 🎯 Skill Positioning

**This skill focuses on solving one problem**: How to quickly adapt your streaming API to Ant Design X's Chat Provider.

**What it doesn't cover**: useXChat usage tutorials (that's another skill).

## Table of Contents

- [📦 Tech Stack Overview](#-tech-stack-overview)
  - [Ant Design X Ecosystem](#ant-design-x-ecosystem)
  - [Core Concepts](#core-concepts)
- [🚀 Quick Start](#-quick-start)
  - [Dependency Management](#dependency-management)
  - [Built-in Providers](#built-in-providers)
  - [When to Use Custom Provider](#when-to-use-custom-provider)
- [📋 Four Steps to Implement Custom Provider](#-four-steps-to-implement-custom-provider)
  - [Step 1: Analyze Interface Format](#step-1-analyze-interface-format)
  - [Step 2: Create Provider Class](#step-2-create-provider-class)
  - [Step 3: Check and Validate](#step-3-check-and-validate)
  - [Step 4: Use Provider](#step-4-use-provider)
- [🔧 Common Scenario Adaptation](#-common-scenario-adaptation)
- [📋 Combined Skill Usage](#-combined-skill-usage)
  - [Scenario 1: Complete AI Chat Application](#scenario-1-complete-ai-chat-application)
  - [Scenario 2: Provider Creation Only](#scenario-2-provider-creation-only)
  - [Scenario 3: Using Built-in Provider](#scenario-3-using-built-in-provider)
- [⚠️ Important Reminders](#️-important-reminders)
  - [Mandatory Rule: Never Implement request Method](#mandatory-rule-never-implement-request-method)
- [⚡ Quick Checklist](#-quick-checklist)
- [🚨 Development Rules](#-development-rules)
- [Reference Files](#reference-files)

## 📦 Tech Stack Overview

### 🏗️ Ant Design X Ecosystem Architecture

| Layer | Package Name | Core Purpose | Typical Use Cases |
| --- | --- | --- | --- |
| **UI Layer** | **@ant-design/x** | React UI component library | Building chat interfaces, bubbles, input boxes |
| **Logic Layer** | **@ant-design/x-sdk** | Development toolkit | Data flow management, Provider, Hook |
| **Render Layer** | **@ant-design/x-markdown** | Markdown renderer | Content display, code highlighting |

> ⚠️ **Important Reminder**: These three packages have different functional positioning. Please import required features from the correct package.
>
> ```ts
> // ✅ Correct import examples
> import { Bubble } from '@ant-design/x'; // UI component
> import { AbstractChatProvider } from '@ant-design/x-sdk'; // Provider base class
> import { XRequest } from '@ant-design/x-sdk'; // Request tool
> ```

### 🔑 Core Concept Analysis

```mermaid
graph LR
    A[Original API Interface] -->|Adapt| B[Chat Provider]
    B -->|Provide Data| C[useXChat Hook]
    C -->|Render| D[Ant Design X UI]
    E[XRequest] -->|Network Request| B
```

| Concept | Role Positioning | Core Responsibilities | Use Cases |
| --- | --- | --- | --- |
| **Chat Provider** | 🔄 Data Adapter | Convert any interface format to Ant Design X standard format | Private API adaptation, format conversion |
| **useXChat** | ⚛️ React Hook | Manage conversation state, message flow, request control | Building AI chat interfaces |
| **XRequest** | 🌐 Request Tool | Handle all network communication, authentication, error handling | Unified request management |

## 🚀 Quick Start

### 📋 Environment Preparation

#### System Requirements

| Dependency Package | Version Requirement | Auto Install | Purpose |
| --- | --- | --- | --- |
| **@ant-design/x-sdk** | ≥2.2.1 | ✅ | Core SDK, includes Provider and Hook |
| **@ant-design/x** | Latest | ✅ | UI component library, build chat interface |

#### 🛠️ One-click Environment Check

```bash
# Auto check and fix version
npm ls @ant-design/x-sdk
# If version doesn't match, auto prompt:
npm install @ant-design/x-sdk@latest
```

#### 📊 Version Compatibility Matrix

| SDK Version | Supported Features         | Compatibility           |
| ----------- | -------------------------- | ----------------------- |
| ≥2.2.1      | Complete Provider features | ✅ Recommended          |
| 2.2.0       | Basic features             | ⚠️ Partially compatible |
| <2.2.0      | Not supported              | ❌ Needs upgrade        |

### 🎯 Provider Selection Decision Tree

```mermaid
graph TD
    A[Start] --> B{Using Standard API?}
    B -->|Yes| C[Use Built-in Provider]
    B -->|No| D{Private API?}
    D -->|Yes| E[Custom Provider]
    D -->|No| F{Special Format?}
    F -->|Yes| E
    F -->|No| C

    C --> G[OpenAI/DeepSeek Provider]
    E --> H[Four Steps to Create Custom Provider]
```

### 🏭 Built-in Provider Overview

#### Out-of-the-box Providers

| Provider Type         | Use Cases             | Usage Method          |
| --------------------- | --------------------- | --------------------- |
| **OpenAI Provider**   | Standard OpenAI API   | Direct import and use |
| **DeepSeek Provider** | Standard DeepSeek API | Direct import and use |

#### Quick Decision Guide

| Scenario                     | Recommended Solution       | Example                      |
| ---------------------------- | -------------------------- | ---------------------------- |
| Calling official OpenAI      | Built-in OpenAI Provider   | `new OpenAIProvider()`       |
| Calling official DeepSeek    | Built-in DeepSeek Provider | `new DeepSeekProvider()`     |
| Company internal API         | Custom Provider            | See four-step implementation |
| Third-party non-standard API | Custom Provider            | See four-step implementation |

# 📋 Four Steps to Implement Custom Provider

## 🎯 Implementation Path Overview

```mermaid
journey
    title Custom Provider Implementation Path
    section Analysis Phase
      Interface Analysis: 2: User
    section Development Phase
      Create Class: 5: User
      Check Validation: 1: User
    section Integration Phase
      Configure Usage: 1: User
```

## Step 1: Analyze Interface Format ⏱️ 2 minutes

### 📋 Interface Information Collection Form

| Information Type          | Example Value               | Your Interface  |
| ------------------------- | --------------------------- | --------------- |
| **Interface URL**         | `https://your-api.com/chat` | `_____________` |
| **Request Method**        | POST                        | `_____________` |
| **Request Format**        | JSON                        | `_____________` |
| **Response Format**       | Server-Sent Events          | `_____________` |
| **Authentication Method** | Bearer Token                | `_____________` |

### 🔍 Interface Format Template

#### ✅ Request Format Example

```ts
// Your actual request format
interface MyAPIRequest {
  query: string; // User question
  context?: string; // Conversation history (optional)
  model?: string; // Model selection (optional)
  stream?: boolean; // Whether to stream (optional)
}
```

#### ✅ Response Format Example

```ts
// Streaming response format
// Actual response: data: {"content": "answer content"}
interface MyAPIResponse {
  content: string; // Answer fragment
  finish_reason?: string; // End marker
}

// End marker: data: [DONE]
```

## Step 2: Create Provider Class ⏱️ 5 minutes

### 🏗️ Code Template (Copy and Use)

```ts
// MyChatProvider.ts
import { AbstractChatProvider } from '@ant-design/x-sdk';

// ====== 1st modification: Define your interface types ======
interface MyInput {
  query: string;
  context?: string;
  model?: string;
  stream?: boolean;
}

interface MyOutput {
  content: string;
  finish_reason?: string;
}

interface MyMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

// ====== 2nd modification: Modify class name ======
export class MyChatProvider extends AbstractChatProvider<MyMessage, MyInput, MyOutput> {
  // Parameter conversion: Convert useXChat parameters to your API parameters
  transformParams(
    requestParams: Partial<MyInput>,
    options: XRequestOptions<MyInput, MyOutput, MyMessage>,
  ): MyInput {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }

    return {
      query: requestParams.query || '',
      context: requestParams.context,
      model: 'gpt-3.5-turbo', // Adjust according to your API
      stream: true,
      ...(options?.params || {}),
    };
  }

  // Local message: Format of user-sent messages
  transformLocalMessage(requestParams: Partial<MyInput>): MyMessage {
    return {
      content: requestParams.query || '',
      role: 'user',
      timestamp: Date.now(),
    };
  }

  // ====== 3rd modification: Response data conversion ======
  transformMessage(info: { originMessage: MyMessage; chunk: MyOutput }): MyMessage {
    const { originMessage, chunk } = info;

    // Handle end marker
    if (!chunk?.content || chunk.content === '[DONE]') {
      return { ...originMessage, status: 'success' as const };
    }

    // Accumulate response content
    return {
      ...originMessage,
      content: `${originMessage.content || ''}${chunk.content || ''}`,
      role: 'assistant' as const,
      status: 'loading' as const,
    };
  }
}
```

### 🚨 Development Notes

- ✅ **Only modify 3 places**: Interface types, class name, response conversion logic
- ✅ **Never implement request method**: Network requests handled by XRequest
- ✅ **Maintain type safety**: Use TypeScript strict mode

## Step 3: Check and Validate ⏱️ 1 minute

### ✅ Quick Checklist

| Check Item             | Status | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| **Correct class name** | ⏳     | `MyChatProvider` → Your class name    |
| **Type matching**      | ⏳     | Interface types match actual API      |
| **Complete methods**   | ⏳     | All 3 methods implemented             |
| **No request method**  | ⏳     | Confirm no request method implemented |
| **Type check passed**  | ⏳     | `tsc --noEmit` no errors              |

### 🔍 Validation Code

```bash
# Run type check
npx tsc --noEmit MyChatProvider.ts

# Expected result: no error output
```

## Step 4: Configure and Use ⏱️ 1 minute

### 🔧 Complete Integration Example

```ts
// 1. Import dependencies
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// 2. Configure XRequest (handled by x-request skill)
const request = XRequest('https://your-api.com/chat', {
  // Authentication configuration
  headers: {
    Authorization: 'Bearer your-token-here',
    'Content-Type': 'application/json',
  },

  // Default parameters
  params: {
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    temperature: 0.7,
  },

  // Streaming configuration
  manual: true,
});

// 3. Create Provider instance
const provider = new MyChatProvider({
  request, // Must pass XRequest instance
});

// 4. Now can be used with useXChat
// This part handled by use-x-chat skill
export { provider };
```

### 🎉 Usage Advantages

- **Zero network code**: XRequest handles all network details
- **Type safety**: Complete TypeScript support
- **Easy testing**: Can mock XRequest for unit testing
- **Unified configuration**: Authentication, parameters, error handling centralized

# 🔧 Common Scenario Adaptation

## 📚 Scenario Adaptation Guide

| Scenario Type | Difficulty | Example Link | Description |
| --- | --- | --- | --- |
| **Standard OpenAI** | 🟢 Simple | [Built-in Provider Example](reference/EXAMPLES.md#scenario-1-openai-format) | Directly use built-in Provider |
| **Standard DeepSeek** | 🟢 Simple | [Built-in Provider Example](reference/EXAMPLES.md#scenario-2-deepseek-format) | Directly use built-in Provider |
| **Private API** | 🟡 Medium | [Custom Provider Detailed Scenarios](reference/EXAMPLES.md#scenario-3-custom-provider) | Requires four-step implementation |

> 📖 **Complete Examples**: [EXAMPLES.md](reference/EXAMPLES.md) contains complete code for all actual scenarios

# 📋 Combined Skill Usage Guide

## 🎯 Skill Relationship Diagram

```mermaid
graph TD
    User[Developer] --> A{Choose Solution}

    A -->|Standard API| B[Built-in Provider]
    A -->|Private API| C[Custom Provider]

    B --> D[use-x-chat]
    C --> E[x-chat-provider]
    E --> D

    D --> F[x-request]
    F --> G[Final Application]
```

## 📊 Skill Comparison Table

| Skill Role | Skill Name | Prerequisites | Core Responsibilities | Use Cases |
| --- | --- | --- | --- | --- |
| **🏗️ Creator** | **x-chat-provider** | None | Create custom Provider | Adapt private/non-standard APIs |
| **⚛️ User** | **use-x-chat** | Requires Provider | Build AI chat interface | React component development |
| **🔧 Configurator** | **x-request** | None | Configure request parameters authentication | Unified network request management |

## 🎯 Combined Usage Scenarios Explained

### 🚀 Scenario 1: Complete AI Chat Application

**Applicable**: Building complete AI chat products from scratch

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CP as x-chat-provider
    participant UX as use-x-chat
    participant XR as x-request

    Dev->>CP: 1. Create custom Provider
    CP->>Dev: Return adapted Provider
    Dev->>XR: 2. Configure XRequest parameters
    XR->>Dev: Return configured request
    Dev->>UX: 3. Use Provider to build interface
    UX->>Dev: Complete AI chat application
```

**Implementation Steps**:

1. **x-chat-provider** → Create custom Provider (4-step implementation)
2. **x-request** → Configure authentication, parameters, error handling
3. **use-x-chat** → Build React chat interface

### 🎯 Scenario 2: Provider Creation Only

**Applicable**: Providing Provider for other frameworks or teams

```mermaid
graph LR
    A[Private API] -->|Adapt| B[Custom Provider]
    B -->|Export| C[Used by other frameworks]
    B -->|Publish| D[NPM package]
```

**Core Value**:

- 🔧 **Decoupling**: Provider separated from UI framework
- 📦 **Reusability**: Can be used by multiple projects
- 🚀 **Efficiency**: Develop once, use everywhere

### ⚡ Scenario 3: Using Built-in Provider

**Applicable**: Rapid prototyping or standard API calls

```mermaid
graph LR
    A[Standard API] -->|Built-in| B[OpenAI/DeepSeek Provider]
    B -->|Direct use| C[use-x-chat]
    C -->|Configure| D[x-request]
    D --> E[Quick deployment]
```

**Advantages**:

- ⚡ **Zero development**: No need for custom Provider
- 🎯 **Zero configuration**: Built-in best practices
- 🚀 **Ultra-fast deployment**: Complete in 5 minutes

## ⚠️ Important Reminders

### 🚨 Mandatory Rule: Never Implement request Method!

**Mandatory Requirements**:

- 🚫 **Absolutely forbidden** to implement `request` method in Provider
- ✅ **Must use** XRequest to handle all network requests
- ✅ **Only focus** on data conversion logic (transformParams, transformLocalMessage, transformMessage)

**❌ Serious Error (absolutely forbidden)**:

```ts
// ❌ Serious error: implementing request method yourself
class MyProvider extends AbstractChatProvider {
  async request(params: any) {
    // Forbidden to write network request logic yourself!
    const response = await fetch(this.url, { ... });
    return response;
  }
}
```

**✅ Mandatory Requirement (only correct way)**:

```ts
// ✅ Mandatory requirement: use XRequest, never implement request method
class MyProvider extends AbstractChatProvider {
  // Never implement request method!
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

// Mandatory use of XRequest:
const provider = new MyProvider({
  request: XRequest('https://your-api.com/chat'),
});
```

# ⚡ Quick Checklist

Before creating Provider, confirm:

- [ ] Interface documentation obtained
- [ ] Request/response format confirmed
- [ ] Message structure defined
- [ ] Interface availability tested
- [ ] **Decided to use XRequest** (avoid writing request method yourself!)

After completion:

- [ ] Provider class can be instantiated normally
- [ ] **Only implemented 3 required methods** (transformParams, transformLocalMessage, transformMessage)
- [ ] **Absolutely no request method implemented** (mandatory use of XRequest for network requests)
- [ ] Edge cases handled (empty data, error responses)
- [ ] **Type check passed** (ensure all TypeScript types are correct)
- [ ] **Removed unused exports** (clean up unused export items)

# 🚨 Development Rules

## Test Case Rules

- **If user doesn't explicitly need test cases, don't add test files**
- **Only create test cases when user explicitly requests**

## Code Quality Rules

- **Must check types after completion**: Run `tsc --noEmit` to ensure no type errors
- **Keep code clean**: Remove all unused variables and imports

# Reference Files

### SDK Documentation

- useXChat: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.en-US.md
- XRequest: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.en-US.md
- chat provider: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.en-US.md

### Example Code

- custom provider width ui: https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx
