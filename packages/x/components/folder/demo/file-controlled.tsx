import type { FolderProps } from '@ant-design/x';
import { Folder } from '@ant-design/x';
import { Button, Flex, Space } from 'antd';
import React, { useState } from 'react';

const treeData: FolderProps['treeData'] = [
  {
    title: 'x-chat-provider',
    path: 'x-chat-provider',
    children: [
      {
        title: 'SKILL.md',
        path: 'SKILL.md',
        content: `---
name: x-chat-provider
version: 2.3.0
description: Focus on implementing custom Chat Provider, helping to adapt any streaming interface to Ant Design X standard format
---

# 🎯 Skill Positioning

**This skill focuses on solving one problem**: How to quickly adapt your streaming interface to Ant Design X's Chat Provider.

**Not involved**: useXChat usage tutorial (that's another skill).

## Table of Contents

- [📦 Technology Stack Overview](#-technology-stack-overview)
  - [Ant Design X Ecosystem](#ant-design-x-ecosystem)
  - [Core Concepts](#core-concepts)
- [🚀 Quick Start](#-quick-start)
  - [Dependency Management](#dependency-management)
  - [Built-in Provider](#built-in-provider)
  - [When to Use Custom Provider](#when-to-use-custom-provider)
- [📋 Four Steps to Implement Custom Provider](#-four-steps-to-implement-custom-provider)
  - [Step1: Analyze Interface Format](#step1-analyze-interface-format)
  - [Step2: Create Provider Class](#step2-create-provider-class)
  - [Step3: Check Files](#step3-check-files)
  - [Step4: Use Provider](#step4-use-provider)
- [🔧 Common Scenario Adaptation](#-common-scenario-adaptation)
- [📋 Joint Skill Usage](#-joint-skill-usage)
  - [Scenario1: Complete AI Conversation Application](#scenario1-complete-ai-conversation-application)
  - [Scenario2: Only Create Provider](#scenario2-only-create-provider)
  - [Scenario3: Use Built-in Provider](#scenario3-use-built-in-provider)
- [⚠️ Important Reminders](#️-important-reminders)
  - [Mandatory Rule: Prohibit Writing request Method](#mandatory-rule-prohibit-writing-request-method)
- [⚡ Quick Checklist](#-quick-checklist)
- [🚨 Development Rules](#-development-rules)
- [🔗 Reference Resources](#-reference-resources)
  - [📚 Core Reference Documentation](#-core-reference-documentation)
  - [🌐 SDK Official Documentation](#-sdk-official-documentation)
  - [💻 Example Code](#-example-code)`,
      },
      {
        title: 'reference',
        path: 'reference',
        children: [
          {
            title: 'EXAMPLES.md',
            path: 'EXAMPLES.md',
            content: `## Scenario1: OpenAI Format

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
\`\`\``,
          },
        ],
      },
    ],
  },
];

export default () => {
  const [selectedFile, setSelectedFile] = useState<string[]>();

  const handleSelectSkill = () => {
    setSelectedFile(['x-chat-provider', 'SKILL.md']);
  };

  const handleSelectExamples = () => {
    setSelectedFile(['x-chat-provider', 'reference', 'EXAMPLES.md']);
  };

  const handleClearSelection = () => {
    setSelectedFile([]);
  };

  return (
    <div style={{ padding: 24, height: 450 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleSelectSkill}>
          Select SKILL.md
        </Button>
        <Button type="primary" onClick={handleSelectExamples}>
          Select EXAMPLES.md
        </Button>
        <Button onClick={handleClearSelection}>Clear Selection</Button>
      </Space>
      <div style={{ marginBottom: 16 }}>
        <strong>Current Selected File:</strong>
        {selectedFile && selectedFile.length > 0 ? selectedFile.join('/') : 'None'}
      </div>
      <Folder
        treeData={treeData}
        directoryTitle={
          <Flex
            style={{
              paddingInline: 16,
              width: '100%',
              whiteSpace: 'nowrap',
              paddingBlock: 8,
              borderBottom: '1px solid #f0f0f0',
            }}
            align="center"
          >
            Project File Browser
          </Flex>
        }
        selectedFile={selectedFile}
        onSelectedFileChange={({ path }) => {
          setSelectedFile(path);
        }}
      />
    </div>
  );
};
