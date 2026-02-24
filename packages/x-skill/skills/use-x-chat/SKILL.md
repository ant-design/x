---
name: use-x-chat
version: 2.2.2-beta.6
description: Focus on explaining how to use the useXChat Hook, including custom Provider integration, message management, error handling, etc.
---

# 🎯 Skill Positioning

> **Core Positioning**: Build professional AI chat applications using `useXChat` Hook **Prerequisites**: Already have custom Chat Provider (refer to [x-chat-provider skill](../x-chat-provider))

## Table of Contents

- [🚀 Quick Start](#-quick-start) - Get started in 5 minutes
  - [Dependency Management](#1-dependency-management)
  - [Three-Step Integration](#2-three-step-integration)
- [🧩 Core Concepts](#-core-concepts)
  - [Tech Stack Architecture](#tech-stack-architecture)
  - [Data Model](#data-model)
- [🔧 Core Features Deep Dive](#-core-features-deep-dive)
  - [Message Management](#1-message-management)
  - [Request Control](#2-request-control)
  - [Error Handling](#3-error-handling)
  - [Complete Example Project](#-complete-example-project)
- [📋 Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [API.md](reference/API.md)
  - [EXAMPLES.md](reference/EXAMPLES.md)

# 🚀 Quick Start

## 1. Dependency Management

### 🎯 Automatic Dependency Handling

### 📋 System Requirements

- **@ant-design/x-sdk**: 2.2.1+ (auto-installed)
- **@ant-design/x**: latest (UI components, auto-installed)

### ⚠️ Automatic Version Issue Resolution

If version mismatch is detected, the skill will automatically:

- ✅ Display current version status
- ✅ Provide fix suggestions
- ✅ Use relative paths to ensure compatibility

#### 🎯 Built-in Version Check

The use-x-chat skill includes built-in version checking, automatically checking version compatibility on startup:

**🔍 Automatic Check Features** When the skill starts, it automatically checks if `@ant-design/x-sdk` version meets requirements (≥2.2.1):

**📋 Check Contents:**

- ✅ Currently installed version
- ✅ Meets minimum requirements (≥2.2.1)
- ✅ Auto-provides fix suggestions
- ✅ Friendly error messages

**🛠️ Version Issue Fixes** If version mismatch is detected, the skill provides specific fix commands:

```bash
# Auto-suggested fix commands
npm install @ant-design/x-sdk@^2.2.1

# Or install latest version
npm install @ant-design/x-sdk@latest
```

## 2. Three-Step Integration

### Step 1: Prepare Provider

This part is handled by the x-chat-provider skill

```ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// Recommend using XRequest as default request method
const provider = new MyChatProvider({
  // Default uses XRequest, no custom fetch needed
  request: XRequest('https://your-api.com/chat'),
});
```

### Step 2: Basic Usage

```tsx
import { useXChat } from '@ant-design/x-sdk';

const ChatComponent = () => {
  const { messages, onRequest, isRequesting } = useXChat({ provider });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.message.role}: {msg.message.content}
        </div>
      ))}
      <button onClick={() => onRequest({ query: 'Hello' })}>Send</button>
    </div>
  );
};
```

### Step 3: UI Integration

```tsx
import { Bubble, Sender } from '@ant-design/x';

const ChatUI = () => {
  const { messages, onRequest, isRequesting, abort } = useXChat({ provider });

  return (
    <div style={{ height: 600 }}>
      <Bubble.List items={messages} />
      <Sender
        loading={isRequesting}
        onSubmit={(content) => onRequest({ query: content })}
        onCancel={abort}
      />
    </div>
  );
};
```

# 🧩 Core Concepts

## Tech Stack Architecture

```mermaid
graph TD
    A[useXChat Hook] --> B[Chat Provider]
    B --> C[XRequest]
    A --> D[Ant Design X UI]
    D --> E[Bubble Component]
    D --> F[Sender Component]
```

### Data Model

> ⚠️ **Important Reminder**: `messages` type is `MessageInfo<MessageType>[]`, not direct `MessageType`

```ts
interface MessageInfo<Message> {
  id: number | string; // Unique message identifier
  message: Message; // Actual message content
  status: MessageStatus; // Sending status
  extraInfo?: AnyObject; // Extended information
}

// Message status enum
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
```

# 🔧 Core Features Deep Dive

> 💡 **Tip**: APIs may update with versions, check [official documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.md) for latest info

Core features reference [CORE.md](reference/CORE.md)

# 📋 Prerequisites and Dependencies

## ⚠️ Important Dependencies

**use-x-chat must depend on one of the following skills:**

| Dependency Type | Skill | Description | Required |
| --- | --- | --- | --- |
| **Core Dependency** | **x-chat-provider** | Provides custom Provider instance, uses XRequest by default, **must** be used with use-x-chat | **Required** |
| **Or** | **Built-in Provider** | Built-in Providers like OpenAI/DeepSeek, uses XRequest by default | **Required** |
| **Recommended Dependency** | **x-request** | Configure request parameters and authentication, as default request method | **Recommended** |

## 🎯 Usage Scenario Comparison Table

| Usage Scenario | Required Skill Combination | Usage Order |
| --- | --- | --- |
| **Private API Adaptation** | x-chat-provider → use-x-chat | Create Provider first, then use |
| **Standard API Usage** | use-x-chat (built-in Provider) | Direct use |
| **Authentication Required** | x-request → use-x-chat | Configure request first, then use |
| **Full Customization** | x-chat-provider → x-request → use-x-chat | Complete workflow |

# 🚨 Development Rules

## Before using use-x-chat, must confirm:

- [ ] **Have Provider source** (choose one):
  - [ ] Used **x-chat-provider** to create custom Provider
  - [ ] Decided to use built-in Provider (OpenAI/DeepSeek)
- [ ] Installed @ant-design/x-sdk
- [ ] Understand MessageInfo data structure
- [ ] Prepared UI components

### Test Case Rules

- **If user doesn't explicitly need test cases, don't add test files**
- **Only create test cases when user explicitly requests**

### Code Quality Rules

- **After completion must check types**: Run `tsc --noEmit` to ensure no type errors
- **Keep code clean**: Remove all unused variables and imports

# 🔗 Reference Resources

## 📚 Core Reference Documentation

- [API.md](reference/API.md) - Complete API reference documentation
- [EXAMPLES.md](reference/EXAMPLES.md) - All practical example codes

## 🌐 SDK Official Documentation

- [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.md)
- [XRequest Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.md)
- [Chat Provider Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.md)

### 💻 Example Code

- [custom-provider-width-ui.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx) - Complete custom Provider example
