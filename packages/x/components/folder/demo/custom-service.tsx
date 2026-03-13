import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import React from 'react';

const treeData: FolderProps['treeData'] = [
  {
    title: 'x-request',
    path: 'x-request',
    children: [
      {
        title: 'SKILL.md',
        path: 'SKILL.md',
      },
      {
        title: 'reference',
        path: 'reference',
        children: [
          {
            title: 'API.md',
            path: 'API.md',
          },
          {
            title: 'CORE.md',
            path: 'CORE.md',
          },
          {
            title: 'EXAMPLES_SERVICE_PROVIDER.md',
            path: 'EXAMPLES_SERVICE_PROVIDER.md',
          },
        ],
      },
    ],
  },
];

// Custom file content service
class CustomFileContentService {
  private mockFiles: Record<string, string> = {
    'x-request/SKILL.md': `---
name: x-request
version: 2.3.0-beta.1
description: Focus on explaining the practical configuration and usage of XRequest, providing accurate configuration instructions based on official documentation
---

# 🎯 Skill Positioning

**This skill focuses on solving**: How to correctly configure XRequest to adapt to various streaming interface requirements.

# Table of Contents

- [🚀 Quick Start](#-quick-start) - Get started in 3 minutes
  - [Dependency Management](#dependency-management)
  - [Basic Configuration](#basic-configuration)
- [📦 Technology Stack Overview](#-technology-stack-overview)
- [🔧 Core Configuration Details](#-core-configuration-details)
  - [Global Configuration](#1-global-configuration)
  - [Security Configuration](#2-security-configuration)
  - [Streaming Configuration](#3-streaming-configuration)
- [🛡️ Security Guide](#️-security-guide)
  - [Environment Security Configuration](#environment-security-configuration)
  - [Authentication Methods Comparison](#authentication-methods-comparison)
- [🔍 Debugging and Testing](#-debugging-and-testing)
  - [Debug Configuration](#debug-configuration)
  - [Configuration Validation](#configuration-validation)
- [📋 Usage Scenarios](#-usage-scenarios)
  - [Standalone Usage](#standalone-usage)
  - [Integration with Other Skills](#integration-with-other-skills)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [📚 Core Reference Documentation](#-core-reference-documentation)
  - [🌐 SDK Official Documentation](#-sdk-official-documentation)
  - [💻 Example Code](#-example-code)`,
    'x-request/reference/API.md': `### XRequestFunction

\`\`\`ts | pure
type XRequestFunction<Input = Record<PropertyKey, any>, Output = Record<string, string>> = (
  baseURL: string,
  options: XRequestOptions<Input, Output>,
) => XRequestClass<Input, Output>;
\`\`\`

### XRequestFunction

| Property | Description      | Type                             | Default | Version |
| -------- | ---------------- | -------------------------------- | ------- | ------- |
| baseURL  | API endpoint URL | string                           | -       | -       |
| options  | Request options  | XRequestOptions<Input, Output> | -       | -       |

### XRequestOptions

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| callbacks | Request callback handlers | XRequestCallbacks<Output> | - | - |
| params | Request parameters | Input | - | - |
| headers | Additional request headers | Record<string, string> | - | - |
| timeout | Request timeout configuration (time from sending request to connecting to service), unit: ms | number | - | - |
| streamTimeout | Stream mode data timeout configuration (time interval for each chunk return), unit: ms | number | - | - |
| fetch | Custom fetch object | \`typeof fetch\` | - | - |
| middlewares | Middlewares for pre- and post-request processing | XFetchMiddlewares | - | - |
| transformStream | Stream processor | XStreamOptions<Output>['transformStream'] | ((baseURL: string, responseHeaders: Headers) => XStreamOptions<Output>['transformStream']) | - | - |
| streamSeparator | Stream separator, used to separate different data streams. Does not take effect when transformStream has a value | string | \n\n | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data. Does not take effect when transformStream has a value | string | \n | 2.2.0 |
| kvSeparator | Key-value separator, used to separate keys and values. Does not take effect when transformStream has a value | string | : | 2.2.0 |
| manual | Whether to manually control request sending. When \`true\`, need to manually call \`run\` method | boolean | false | - |
| retryInterval | Retry interval when request is interrupted or fails, in milliseconds. If not set, automatic retry will not occur | number | - | - |
| retryTimes | Maximum number of retry attempts. No further retries will be attempted after exceeding this limit | number | - | - |

### XRequestCallbacks

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| onSuccess | Success callback. When used with Chat Provider, additionally gets the assembled message | (chunks: Output[], responseHeaders: Headers, message: ChatMessage) => void | - | - |
| onError | Error handling callback. \`onError\` can return a number indicating the retry interval (in milliseconds) when a request exception occurs. When both \`onError\` return value and \`options.retryInterval\` exist, the \`onError\` return value takes precedence. When used with Chat Provider, additionally gets the assembled fail back message | (error: Error, errorInfo: any, responseHeaders?: Headers, message: ChatMessage) => number | void | - | - |
| onUpdate | Message update callback. When used with Chat Provider, additionally gets the assembled message | (chunk: Output, responseHeaders: Headers, message: ChatMessage) => void | - | - |

### XRequestClass

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| run | Manually execute request (effective when \`manual=true\`) | (params?: Input) => void | - | - |
| isRequesting | Whether currently requesting | boolean | - | - |

### setXRequestGlobalOptions

\`\`\`ts | pure
type setXRequestGlobalOptions<Input, Output> = (
  options: XRequestGlobalOptions<Input, Output>,
) => void;
\`\`\`

### XRequestGlobalOptions

\`\`\`ts | pure
type XRequestGlobalOptions<Input, Output> = Pick<
  XRequestOptions<Input, Output>,
  'headers' | 'timeout' | 'streamTimeout' | 'middlewares' | 'fetch' | 'transformStream' | 'manual'
>;
\`\`\`

### XFetchMiddlewares

\`\`\`ts | pure
interface XFetchMiddlewares {
  onRequest?: (...ags: Parameters<typeof fetch>) => Promise<Parameters<typeof fetch>>;
  onResponse?: (response: Response) => Promise<Response>;
}
\`\`\``,
    'x-request/reference/CORE.md': `# Core Configuration Details

## Global Configuration

### Basic Configuration Structure

\`\`\`typescript
import { XRequest } from '@ant-design/x-sdk';

// Basic configuration
const request = XRequest('https://api.example.com/chat', {
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
  },
});
\`\`\`

## Security Configuration

### Environment-based Security Configuration

\`\`\`typescript
// Node.js environment (safe)
const nodeRequest = XRequest('https://api.example.com/chat', {
  headers: {
    Authorization: \`Bearer \${process.env.API_KEY}\`,
  },
});

// Browser environment (use proxy)
const browserRequest = XRequest('/api/proxy/chat', {
  headers: {
    'X-Custom-Header': 'value',
  },
});
\`\`\`

## Streaming Configuration

### SSE Configuration

\`\`\`typescript
const sseRequest = XRequest('https://api.example.com/chat', {
  headers: {
    'Accept': 'text/event-stream',
  },
  manual: true, // Manual control for Provider usage
});
\`\`\``,
    'x-request/reference/EXAMPLES_SERVICE_PROVIDER.md': `# Service Provider Configuration Examples

## OpenAI Configuration

\`\`\`typescript
import { XRequest } from '@ant-design/x-sdk';

const openAIRequest = XRequest('https://api.openai.com/v1/chat/completions', {
  headers: {
    'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  params: {
    model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    temperature: 0.7,
    stream: true,
  },
  manual: true,
});
\`\`\`

## DeepSeek Configuration

\`\`\`typescript
const deepSeekRequest = XRequest('https://api.deepseek.com/v1/chat/completions', {
  headers: {
    'Authorization': \`Bearer \${process.env.DEEPSEEK_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  params: {
    model: 'deepseek-chat',
    max_tokens: 1000,
    temperature: 0.7,
    stream: true,
  },
  manual: true,
});
\`\`\`

## Custom API Configuration

\`\`\`typescript
const customRequest = XRequest('https://your-api.com/chat', {
  headers: {
    'X-API-Key': process.env.CUSTOM_API_KEY || '',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  streamTimeout: 5000,
  retryTimes: 3,
  retryInterval: 1000,
  manual: true,
});
\`\`\``,
    'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`,
    'src/App.js': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;`,
    'public/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  };

  async loadFileContent(filePath: string): Promise<string> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const content = this.mockFiles[filePath];
    if (content) {
      return content;
    }

    throw new Error(`File ${filePath} does not exist`);
  }
}

export default () => (
  <div style={{ padding: 24, height: 500 }}>
    <Folder
      treeData={treeData}
      previewTitle={({ path }) => {
        return path.join('/');
      }}
      fileContentService={new CustomFileContentService()}
      defaultSelectedFile={['src', 'App.js']}
    />
  </div>
);
