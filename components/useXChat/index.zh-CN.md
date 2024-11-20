---
category: Components
group:
  title: 工具
  order: 5
title: useXChat
subtitle: 数据管理
description: 配合 Agent hook 进行对话数据管理。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*HjY3QKszqFEAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*G8njQogkGwAAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 1
---

## 何时使用

通过 Agent 进行会话数据管理，并产出供页面渲染使用的数据。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/stream.tsx">流式输出</code>
<code src="./demo/suggestions.tsx">多项建议</code>

## API

```tsx | pure
type useXChat<AgentMessage, ParsedMessage = AgentMessage> = (
  config: XChatConfig<AgentMessage, ParsedMessage>,
) => XChatConfigReturnType;
```

### XChatConfig

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| agent | 由 useXAgent 生成的代理器 | XAgent | - |  |
| defaultMessages | 默认展示信息 | { status, message }[] | - |  |
| parser | 将 AgentMessage 转换成消费使用的 ParsedMessage，不设置时则直接消费 AgentMessage。支持将一条 AgentMessage 转换成多条 ParsedMessage | (message: AgentMessage) => BubbleMessage \| BubbleMessage[] | - |  |
| requestFallback | 请求失败的兜底信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |
| requestPlaceholder | 请求中的占位信息，不提供则不会展示 | AgentMessage \| () => AgentMessage | - |  |

### XChatConfigReturnType

| 属性 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| messages | 当前管理的内容 | AgentMessages[] |  |
| parsedMessages | 经过 `parser` 转译过的内容 | ParsedMessages[] |  |
| onRequest | 添加一条 Message，并且触发请求 | (message) => void |  |
| setMessages | 直接修改 messages，不会触发请求 | (messages: { message, status }[]) => void |  |
