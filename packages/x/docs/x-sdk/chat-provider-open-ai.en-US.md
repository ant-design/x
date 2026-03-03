---
category: Components
group:
  title: Chat Provider
  order: 2
title: OpenAIChatProvider
order: 2
tag: 2.0.0
packageName: x-sdk
---

`OpenAIChatProvider` is a `Chat Provider` compatible with the `OpenAI` interface. It automatically converts request parameters and response data into the OpenAI API format.

`XModelParams` defines the request parameter types for `OpenAIChatProvider`, `XModelResponse` defines the response data types, and `XModelMessage` defines the complete message data types. These types can be directly used in the generics `ChatMessage`, `Input`, and `Output` of `useXChat`.

## Usage Example

<!-- prettier-ignore -->
<code src="./demos/chat-providers/open-ai-chat-provider.tsx">Basic</code> 
<code src="./demos/x-chat/openai.tsx">With Components</code>
