---
group:
  title: ❤️ Intention 意图设计
  order: 2
order: 3
title: 引导意图表达
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pNdBQ6XZy0YAAAAAAAAAAAAADgCCAQ/fmt.webp)

用户意图表达常倾向于口语化的方式，导致 AI 无法高效识别与理解，并反过来影响了用户体验。为了引导 AI 与用户双方意图的准确匹配，我们在设计侧引入了「槽位设计」这一概念。

什么是槽位呢？槽位可以理解为预定义的参数或变量，用于匹配用户表达的关键信息，如：日期、时间、地点等。这些信息对理解用户意图和提供准确响应至关重要，共同构成对用户需求的完整理解。例如，在智能助手应用中，用户说“提醒我明天下午2点开会”，其中“明天下午2点”就是一个时间槽位。为了准确的引导用户将这些关键信息表达清楚，我们需要在交互过程中有意识的、自然的引导用户进行对应信息的表达。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*JobgQqiiT4YAAAAAAAAAAAAADgCCAQ/fmt.webp)

在蚂蚁实际业务的实践中我们发现就算是应用意图槽位匹配，依然存在部分场景匹配不到不全的情况，针对此类场景我们也整理了应对策略，去覆盖解决全量意图槽位匹配的场景，意图槽位匹配策略如下：

- **意图与槽位精准匹配：** 若用户意图的可靠度高且所有必填槽位均已成功填写，系统将直接发送指令到下游服务，执行用户请求。

- **意图匹配到多个类似槽位：** 当用户意图或关键槽位的可靠度较低时，系统将回复意图或槽位确认信息，以请求用户进一步澄清或提供额外信息，确保信息准确无误。

- **意图未匹配到槽位：** 当遇到无法直接处理的用户意图时，采用对话转移或回复兜底话术策略，确保用户得到合理引导或回应。

槽位设计的规则后续将在具体的会话设计篇目中有相关的具体应用，大家按需查阅。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*_a2DTZensl8AAAAAAAAAAAAADgCCAQ/fmt.webp)

行文至此，相信大家对于概述开篇提到“什么时候应该使用会话的方式？如何让 AI 理解用户的意图？等”问题有了初步的答案，接下来让我们进入角色设计篇、会话设计篇、混合界面篇中去进一步了解如何创造更好的 AI 产品体验。

## 最佳案例

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*SSWhQIEadIYAAAAAAAAAAAAADgCCAQ/fmt.webp)
