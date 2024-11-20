---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 4
order: 4
title: 表达｜用户发送
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QtyDRKq5VQEAAAAAAAAAAAAADgCCAQ/fmt.webp)

用于承载用户侧发送的对话内容，<font style="color:#000000;">以结构化、易读的方式展示各种类型的用户发送的内容。</font>

<font style="color:#000000;"></font>

<h1 id="WCqkg"><font style="color:rgba(0, 0, 0, 0.88);">设计目标</font></h1>

<font style="color:rgb(28, 31, 35);">用户发送组件需具备清晰展示效果，以使用户能够直观地审视自己输入的内容，如文本采用合适字体、字号和颜色，排版合理；图片确保高分辨率、快加载速度和合适呈现；文档提供简洁预览。同时，交互设计要简单易懂，操作反馈及时明确，该组件还应提供便捷的再次编辑操作功能，设置明显图标或提示，以便用户能够轻松地对已输入内容进行修改与完善。</font>

<font style="color:rgb(38, 38, 38);"></font>

---

<h1 id="g47fc">发送交互操作</h1>

<h2 id="YTmbc"><font style="color:rgba(0, 0, 0, 0.88);">编辑发送</font></h2>
<font style="color:#585A5A;"></font>

<font style="color:#585A5A;">用户在发送信息之后，若发现存在错误或需补充内容时，可以对已发送气泡进行再次编辑修改，提供更为便捷灵活的交互体验，使用户能够更好的表达自身意图。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-uiSQraZL-UAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="QE3zt"><font style="color:rgba(0, 0, 0, 0.88);">删除发送</font></h2>

<font style="color:#585A5A;">当用户认为某个气泡的内容不再需要或者发送错误时，可以选择将其删除，为用户提供了更大的灵活性和控制权，也可以提高交互界面的整洁和准确性。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*TJzIR6-vSCAAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="UsRtO"><font style="color:rgba(0, 0, 0, 0.88);">引用发送</font></h2>

<font style="color:#585A5A;">用户发送的气泡内容可被引用，为用户和 AI 交流提供便利与灵活，可高效回应 AI 观点或重复利用自身信息，提升交流连贯性与准确性。</font>

![全局引用入口](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4tI0SrL-Q6wAAAAAAAAAAAAADgCCAQ/fmt.webp)

![部分文本引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eHWARJJ_xIoAAAAAAAAAAAAADgCCAQ/fmt.webp)

![单图片引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DVouQ6wbeHEAAAAAAAAAAAAADgCCAQ/fmt.webp)

![单文件引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5q0CRLZwLv4AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="v9nWE">发送异常</h2>

<font style="color:#585A5A;">发送异常时，系统迅速弹出清晰提示及时告知用户原因，并提供解决方法，如重新发送等。</font>

![发送失败](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDMOSKj_2bUAAAAAAAAAAAAADgCCAQ/fmt.webp)

![重新发送](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2aedT6-bNGQAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h1 id="ejdAo"></h1>

<h1 id="CRW9S"><font style="color:rgba(0, 0, 0, 0.88);">发送气泡内容</font></h1>

<h2 id="Zqtu2"><font style="color:rgba(0, 0, 0, 0.88);">💬</font><font style="color:rgba(0, 0, 0, 0.88);">文本类</font></h2>

<font style="color:#585A5A;">发送气泡展示文本类内容，方便用户交流，提高信息可读性与可理解性，使交流更顺畅高效。文本采用合适字体、字号和颜色，排版合理。</font>

> <font style="color:rgba(0, 0, 0, 0.65);">注：可以对一些文本（如数字和网址超链接）运用特别的样式。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Qqs7QbmhhRgAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="m7GFh">**🎨****图片类**</h2>
<font style="color:rgba(0, 0, 0, 0.88);"></font>

<font style="color:#585A5A;">发送气泡展示图片类内容，增强交流丰富性与生动性，助于清晰传达信息。设计应考虑图片展示效果与用户体验，为交流增添新维度，图片确保高分辨率、快加载速度和合适呈现。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDpZSa5acrQAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="UkeAh">**📃****文档类**</h2>
<font style="color:rgba(0, 0, 0, 0.88);"></font>

<font style="color:#585A5A;">发送气泡能够展示文档类内容，增强和AI的交流的专业性和信息丰富度。在设计上，提供文档简洁预览，需充分考虑清晰性和易用性。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*REJDR5uemYcAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="B1kCR">**🧩****混合类｜图片+文档**</h2>
<font style="color:rgba(0, 0, 0, 0.88);"></font>

<font style="color:#585A5A;">发送气泡可混合展示图片类和文档类内容，丰富分享方式，提升交流生动性与专业性及信息丰富度。利于全面传达复杂信息，使交流深入高效。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QjFHTarVmYsAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="C3KoG">**🙌****引用内容**<font style="color:rgba(0, 0, 0, 0.88);"></font></h2>

<font style="color:#585A5A;">引用气泡内容再次输入后，发送气泡可展示文本、图片、文档等样式。丰富信息呈现，使交流直观全面高效。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*xCoAS5LeDSEAAAAAAAAAAAAADgCCAQ/fmt.webp)
