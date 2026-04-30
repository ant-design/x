(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_@ant-design/x"]||[]).push([["343bb893"],{"27c0496c":function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return c;}});var n=s("777fffbe"),r=s("8090cfc0");s("d56f109a");var a=n._(s("0ef2e5e5")),o=n._(s("b1fa7400")),i=n._(s("17027f80"));let l=[{title:"src",path:"src",children:[{title:"index.js",path:"index.js",content:'console.log("Hello");'},{title:"App.tsx",path:"App.tsx",content:"const App = () => <div>App</div>;"}]},{title:"package.json",path:"package.json",content:'{"name": "demo"}'}];var c=()=>(0,r.jsx)("div",{style:{padding:24},children:(0,r.jsx)("div",{style:{height:300,border:"1px solid #f0f0f0",marginBottom:24},children:(0,r.jsx)(a.default,{treeData:l,previewRender:({content:e,path:t,title:s,language:n},{originNode:a})=>(0,r.jsxs)(o.default,{title:s,extra:(0,r.jsx)(i.default,{children:n}),children:[(0,r.jsxs)("div",{children:["Path: ",t.join("/")]}),(0,r.jsx)("pre",{children:e}),(0,r.jsxs)("div",{style:{marginTop:16},children:[(0,r.jsx)("strong",{children:"Original preview:"}),a]})]})})})});},"39738b92":function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return f;}});var n=s("777fffbe"),r=s("8090cfc0");s("e1e5dca0");var a=n._(s("ec526842")),o=n._(s("5ce23652")),i=n._(s("f5c7bba6")),l=n._(s("0d1768bc")),c=n._(s("426184ac")),d=n._(s("f418d994")),u=n._(s("593b1b72")),g=n._(s("615d4def")),p=n._(s("c71c30be")),m=n._(s("0ef2e5e5"));let h=[{title:"my-project",path:"my-project",children:[{title:"docs",path:"docs",children:[{title:"README.md",path:"README.md",content:"# Project Documentation"},{title:"API.pdf",path:"API.pdf",content:"API Documentation PDF"}]},{title:"src",path:"src",children:[{title:"components",path:"components",children:[{title:"Button.tsx",path:"Button.tsx",content:"Button component code..."},{title:"styles.css",path:"styles.css",content:"/* CSS styles */"}]},{title:"utils",path:"utils",children:[{title:"helpers.ts",path:"helpers.ts",content:"Utility functions..."}]}]},{title:"assets",path:"assets",children:[{title:"logo.png",path:"logo.png",content:"Company logo image"},{title:"banner.jpg",path:"banner.jpg",content:"Website banner image"}]},{title:"data",path:"data",children:[{title:"users.xlsx",path:"users.xlsx",content:"User data spreadsheet"},{title:"report.docx",path:"report.docx",content:"Monthly report document"},{title:"archive.zip",path:"archive.zip",content:"Project archive"}]},{title:"package.json",path:"package.json",content:'{\n  "name": "my-project"\n}'}]}];var f=()=>(0,r.jsx)("div",{style:{padding:24,height:500},children:(0,r.jsx)(m.default,{treeData:h,defaultSelectedFile:["my-project","package.json"],directoryTitle:(0,r.jsxs)("div",{style:{padding:12,whiteSpace:"nowrap",borderBottom:"1px solid #f0f0f0"},children:[(0,r.jsx)("strong",{children:"Custom Icon File Browser"}),(0,r.jsx)("div",{style:{fontSize:12,color:"#666",marginTop:4},children:"Display different icons based on file type"})]}),directoryIcons:{directory:(0,r.jsx)(p.default,{style:{color:"#faad14"}}),md:(0,r.jsx)(l.default,{style:{color:"#722ed1"}}),pdf:(0,r.jsx)(c.default,{style:{color:"#ff4d4f"}}),tsx:(0,r.jsx)(a.default,{style:{color:"#13c2c2"}}),css:(0,r.jsx)(a.default,{style:{color:"#13c2c2"}}),ts:(0,r.jsx)(a.default,{style:{color:"#13c2c2"}}),png:(0,r.jsx)(i.default,{style:{color:"#1890ff"}}),jpg:(0,r.jsx)(i.default,{style:{color:"#1890ff"}}),xlsx:(0,r.jsx)(o.default,{style:{color:"#52c41a"}}),docx:(0,r.jsx)(u.default,{style:{color:"#1890ff"}}),zip:(0,r.jsx)(g.default,{style:{color:"#faad14"}}),json:(0,r.jsx)(d.default,{style:{color:"#666"}})}})});},"4b81b121":function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return l;}});var n=s("777fffbe"),r=s("8090cfc0");s("8bae4526");var a=n._(s("0ef2e5e5"));let o=[{title:"x-request",path:"x-request",children:[{title:"SKILL.md",path:"SKILL.md"},{title:"reference",path:"reference",children:[{title:"API.md",path:"API.md"},{title:"CORE.md",path:"CORE.md"},{title:"EXAMPLES_SERVICE_PROVIDER.md",path:"EXAMPLES_SERVICE_PROVIDER.md"}]}]}];class i{mockFiles={"x-request/SKILL.md":`---
name: x-request
version: 2.3.0-beta.1
description: Focus on explaining the practical configuration and usage of XRequest, providing accurate configuration instructions based on official documentation
---

# \u{1F3AF} Skill Positioning

**This skill focuses on solving**: How to correctly configure XRequest to adapt to various streaming interface requirements.

# Table of Contents

- [\u{1F680} Quick Start](#-quick-start) - Get started in 3 minutes
  - [Dependency Management](#dependency-management)
  - [Basic Configuration](#basic-configuration)
- [\u{1F4E6} Technology Stack Overview](#-technology-stack-overview)
- [\u{1F527} Core Configuration Details](#-core-configuration-details)
  - [Global Configuration](#1-global-configuration)
  - [Security Configuration](#2-security-configuration)
  - [Streaming Configuration](#3-streaming-configuration)
- [\u{1F6E1}\u{FE0F} Security Guide](#\u{FE0F}-security-guide)
  - [Environment Security Configuration](#environment-security-configuration)
  - [Authentication Methods Comparison](#authentication-methods-comparison)
- [\u{1F50D} Debugging and Testing](#-debugging-and-testing)
  - [Debug Configuration](#debug-configuration)
  - [Configuration Validation](#configuration-validation)
- [\u{1F4CB} Usage Scenarios](#-usage-scenarios)
  - [Standalone Usage](#standalone-usage)
  - [Integration with Other Skills](#integration-with-other-skills)
- [\u{1F6A8} Development Rules](#-development-rules)
- [\u{1F517} Reference Resources](#-reference-resources)
  - [\u{1F4DA} Core Reference Documentation](#-core-reference-documentation)
  - [\u{1F310} SDK Official Documentation](#-sdk-official-documentation)
  - [\u{1F4BB} Example Code](#-example-code)`,"x-request/reference/API.md":`### XRequestFunction

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
| streamSeparator | Stream separator, used to separate different data streams. Does not take effect when transformStream has a value | string | 

 | 2.2.0 |
| partSeparator | Part separator, used to separate different parts of data. Does not take effect when transformStream has a value | string | 
 | 2.2.0 |
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
\`\`\``,"x-request/reference/CORE.md":`# Core Configuration Details

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
\`\`\``,"x-request/reference/EXAMPLES_SERVICE_PROVIDER.md":`# Service Provider Configuration Examples

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
\`\`\``,"src/index.js":`import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));`,"src/App.js":`import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;`,"public/index.html":`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`};async loadFileContent(e){await new Promise(e=>setTimeout(e,500));let t=this.mockFiles[e];if(t)return t;throw Error(`File ${e} does not exist`);}}var l=()=>(0,r.jsx)("div",{style:{padding:24,height:500},children:(0,r.jsx)(a.default,{treeData:o,previewTitle:({path:e})=>e.join("/"),fileContentService:new i,defaultSelectedFile:["src","App.js"]})});},"9d56fe92":function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return g;}});var n=s("777fffbe"),r=s("8090cfc0");s("d19cd46f");var a=n._(s("0ef2e5e5")),o=n._(s("cca35c65")),i=n._(s("fd409399")),l=n._(s("17027f80")),c=s("3e6b097d");let d=[{title:"project-root",path:"project-root",children:[{title:"src",path:"src",children:[{title:"components",path:"components",children:[{title:"Header.tsx",path:"Header.tsx",content:"Header component implementation..."},{title:"Footer.tsx",path:"Footer.tsx",content:"Footer component implementation..."},{title:"Sidebar.tsx",path:"Sidebar.tsx",content:"Sidebar component implementation..."}]},{title:"pages",path:"pages",children:[{title:"Home.tsx",path:"Home.tsx",content:"Home page component..."},{title:"About.tsx",path:"About.tsx",content:"About page component..."},{title:"Contact.tsx",path:"Contact.tsx",content:"Contact page component..."}]},{title:"utils",path:"utils",children:[{title:"helpers.ts",path:"helpers.ts",content:"Helper functions..."},{title:"constants.ts",path:"constants.ts",content:"Application constants..."}]}]},{title:"public",path:"public",children:[{title:"index.html",path:"index.html",content:"<!DOCTYPE html>..."},{title:"favicon.ico",path:"favicon.ico",content:"Favicon file..."}]},{title:"package.json",path:"package.json",content:'{\n  "name": "my-project"\n}'},{title:"README.md",path:"README.md",content:"# Project Documentation..."}]}],u=(e,t)=>t?e.reduce((e,s)=>{let n=s.path.toLowerCase().includes(t.toLowerCase()),r=[];return s.children&&(r=u(s.children,t)),(n||r.length>0)&&e.push({...s,children:r.length>0?r:s.children}),e;},[]):e;var g=()=>{let[e,t]=(0,c.useState)(""),[s,n]=(0,c.useState)(["project-root","src","components","Header.tsx"]),g=(0,c.useMemo)(()=>u(d,e),[e]);return(0,r.jsxs)("div",{style:{padding:24,height:600},children:[(0,r.jsxs)(i.default,{vertical:!0,style:{width:"100%",marginBottom:16},children:[(0,r.jsx)(o.default.Search,{placeholder:"Search files or folders...",value:e,onChange:e=>t(e.target.value),allowClear:!0}),(0,r.jsxs)(i.default,{children:[(0,r.jsxs)(l.default,{color:"blue",children:["Total Files: ",p(d)]}),(0,r.jsxs)(l.default,{color:"green",children:["Matching Results: ",p(g)]})]})]}),(0,r.jsx)(a.default,{treeData:g,selectedFile:s,onSelectedFileChange:({path:e})=>n(e),directoryTitle:(0,r.jsxs)("div",{style:{whiteSpace:"nowrap",padding:12,borderBottom:"1px solid #f0f0f0"},children:[(0,r.jsx)("strong",{children:"Project File Browser"}),e&&(0,r.jsxs)("div",{style:{fontSize:12,color:"#666",marginTop:4},children:['Search: "',e,'"']})]})})]});};function p(e){return e.reduce((e,t)=>t.children?e+p(t.children):e+1,0);}},bcf6e743:function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return u;}});var n=s("777fffbe"),r=s("8090cfc0");s("f21b0dd9");var a=n._(s("0ef2e5e5")),o=n._(s("bf2579c8")),i=n._(s("d78812de")),l=n._(s("fd409399")),c=s("3e6b097d");let d=[{title:"x-chat-provider",path:"x-chat-provider",children:[{title:"SKILL.md",path:"SKILL.md",content:`---
name: x-chat-provider
version: 2.3.0
description: Focus on implementing custom Chat Provider, helping to adapt any streaming interface to Ant Design X standard format
---

# \u{1F3AF} Skill Positioning

**This skill focuses on solving one problem**: How to quickly adapt your streaming interface to Ant Design X's Chat Provider.

**Not involved**: useXChat usage tutorial (that's another skill).

## Table of Contents

- [\u{1F4E6} Technology Stack Overview](#-technology-stack-overview)
  - [Ant Design X Ecosystem](#ant-design-x-ecosystem)
  - [Core Concepts](#core-concepts)
- [\u{1F680} Quick Start](#-quick-start)
  - [Dependency Management](#dependency-management)
  - [Built-in Provider](#built-in-provider)
  - [When to Use Custom Provider](#when-to-use-custom-provider)
- [\u{1F4CB} Four Steps to Implement Custom Provider](#-four-steps-to-implement-custom-provider)
  - [Step1: Analyze Interface Format](#step1-analyze-interface-format)
  - [Step2: Create Provider Class](#step2-create-provider-class)
  - [Step3: Check Files](#step3-check-files)
  - [Step4: Use Provider](#step4-use-provider)
- [\u{1F527} Common Scenario Adaptation](#-common-scenario-adaptation)
- [\u{1F4CB} Joint Skill Usage](#-joint-skill-usage)
  - [Scenario1: Complete AI Conversation Application](#scenario1-complete-ai-conversation-application)
  - [Scenario2: Only Create Provider](#scenario2-only-create-provider)
  - [Scenario3: Use Built-in Provider](#scenario3-use-built-in-provider)
- [\u{26A0}\u{FE0F} Important Reminders](#\u{FE0F}-important-reminders)
  - [Mandatory Rule: Prohibit Writing request Method](#mandatory-rule-prohibit-writing-request-method)
- [\u{26A1} Quick Checklist](#-quick-checklist)
- [\u{1F6A8} Development Rules](#-development-rules)
- [\u{1F517} Reference Resources](#-reference-resources)
  - [\u{1F4DA} Core Reference Documentation](#-core-reference-documentation)
  - [\u{1F310} SDK Official Documentation](#-sdk-official-documentation)
  - [\u{1F4BB} Example Code](#-example-code)`},{title:"reference",path:"reference",children:[{title:"EXAMPLES.md",path:"EXAMPLES.md",content:`## Scenario1: OpenAI Format

OpenAI format uses built-in Provider, use OpenAIProvider:

\`\`\`ts
import { OpenAIProvider } from '@ant-design/x-sdk';

const provider = new OpenAIProvider({
  request: XRequest('https://api.openai.com/v1/chat/completions'),
});
\`\`\`

## Scenario2 DeepSeek Format

DeepSeek format uses built-in Provider, use DeepSeekProvider:

\`\`\`ts
import { DeepSeekProvider } from '@ant-design/x-sdk';

const provider = new DeepSeekProvider({
  request: XRequest('https://api.deepseek.com/v1/chat/completions'),
});
\`\`\`

## Scenario3: Custom Provider

### 1. Custom Error Format

\`\`\`ts
transformMessage(info) {
  const { originMessage, chunk } = info || {};
  const data = JSON.parse(chunk.data);
  try {
   if (data.error) {
    return {
      ...originMessage,
      content: data.error.message,
      status: 'error',
    };
  }
  // Other normal processing logic
  } catch (error) {
  return {
      ...originMessage,
      status: 'error',
    };
  }
}
\`\`\`

### 2. Multi-field Response

\`\`\`ts
interface MyOutput {
  content: string;
  metadata?: {
    confidence: number;
    source: string;
  };
}

transformMessage(info) {
  const { originMessage, chunk } = info || {};

  return {
    ...originMessage,
    content: chunk.content,
    metadata: chunk.metadata, // Can extend MyMessage type
  };
}
\`\`\``}]}]}];var u=()=>{let[e,t]=(0,c.useState)();return(0,r.jsxs)("div",{style:{padding:24,height:450},children:[(0,r.jsxs)(l.default,{style:{marginBottom:16},children:[(0,r.jsx)(o.default,{type:"primary",onClick:()=>{t(["x-chat-provider","SKILL.md"]);},children:"Select SKILL.md"}),(0,r.jsx)(o.default,{type:"primary",onClick:()=>{t(["x-chat-provider","reference","EXAMPLES.md"]);},children:"Select EXAMPLES.md"}),(0,r.jsx)(o.default,{onClick:()=>{t([]);},children:"Clear Selection"})]}),(0,r.jsxs)("div",{style:{marginBottom:16},children:[(0,r.jsx)("strong",{children:"Current Selected File:"}),e&&e.length>0?e.join("/"):"None"]}),(0,r.jsx)(a.default,{treeData:d,directoryTitle:(0,r.jsx)(i.default,{style:{paddingInline:16,width:"100%",whiteSpace:"nowrap",paddingBlock:8,borderBottom:"1px solid #f0f0f0"},align:"center",children:"Project File Browser"}),selectedFile:e,onSelectedFileChange:({path:e})=>{t(e);}})]});};},d3685509:function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return g;}});var n=s("777fffbe"),r=s("8090cfc0");s("a1b29ba1");var a=n._(s("0ef2e5e5")),o=n._(s("bf2579c8")),i=n._(s("b1fa7400")),l=n._(s("d78812de")),c=n._(s("fd409399")),d=s("3e6b097d");let u=[{title:"use-x-chat",path:"use-x-chat",children:[{title:"SKILL.md",path:"SKILL.md",content:`---
name: use-x-chat
version: 2.3.0
description: Focus on explaining how to use the useXChat Hook, including custom Provider integration, message management, error handling, etc.
---

# \u{1F3AF} Skill Positioning

> **Core Positioning**: Use the \`useXChat\` Hook to build professional AI conversation applications **Prerequisites**: Already have a custom Chat Provider (refer to [x-chat-provider skill](../x-chat-provider))

## Table of Contents

- [\u{1F680} Quick Start](#-quick-start)
  - [Dependency Management](#1-dependency-management)
  - [Three-step Integration](#2-three-step-integration)
- [\u{1F9E9} Core Concepts](#-core-concepts)
  - [Technology Stack Architecture](#technology-stack-architecture)
  - [Data Model](#data-model)
- [\u{1F527} Core Function Details](#-core-function-details)
  - [Message Management](#1-message-management)
  - [Request Control](#2-request-control)
  - [Error Handling](#3-error-handling)
  - [Complete Example Project](#-complete-example-project)
- [\u{1F4CB} Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [\u{1F6A8} Development Rules](#-development-rules)
- [\u{1F517} Reference Resources](#-reference-resources)
  - [\u{1F4DA} Core Reference Documentation](#-core-reference-documentation)
  - [\u{1F310} SDK Official Documentation](#-sdk-official-documentation)
  - [\u{1F4BB} Example Code](#-example-code)

# \u{1F680} Quick Start

## 1. Dependency Management

### \u{1F3AF} Automatic Dependency Handling

### \u{1F4CB} System Requirements

- **@ant-design/x-sdk**: 2.2.2+ (automatically installed)
- **@ant-design/x**: latest version (UI components, automatically installed)

### \u{26A0}\u{FE0F} Version Issue Auto-fix

If version mismatch is detected, the skill will automatically:

- \u{2705} Prompt current version status
- \u{2705} Provide fix suggestions
- \u{2705} Use relative paths to ensure compatibility

#### \u{1F3AF} Built-in Version Check

The use-x-chat skill has built-in version checking functionality, automatically checking version compatibility on startup:

**\u{1F50D} Auto-check Function** The skill will automatically check if the \`@ant-design/x-sdk\` version meets requirements (\u{2265}2.2.2) on startup:

**\u{1F4CB} Check Contents:**

- \u{2705} Currently installed version
- \u{2705} Whether it meets minimum requirements (\u{2265}2.2.2)
- \u{2705} Automatically provide fix suggestions
- \u{2705} Friendly error prompts

**\u{1F6E0}\u{FE0F} Version Issue Fix** If version mismatch is detected, the skill will provide specific fix commands:

\`\`\`bash
# Auto-prompted fix commands
npm install @ant-design/x-sdk@^2.2.2

# Or install latest version
npm install @ant-design/x-sdk@latest
\`\`\`

## 2. Three-step Integration

### Step 1: Prepare Provider

This part is handled by the x-chat-provider skill

\`\`\`ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// Recommended to use XRequest as the default request method
const provider = new MyChatProvider({
  // Default use XRequest, no need for custom fetch
  request: XRequest('https://your-api.com/chat'),
  // When requestPlaceholder is set, placeholder message will be displayed before request starts
  requestPlaceholder: {
    content: 'Thinking...',
    role: 'assistant',
    timestamp: Date.now(),
  },
  // When requestFallback is set, fallback message will be displayed when request fails
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    }
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
      timestamp: Date.now(),
    };
  },
});
\`\`\`

### Step 2: Basic Usage

\`\`\`tsx
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
\`\`\`

### Step 3: UI Integration

\`\`\`tsx
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
};`},{title:"reference",path:"reference",children:[{title:"API.md",path:"API.md",content:`### useXChat

\`\`\`tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
\`\`\`

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ChatMessage | Message data type, defines the structure of chat messages | object | object | - |
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines the structure of request parameters | RequestParams<ChatMessage> | RequestParams<ChatMessage> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider used to convert data and requests of different structures into formats that useXChat can consume. The platform includes built-in \`DefaultChatProvider\` and \`OpenAIChatProvider\`, and you can also implement your own Provider by inheriting \`AbstractChatProvider\`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider<ChatMessage, Input, Output> | - | - |
| conversationKey | Session unique identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => Promise<MessageInfo<ChatMessage>[]> | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage | BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage|Promise<ChatMessage> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>, info: { messages: Message[] }) => ChatMessage | Promise<Message> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether a request is in progress | boolean | - | - |
| isDefaultMessagesRequesting | Whether the default message list is requesting | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo<ChatMessage>[] | - | - |
| parsedMessages | Content translated through \`parser\` | MessageInfo<ParsedMessages>[] | - | - |
| onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string | number, requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages without triggering requests | (messages: Partial<MessageInfo<ChatMessage>>[]) => void | - | - |
| setMessage | Directly modify a single message without triggering requests | (id: string | number, info: Partial<MessageInfo<ChatMessage>>) => void | - | - |
| removeMessage | Deleting a single message will not trigger a request | (id: string | number) => void | - | - |
| queueRequest | Will add the request to a queue, waiting for the conversationKey to be initialized before sending | (conversationKey: string | symbol, requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => void | - | - |

#### MessageInfo

\`\`\`ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extra?: AnyObject;
}
\`\`\`

#### MessageStatus

\`\`\`ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
\`\`\``},{title:"CORE.md",path:"CORE.md",content:`### 1. Message Management

#### Get Message List

\`\`\`ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<MessageType>[]
// Actual message data is in msg.message
\`\`\`

#### Manually Set Messages

\`\`\`ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message - note it's MessageInfo structure
setMessages([
  {
    id: 'welcome',
    message: {
      content: 'Welcome to AI Assistant',
      role: 'assistant',
    },
    status: 'success',
  },
]);
\`\`\`

#### Update Single Message

\`\`\`ts
const { setMessage } = useXChat({ provider });

// Update message content - need to update message object
setMessage('msg-id', {
  message: { content: 'New content', role: 'assistant' },
});

// Mark as error - update status
setMessage('msg-id', { status: 'error' });
\`\`\`

### 2. Request Control

#### Send Message

\`\`\`ts
const { onRequest } = useXChat({ provider });

// Basic usage
onRequest({ query: 'User question' });

// With additional parameters
onRequest({
  query: 'User question',
  context: 'Previous conversation content',
  userId: 'user123',
});
\`\`\`

#### Abort Request

\`\`\`tsx
const { abort, isRequesting } = useXChat({ provider });

// Abort current request
<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>;
\`\`\`

#### Resend

The resend feature allows users to regenerate replies for specific messages, which is very useful when AI answers are unsatisfactory or errors occur.

#### Basic Usage

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onReload } = useXChat({ provider });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <span>{msg.message.content}</span>
          {msg.message.role === 'assistant' && (
            <button onClick={() => onReload(msg.id)}>Regenerate</button>
          )}
        </div>
      ))}
    </div>
  );
};
\`\`\`

#### Resend Notes

1. **Can only regenerate AI replies**: Usually can only use resend on messages with \`role === 'assistant'\`
2. **Status management**: Resend will set the corresponding message status to \`loading\`
3. **Parameter passing**: Can pass additional information to Provider through \`extra\` parameter
4. **Error handling**: It is recommended to use \`requestFallback\` to handle resend failures

### 3. Error Handling

#### Unified Error Handling

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
        content: 'Network connection failed, please check network',
        role: 'assistant' as const,
      };
    }

    // User interruption
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
      };
    }

    // Server error
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
    };
  },
});
\`\`\`

### 4. Message Display During Request

Generally no configuration is needed, default use with Bubble component's loading state. For custom loading content, refer to:

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onRequest } = useXChat({ provider });
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
\`\`\`

#### Custom Request Placeholder

When requestPlaceholder is set, placeholder messages will be displayed before the request starts, used with Bubble component's loading state.

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      content: 'Generating...',
      role: 'assistant',
    };
  },
});
\`\`\``},{title:"EXAMPLES.md",path:"EXAMPLES.md",content:`# Complete Example Projects

## Project with Conversation Management

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';
import { Bubble, Sender, Conversations, type ConversationsProps } from '@ant-design/x';
import { GetRef } from 'antd';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: 'New Conversation' }]);
  const [activeKey, setActiveKey] = useState('1');
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  // Create new conversation
  const handleNewConversation = () => {
    const newKey = Date.now().toString();
    const newConversation = {
      key: newKey,
      label: \`Conversation \${conversations.length + 1}\`,
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveKey(newKey);
  };

  // Delete conversation
  const handleDeleteConversation = (key: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      if (filtered.length === 0) {
        // If no conversations left, create a new one
        const newKey = Date.now().toString();
        return [{ key: newKey, label: 'New Conversation' }];
      }
      return filtered;
    });

    // If deleted current active conversation, switch to first one
    if (activeKey === key) {
      setActiveKey(conversations[0]?.key || '1');
    }
  };

  const { messages, onRequest, isRequesting, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    conversationKey: activeKey,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: 'Cancelled', role: 'assistant' as const, timestamp: Date.now() };
      }
      return { content: 'Request failed', role: 'assistant' as const, timestamp: Date.now() };
    },
  });

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Delete',
        key: 'delete',
        danger: true,
      },
    ],
    onClick: ({ key: menuKey }) => {
      if (menuKey === 'delete') {
        handleDeleteConversation(conversation.key);
      }
    },
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation List */}
      <div
        style={{
          width: 240,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Conversations
          creation={{
            onClick: handleNewConversation,
          }}
          items={conversations}
          activeKey={activeKey}
          menu={menuConfig}
          onActiveChange={setActiveKey}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ padding: 16, borderBottom: '1px solid #f0f0f0', fontSize: 16, fontWeight: 500 }}
        >
          {conversations.find((c) => c.key === activeKey)?.label || 'Conversation'}
        </div>

        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          <Bubble.List
            role={{
              assistant: {
                placement: 'start',
              },
              user: {
                placement: 'end',
              },
            }}
            items={messages.map((msg) => ({
              key: msg.id,
              content: msg.message.content,
              role: msg.message.role,
              loading: msg.status === 'loading',
            }))}
          />
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Sender
            loading={isRequesting}
            ref={senderRef}
            onSubmit={(content: string) => {
              onRequest({ query: content });
              senderRef.current?.clear?.();
            }}
            onCancel={abort}
            placeholder="Enter message..."
          />
        </div>
      </div>
    </div>
  );
};
export default App;
\`\`\`

## With State Management Resend

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Sender } from '@ant-design/x';
import { Button, type GetRef } from 'antd';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';

const ChatWithRegenerate: React.FC = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const { messages, onReload, isRequesting, onRequest, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    requestPlaceholder: {
      content: 'Thinking...',
      role: 'assistant',
      timestamp: Date.now(),
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || 'Reply cancelled',
          role: 'assistant' as const,
          timestamp: Date.now(),
        };
      }
      return {
        content: errorInfo?.error?.message || 'Network error, please try again later',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    },
  });

  // Track message ID being regenerated
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const handleRegenerate = (messageId: string | number): void => {
    setRegeneratingId(messageId);
    onReload(
      messageId,
      {},
      {
        extraInfo: { regenerate: true },
      },
    );
  };

  return (
    <div>
      <Bubble.List
        role={{
          assistant: {
            placement: 'start',
          },
          user: {
            placement: 'end',
          },
        }}
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message.content,
          role: msg.message.role,
          loading: msg.status === 'loading',
          footer: msg.message.role === 'assistant' && (
            <Button
              type="text"
              size="small"
              loading={regeneratingId === msg.id && isRequesting}
              onClick={() => handleRegenerate(msg.id)}
              disabled={isRequesting && regeneratingId !== msg.id}
            >
              {regeneratingId === msg.id ? 'Generating...' : 'Regenerate'}
            </Button>
          ),
        }))}
      />
      <div>
        <Sender
          loading={isRequesting}
          onSubmit={(content: string) => {
            onRequest({ query: content });
            senderRef.current?.clear?.();
          }}
          onCancel={abort}
          ref={senderRef}
          placeholder="Enter message..."
          allowSpeech
          prefix={
            <Sender.Header
              title="AI Assistant"
              open={false}
              styles={{
                content: { padding: 0 },
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default ChatWithRegenerate;
\`\`\``}]}]}];var g=()=>{let[e,t]=(0,d.useState)(["use-x-chat","SKILL.md"]),[s,n]=(0,d.useState)(["use-x-chat"]);return(0,r.jsxs)("div",{style:{padding:24},children:[(0,r.jsxs)(c.default,{style:{marginBottom:16},children:[(0,r.jsx)(o.default,{type:"primary",onClick:()=>{t(["use-x-chat","SKILL.md"]),n(["use-x-chat"]);},children:"Reset State"}),(0,r.jsx)(o.default,{onClick:()=>{n(["use-x-chat","use-x-chat/reference"]);},children:"Expand All"}),(0,r.jsx)(o.default,{onClick:()=>{n([]);},children:"Collapse All"}),(0,r.jsx)(o.default,{onClick:()=>{t(["use-x-chat","reference","API.md"]),n(["use-x-chat","use-x-chat/reference"]);},children:"Select API.md"})]}),(0,r.jsx)(i.default,{style:{marginBottom:16},children:(0,r.jsxs)(c.default,{vertical:!0,children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("strong",{children:"Current Selected File:"})," ",e&&e.length>0?e.join("/"):"None"]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("strong",{children:"Expanded Nodes:"})," ",s.join(", ")||"None"]})]})}),(0,r.jsx)(a.default,{style:{height:500},treeData:u,directoryTitle:(0,r.jsx)(l.default,{style:{whiteSpace:"nowrap",paddingInline:16,width:"100%",paddingBlock:8,borderBottom:"1px solid #f0f0f0"},align:"center",children:"File Browser"}),selectedFile:e,onSelectedFileChange:({path:e})=>t(e),expandedPaths:s,onExpandedPathsChange:n})]});};},ea55af2a:function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return g;}});var n=s("777fffbe"),r=s("8090cfc0");s("0a084bfa");var a=n._(s("c71c30be")),o=n._(s("0ef2e5e5")),i=n._(s("d78812de")),l=n._(s("ce5dd0f9")),c=n._(s("40ff87e3"));let d={cn:{root:"\u6839\u8282\u70B9",directoryTree:"\u76EE\u5F55\u6811\u5BB9\u5668",directoryTitle:"\u76EE\u5F55\u6811\u6807\u9898",filePreview:"\u6587\u4EF6\u9884\u89C8\u5BB9\u5668",previewTitle:"\u9884\u89C8\u6807\u9898",previewRender:"\u9884\u89C8\u5185\u5BB9"},en:{root:"Root",directoryTree:"Directory tree container",directoryTitle:"Directory tree title",filePreview:"File preview container",previewTitle:"Preview title",previewRender:"Preview content"}},u=[{title:"src",path:"src",children:[{title:"components",path:"components",children:[{title:"Button.tsx",path:"Button.tsx",content:`import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'primary' | 'default' | 'dashed';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'default' 
}) => {
  return (
    <button 
      className={\`btn btn-\${type}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;`},{title:"Input.tsx",path:"Input.tsx",content:`import React from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChange 
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="input"
    />
  );
};

export default Input;`}]},{title:"utils",path:"utils",children:[{title:"helper.ts",path:"helper.ts",content:`export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`}]}]},{title:"package.json",path:"package.json",content:`{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`}];var g=()=>{let[e]=(0,c.default)(d);return(0,r.jsx)(l.default,{componentName:"Folder",semantics:[{name:"root",desc:e.root},{name:"directoryTree",desc:e.directoryTree},{name:"directoryTitle",desc:e.directoryTitle},{name:"filePreview",desc:e.filePreview},{name:"previewTitle",desc:e.previewTitle},{name:"previewRender",desc:e.previewRender}],children:(0,r.jsx)(o.default,{treeData:u,directoryTreeWith:200,directoryTitle:(0,r.jsxs)(i.default,{style:{paddingInline:16,whiteSpace:"nowrap",width:"100%",paddingBlock:8,borderBottom:"1px solid #f0f0f0"},align:"center",children:[(0,r.jsx)(a.default,{style:{marginRight:8}}),"\u9879\u76EE\u6587\u4EF6\u6D4F\u89C8\u5668"]}),defaultSelectedFile:["src","components","Button.tsx"]})});};},ea89dea8:function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"refractor",{enumerable:!0,get:function(){return i;}});var n=s("ae022160"),r=s("94d17c2f"),a=s("c79cb849");function o(){}o.prototype=a.Prism;let i=new o;i.highlight=function(e,t){let s,n;if("string"!=typeof e)throw TypeError("Expected `string` for `value`, got `"+e+"`");if(t&&"object"==typeof t)s=t;else{if("string"!=typeof(n=t))throw TypeError("Expected `string` for `name`, got `"+n+"`");if(Object.hasOwn(i.languages,n))s=i.languages[n];else throw Error("Unknown language: `"+n+"` is not registered");}return{type:"root",children:a.Prism.highlight.call(i,e,s,n)};},i.register=function(e){if("function"!=typeof e||!e.displayName)throw Error("Expected `function` for `syntax`, got `"+e+"`");Object.hasOwn(i.languages,e.displayName)||e(i);},i.alias=function(e,t){let s;let n=i.languages,r={};for(s in"string"==typeof e?t&&(r[e]=t):r=e,r)if(Object.hasOwn(r,s)){let e=r[s],t="string"==typeof e?[e]:e,a=-1;for(;++a<t.length;)n[t[a]]=n[s];}},i.registered=function(e){if("string"!=typeof e)throw TypeError("Expected `string` for `aliasOrLanguage`, got `"+e+"`");return Object.hasOwn(i.languages,e);},i.listLanguages=function(){let e;let t=i.languages,s=[];for(e in t)Object.hasOwn(t,e)&&"object"==typeof t[e]&&s.push(e);return s;},i.util.encode=function(e){return e;},i.Token.stringify=function e(t,s){if("string"==typeof t)return{type:"text",value:t};if(Array.isArray(t)){let n=[],r=-1;for(;++r<t.length;)null!==t[r]&&void 0!==t[r]&&""!==t[r]&&n.push(e(t[r],s));return n;}let a={attributes:{},classes:["token",t.type],content:e(t.content,s),language:s,tag:"span",type:t.type};return t.alias&&a.classes.push(..."string"==typeof t.alias?[t.alias]:t.alias),i.hooks.run("wrap",a),(0,n.h)(a.tag+"."+a.classes.join("."),function(e){let t;for(t in e)Object.hasOwn(e,t)&&(e[t]=(0,r.parseEntities)(e[t]));return e;}(a.attributes),a.content);};},ee0baa9d:function(e,t,s){"use strict";s.d(t,"__esModule",{value:!0}),s.d(t,"default",{enumerable:!0,get:function(){return i;}});var n=s("777fffbe"),r=s("8090cfc0");s("6999d319");var a=n._(s("0ef2e5e5"));let o=[{title:"use-x-chat",path:"use-x-chat",children:[{title:"SKILL.md",path:"SKILL.md",content:`---
name: use-x-chat
version: 2.3.0
description: Focus on explaining how to use the useXChat Hook, including custom Provider integration, message management, error handling, etc.
---

# \u{1F3AF} Skill Positioning

> **Core Positioning**: Use the \`useXChat\` Hook to build professional AI conversation applications **Prerequisites**: Already have a custom Chat Provider (refer to [x-chat-provider skill](../x-chat-provider))

## Table of Contents

- [\u{1F680} Quick Start](#-quick-start)
  - [Dependency Management](#1-dependency-management)
  - [Three-step Integration](#2-three-step-integration)
- [\u{1F9E9} Core Concepts](#-core-concepts)
  - [Technology Stack Architecture](#technology-stack-architecture)
  - [Data Model](#data-model)
- [\u{1F527} Core Function Details](#-core-function-details)
  - [Message Management](#1-message-management)
  - [Request Control](#2-request-control)
  - [Error Handling](#3-error-handling)
  - [Complete Example Project](#-complete-example-project)
- [\u{1F4CB} Prerequisites and Dependencies](#-prerequisites-and-dependencies)
- [\u{1F6A8} Development Rules](#-development-rules)
- [\u{1F517} Reference Resources](#-reference-resources)
  - [\u{1F4DA} Core Reference Documentation](#-core-reference-documentation)
  - [\u{1F310} SDK Official Documentation](#-sdk-official-documentation)
  - [\u{1F4BB} Example Code](#-example-code)

# \u{1F680} Quick Start

## 1. Dependency Management

### \u{1F3AF} Automatic Dependency Handling

### \u{1F4CB} System Requirements

- **@ant-design/x-sdk**: 2.2.2+ (automatically installed)
- **@ant-design/x**: latest version (UI components, automatically installed)

### \u{26A0}\u{FE0F} Version Issue Auto-fix

If version mismatch is detected, the skill will automatically:

- \u{2705} Prompt current version status
- \u{2705} Provide fix suggestions
- \u{2705} Use relative paths to ensure compatibility

#### \u{1F3AF} Built-in Version Check

The use-x-chat skill has built-in version checking functionality, automatically checking version compatibility on startup:

**\u{1F50D} Auto-check Function** The skill will automatically check if the \`@ant-design/x-sdk\` version meets requirements (\u{2265}2.2.2) on startup:

**\u{1F4CB} Check Contents:**

- \u{2705} Currently installed version
- \u{2705} Whether it meets minimum requirements (\u{2265}2.2.2)
- \u{2705} Automatically provide fix suggestions
- \u{2705} Friendly error prompts

**\u{1F6E0}\u{FE0F} Version Issue Fix** If version mismatch is detected, the skill will provide specific fix commands:

\`\`\`bash
# Auto-prompted fix commands
npm install @ant-design/x-sdk@^2.2.2

# Or install latest version
npm install @ant-design/x-sdk@latest
\`\`\`

## 2. Three-step Integration

### Step 1: Prepare Provider

This part is handled by the x-chat-provider skill

\`\`\`ts
import { MyChatProvider } from './MyChatProvider';
import { XRequest } from '@ant-design/x-sdk';

// Recommended to use XRequest as the default request method
const provider = new MyChatProvider({
  // Default use XRequest, no need for custom fetch
  request: XRequest('https://your-api.com/chat'),
  // When requestPlaceholder is set, placeholder message will be displayed before request starts
  requestPlaceholder: {
    content: 'Thinking...',
    role: 'assistant',
    timestamp: Date.now(),
  },
  // When requestFallback is set, fallback message will be displayed when request fails
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    }
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
      timestamp: Date.now(),
    };
  },
});
\`\`\`

### Step 2: Basic Usage

\`\`\`tsx
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
\`\`\`

### Step 3: UI Integration

\`\`\`tsx
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
\`\`\``},{title:"reference",path:"reference",children:[{title:"API.md",path:"API.md",content:`### useXChat

\`\`\`tsx | pure
type useXChat<
  ChatMessage extends SimpleType = object,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
> = (config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) => XChatConfigReturnType;
\`\`\`

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| ChatMessage | Message data type, defines the structure of chat messages | object | object | - |
| ParsedMessage | Parsed message type, message format for component consumption | ChatMessage | ChatMessage | - |
| Input | Request parameter type, defines the structure of request parameters | RequestParams<ChatMessage> | RequestParams<ChatMessage> | - |
| Output | Response data type, defines the format of received response data | SSEOutput | SSEOutput | - |

### XChatConfig

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| provider | Data provider used to convert data and requests of different structures into formats that useXChat can consume. The platform includes built-in \`DefaultChatProvider\` and \`OpenAIChatProvider\`, and you can also implement your own Provider by inheriting \`AbstractChatProvider\`. See: [Chat Provider Documentation](/x-sdks/chat-provider) | AbstractChatProvider<ChatMessage, Input, Output> | - | - |
| conversationKey | Session unique identifier (globally unique), used to distinguish different sessions | string | Symbol('ConversationKey') | - |
| defaultMessages | Default display messages | MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => MessageInfo<ChatMessage>[] | (info: { conversationKey?: string }) => Promise<MessageInfo<ChatMessage>[]> | - | - |
| parser | Converts ChatMessage into ParsedMessage for consumption. When not set, ChatMessage is consumed directly. Supports converting one ChatMessage into multiple ParsedMessages | (message: ChatMessage) => BubbleMessage | BubbleMessage[] | - | - |
| requestFallback | Fallback message for failed requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>,info: { error: Error; errorInfo: any; messages: ChatMessage[], message: ChatMessage }) => ChatMessage|Promise<ChatMessage> | - | - |
| requestPlaceholder | Placeholder message during requests. When not provided, no message will be displayed | ChatMessage | (requestParams: Partial<Input>, info: { messages: Message[] }) => ChatMessage | Promise<Message> | - | - |

### XChatConfigReturnType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| abort | Cancel request | () => void | - | - |
| isRequesting | Whether a request is in progress | boolean | - | - |
| isDefaultMessagesRequesting | Whether the default message list is requesting | boolean | false | 2.2.0 |
| messages | Current managed message list content | MessageInfo<ChatMessage>[] | - | - |
| parsedMessages | Content translated through \`parser\` | MessageInfo<ParsedMessages>[] | - | - |
| onReload | Regenerate, will send request to backend and update the message with new returned data | (id: string | number, requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| onRequest | Add a Message and trigger request | (requestParams: Partial<Input>, opts: { extra: AnyObject }) => void | - | - |
| setMessages | Directly modify messages without triggering requests | (messages: Partial<MessageInfo<ChatMessage>>[]) => void | - | - |
| setMessage | Directly modify a single message without triggering requests | (id: string | number, info: Partial<MessageInfo<ChatMessage>>) => void | - | - |
| removeMessage | Deleting a single message will not trigger a request | (id: string | number) => void | - | - |
| queueRequest | Will add the request to a queue, waiting for the conversationKey to be initialized before sending | (conversationKey: string | symbol, requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => void | - | - |

#### MessageInfo

\`\`\`ts
interface MessageInfo<ChatMessage> {
  id: number | string;
  message: ChatMessage;
  status: MessageStatus;
  extra?: AnyObject;
}
\`\`\`

#### MessageStatus

\`\`\`ts
type MessageStatus = 'local' | 'loading' | 'updating' | 'success' | 'error' | 'abort';
\`\`\``},{title:"CORE.md",path:"CORE.md",content:`### 1. Message Management

#### Get Message List

\`\`\`ts
const { messages } = useXChat({ provider });
// messages structure: MessageInfo<MessageType>[]
// Actual message data is in msg.message
\`\`\`

#### Manually Set Messages

\`\`\`ts
const { setMessages } = useXChat({ provider });

// Clear messages
setMessages([]);

// Add welcome message - note it's MessageInfo structure
setMessages([
  {
    id: 'welcome',
    message: {
      content: 'Welcome to AI Assistant',
      role: 'assistant',
    },
    status: 'success',
  },
]);
\`\`\`

#### Update Single Message

\`\`\`ts
const { setMessage } = useXChat({ provider });

// Update message content - need to update message object
setMessage('msg-id', {
  message: { content: 'New content', role: 'assistant' },
});

// Mark as error - update status
setMessage('msg-id', { status: 'error' });
\`\`\`

### 2. Request Control

#### Send Message

\`\`\`ts
const { onRequest } = useXChat({ provider });

// Basic usage
onRequest({ query: 'User question' });

// With additional parameters
onRequest({
  query: 'User question',
  context: 'Previous conversation content',
  userId: 'user123',
});
\`\`\`

#### Abort Request

\`\`\`tsx
const { abort, isRequesting } = useXChat({ provider });

// Abort current request
<button onClick={abort} disabled={!isRequesting}>
  Stop generation
</button>;
\`\`\`

#### Resend

The resend feature allows users to regenerate replies for specific messages, which is very useful when AI answers are unsatisfactory or errors occur.

#### Basic Usage

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onReload } = useXChat({ provider });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <span>{msg.message.content}</span>
          {msg.message.role === 'assistant' && (
            <button onClick={() => onReload(msg.id)}>Regenerate</button>
          )}
        </div>
      ))}
    </div>
  );
};
\`\`\`

#### Resend Notes

1. **Can only regenerate AI replies**: Usually can only use resend on messages with \`role === 'assistant'\`
2. **Status management**: Resend will set the corresponding message status to \`loading\`
3. **Parameter passing**: Can pass additional information to Provider through \`extra\` parameter
4. **Error handling**: It is recommended to use \`requestFallback\` to handle resend failures

### 3. Error Handling

#### Unified Error Handling

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestFallback: (_, { error, errorInfo, messageInfo }) => {
    // Network error
    if (!navigator.onLine) {
      return {
        content: 'Network connection failed, please check network',
        role: 'assistant' as const,
      };
    }

    // User interruption
    if (error.name === 'AbortError') {
      return {
        content: messageInfo?.message?.content || 'Reply cancelled',
        role: 'assistant' as const,
      };
    }

    // Server error
    return {
      content: errorInfo?.error?.message || 'Network error, please try again later',
      role: 'assistant' as const,
    };
  },
});
\`\`\`

### 4. Message Display During Request

Generally no configuration is needed, default use with Bubble component's loading state. For custom loading content, refer to:

\`\`\`tsx
const ChatComponent = () => {
  const { messages, onRequest } = useXChat({ provider });
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
\`\`\`

#### Custom Request Placeholder

When requestPlaceholder is set, placeholder messages will be displayed before the request starts, used with Bubble component's loading state.

\`\`\`tsx
const { messages } = useXChat({
  provider,
  requestPlaceholder: (_, { error, messageInfo }) => {
    return {
      content: 'Generating...',
      role: 'assistant',
    };
  },
});
\`\`\``},{title:"EXAMPLES.md",path:"EXAMPLES.md",content:`# Complete Example Projects

## Project with Conversation Management

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';
import { Bubble, Sender, Conversations, type ConversationsProps } from '@ant-design/x';
import { GetRef } from 'antd';

const App: React.FC = () => {
  const [conversations, setConversations] = useState([{ key: '1', label: 'New Conversation' }]);
  const [activeKey, setActiveKey] = useState('1');
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  // Create new conversation
  const handleNewConversation = () => {
    const newKey = Date.now().toString();
    const newConversation = {
      key: newKey,
      label: \`Conversation \${conversations.length + 1}\`,
    };
    setConversations((prev) => [...prev, newConversation]);
    setActiveKey(newKey);
  };

  // Delete conversation
  const handleDeleteConversation = (key: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      if (filtered.length === 0) {
        // If no conversations left, create a new one
        const newKey = Date.now().toString();
        return [{ key: newKey, label: 'New Conversation' }];
      }
      return filtered;
    });

    // If deleted current active conversation, switch to first one
    if (activeKey === key) {
      setActiveKey(conversations[0]?.key || '1');
    }
  };

  const { messages, onRequest, isRequesting, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    conversationKey: activeKey,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return { content: 'Cancelled', role: 'assistant' as const, timestamp: Date.now() };
      }
      return { content: 'Request failed', role: 'assistant' as const, timestamp: Date.now() };
    },
  });

  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: 'Delete',
        key: 'delete',
        danger: true,
      },
    ],
    onClick: ({ key: menuKey }) => {
      if (menuKey === 'delete') {
        handleDeleteConversation(conversation.key);
      }
    },
  });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Conversation List */}
      <div
        style={{
          width: 240,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Conversations
          creation={{
            onClick: handleNewConversation,
          }}
          items={conversations}
          activeKey={activeKey}
          menu={menuConfig}
          onActiveChange={setActiveKey}
        />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ padding: 16, borderBottom: '1px solid #f0f0f0', fontSize: 16, fontWeight: 500 }}
        >
          {conversations.find((c) => c.key === activeKey)?.label || 'Conversation'}
        </div>

        <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
          <Bubble.List
            role={{
              assistant: {
                placement: 'start',
              },
              user: {
                placement: 'end',
              },
            }}
            items={messages.map((msg) => ({
              key: msg.id,
              content: msg.message.content,
              role: msg.message.role,
              loading: msg.status === 'loading',
            }))}
          />
        </div>

        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
          <Sender
            loading={isRequesting}
            ref={senderRef}
            onSubmit={(content: string) => {
              onRequest({ query: content });
              senderRef.current?.clear?.();
            }}
            onCancel={abort}
            placeholder="Enter message..."
          />
        </div>
      </div>
    </div>
  );
};
export default App;
\`\`\`

## With State Management Resend

\`\`\`tsx
import React, { useRef, useState } from 'react';
import { useXChat } from '@ant-design/x-sdk';
import { Bubble, Sender } from '@ant-design/x';
import { Button, type GetRef } from 'antd';
import { chatProvider } from '../services/chatService';
import type { ChatMessage } from '../providers/ChatProvider';

const ChatWithRegenerate: React.FC = () => {
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const { messages, onReload, isRequesting, onRequest, abort } = useXChat<
    ChatMessage,
    ChatMessage,
    { query: string },
    { content: string; time: string; status: 'success' | 'error' }
  >({
    provider: chatProvider,
    requestPlaceholder: {
      content: 'Thinking...',
      role: 'assistant',
      timestamp: Date.now(),
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === 'AbortError') {
        return {
          content: messageInfo?.message?.content || 'Reply cancelled',
          role: 'assistant' as const,
          timestamp: Date.now(),
        };
      }
      return {
        content: errorInfo?.error?.message || 'Network error, please try again later',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
    },
  });

  // Track message ID being regenerated
  const [regeneratingId, setRegeneratingId] = useState<string | number | null>(null);

  const handleRegenerate = (messageId: string | number): void => {
    setRegeneratingId(messageId);
    onReload(
      messageId,
      {},
      {
        extraInfo: { regenerate: true },
      },
    );
  };

  return (
    <div>
      <Bubble.List
        role={{
          assistant: {
            placement: 'start',
          },
          user: {
            placement: 'end',
          },
        }}
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message.content,
          role: msg.message.role,
          loading: msg.status === 'loading',
          footer: msg.message.role === 'assistant' && (
            <Button
              type="text"
              size="small"
              loading={regeneratingId === msg.id && isRequesting}
              onClick={() => handleRegenerate(msg.id)}
              disabled={isRequesting && regeneratingId !== msg.id}
            >
              {regeneratingId === msg.id ? 'Generating...' : 'Regenerate'}
            </Button>
          ),
        }))}
      />
      <div>
        <Sender
          loading={isRequesting}
          onSubmit={(content: string) => {
            onRequest({ query: content });
            senderRef.current?.clear?.();
          }}
          onCancel={abort}
          ref={senderRef}
          placeholder="Enter message..."
          allowSpeech
          prefix={
            <Sender.Header
              title="AI Assistant"
              open={false}
              styles={{
                content: { padding: 0 },
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default ChatWithRegenerate;
\`\`\``}]}]}];var i=()=>(0,r.jsx)("div",{style:{padding:24,height:500},children:(0,r.jsx)(a.default,{treeData:o,defaultSelectedFile:["use-x-chat","SKILL.md"]})});}}]);