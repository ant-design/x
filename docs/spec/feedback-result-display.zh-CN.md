---
group:
  title: 💻 Hybrid UI 混合界面设计
  order: 6
order: 8
title: 反馈｜结果展示
---

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*p4l8Q4Hdix0AAAAAAAAAAAAADgCCAQ/fmt.webp)

AI处理完成用户需求后，需以结构化、易读的方式来呈现各种类型的回答内容。

<h2 id="gV9CN">设计目标</h2>

结果展示需要合理规划信息层级，让重要内容和结构化信息更易识别。针对文本、图片、代码等不同类型的内容采用恰当的展示形式，既要保持视觉风格的统一性，又要充分考虑长文本的阅读体验，避免信息过载影响理解。

---

<h2 id="97eca455">内容展示</h2>

<h3 id="cbc60835">文本内容</h3>

<font style="color:#585A5A;">作为最基础的展示形式，需要处理好单行文本、多行文本和结构化文本（如列表、标题段落等）的呈现。通过合理的间距、字号和段落划分，提升长文本的可读性。对重点内容可使用高亮、加粗等样式突出，但需控制使用频率避免干扰。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*c_8JTrMpRJ8AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="W5Mk0">图片内容</h3>

<font style="color:#585A5A;">展示AI生成或处理的图片结果。默认以合适尺寸展示，支持预览大图和缩放细节。多图场景注意排版美观，加载时提供占位图避免布局跳动。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*S8ljSJ-V6YIAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="a47dfedc">代码内容</h3>

<font style="color:#585A5A;">为展示代码片段设计的专门容器。使用等宽字体，支持代码语法高亮增强可读性。提供代码复制功能，方便用户使用。代码过长时支持横向滚动，保持代码格式不被破坏。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*io9ISYEQJ_sAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="f78805eb">交互卡片</h3>

<font style="color:#585A5A;">用于特定场景下需要用户操作的结构化内容，如表单填写、参数调整等。卡片内可包含按钮、输入框等交互元素，操作要有明确的反馈。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5TshRpA9w_4AAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="fk1V9">其他</h3>

<font style="color:#585A5A;">用于展示表格、数学公式等特殊格式内容。可以和普通文本内容混合展示，保持整体的视觉一致性。特殊内容的展示要考虑性能和兼容性，必要时提供降级方案。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-MuHQo41bPYAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h2 id="tr41H">内容组织</h2>

<h3 id="407ae7df">内容折叠</h3>

<font style="color:#585A5A;">针对超过一屏的长内容，提供折叠功能提升浏览效率。默认展示预览内容，用户可以根据需要展开查看完整信息。折叠状态要有明确提示，展开/收起过程动画流畅。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*VhKkQ78jX0MAAAAAAAAAAAAADgCCAQ/fmt.webp)

<h3 id="I7JpE">内容参考来源展示</h3>

<font style="color:#585A5A;">在RAG等需要提供引用依据的场景下使用。参考来源默认收起以减少干扰，用户可以通过hover或点击方式查看详细引用内容。来源信息要简洁清晰，增强内容可信度。</font>

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*L5sWQ6w_qjoAAAAAAAAAAAAADgCCAQ/fmt.webp)
