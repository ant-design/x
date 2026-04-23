---
order: 2
title: Prompt Templates
---

This document provides prompt templates for using X skills, helping you use various skill functions more efficiently.

### Chat Function Development

<PromptTemplate title="Basic Chat Function">
Use the skill to help me create a complete chat application with the following requirements:
- Use Ant Design X UI components
- Create a custom ChatProvider to adapt to streaming interfaces, using XRequest to handle SSE requests
- Interface address: `https://api.example.com/chat`
- Request format: `{ query: string, sessionId?: string }`
- Response format: `{ content: string, time: string, status: 'success' | 'error', role: 'assistant' | 'user' }`
- Add error handling and user-friendly error prompts
- Organize code modularly by function: hooks/, types/, utils/, components/
</PromptTemplate>

### Partial Optimization and Modification

<PromptTemplate title="Custom Chat Provider - Tool Calls">
Use the skill to help me extend the current ChatProvider to support tool calls:
- Add tool call functionality based on the existing ChatProvider
- Interface address: `https://api.example.com/chat`
- Request format: `{ query: string, sessionId?: string }`
- Response format: `{
    content: string,
    time: string,
    status: 'success' | 'error',
    tools?: Array<{
      id: string,
      name: string,
      code: string,
      status: 'pending' | 'running' | 'success' | 'error',
      output?: any,
      error?: string
    }>
   }`
- Message format: `{
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
  }`
</PromptTemplate>
