---
group:
  title: 💭 Conversation 会话设计
  order: 3
order: 2
title: 追问
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BhgMQIcgCfUAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="WLz7k">WHAT 概述</h1>

在 AI 对话交互过程中，若用户所提供的信息不足以支撑 AI 完成既定的任务目标，AI 必须采取主动措施，通过精心设计的询问来引导用户提供额外的槽位信息。这种策略不仅能够确保任务的顺利完成，还能够提升用户体验，避免因信息不足而导致的误解或错误。例如，如果用户在预订酒店时只提供了入住日期，而没有提供退房日期，AI 可以礼貌地询问：“您需要在这里住多久？”这样的询问既明确又具体，有助于获取所需信息，同时保持了对话的流畅性。

<h1 id="l8yjH"><font style="color:rgb(32, 33, 36);">HOW 如何操作</font></h1>

1. **明确识别需求：**AI 首先需要准确分析用户输入，以确定哪些信息是缺失的或不充分的。
2. **构建有效询问：**基于识别出的信息缺口，AI 应构建清晰、具体的询问，直接引导用户补充所需信息。
3. **保持对话连贯性：**在请求额外信息时，AI 应保持对话的自然流畅，避免突兀的提问，确保用户理解为何需要这些信息。

<h2 id="DrDJg"><font style="color:rgb(32, 33, 36);">消歧场景</font></h2>

在对话中，语言往往存在多种解释，通常依赖上下文来消除歧义。当上下文信息不足以明确含义时，应主动向用户请求额外的信息以澄清问题。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*D2ntT7HfxeIAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="kLRf3">组件构成</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*dW_WRphl1w8AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="MUTBC"><font style="color:rgb(32, 33, 36);">错误处理</font></h2>

当对话遇到问题时，通过精确定位问题的核心，可以提供更加针对性的帮助，引导用户迅速恢复正确的操作流程。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*mKI4QJKDLEwAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="dvGeQ">组件构成</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ALVHQ4SVycsAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="HvO3T">二次确认</h2>

尽管这种情况较少，但在以下场景中，进行再次确认是至关重要的：

- 当误解用户意图可能导致严重后果时（例如，涉及姓名、地址或用户授权分享的文本）；
- 在执行不可逆操作之前（例如，删除用户数据或完成交易）。

进行双重确认可以最大限度地减少错误和风险，确保用户得到准确无误的服务。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DGmNTpLDwf4AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="vQviS">组件构成</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rybpRpR5W_gAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="BG1rh">影响核心体验</h2>

如果可选的槽位信息对用户体验至关重要时，AI 也可以主动进行追问，以确保收集到的信息足够支持用户做出决策。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*8lGGTJP2bw0AAAAAAAAAAAAADgCCAQ/fmt.webp)
