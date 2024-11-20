---
group:
  title: 💭 Conversation 会话设计
  order: 3
order: 5
title: 错误
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2zMiQIQK9c8AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="SussH">WHAT 概述</h1>

尽管 AI 在自然语言处理领域有显著进步，但在实际应用中仍可能遇到对话无法继续的情况，这可能导致错误。常见的错误类型包括：

1. **AI 无法解析用户的输入内容；**
2. **用户提供了无效的输入；**
3. **AI 当前的功能无法满足用户的请求。**

针对这些错误情况，必须实施有效的错误处理机制，以引导用户回到正确的交流轨道。错误响应的方式对用户体验至关重要，一个处理不当的错误可能会给用户留下深刻印象，甚至超过多次成功的交互。相反，如果错误得到妥善处理，用户可能根本不会意识到曾经出现过错误。

为了优化用户体验，错误处理机制应当：

1. 及时识别并明确指出问题所在；
2. 提供清晰的指导，帮助用户纠正错误或提供有效的替代方案；
3. 保持友好和专业的语气，以减少用户的挫败感；
4. 记录错误情况，以便不断改进AI的理解和响应能力。

通过这样的措施，可以最大限度地减少错误对用户体验的负面影响，同时提升AI系统的可靠性和用户满意度。

<h1 id="cgCNC">HOW 如何操作</h1>

<h2 id="EAGSG">**AI 无法解析或无法匹配用户的输入内容**</h2>

在 AI 对话设计中，"无匹配"错误是指系统在处理用户输入时，无法找到与用户意图相匹配的响应或操作。这种情况通常发生在用户的问题或请求超出了 AI 系统预设的处理范围，或者用户的表达方式与系统训练数据中的模式不匹配时。例如，如果用户使用非常规的措辞或提出一个系统未被训练来识别的新颖问题，AI 可能无法理解其意图，从而导致无匹配错误。

<h3 id="ahSXv">**<font style="color:rgb(6, 6, 7);">引导用户重新表述</font>**</h3>

为了应对这种错误，AI 需要具备一定的错误处理和恢复机制。例如引导用户重新表述法，系统应通过提问或提供选项的方式，引导用户以更清晰、更具体的方式重新表述他们的问题或请求。一般在缺少必填槽位（无该内容无法执行任务），必填槽位答案唯一但涉及范围比较广，AI 无法进行猜测时使用该方法

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CqISQJfdzqoAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="vPdhb"><font style="color:rgb(32, 33, 36);">组件总结</font></h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CoAhR4xjsKQAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="BIoou"><font style="color:rgb(32, 33, 36);">缩小范围</font></h3>

在重新询问用户时，AI 可以采取缩小范围的策略来增强交互的清晰度和效率。包括：

1. **展示选项**：通过提供清晰的选择，使用户能够快速识别并选择最符合其需求的选项。
2. **提供示例**：通过示例展示正确的输入格式或期望的答案类型，帮助用户更准确地表达他们的请求。
3. **预测需求**：利用AI的分析能力，预测用户可能的需求，并主动提供相关信息，以减少用户的输入努力。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BqzoQIMo8DEAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="MjVl2">组件总结</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pYSIRqIK5oMAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="EPB77"><font style="color:rgb(32, 33, 36);">承认错误</font></h3>

为了避免用户经历连续的挫败感，AI 应在两次尝试理解用户意图失败后，主动结束对话。在这种情况下，提供不明确的承诺可能会损害用户对系统的信任。因此，应该：

1. **及时终止对话：**在两次尝试后，如果仍然无法准确理解用户的需求，系统应礼貌地结束对话，避免无谓的尝试。
2. **明确承认局限：**系统应诚实地向用户说明其当前能力的限制，并承认无法解决用户的问题。
3. **提供替代方案：**在结束对话前，系统可以提供其他可能的解决方案或建议用户寻求其他帮助渠道。
4. **保持透明和诚实：**通过透明和诚实的沟通，系统可以维护用户的信任，并为未来的交互留下积极的印象。
5. **收集反馈：**系统应鼓励用户提供反馈，以便从这些互动中学习并改进未来的性能。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*mXiTTo9E1HAAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="jKoy0">组件总结</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*j21eTJ-CTvUAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="vg62S">用户提供了无效的输入</h2>

在对话交互中，用户可能会因为设备故障或网络不稳定而发送损坏或丢失的信息，或者由于误解 AI 的提示而提供不相关或不精确的数据。这就需要引导用户重新提供信息或通过帮助他们更准确地表达需求。

<h3 id="Ulsp3"><font style="color:rgb(6, 6, 7);"> 重诉问题</font></h3>

在对话过程中，用户有时可能会因为设备故障或网络连接问题而发送出受损或不完整的信息。在这种情况下，AI系统应当具备识别这类问题的能力，并主动要求用户重新表述他们的问题或请求。另外如果用户输入的信息不清晰，AI 可以重述其理解的问题，以确认是否正确把握了用户的意图。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*YDlfR6i56soAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="SoYEm"><font style="color:rgb(32, 33, 36);">结束之前再次提示</font></h3>

在 AI 对话的设计中，当识别到用户的输入可能存在问题或不完整时，应该在结束对话之前再次给予用户回复的机会，确保了用户有机会纠正或补充他们的请求，从而避免误解或未满足的需求。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*logJRZE1lx4AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="zBWT8">合理结束</h3>

为了避免不必要的用户纠缠，并保持对话的效率和尊重，AI 应在尝试两次收集用户输入未果后，主动结束对话。这一策略不仅体现了对用户时间的尊重，也避免了可能的沟通疲劳。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*jEC3S56XqiUAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="xYHOI">系统错误</h2>

当用户的意图无误，但执行依赖的系统无法进行任务或因技术故障而失败时，即发生系统错误。此类错误可能表现为：

- **系统故障：**系统无响应或网络错误，例如网络连接超时，大模型渲染失败等
- **无效请求：**用户发出的请求在逻辑上不成立，如尝试预约已过去的时间段。
- **超出能力：**用户发出的请求已经超出 AI 能执行的范围，例如：给我的银行卡打 1 万块钱

为了确保系统的可靠性和用户的信任，在发生错误时，应以透明、诚实的态度向用户通报情况，并提供切实可行的后续步骤建议。这包括但不限于：

1. **明确错误信息：**提供清晰、具体的错误描述，避免使用技术性或模糊的语言。
2. **解释原因：**尽可能向用户解释导致错误的技术原因，以增加透明度。
3. **提供解决方案：**根据错误类型，给出用户可以采取的解决步骤或建议。
4. **引导用户：**如果问题无法立即解决，应指导用户如何寻求进一步的帮助或联系技术支持。
5. **记录和分析：**系统应自动记录错误详情，以便进行后续分析和改进。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*i9LTSZP6t_QAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="FhCnI">组件总结</h3>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cs2aS5jtj8AAAAAAAAAAAAAADgCCAQ/fmt.webp)
