import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const content = `
# Ant Design X: The Ultimate AI Conversation UI Framework

> "Easily build AI-driven interfaces"
>
> — Ant Design X Team

## ✨ Features

- 🌈 Best practices from enterprise-level AI products: Based on RICH interaction paradigms, providing excellent AI interaction experience
- 🧩 Flexible atomic components: Covering most AI scenarios, helping you quickly build personalized AI interaction pages
- ✨ Stream-friendly, extensible, and high-performance Markdown renderer: Supports streaming formulas, code highlighting, mermaid diagrams, etc.
- 🚀 Out-of-the-box model/agent integration: Easily connect to OpenAI-compatible model/agent services
- ⚡️ Efficient management of large model data streams: Provides handy data stream management features for more efficient development
- 📦 Rich template support: Multiple templates for quick LUI app development
- 🛡 Full TypeScript coverage: Developed with TypeScript, providing complete type support for better experience and reliability
- 🎨 Deep theme customization: Fine-grained style adjustments for personalized needs in various scenarios

## 🧩 Atomic Components

Based on the RICH interaction paradigm, we provide many atomic components for different interaction stages to help you flexibly build your AI application:

### Core Components
- **Bubble**: Message bubble for displaying chat messages
- **Bubble.List**: Virtualized message list for handling large datasets
- **Sender**: Input box for sending messages
- **Conversations**: Conversation history management
- **Welcome**: Welcome screen component

### Input Components
- **Prompts**: Quick suggestion prompts
- **Attachments**: File upload and preview

### Display Components
- **ThoughtChain**: AI reasoning process display
- **Sources**: Reference and citation display
- **FileCard**: File preview cards

## 🔗 Ecosystem

### Related Packages
- **@ant-design/x-markdown**: Advanced markdown rendering with streaming support
- **@ant-design/x-sdk**: AI model integration and data stream management

### Framework Integrations
- **Next.js**: Server-side rendering support
- **Vite**: Fast development experience
- **Create React App**: Zero configuration setup
- **Umi**: Enterprise-grade framework

> Ant Design X is more than just a component library—it's a complete solution for building the next generation of AI-powered applications. Start building today and create experiences that delight your users.
`;

const App: React.FC = () => {
  const [className] = useMarkdownTheme();

  return <XMarkdown content={content} className={className} />;
};

export default App;
