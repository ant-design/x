---
group:
  title: ❤️ Intention 意图设计
  order: 1
title: 明确意图类型
order: 1
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Hl54SK43ZcEAAAAAAAAAAAAADgCCAQ/fmt.webp)

在意图设计的概览中，我们提及了意图可依据不同领域与维度进行分类。

- **从用户意图清晰度，可分为意图清晰与意图模糊。** 通常来说意图模糊，通过对话的方式，能更加高效洞察与满足意图；而意图清晰的用户，通过简单的操作即可完成用户的目标，例如点击按钮或者图标等。
- **从用户与系统间交互目的，可分为咨询信息类与执行任务类。** 咨询信息类意图主要关联用户的查看与搜索行为，体现了用户对于信息的获取意图；执行任务类意图主要关联用户的操作与管理行为，体现了用户希望系统执行特定任务或操作的意图。

我们发现意图分类与用户行为存在着紧密的关联性。以上信息有助于我们更了解用户意图，从而设计出更加符合用户期望的界面交互模式。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9LwoQ4MwwDMAAAAAAAAAAAAADgCCAQ/fmt.webp)

在意图类型与用户行为象限图的基础上，如果我们把目前主流的 AI 产品已有的介入方式做一个叠加的话，我们发现意图类型+用户行为与 AI 介入方式存在着一定的关系。

- **Do 适合内嵌式：** 以界面操作为主，偶尔唤起AI快捷指令，更适合意图上清晰与行为上做管为主的。
- **Chat 适合独立式：** 以自然语言为主，几乎没有界面操作。更适合意图上模糊与行为上查看搜索为主的。
- **Chat+Do 适合助手式：** 自然语言和界面操作均衡配合使用。较强通用性更加适合以上 2 种交叉的场景。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9gYzSLymZJ8AAAAAAAAAAAAADgCCAQ/fmt.webp)

这并不意味着每种意图都只能对应一种交互介入方式。在实际应用中，产品设计者需要根据具体的场景和需求来选择最合适的 AI 介入形式。

## 最佳案例

### 独立式

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*PGBUQpVeVm0AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 助手式

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*lqolSZOH3-4AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 内嵌式

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*39iBTpJDTSEAAAAAAAAAAAAADgCCAQ/fmt.webp)
