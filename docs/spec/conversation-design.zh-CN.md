---
group:
  title: 💭 Conversation 会话设计
  order: 3
order: 0
title: 介绍
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ohp_SLO1eaEAAAAAAAAAAAAADgCCAQ/fmt.webp)

用户的模糊意图通过会话的方式来逐步与 AI 对焦、拆解，而用户的各项操作指令通常也以交互式卡片的形式贯穿于会话流之中。会话风格与角色的一致性，也是 AI 体验的关键。此外，每一次良好人机的自然会话体验背后，其实都隐藏着一套隐含的、系统性的体验规则。上述这些正是会话设计所需要定义的。

## WHY 为什么要做对话设计

在明确用户的意图和 AI 角色定位之后，便可以着手设计对话流程了。这一过程既涉及了对用户意图的深入理解，根据用户意图，有助于设计出更加针对性和有效的对话；又涉及对 AI 角色的精确把握，根据 AI 角色性格，可以选择合适的语言风格，构建更加真实和有说服力的对话场景。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*C94kQK-GA9QAAAAAAAAAAAAADgCCAQ/fmt.webp)

在人际交往的过程中，交流双方为了实现特定的沟通目标，往往会遵循一系列隐性或显性的规则。这些规则不仅涵盖了语言的语义层面，还包括行为和意图的表达，从而有效推进对话进程，实现预期的交际目的。

同样，在人机交互中，对话系统也需遵循一套规则，以确保语义的准确传达、行为的合理展现以及意图的清晰表达。这些规则对于促进用户目标的实现、提升交互体验具有至关重要的作用。通过精心设计的对话规则，可以优化人机对话系统的性能，使其更贴近自然语言交流的流畅性和效率，进而为用户提供更加优质的交互体验。

## WHAT 什么是会话设计

![什么是会话设计](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QI3xQrObsI4AAAAAAAAAAAAADgCCAQ/fmt.webp)

对话交互组件是构建人机对话系统的核心内容，它们基于用户提出的问题，依据预设的规则生成响应。这些组件旨在准确传达语义、行为和意图，以促进用户目标的实现，构成了对话交互的基础单元。

**使用不同的对话交互组件可以形成多样化的对话表达方式：**

- 通过选择和组合不同的对话交互组件，可以构建出多种对话表达策略。这些策略不仅能够覆盖广泛的语言风格和语境，还能够适应用户的个性化需求和偏好。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QROUQbGlvcwAAAAAAAAAAAAADgCCAQ/fmt.webp)

**对于同一个用户请求，可以通过不同的对话设计组件组合，形成同一语义，不同风格的对话：**

- 语义一致性与风格多样性：即便面对相同的用户请求，通过灵活运用不同的对话设计组件，可以创造出在语义上保持一致，但在风格上各具特色的对话响应。这种设计允许AI在保持信息传递准确性的同时，也能够提供多样化的用户体验。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2q8gQZMp9l4AAAAAAAAAAAAADgCCAQ/fmt.webp)

因此对话交互组件的设计和应用是实现高效、个性化人机对话的关键。通过精心构建和优化这些组件，可以显著提升对话系统的性能和用户的交互体验。

## HOW 原则

在人机对话交互中，尽管对话交互组件具有自然性和操作路径简化等优势，但它们也面临着一些挑战，例如意图识别的不准确性可能导致错误回复，以及槽位信息的缺失可能需要多轮对话来补全信息。对话交互的核心目标是解决用户问题并提高效率，任何对话交互设计都应遵循这一原则。针对这些问题，我们制定了对话交互的通用性原则，旨在优化对话设计，发挥其优势同时规避劣势，以更有效地解决用户的实际问题。通过下述原则，可以构建出更加高效、准确且用户友好的对话交互系统。

### 1.信息充分且真实

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*h_9JQLDK_JIAAAAAAAAAAAAADgCCAQ/fmt.webp)

