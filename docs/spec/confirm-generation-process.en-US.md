---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 4
order: 5
title: 确认｜生成过程
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bsGjTaJWgR4AAAAAAAAAAAAADgCCAQ/fmt.webp)

在用户向AI表达意图后等待AI回复的过程中，需向用户展示AI处理请求、生成内容或执行任务的进程与状态。

<h2 id="ScT0o">设计目标</h2>

处理过程反馈需要通过流式输出等方式给予用户及时响应，让用户清晰感知AI的工作状态，建立恰当的等待预期。在部分业务场景中，需要完整展现AI的思考过程和处理阶段，减少黑盒感，提升用户对系统的信任度和理解度。

---

<h2 id="7e515f44">内容动态加载</h2>

<h3 id="a7328e13">动画加载</h3>
<font style="color:#585A5A;">系统接收到用户请求后立即触发的状态反馈。轻量的动画效果既能让用户知道系统已开始处理，又不会带来视觉干扰。动画要即时触发、简洁克制，让用户感知到明确的响应。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*w5T-R6Q2tM0AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="bab55483">流式输出</h3>
<font style="color:#585A5A;">AI处理文本内容时的实时反馈形式。默认使用打字机光标效果，让用户能感知生成节奏；但在模型响应速度非常快时，应直接展示完整内容。保持输出内容的可读性，让用户能实时阅读已生成部分。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*w5T-R6Q2tM0AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="KrfhU">进度展示</h3>
<font style="color:#585A5A;">用于异步生成场景下的状态反馈。通过进度百分比或处理阶段提示，展示当前任务进展。对于耗时较长的任务，提供预估完成时间，帮助用户建立等待预期。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*nbk_Q4EfmR0AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="6ed2bf0c">异常状态展示</h2>

<h3 id="7f7de8a2">生成失败</h3>
<font style="color:#585A5A;">当请求处理失败时，及时展示失败原因和可采取的措施。失败提示要醒目但不刺激，文案简洁明确，提供如重试等后续操作建议。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*jSdGT4NGzy0AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="e6582324">生成终止</h3>
<font style="color:#585A5A;">包括用户主动中断和系统自动终止的情况。终止后保留已生成内容，清晰提示当前状态。对于系统终止，需说明原因并给出建议。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Ul_rR5Ix1XAAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="b0b1225b">思考过程展现</h2>

<h3 id="d0198c44">展示思考阶段</h3>
<font style="color:#585A5A;">方便用户理解AI的处理流程和进展。在耗时较长的场景（如深度搜索），展示完整的处理步骤；耗时较短时仅展示当前思考状态。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QOdOQpy-io8AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="32575716">展示思考细节</h3>
<font style="color:#585A5A;">通过可展开/收起的形式呈现AI推理的具体步骤和依据。在设计时需要满足用户查看决策过程细节，同时避免信息过载。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DtBxSYxd7WcAAAAAAAAAAAAADgCCAQ/fmt.webp)
