---
group:
  title: 💭 Conversation 会话设计
  order: 3
order: 4
title: 确认
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*y4fLQ4MNM_kAAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT 概述

在对话设计中，确认设计是一种交互设计策略，它允许用户在与 AI 系统交流时验证其输入内容的解析结果。这种设计不仅提升了用户对输入信息准确性的信心，而且通过建立对话共识，增强了用户在与 AI 互动中的安全感和信任感。此外，确认设计通过维护对话的上下文连贯性，有助于推动对话的深入发展，确保交流的流畅性和效率。通过这种方式，AI 系统能够更准确地理解用户的意图，同时用户也能够即时纠正任何错误或误解，从而提高整体的交互质量。

### 三类确认形式

#### 显性确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*E6wURJNuKgUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

显性确认要求用户对系统的理解或操作结果进行明确的响应确认。这种确认方式通常涉及简单的是/否回答，或者使用同义词来明确表达用户的确认意图。

在实施显性确认时，系统会暂停进一步的操作，直到收到用户的明确指示。这种确认方式特别适用于错误成本较高或需要用户明确同意的场景，例如在执行不可逆操作前的用户确认。

显性确认确保用户对即将执行的操作有充分的认识和同意，从而降低操作错误的风险。

#### 隐性确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OGCvRKZylM8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

隐性确认是一种更为微妙的确认方式，它通过在后续的对话或操作中隐含地确认用户的信息，而无需用户进行直接回复。这种策略通常涉及系统对用户输入的关键信息进行重复或同义词替换，以此向用户展示系统已经理解了他们的意图。

隐性确认适用于错误成本较低或系统对识别结果有较高信心的情况，因为它可以提高对话的效率，同时减少用户的交互负担。

在实施隐性确认时，系统会通过提炼用户表述的关键内容，并将其融入到响应中，使用户能够快速确认系统已经识别到了这些信息。

这种方式的优势在于其效率较高，但劣势在于一旦系统识别错误，用户可能不清楚如何纠正。因此，隐性确认策略的运用需要根据系统对信息识别的准确度和出错可能性来谨慎选择。

#### 无需确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*VY4ITICKJmsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在对话设计中，“无需确认”指的是 AI 在接收到用户输入后，并未提供任何形式的确认反馈给用户。这种情况通常发生在信息高度确认，或者确认操作被认为是不必要的场合。在这种模式下，AI 假定用户的输入是正确的，并且不需要额外的确认步骤来验证输入的准确性或完整性。

“无需确认”的设计考虑到了用户体验的流畅性和效率，特别是在用户操作失误风险较低，或者系统对输入的识别有足够信心的场景中。这种交互可以减少用户的操作步骤，提高用户体验。

需要注意的是，“无需确认”的设计并不适用于所有情况。在错误成本较高或需要用户明确同意的场景中，如执行不可逆操作前，显性确认或隐性确认可能更为合适，以确保用户对其操作有充分的认识和同意。因此，设计者在决定是否采用“无需确认”交互时，需要仔细权衡用户体验的便捷性和操作的安全性。

## HOW 如何操作

### 1.针对用户输入的参数做隐性确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*KgMlQ6KyuzIAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在大多数情况下，隐性确认的应用目的并不在于直接验证用户的输入内容，而是在于确认用户所传达或隐含的参数信息。

这种策略通过在后续的对话或操作中隐含地确认用户的信息，例如通过重复关键信息或使用同义词替换，来向用户展示系统已经理解了他们的意图。

隐性确认为用户提供了必要的上下文环境，以便他们能够更准确地理解系统的响应内容。通过这种方式，隐性确认有助于提升交互的连贯性和用户的满意度，确保对话流程的顺畅。

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*I-b4RKnBw6YAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 2.系统动作的隐性确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bz8tRL4VG18AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

动作的隐性确认也是一种间接确认机制，它通过系统的行为和反馈来隐含地表明某个动作已经完成，而不是依赖于直接的言语或明确的信号。这种确认方式一般通过系统响应的自然流程和结果展示，为用户提供了动作执行的证据，从而在不打断用户流程的情况下，增强用户对系统操作结果的信任和满意度。

### 3.显性确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4HIpQ7M0nHsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在执行可能导致不可逆后果的操作，例如删除用户数据或完成交易等关键步骤之前，显性确认是必不可少的。这一机制确保用户对即将执行的操作及其潜在影响有充分的认识。

AI 必须在采取最终行动之前，明确地向用户展示操作的具体细节，并主动请求用户的明确同意。通过这种方式，显性确认不仅提高了操作的透明度，还强化了用户对操作结果的责任意识，从而降低误操作的风险，并提升用户对系统的信任度。

#### 组件构成

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*HkF4RZwdqh8AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 4.无需确认

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*X4qQRJdioRMAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

在用户输入明确且系统能够以高置信度识别用户意图的情况下，可以省略确认步骤。这种设计原则适用于那些系统对用户意图的识别具有高度准确性的场景，从而简化了交互流程，提高用户体验的效率和流畅性。通过减少不必要的确认环节，用户可以更快捷地完成操作，同时保持了操作的安全性和准确性。
