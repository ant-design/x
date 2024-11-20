---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 4
order: 0
title: 介绍
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bybpQaS1i9kAAAAAAAAAAAAADgCCAQ/fmt.webp)

在 AI 时代，图形界面融合了自然语言会话等多通道交互，演变出新的形态。当意图、角色、会话这一切无形的体验规则被确定之后，它们最终也将承载于具体的界面之上。无形的体验融入到有形的体验之中，在这一部分里，我们提出的 HUI 正是要定义界面这一有形的体验，保障好 AI 产品体验的最后一道门槛。

Ant Design X UI 资产正是一套基于 RICH 理念而生的、混合了多通道交互模式的 AI 界面资产，希望帮助大家轻松创造卓越 AI 产品体验。

<h1 id="nS9dS">WHY｜为什么是 Hybrid UI</h1>

<font style="color:rgb(28, 31, 35);">随着人工智能（AI）技术极为快速的发展，在各个领域都出现了更多形式多样的人与AI 配合的工作方式，这种工作方式涵盖了从简单的数据处理到复杂的决策制定等多个层面。由于人与AI的协作方式不断创新和拓展，自然也会不可避免地带来用户交互行为上全方位、深层次的变化。这些变化不仅体现在交互的频率上，还包括交互的方式、内容以及对交互结果的预期和处理等多个方面。</font>人工智能带来了工具功能的强大，也提高了用户对智能体验的期望。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*PmlSR6yuYWgAAAAAAAAAAAAADgCCAQ/fmt.webp)

在<font style="background-color:rgb(253, 253, 254);">人工智能（AI）</font>时代下，用户行为的变化是：由原来人主要的执行行为（DO），可以增加人为 <font style="background-color:rgb(253, 253, 254);">AI</font> 来提供意图信息（Chat），让 AI 去执行任务，人可以感知 AI 做的过程和结果，并做辅助决策。

所以，基于用户行为的变化，会在 GUI + 键鼠的传统操作基础上，增加了自然语言对话新方式。同时，新的用户行为方式也带来了表达障碍的挑战，设计师需要思考，该如何兼顾用户的对话式体验和操作体验？界面载体该如何兼顾呈现呢？

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UpqARobh0kYAAAAAAAAAAAAADgCCAQ/fmt.webp)

基于以上思考，经过蚂蚁内部 50+ AI 产品的设计实践，我们推出了**<font style="color:rgb(36, 36, 36);">混合用户界面（ </font>\*\***Hybrid UI ）\*\*，用以解答：AI 赋能的混合意图界面如何兼顾用户的对话式体验和操作体验？我们需要将原来传统 GUI 和 AI 时代下的自然语言带来的新型 UI 模式进行结合，以满足不同场景的界面表达诉求。

<h1 id="mP5uu">WHAT｜Hybrid UI 介绍</h1>

<font style="color:rgb(36, 36, 36);">由 AI 赋能的 </font>**<font style="color:rgb(36, 36, 36);">混合用户界面（ </font>\*\***Hybrid UI ）\*\*适用于<font style="color:rgb(36, 36, 36);">探索 AI 对话式界面和 GUI 操作界面的融合，</font>Hybrid UI 可以搭载不同的关键 UI 元素，用于解决用户 Chat 和 Do 的意图表达诉求。<font style="background-color:rgb(253, 253, 254);">基于过去一年业务实践，我们盘点了 50+ 企业级的 AI 产品，抽象概括了三类界面模式，</font>基于用户不同意图，PD 或设计师可以快捷定位产品倾向的界面模式。

<font style="background-color:rgb(253, 253, 254);"></font>

- **Do 为主：**以界面操作为主，偶尔唤起AI快捷指令。如 Quick Bar、固定指令式、内嵌生成式等。
- **Do + Chat 均衡：**自然语言和界面操作均衡配合使用。如双区联动交互、交互式操作气泡等。
- **Chat 为主：**以自然语言为主，几乎没有界面操作。如侧边式 Copliot、独立 Web Bot 等。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*MYRbTYaUnToAAAAAAAAAAAAADgCCAQ/fmt.webp)

另外在资产层，基于 Ant Design 5.0**，**我们也希望提供一套便利的 AI 组件资产，可以方便 PD 或设计师快速搭建起适合的 Hybrid UI 。设计资产是无穷尽且不断变化的，但用户目的和设计目标相对是唯一的，所以我们从用户视角抽象出用户感知 AI 的四个阶段，沉淀出一套典型的 Hybrid UI 界面设计资产，即 **Ant Design X **，让其可以不断生长。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uBTuR6ymZP0AAAAAAAAAAAAADgCCAQ/fmt.webp)

- **唤醒阶段：用户要了解 AI 产品的能力与用法。**设计目标是吸引用户，让首次接触的用户快速理解 AI 能做什么，告知用户 AI 可实现的意图范围和预期。相关资产有 [欢迎&提示](https://www.yuque.com/ant-design/ierwgq/zc5hxe2b12mda2ad)。
- **表达阶段：用户向 AI 准确表达意图。**设计目标是让用户知道如何快捷且正确的表达意图、并看清自己发送的内容。相关资产有 [用户输入](https://www.yuque.com/ant-design/ierwgq/rt5szecixmed200e)、[用户发送](https://www.yuque.com/ant-design/ierwgq/hxm37nohgxg6l1gd)。
- **确认阶段：用户等待 AI 完成任务。**设计目标是让用户知道该任务的AI执行运转情况。相关资产有 [生成过程](https://www.yuque.com/ant-design/ierwgq/me4dwuedfq0gieqy)。
- **反馈阶段：用户核查 AI 完成结果并应用。**设计目标是让用户清晰看到并信任AI任务完成的情况、并快速应用AI生成结果。相关资产有 [结果展示](https://www.yuque.com/ant-design/ierwgq/em1gu50owfb91c9a)、[结果应用](https://www.yuque.com/ant-design/ierwgq/nw6o7xc6gxltm4ba)。

<h1 id="ruTIp">HOW｜资产使用</h1>

<font style="color:rgba(0, 0, 0, 0.88);">我们与工程师合作，将 Ant Design X 设计组件转化为可重用的代码，最大限度地提高您的生产力和沟通效率。</font>

- <font style="color:#2F8EF4;">研发组件</font><font style="color:rgba(0, 0, 0, 0.88);">：Ant Design X 的 UI 组件库拥有多类基础组件。</font>
- Sketch资产<font style="color:rgba(0, 0, 0, 0.88);">：提供设计资产包，包括组件、典型模板等。可</font>点击下载 ：[🌟AntDesignX_UI KIT_20241122版.sketch](https://www.yuque.com/attachments/yuque/0/2024/sketch/635293/1732072368187-dd14a3f0-54d4-4af6-9b82-1a408b879aa0.sketch)
- <font style="color:#2F8EF4;">演示 Demo</font><font style="color:rgba(0, 0, 0, 0.88);">：提供真实样板间使用体验，包括独立式、助手式、嵌入式。</font>

![典型页面示意](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)
