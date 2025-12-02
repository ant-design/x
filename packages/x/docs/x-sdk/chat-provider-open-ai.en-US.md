---
group:
  title: Chat Provider
  order: 2
title: OpenAIChatProvider
order: 2
---

`OpenAIChatProvider` is a `Chat Provider` compatible with `OpenAI`. It converts request parameters and response data into a format compatible with the `OpenAI` interface.

`XModelMessage`, `XModelParams`, and `XModelResponse` are the type definitions for input and output of `OpenAIChatProvider`, which can be directly used in the generics `ChatMessage`, `Input`, and `Output` of `useXChat`.

## Usage Example

<code src="./demos/x-chat/model.tsx">Basic</code>
