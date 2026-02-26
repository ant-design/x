---
name: x-request
version: 2.2.2-beta.7
description: Focuses on explaining the actual configuration and usage of XRequest, providing accurate configuration instructions based on official documentation
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
  - [Environment Security Configuration](#environment-security-configuration)
  - [Authentication Method Comparison](#authentication-method-comparison)
- [🔍 Debugging and Testing](#-debugging-and-testing)
  - [Debug Configuration](#debug-configuration)
  - [Configuration Validation](#configuration-validation)
- [📋 Usage Scenarios](#-usage-scenarios)
  - [Standalone Usage](#standalone-usage)
  - [Cooperate with Other Skills](#cooperate-with-other-skills)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [📚 Core Reference Documents](#-core-reference-documents)
  - [🌐 SDK Official Documentation](#-sdk-official-documentation)
  - [� Example Code](#-example-code)

# �🚀 Quick Start

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

// Minimal configuration: only need to provide API address
const request = XRequest('https://api.example.com/chat');

// For manual control (used in Provider scenarios)
const providerRequest = XRequest('https://api.example.com/chat', {
  manual: true, // Usually only this needs explicit configuration
});
```

> 💡 **Tip**: XRequest has built-in reasonable default configurations. In most cases, you only need to provide the API address to use.

# 📦 Tech Stack Overview

## 🏗️ Tech Stack Architecture

```mermaid
graph TD
    A[XRequest] --> B[Network Request]
    A --> C[Authentication Management]
    A --> D[Error Handling]
    A --> E[Streaming Processing]
    B --> F[fetch wrapper]
    C --> G[Token Management]
    D --> H[Retry Mechanism]
    E --> I[Server-Sent Events]
```

## 🔑 Core Concepts

| Concept | Role Positioning | Core Responsibility | Usage Scenario |
| --- | --- | --- | --- |
| **XRequest** | 🌐 Request Tool | Handle all network communication, authentication, error handling | Unified request management |
| **Global Configuration** | ⚙️ Configuration Center | Configure once, use multiple times | Reduce duplicate code |
| **Streaming Configuration** | 🔄 Streaming Processing | Support SSE and JSON response formats | AI conversation scenarios |

# 🔧 Core Configuration Details

Core functionality reference content [CORE.md](reference/CORE.md)

# 🛡️ Security Guide

## Environment Security Configuration

### 🌍 Security Strategies for Different Environments

| Runtime Environment | Security Level | Configuration Method | Risk Description |
| --- | --- | --- | --- |
| **Browser Frontend** | 🔴 High Risk | ❌ Prohibit key configuration | Keys will be directly exposed to users |
| **Node.js Backend** | 🟢 Safe | ✅ Environment variable configuration | Keys stored on server side |
| **Proxy Service** | 🟢 Safe | ✅ Same-origin proxy forwarding | Keys managed by proxy service |

### 🔐 Authentication Method Comparison

| Authentication Method    | Applicable Environment | Configuration Example           | Security  |
| ------------------------ | ---------------------- | ------------------------------- | --------- |
| **Bearer Token**         | Node.js                | `Bearer ${process.env.API_KEY}` | ✅ Safe   |
| **API Key Header**       | Node.js                | `X-API-Key: ${process.env.KEY}` | ✅ Safe   |
| **Proxy Forwarding**     | Browser                | `/api/proxy/service`            | ✅ Safe   |
| **Direct Configuration** | Browser                | `Bearer sk-xxx`                 | ❌ Danger |

# 🔍 Debugging and Testing

## Debug Configuration

### 🛠️ Debug Template

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
      '❌ Frontend environment prohibits Authorization configuration, key leakage risk!',
    );
  }

  console.log('✅ Security configuration check passed');
  return true;
};

// Usage example
validateSecurity({
  headers: {
    // Do not include Authorization
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

## Cooperate with Other Skills

### 🔄 Skill Collaboration Process

```mermaid
graph TD
    A[x-request] -->|Configure Request| B[x-chat-provider]
    A -->|Configure Request| C[use-x-chat]
    B -->|Provide Provider| C
    A --> D[Direct Request]
```

| Usage Method | Cooperating Skill | Purpose | Example |
| --- | --- | --- | --- |
| **Standalone Usage** | None | Directly initiate network requests | Test interface availability |
| **Cooperate with x-chat-provider** | x-chat-provider | Configure requests for custom Provider | Configure private API |
| **Cooperate with use-x-chat** | use-x-chat | Configure requests for built-in Provider | Configure OpenAI API |
| **Complete AI Application** | x-request → x-chat-provider → use-x-chat | Configure requests for entire system | Complete AI conversation application |

### ⚠️ useXChat Integration Security Warning

**Important Warning: useXChat is only for frontend environments, XRequest configuration must not include Authorization!**

**❌ Wrong Configuration (Dangerous)**:

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
// Frontend safe configuration: use proxy service
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

Please confirm the following configurations are correctly set before using XRequest:

### 🔍 Configuration Checklist

| Check Item | Status | Description |
| --- | --- | --- |
| **API Address** | ✅ Must configure | `XRequest('https://api.xxx.com')` |
| **Authentication** | ⚠️ Environment related | Frontend ❌ prohibited, Node.js ✅ available |
| **manual config** | ✅ Provider scenario | Needs to be set to `true` in Provider, other scenarios need to be set according to actual situation |
| **Other configs** | ❌ No need to configure | Built-in reasonable defaults |
| **Interface availability** | ✅ Recommended test | Use debug configuration to verify |

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

# 🔗 Reference Resources

## 📚 Core Reference Documents

- [API.md](reference/API.md) - Complete API reference documentation
- [EXAMPLES_SERVICE_PROVIDER.md](reference/EXAMPLES_SERVICE_PROVIDER.md) - Service provider configuration examples

## 🌐 SDK Official Documentation

- [useXChat Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/use-x-chat.zh-CN.md)
- [XRequest Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/x-request.zh-CN.md)
- [Chat Provider Official Documentation](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/chat-provider.zh-CN.md)

## 💻 Example Code

- [custom-provider-width-ui.tsx](https://github.com/ant-design/x/blob/main/packages/x/docs/x-sdk/demos/chat-providers/custom-provider-width-ui.tsx) - Custom Provider complete example
