---
name: x-request
version: 2.2.2-beta.7
<<<<<<< HEAD
description: Focuses on explaining the actual configuration and usage of XRequest, providing accurate configuration instructions based on official documentation
=======
description: Focuses on the practical configuration and usage of XRequest, providing accurate configuration instructions based on official documentation
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
---

# 🎯 Skill Positioning

**This skill focuses on solving**: How to correctly configure XRequest to adapt to various streaming interface requirements.

# Table of Contents

- [🚀 Quick Start](#-quick-start) - 3 minutes to get started
  - [Dependency Management](#dependency-management)
  - [Basic Configuration](#basic-configuration)
- [📦 Tech Stack Overview](#-tech-stack-overview)
- [🔧 Core Configuration Details](#-core-configuration-details)
  - [Global Configuration](#1-global-configuration)
  - [Security Configuration](#2-security-configuration)
  - [Streaming Configuration](#3-streaming-configuration)
- [🛡️ Security Guide](#️-security-guide)
  - [Environment Security Configuration](#environment-security-configuration) <<<<<<< HEAD
  - # [Authentication Method Comparison](#authentication-method-comparison)
  - [Authentication Methods Comparison](#authentication-methods-comparison)
    > > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
- [🔍 Debugging and Testing](#-debugging-and-testing)
  - [Debug Configuration](#debug-configuration)
  - [Configuration Validation](#configuration-validation)
- [📋 Usage Scenarios](#-usage-scenarios)
  - [Standalone Usage](#standalone-usage) <<<<<<< HEAD
  - [Cooperate with Other Skills](#cooperate-with-other-skills)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [📚 Core Reference Documents](#-core-reference-documents)
  - [🌐 SDK Official Documentation](#-sdk-official-documentation)
  - [� Example Code](#-example-code)

# �🚀 Quick Start

=======

- [Integration with Other Skills](#integration-with-other-skills)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)

# 🚀 Quick Start

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

## Dependency Management

### 📋 System Requirements

| Dependency Package    | Version Requirement | Auto Install | Purpose                          |
| --------------------- | ------------------- | ------------ | -------------------------------- |
| **@ant-design/x-sdk** | ≥2.2.2              | ✅           | Core SDK, includes XRequest tool |

### 🛠️ One-click Installation

```bash
# Recommended to use tnpm
tnpm install @ant-design/x-sdk

# Or use npm
npm add @ant-design/x-sdk

# Check version
npm ls @ant-design/x-sdk
```

## Basic Configuration

### Simplest Usage

```typescript
import { XRequest } from '@ant-design/x-sdk';

<<<<<<< HEAD
// Minimal configuration: only need to provide API address
=======
// Minimal configuration: only need to provide API URL
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
const request = XRequest('https://api.example.com/chat');

// For manual control (used in Provider scenarios)
const providerRequest = XRequest('https://api.example.com/chat', {
<<<<<<< HEAD
  manual: true, // Usually only this needs explicit configuration
});
```

> # 💡 **Tip**: XRequest has built-in reasonable default configurations. In most cases, you only need to provide the API address to use.
>
> manual: true, // Only this item usually needs explicit configuration });

````

> 💡 **Tip**: XRequest has built-in reasonable default configurations, in most cases you only need to provide the API URL to use it.
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

# 📦 Tech Stack Overview

## 🏗️ Tech Stack Architecture

```mermaid
graph TD
<<<<<<< HEAD
    A[XRequest] --> B[Network Request]
=======
    A[XRequest] --> B[Network Requests]
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
    A --> C[Authentication Management]
    A --> D[Error Handling]
    A --> E[Streaming Processing]
    B --> F[fetch wrapper]
    C --> G[Token Management]
    D --> H[Retry Mechanism]
    E --> I[Server-Sent Events]
````

## 🔑 Core Concepts

<<<<<<< HEAD | Concept | Role Positioning | Core Responsibility | Usage Scenario | | --- | --- | --- | --- | | **XRequest** | 🌐 Request Tool | Handle all network communication, authentication, error handling | Unified request management | | **Global Configuration** | ⚙️ Configuration Center | Configure once, use multiple times | Reduce duplicate code | | **Streaming Configuration** | 🔄 Streaming Processing | Support SSE and JSON response formats | AI conversation scenarios |

# 🔧 Core Configuration Details

# Core functionality reference content [CORE.md](reference/CORE.md)

| Concept | Role Positioning | Core Responsibilities | Use Cases |
| --- | --- | --- | --- |
| **XRequest** | 🌐 Request Tool | Handle all network communication, authentication, error handling | Unified request management |
| **Global Config** | ⚙️ Config Center | One-time configuration, multiple uses | Reduce duplicate code |
| **Stream Config** | 🔄 Stream Processing | Support SSE and JSON response formats | AI chat scenarios |

# 🔧 Core Configuration Details

Core features reference content [CORE.md](reference/CORE.md)

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

# 🛡️ Security Guide

## Environment Security Configuration

### 🌍 Security Strategies for Different Environments

| Runtime Environment | Security Level | Configuration Method | Risk Description |
| ------------------- | -------------- | -------------------- | ---------------- |

<<<<<<< HEAD | **Browser Frontend** | 🔴 High Risk | ❌ Prohibit key configuration | Keys will be directly exposed to users | | **Node.js Backend** | 🟢 Safe | ✅ Environment variable configuration | Keys stored on server side | | **Proxy Service** | 🟢 Safe | ✅ Same-origin proxy forwarding | Keys managed by proxy service |

### 🔐 Authentication Method Comparison

======= | **Browser Frontend** | 🔴 High Risk | ❌ Prohibit key config | Keys will be directly exposed to users | | **Node.js Backend** | 🟢 Safe | ✅ Environment variables | Keys stored on server side | | **Proxy Service** | 🟢 Safe | ✅ Same-origin proxy forwarding | Keys managed by proxy service |

### 🔐 Authentication Methods Comparison

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

| Authentication Method    | Applicable Environment | Configuration Example           | Security  |
| ------------------------ | ---------------------- | ------------------------------- | --------- |
| **Bearer Token**         | Node.js                | `Bearer ${process.env.API_KEY}` | ✅ Safe   |
| **API Key Header**       | Node.js                | `X-API-Key: ${process.env.KEY}` | ✅ Safe   |
| **Proxy Forwarding**     | Browser                | `/api/proxy/service`            | ✅ Safe   |
| **Direct Configuration** | Browser                | `Bearer sk-xxx`                 | ❌ Danger |

# 🔍 Debugging and Testing

## Debug Configuration

<<<<<<< HEAD

### 🛠️ Debug Template

=======

### 🛠️ Debug Templates

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

**Node.js Debug Configuration**:

```typescript
// Safe debug configuration (Node.js environment)
const debugRequest = XRequest('https://your-api.com/chat', {
  headers: {
    Authorization: `Bearer ${process.env.DEBUG_API_KEY}`,
  },
  params: { query: 'test message' },
});
```

**Frontend Debug Configuration**:

```typescript
// Safe debug configuration (frontend environment)
const debugRequest = XRequest('/api/debug/chat', {
  params: { query: 'test message' },
});
```

## Configuration Validation

### ✅ Security Check Tool

```typescript
// Security configuration validation function
const validateSecurity = (config: any) => {
  const isBrowser = typeof window !== 'undefined';
  const hasAuth = config.headers?.Authorization || config.headers?.authorization;

  if (isBrowser && hasAuth) {
    throw new Error(
<<<<<<< HEAD
      '❌ Frontend environment prohibits Authorization configuration, key leakage risk!',
=======
      '❌ Frontend environment prohibits Authorization configuration, risk of key leakage!',
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
    );
  }

  console.log('✅ Security configuration check passed');
  return true;
};

// Usage example
validateSecurity({
  headers: {
<<<<<<< HEAD
    // Do not include Authorization
=======
    // Don't include Authorization
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
  },
});
```

# 📋 Usage Scenarios

## Standalone Usage

### 🎯 Direct Request Initiation

```typescript
import { XRequest } from '@ant-design/x-sdk';

// Test interface availability
const testRequest = XRequest('https://httpbin.org/post', {
  params: { test: 'data' },
});

// Send request immediately
const response = await testRequest();
console.log(response);
```

<<<<<<< HEAD

## Cooperate with Other Skills

### 🔄 Skill Collaboration Process

=======

## Integration with Other Skills

### 🔄 Skill Collaboration Flow

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

```mermaid
graph TD
    A[x-request] -->|Configure Request| B[x-chat-provider]
    A -->|Configure Request| C[use-x-chat]
    B -->|Provide Provider| C
    A --> D[Direct Request]
```

| Usage Method | Cooperating Skill | Purpose | Example |
| ------------ | ----------------- | ------- | ------- |

<<<<<<< HEAD | **Standalone Usage** | None | Directly initiate network requests | Test interface availability | | **Cooperate with x-chat-provider** | x-chat-provider | Configure requests for custom Provider | Configure private API | | **Cooperate with use-x-chat** | use-x-chat | Configure requests for built-in Provider | Configure OpenAI API | | **Complete AI Application** | x-request → x-chat-provider → use-x-chat | Configure requests for entire system | Complete AI conversation application |

### ⚠️ useXChat Integration Security Warning

**Important Warning: useXChat is only for frontend environments, XRequest configuration must not include Authorization!**

# **❌ Wrong Configuration (Dangerous)**:

| **Standalone** | None | Directly initiate network requests | Test interface availability | | **With x-chat-provider** | x-chat-provider | Configure requests for custom Provider | Configure private API | | **With use-x-chat** | use-x-chat | Configure requests for built-in Provider | Configure OpenAI API | | **Complete AI Application** | x-request → x-chat-provider → use-x-chat | Configure requests for entire system | Complete AI chat application |

### ⚠️ useXChat Integration Security Warning

**Important Warning: useXChat is only for frontend environments, Authorization is prohibited in XRequest configuration!**

**❌ Incorrect Configuration (Dangerous)**:

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

```typescript
// Extremely dangerous: keys will be directly exposed to browser
const unsafeRequest = XRequest('https://api.openai.com/v1/chat/completions', {
  headers: {
    Authorization: 'Bearer sk-xxxxxxxxxxxxxx', // ❌ Dangerous!
  },
  manual: true,
});
```

**✅ Correct Configuration (Safe)**:

```typescript
<<<<<<< HEAD
// Frontend safe configuration: use proxy service
=======
// Frontend security configuration: use proxy service
>>>>>>> 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
const safeRequest = XRequest('/api/proxy/openai', {
  params: {
    model: 'gpt-3.5-turbo',
    stream: true,
  },
  manual: true,
});
```

# 🚨 Development Rules

## Test Case Rules

- **If user doesn't explicitly need test cases, don't add test files**
- **Only create test cases when user explicitly requests**

## Code Quality Rules

- **Must check types after completion**: Run `tsc --noEmit` to ensure no type errors
- **Keep code clean**: Remove all unused variables and imports

## ✅ Configuration Checklist

<<<<<<< HEAD Please confirm the following configurations are correctly set before using XRequest: ======= Before using XRequest, please confirm the following configurations are correctly set:

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

### 🔍 Configuration Checklist

| Check Item | Status | Description |
| ---------- | ------ | ----------- |

<<<<<<< HEAD | **API Address** | ✅ Must configure | `XRequest('https://api.xxx.com')` | | **Authentication** | ⚠️ Environment related | Frontend ❌ prohibited, Node.js ✅ available | | **manual config** | ✅ Provider scenario | Needs to be set to `true` in Provider, other scenarios need to be set according to actual situation | | **Other configs** | ❌ No need to configure | Built-in reasonable defaults | ======= | **API URL** | ✅ Must configure | `XRequest('https://api.xxx.com')` | | **Auth Info** | ⚠️ Environment dependent | Frontend❌prohibited, Node.js✅available | | **manual config** | ✅ Provider scenario | Must be set to `true` in Provider, other scenarios need to be set according to actual situation | | **Other configs** | ❌ No need to configure | Built-in reasonable defaults already exist |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8 | **Interface availability** | ✅ Recommended test | Use debug configuration to verify |

### 🛠️ Quick Validation Script

```typescript
// Check configuration before running
const checkConfig = () => {
  const checks = [
    {
      name: 'Global Configuration',
      test: () => {
        // Check if global configuration is set
        return true; // Check according to actual situation
      },
    },
    {
      name: 'Security Configuration',
      test: () => validateSecurity(globalConfig),
    },
    {
      name: 'Type Check',
      test: () => {
        // Run tsc --noEmit
        return true;
      },
    },
  ];

  checks.forEach((check) => {
    console.log(`${check.name}: ${check.test() ? '✅' : '❌'}`);
  });
};
```

# <<<<<<< HEAD

# 🔗 Reference Resources

## 📚 Core Documentation

| Resource Name | Link | Description | Dependencies |
| --- | --- | --- | --- |
| **Official Documentation** | [XRequest Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.en-US.md) | Latest feature description | Standalone resource |
| **API Reference** | [API.md](reference/API.md) | Complete API documentation | Must read |
| **Service Provider Configuration** | [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md) | Configuration examples for various service providers | Optional |

> > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8

## 🎯 Skill Collaboration

```mermaid
graph LR
    A[x-request] -->|Configure Request| B[x-chat-provider]
    A -->|Configure Request| C[use-x-chat]
    B -->|Provide Provider| C
```

### 📊 Skill Usage Comparison Table

| Usage Scenario | Required Skills | Usage Order | Completion Time |
| --- | --- | --- | --- |
| **Test Interface** | x-request | Direct use | 2 minutes |
| **Private API Adaptation** | x-request → x-chat-provider | Configure request first, then create Provider | 10 minutes |
| **Standard AI Application** | x-request → use-x-chat | Configure request first, then build interface | 15 minutes |
| **Complete Customization** | x-request → x-chat-provider → use-x-chat | Complete workflow | 30 minutes |

<<<<<<< HEAD

# 🔗 Reference Resources

## 📚 Core Reference Documents

- [API.md](reference/API.md) - Complete API reference documentation
- [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md) - Service provider configuration examples

## 🌐 SDK Official Documentation

- [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.en-US.md)
- [XRequest Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.en-US.md)
- [Chat Provider Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.en-US.md)

## 💻 Example Code

- # [custom-provider-width-ui.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx) - Custom Provider complete example
  > > > > > > > 1cf23b141ee7cc4322aa0946f59313c3205bcbb8
