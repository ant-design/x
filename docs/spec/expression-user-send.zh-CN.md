---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 4
order: 4
title: 表达｜用户发送
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QtyDRKq5VQEAAAAAAAAAAAAADgCCAQ/fmt.webp)

用于承载用户侧发送的对话内容，以结构化、易读的方式展示各种类型的用户发送内容。

## 设计目标

用户发送组件需具备清晰展示效果，以使用户能够直观地审视自己输入的内容，如文本采用合适字体、字号和颜色，排版合理；图片确保高分辨率、快加载速度和合适呈现；文档提供简洁预览。同时，交互设计要简单易懂，操作反馈及时明确。该组件还应提供便捷的再次编辑操作功能，设置明显图标或提示，以便用户能够轻松地对已输入内容进行修改与完善。

---

## 发送交互操作

### 编辑发送

用户在发送信息之后，若发现存在错误或需补充内容时，可以对已发送气泡进行再次编辑修改，提供更为便捷灵活的交互体验，使用户能够更好地表达自身意图。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-uiSQraZL-UAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 删除发送

当用户认为某个气泡的内容不再需要或者发送错误时，可以选择将其删除，为用户提供更大的灵活性和控制权，同时提升界面的整洁和准确性。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*TJzIR6-vSCAAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 引用发送

用户发送的气泡内容可被引用，为用户和 AI 的交流提供便利与灵活。可高效回应 AI 观点或重复利用自身信息，提升交流的连贯性与准确性。

![全局引用入口](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4tI0SrL-Q6wAAAAAAAAAAAAADgCCAQ/fmt.webp)

![部分文本引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eHWARJJ_xIoAAAAAAAAAAAAADgCCAQ/fmt.webp)

![单图片引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DVouQ6wbeHEAAAAAAAAAAAAADgCCAQ/fmt.webp)

![单文件引用](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5q0CRLZwLv4AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 发送异常

发送异常时，系统迅速弹出清晰提示及时告知用户原因，并提供解决方法，如重新发送等。

![发送失败](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDMOSKj_2bUAAAAAAAAAAAAADgCCAQ/fmt.webp)

![重新发送](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2aedT6-bNGQAAAAAAAAAAAAADgCCAQ/fmt.webp)

---

## 发送气泡内容

### 💬 文本类

发送气泡展示文本类内容，方便用户交流，提高信息的可读性与可理解性，使交流更顺畅高效。文本采用合适的字体、字号和颜色，排版合理。

> **注**：可以对一些文本（如数字和网址超链接）运用特别的样式。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Qqs7QbmhhRgAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 🎨 图片类

发送气泡展示图片类内容，增强交流的丰富性与生动性，助于清晰传达信息。设计应考虑图片的展示效果与用户体验，图片需确保高分辨率、快加载速度和合适呈现。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDpZSa5acrQAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 📃 文档类

发送气泡能够展示文档类内容，增强与 AI 交流的专业性和信息丰富度。在设计上，提供文档简洁预览，需充分考虑清晰性和易用性。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*REJDR5uemYcAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 🧩 混合类｜图片+文档

发送气泡可混合展示图片类和文档类内容，丰富分享方式，提升交流的生动性、专业性及信息丰富度。利于全面传达复杂信息，使交流深入高效。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QjFHTarVmYsAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 🙌 引用内容

引用气泡内容再次输入后，发送气泡可展示文本、图片、文档等样式，丰富信息呈现，使交流直观、全面、高效。

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*xCoAS5LeDSEAAAAAAAAAAAAADgCCAQ/fmt.webp)