在人机对话交互中，要确保提供给用户的是真实信息，建立用户和 AI 之间的信任，强调以用户为中心。

#### 1.AI 需提供真实的信息

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*_SoFRY_Rm30AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

对话交互系统必须基于事实和数据提供信息，以确保用户能够依据真实、准确的信息做出决策。这要求 AI 在处理用户请求时，必须写明引用的数据源，并确保信息的时效性和准确性。

#### 2.AI 需告知自己能力界限

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*83p9R7JFirgAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

AI 应明确告知用户其功能和限制，避免用户对 AI 能力产生误解。这包括在 AI 无法提供确切答案或执行特定任务时，诚实地向用户说明情况，并提供备选方案或建议。

#### 3.针对性信息提供

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BEkxTZKqypgAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

对话主体应具备针对性，针对特定的决策问题和决策者提供专门的支持。这意味着 AI 需要能够根据用户的具体需求，提供定制化的信息和建议，以增强决策的相关性和有效性

### 2.话术要清晰易懂

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*sLjARY7FmvcAAAAAAAAAAAAADgCCAQ/fmt.webp)

在对话设计中，使用的话术要易于用户记忆、理解及清晰表意，从而实现更加有效的沟通。

#### 1.任务相关性

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*wSo8Qa4UqI4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

对话内容应紧密围绕用户的任务和目标展开，确保信息的相关性，以提高用户对对话的关注度和记忆度。

#### 2.词汇的普及性

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*VSkrRLuLN2kAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

选用普遍熟悉且易于理解的词汇，有助于降低用户的认知负荷，使得信息传递更加高效。

#### 3.术语的一致性

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*myBASJk_wp0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在对话过程中，对特定术语或概念的使用应保持一致性，避免用户混淆。

#### 4.句式的简洁性

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tRXKSahVc4wAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

避免复杂句式结构，转而使用简洁、直接的表述方式，以便用户快速把握信息要点。

#### 5.清晰度

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*flR6QIBpFq0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

信息表述必须清晰明了，避免歧义，确保用户能够准确理解内容。

### 3.自然友好并且尊重用户

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Dkx5Tat2d6IAAAAAAAAAAAAADgCCAQ/fmt.webp)

在 AI 与用户的互动中，需要尊重用户，认可用户的感受。

#### 1.自然交流

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*hKpWR56DgjAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

应采用自然口语风格，使对话更加贴近日常交流，提高用户的交流体验，确保沟通的亲切感和易理解性。

#### 2.尊重与认可

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*WalpQrw9VvEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在所有交互中，AI 将始终保持对用户的尊重，认可并重视用户的感受和观点，以建立信任和积极的互动环境。

#### 3.敏感话题回避

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*vY0wTbb5QKYAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

对于可能引起争议或不适的敏感话题，应予以回避，以免造成不必要的误解或冲突。

#### 4.审慎处理内容

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*I2fZTL6_FpgAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

对于用户未主动请求的信息或内容，应保持谨慎态度，避免过度干预或提供不适当的信息。

## 对话组件预览

为了更直观的了解并使用对话组件，我们将对话流程划分为四个主要环节，每个环节都对应着特定的组件。依次为：欢迎组件、引导组件、追问组件、提示组件、确认组件、错误处理组件以及结束组件。有关这些模块的详细信息，请参阅以下文档。

| **对话流程** | **对话组件** |          **详细内容**          |
| :----------: | :----------: | :----------------------------: |
|   **唤醒**   |     开始     |  [Link](/docs/spec/start-cn)   |
|   **识别**   |     追问     | [Link](docs/spec/follow-up-cn) |
|              |     提示     |   [Link](docs/spec/hint-cn)    |
|   **确认**   |     确认     |  [Link](docs/spec/confirm-cn)  |
|              |     错误     |   [Link](docs/spec/error-cn)   |
|   **反馈**   |     结束     |    [Link](docs/spec/end-cn)    |
