---
group:
  title: 💭 Conversation 会话设计
  order: 3
order: 6
title: 结束
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*l97pQZf55w4AAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT 概述

AI 在对话过程中，应以优雅的方式结束交流。通过精心设计的结束语，AI 不仅能够展示其社交智慧，还能确保用户在对话结束时感到满意和受尊重。在对话即将结束时，AI 应提供有益的总结或明确的后续步骤建议，使得对话的收尾既流畅又富有成效，为用户留下积极的印象，并为未来的互动奠定良好的基础。

## HOW 如何操作

### 已完成的意图

当用户的需求或意图得到满足时，AI 应确保用户清楚地认识到任务已经圆满完成，并通过恰当的结束语来确认对话的结束，使用户感到满意和被尊重。此外，AI 应主动询问用户是否需要进一步的帮助或有其他问题，以确保用户在对话结束时感到被充分照顾。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9AP9RYhIBL8AAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*FrGtRqUj_7MAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 放弃的意图

用户可能会因为多种原因而放弃正在进行的任务。无论具体原因是什么，AI 应尊重用户的决定，允许他们在适当的时候结束对话。这意味着 AI 需要提供清晰的指示或选项，让用户可以轻松选择退出对话，同时确保用户知道他们随时可以回来继续或重新开始。通过这种方式，AI 支持用户保持控制权，并在交流过程中感到舒适和尊重。

#### 让用户可以直接退出

除非会丢失重大进展，否则不要进行二次确认。

> 请注意，“退出”、“取消”、“停止”、“没关系”和“再见”是默认支持的，因此如果用户说这些，AI 的操作将结束。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bqwuR5dIx4IAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 合理结束对话

一旦用户表明对话已结束，那就假设你已经失去了他们的注意力。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CQ5gRb8APpUAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CW8eR523owIAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 不支持的意图

当 AI 无法支持用户请求的功能时，对话将会终止。在这种情况下，关键的做法是坦诚地承认 AI 能力的不足，并提供可行的替代方案或引导用户通过其他途径实现目标。此外，这也是收集反馈和数据的宝贵机会，用以未来增强 AI 的功能和效能，更准确地迎合用户需求。通过采取透明且用户友好的错误处理措施，可以最大程度地减少用户的失望感，并保持他们对 AI 服务的信任和满意度。

#### 回复简洁恰当

1. 当请求超出范围时，简要通知用户，并避免过度使用道歉，例如一直说“对不起”。
2. 避免过度承诺。仅在有计划构建所请求功能的情况下使用“我还不能做 X”这样的短语。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tpCSSq-dDtsAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*xbHOQY7fn_kAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 错误

在对话中，遇到无法恢复的错误，例如用户输入超出系统处理能力时，应采取适当的措施来结束对话。

1. **超时无响应：** 若用户在预设的等待时间内未进行输入，系统应自动终止对话，并提供重新启动对话的选项，以便用户能够继续获取所需服务。
2. **无法匹配输入：** 当用户的输入内容无法被系统解析或与任何预设命令不匹配时，AI 应提供明确的错误反馈。同时，AI 应给出建议或可能的行动方案，指导用户如何调整输入以获得帮助。
3. **系统错误：** 如果因为系统限制无法满足用户请求，AI 应明确告知用户当前无法提供所需服务，并提供备选或引导至其他服务。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Qa78S6hhT-QAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cGTxRbmiHawAAAAAAAAAAAAADgCCAQ/fmt.webp)
