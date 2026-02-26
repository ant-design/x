---
order: 1
title: Prompt 模版
group:
  title: 技能
  order: 3
---

本文档提供了使用 X 技能时的 Prompt 模版参考，帮助您更高效地使用各种技能功能。

### 聊天功能开发

<PromptTemplate title="基础聊天功能">
使用技能帮我创建一个完整的聊天应用，要求：
- 使用 Ant Design X 的 UI 组件
- 创建自定义 ChatProvider 适配流式接口，使用 XRequest 处理 SSE 请求
- 接口地址："https://api.example.com/chat"
- 请求格式：{ query: string, sessionId?: string }
- 响应格式：{ content: string, time: string, status: 'success' | 'error', role: 'assistant' | 'user' }
- 添加错误处理和用户友好的错误提示
- 按功能模块化组织代码：hooks/、types/、utils/、components/
</PromptTemplate>

### 部分优化和修改

<PromptTemplate title="自定义 Chat Provider - 工具调用">
使用技能帮我扩展当前 ChatProvider 支持工具调用：
- 基于现有 ChatProvider 添加工具调用功能
- 接口地址："https://api.example.com/chat"
- 请求格式：{ query: string, sessionId?: string }
- 响应格式：{
    content: string,
    time: string,
    status: 'success' | 'error',
    tools?: Array\<{
      id: string,
      name: string,
      code: string,
      status: 'pending' | 'running' | 'success' | 'error',
      output?: any,
      error?: string
    }\>
   }
- 消息格式：{
    role: 'assistant' | 'user',
    content: string,
    time: string,
    status: 'success' | 'error',
    tools?: Array<{
      id: string,
      name: string,
      code: string,
      status: 'running' | 'success' | 'error',
    }>
  }
</PromptTemplate>
