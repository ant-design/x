---
order: 6
title: 更新日志
timeline: true
tag: vVERSION
---

`@ant-design/x` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：日常 bugfix 更新。
- 次版本号：带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性。

---

## 2.5.0

`2016-03-31`

### @ant-design/x-card

- 新模块 X Card 基于 A2UI 协议的动态卡片渲染组件，让 AI Agent 能够通过结构化的 JSON 消息流，动态构建和渲染交互式界面。

### 其他

- 📖 优化官网站点提升用户体验。[#1830](https://github.com/ant-design/x/pull/1830) 由 [1uokun](https://github.com/1uokun) 提交

## 2.4.0

`2026-03-13`

### @ant-design/x

- 🔥 新组件 Folder。[#1797](https://github.com/ant-design/x/pull/1797) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 强化 FileCard 的 `description`、`mask`、`onClick` 配置的能力。[#1807](https://github.com/ant-design/x/pull/1807) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🆕 XMarkdown 流式渲染新增 `tail` 配置，支持自定义尾缀内容与尾缀组件，并避免尾缀出现在未完成组件之前。[#1296](https://github.com/ant-design/x/pull/1296) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 自定义组件流式状态识别问题，正确处理 void elements，并隔离同名组件多实例的 `streamStatus`。[#1590](https://github.com/ant-design/x/pull/1590) 由 [Last-Order](https://github.com/Last-Order) 提交
- 🛠 导出 XMarkdown 的 `StreamCacheTokenType` 类型，便于外部复用流式渲染相关类型。[#1592](https://github.com/ant-design/x/pull/1592) 由 [Last-Order](https://github.com/Last-Order) 提交
- 📖 新增 XMarkdown Playground，并重构 streaming、examples、data-display 文档，补充 AntV Infographic 示例。[#1779](https://github.com/ant-design/x/pull/1779) 由 [Div627](https://github.com/Div627) 提交、[#1780](https://github.com/ant-design/x/pull/1780) 由 [Div627](https://github.com/Div627) 提交、[#1814](https://github.com/ant-design/x/pull/1814) 由 [Div627](https://github.com/Div627) 提交

### @ant-design/x-skill

- 🆕 发布 x-markdown skill。[#1813](https://github.com/ant-design/x/pull/1813) 由 [Div627](https://github.com/Div627) 提交

### 其他

- 🐛 修复 useShortcutKeys 错误的事件处理。[#1822](https://github.com/ant-design/x/pull/1822) 由 [cxybd](https://github.com/cxybd) 提交
- 🛠 将所有组件 useMergedState 升级为 useControlledState。[#1808](https://github.com/ant-design/x/pull/1808) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1814](https://github.com/ant-design/x/pull/1814) 由 [Div627](https://github.com/Div627) 提交、[#1793](https://github.com/ant-design/x/pull/1793) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1792](https://github.com/ant-design/x/pull/1792) 由 [Div627](https://github.com/Div627) 提交、[#1780](https://github.com/ant-design/x/pull/1780) 由 [Div627](https://github.com/Div627) 提交、[#1779](https://github.com/ant-design/x/pull/1779) 由 [Div627](https://github.com/Div627) 提交

## 2.3.0

`2026-02-26`

### @ant-design/x

- 🆕 Conversation 的 onActiveChange 回调现在同时返回被激活的项及其键值，同时更新 useMergedState 为 useControlledState。[#1762](https://github.com/ant-design/x/pull/1762) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 优化 Sender 禁用状态按钮的视觉表现，统一添加透明边框处理，确保不同按钮变体在禁用时的外观一致。[#1751](https://github.com/ant-design/x/pull/1751) 由 [Rain120](https://github.com/Rain120) 提交

### @ant-design/x-markdown

- 🆕 XMarkdown 新增 escapeRawHtml 属性，允许用户在渲染时选择是否对原始 HTML 进行转义。[#1769](https://github.com/ant-design/x/pull/1769) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 列表中遇到未闭合行内代码时的渲染，确保列表标记在特殊未闭合情况仍被保留。[#1739](https://github.com/ant-design/x/pull/1739) 由 [Div627](https://github.com/Div627) 提交
- 🐛 改进了块级 LaTeX 公式的解析，对结尾处的空白与缩进处理更宽容，提升了对不同行尾格式的兼容性，减少误判与渲染问题。[#1744](https://github.com/ant-design/x/pull/1744) 由 [Waiter](https://github.com/Waiter) 提交
- 🐛 优化深色模式 CodeHighlighter，Mermaid 插件样式问题。[#1766](https://github.com/ant-design/x/pull/1766) 由 [menghany](https://github.com/menghany) 提交

### @ant-design/x-sdk

- 🆕 useXChat 新增 queueRequest 方法，实现 ConversationKey 和 SessionId 的初始化消息发送。[#1761](https://github.com/ant-design/x/pull/1761) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-skill

- 🆕 新增 skill 安装指令，同时发布 use-x-chat、x-chat-provider、x-request 三个 skill。[#1753](https://github.com/ant-design/x/pull/1768)、[#1767](https://github.com/ant-design/x/pull/1767) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 🛠 修复了因依赖升级导致的构建错误问题。 [#1754](https://github.com/ant-design/x/pull/1754) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 解决 CodeSandbox 预览中 domhandler 的 ModuleNotFoundError 错误。[#1754](https://github.com/ant-design/x/pull/1754) 由 [Div627](https://github.com/Div627) 提交

## 2.2.2

`2026-02-06`

### @ant-design/x

- 🛠 修复一些文档和类型来支持 AI Coding。[#1733](https://github.com/ant-design/x/pull/1733) 由 [kimteayon](https://github.com/kimteayon) 提交
- 💄 修复 Bubble.List 样式和语义化问题。[#1731](https://github.com/ant-design/x/pull/1731) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🐛 修复 Sender 插入节点配置了 replaceCharacters 时的替换问题。[#1727](https://github.com/ant-design/x/pull/1727) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.2.1

`2026-01-30`

### @ant-design/x

- 💄 修复 Bubble.List 样式问题。[#1713](https://github.com/ant-design/x/pull/1713) 由 [anxLiang](https://github.com/anxLiang) 提交、[#1704](https://github.com/ant-design/x/pull/1704) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🐛 修复因其他三方依赖 `esm` 路径导致 Node 环境构建报错问题。[#1708](https://github.com/ant-design/x/pull/1708) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🐛 修复流式渲染缓存失效问题，当列表项包含行内代码（如 - \code\`\` ）时，缓存会提前提交导致渲染异常。[#1709](https://github.com/ant-design/x/pull/1709) 由 [Div627](https://github.com/Div627) 提交
- 🆕 自定义代码渲染支持接受语言信息。[#1705](https://github.com/ant-design/x/pull/1705) 由 [Aarebecca](https://github.com/Aarebecca) 提交

### @ant-design/x-sdk

- 🆕 XRequest 与 Chat Provider 一起使用时会额外获取到组装好的 message。[#1714](https://github.com/ant-design/x/pull/1714) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 📖 优化官网站点提升用户体验。[#1717](https://github.com/ant-design/x/pull/1717) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1707](https://github.com/ant-design/x/pull/1707) 由 [Div627](https://github.com/Div627) 提交

## 2.2.0

`2026-01-26`

### @ant-design/x

- Sender
  - 🐛 修复光标在技能位置时插入位置错误问题。[#1633](https://github.com/ant-design/x/pull/1633) 由 [IsDyh01](https://github.com/IsDyh01) 提交
  - 🛠 重构插入节点位置能力，同时重写测试用例。[#1612](https://github.com/ant-design/x/pull/1612) 由 [kimteayon](https://github.com/kimteayon) 提交
- XProvider
  - 🐛 修复设置 `iconPrefixCls` 不生效问题。[#1656](https://github.com/ant-design/x/pull/1656) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复设置 `prefix` 不生效问题。[#1642](https://github.com/ant-design/x/pull/1642) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 `layer` 设置问题。 [#1616](https://github.com/ant-design/x/pull/1616) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复因强制 `antd` 依赖 `es` 路径导致 Node 环境构建报错问题。[#1645](https://github.com/ant-design/x/pull/1645) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 ThoughtChain 布局导致动画卡顿问题。[#1641](https://github.com/ant-design/x/pull/1641) 由 [IsDyh01](https://github.com/IsDyh01) 提交
- 🐛 修复 Think 布局导致动画卡顿问题。[#1636](https://github.com/ant-design/x/pull/1636) 由 [IsDyh01](https://github.com/IsDyh01) 提交
- 🐛 修复 Sources 设置了位置但无法定位内容问题。 [#1683](https://github.com/ant-design/x/pull/1683) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Bubble.List 内部高度变化滚动条变化错误问题。[#1690](https://github.com/ant-design/x/pull/1690) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🆕 新增 Mermaid 设置初始化配置和操作栏功能。[#1631](https://github.com/ant-design/x/pull/1631) 由 [Div627](https://github.com/Div627) 提交
- 🆕 新增 Attachments 设置卡片类型能力。[#1610](https://github.com/ant-design/x/pull/1610) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🆕 XRequest 新增重连接能力。[#1629](https://github.com/ant-design/x/pull/1629) 由 [hylin](https://github.com/hylin) 提交
- 🆕 XRequest 和 XStream 支持流数据解析引入了可配置的分隔符 `streamSeparator`、`partSeparator`、`kvSeparator` 能力，同时为 TextDecoderStream 添加了 polyfill 以提高兼容性，修复了 undefined 值被添加到流结果中的问题。 [#1611](https://github.com/ant-design/x/pull/1611) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🆕 增强 XMarkdown 解析器，使其支持带占位符保护的自定义组件。[#1668](https://github.com/ant-design/x/pull/1668) 由 [yanghuanrong](https://github.com/yanghuanrong) 提交
- 🆕 新增 XMarkdown 基于 Playwright Component Testing 实现流式 Markdown 渲染的性能基准测试能力。[#1314](https://github.com/ant-design/x/pull/1314) 由 [Div627](https://github.com/Div627) 提交
- 🆕 新增 XMarkdown 流式语法对行内代码缓存的功能。[#1630](https://github.com/ant-design/x/pull/1630) 由 [Div627](https://github.com/Div627) 提交

### 其他

- 📖 优化官网站点提升用户体验。[#1675](https://github.com/ant-design/x/pull/1675) 由 [hongxuWei](https://github.com/hongxuWei) 提交、[#1644](https://github.com/ant-design/x/pull/1644) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1658](https://github.com/ant-design/x/pull/1658) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1646](https://github.com/ant-design/x/pull/1646) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1651](https://github.com/ant-design/x/pull/1651) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1650](https://github.com/ant-design/x/pull/1650) 由 [Div627](https://github.com/Div627) 提交、[#1635](https://github.com/ant-design/x/pull/1635) 由 [IsDyh01](https://github.com/IsDyh01) 提交、[#1627](https://github.com/ant-design/x/pull/1627) 由 [Alexzjt](https://github.com/Alexzjt) 提交、[#1615](https://github.com/ant-design/x/pull/1615) 由 [Yx0201](https://github.com/Yx0201) 提交

## 2.1.3

`2026-01-04`

### @ant-design/x

- 🐛 修复了 Sender 未声明依赖问题，将 `classnames` 替换为 `clsx` 并为 `biome.json` 配置了依赖引用检查。[#1608](https://github.com/ant-design/x/pull/1608) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1605](https://github.com/ant-design/x/pull/1605) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.1.2

`2025-12-30`

### @ant-design/x

- 💄 修复 Actions `disliked` 类名错误问题。[#1521](https://github.com/ant-design/x/pull/1521) 由 [kimteayon](https://github.com/kimteayon) 提交
- Sender
  - 🛠 整体重构 Sender 组件实现，同时修复一些细节光标问题。[#1515](https://github.com/ant-design/x/pull/1515) [#1548](https://github.com/ant-design/x/pull/1548) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 💄 修复 Sender 组件 actions 与 antd Button 样式冲突导致渲染错误问题。[#1535](https://github.com/ant-design/x/pull/1535) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复词槽模式 `skill` 情况下 placeholder 为空时光标太小异常的问题。[#1537](https://github.com/ant-design/x/pull/1537) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复粘贴文字时撤销栈（undo）未更新问题。[#1527](https://github.com/ant-design/x/pull/1527) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交
- 🐛 移除 Bubble.List 新消息自动滚动到最底部的逻辑，改为手动控制。[#1548](https://github.com/ant-design/x/pull/1548) 由 [anxLiang](https://github.com/anxLiang) 提交
- 💄 修复 Prompts 组件动画演示不生效问题。 [#1580](https://github.com/ant-design/x/pull/1580) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Actions.Feedback tooltip 展示异常问题。[#1591](https://github.com/ant-design/x/pull/1591) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Attachments 调用 `ref.select()` 未传参数时报错问题 [#1587](https://github.com/ant-design/x/pull/1587) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 FileCard `overflow` 展示时按钮未更新问题，以及图片展示时无 `src` 导致 Image 展示失败问题。 [#1587](https://github.com/ant-design/x/pull/1587) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🐛 修复 XChat 无法远程加载历史消息问题。[#1593](https://github.com/ant-design/x/pull/1593) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 OpenAIChatProvider 和 DeepSeekChatProvider 非流式请求渲染了两次内容问题。[#1593](https://github.com/ant-design/x/pull/1593) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 💄 修复 XMarkdown 动画字体颜色错误问题。[#1531](https://github.com/ant-design/x/pull/1531) 由 [Div627](https://github.com/Div627) 提交

### 其他

- 🛠 整体的依赖重构升级。[#1448](https://github.com/ant-design/x/pull/1448) 由 [yoyo837](https://github.com/yoyo837) 提交
- 📖 优化官网站点提升用户体验。[#1508](https://github.com/ant-design/x/pull/1508) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1516](https://github.com/ant-design/x/pull/1516) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1529](https://github.com/ant-design/x/pull/1529) 由 [fireairforce](https://github.com/fireairforce) 提交、[#1549](https://github.com/ant-design/x/pull/1549) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1551](https://github.com/ant-design/x/pull/1551) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1553](https://github.com/ant-design/x/pull/1553) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1555](https://github.com/ant-design/x/pull/1555) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1543](https://github.com/ant-design/x/pull/1543) 由 [IsDyh01](https://github.com/IsDyh01) 提交、[#1558](https://github.com/ant-design/x/pull/1558) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1557](https://github.com/ant-design/x/pull/1557) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1562](https://github.com/ant-design/x/pull/1562) 由 [hustcc](https://github.com/hustcc) 提交、[#1569](https://github.com/ant-design/x/pull/1569) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1561](https://github.com/ant-design/x/pull/1561) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1584](https://github.com/ant-design/x/pull/1584) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1581](https://github.com/ant-design/x/pull/1581) 由 [teimurjan](https://github.com/teimurjan) 提交

## 2.1.1

`2025-12-10`

### @ant-design/x

- Sender
  - 🐛 修复发送快捷键 enter 和 shift + enter 未受 submit 按钮 disabled 状态控制的问题，修复 `onSubmit` 快捷键和按钮参数不一致问题。 [#1472](https://github.com/ant-design/x/pull/1472) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 `onChange` 缺少 `skill` 参数问题，修复词槽模式仅展示技能能力时 placeholder 未展示问题，并重构 `onChange`逻辑。[#1477](https://github.com/ant-design/x/pull/1477) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复词槽模式 `input` 类型词槽激活焦点时发送快捷键 enter 和 shift + enter 未触发问题。[#1498](https://github.com/ant-design/x/pull/1498) 由 [kimteayon](https://github.com/kimteayon) 提交
- Attachment
  - 🐛 修复设置 `maxCount` 后最后一个文件未上传问题。[#1486](https://github.com/ant-design/x/pull/1486) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复上传图片后 antd 报警告问题。[#1492](https://github.com/ant-design/x/pull/1492) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Mermaid 渲染抖动问题。[#1497](https://github.com/ant-design/x/pull/1497) 由 [Div627](https://github.com/Div627) 提交
- 📖 优化官网站点提升用户体验。[#1464](https://github.com/ant-design/x/pull/1464) 由 [IsDyh01](https://github.com/IsDyh01) 提交、[#1483](https://github.com/ant-design/x/pull/1483) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1463](https://github.com/ant-design/x/pull/1463) 由 [J-Da-Shi](https://github.com/J-Da-Shi) 提交、[#1489](https://github.com/ant-design/x/pull/1489) 由 [Chiaki-xps](https://github.com/Chiaki-xps) 提交、[#1499](https://github.com/ant-design/x/pull/1499) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1500](https://github.com/ant-design/x/pull/1500) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1501](https://github.com/ant-design/x/pull/1501) 由 [Samoy](https://github.com/Samoy) 提交
- 🛠 修改对 `mermaid` 的依赖配置。[#1475](https://github.com/ant-design/x/pull/1475) 由 [Div627](https://github.com/Div627) 提交

### @ant-design/x-sdk

- 🐛 优化消息流的节流与发射逻辑，避免高频流式更新导致的深度更新错误，提升实时消息稳定性与性能。[#1418](https://github.com/ant-design/x/pull/1418) 由 [Afee2019](https://github.com/Afee2019) 提交

### @ant-design/x-markdown

- 🛠 优化 `sideEffects` 配置。[#1408](https://github.com/ant-design/x/pull/1408) 由 [hongxuWei](https://github.com/hongxuWei) 提交

## 2.1.0

`2025-12-05`

### @ant-design/x

- 🐛 修复 Bubble css token `typingContent` 配置不生效问题。[#1435](https://github.com/ant-design/x/pull/1435) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复因 antd 升级到 6.0.1 导致多个组件样式丢失问题。[#1441](https://github.com/ant-design/x/pull/1441) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1446](https://github.com/ant-design/x/pull/1446) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Bubble.List 在 safari 浏览器滚动兼容性问题。[#1392](https://github.com/ant-design/x/pull/1392) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🔥 新组件 HighlightCode 和 Mermaid。[#1402](https://github.com/ant-design/x/pull/1402) 由 [Div627](https://github.com/Div627) 提交
- 🆕 Actions 新增语义化实现。[#1443](https://github.com/ant-design/x/pull/1443) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Suggestion 新增语义化实现，移除重复的 Enter 触发事件，修复 `onSubmit` 方法多次执行的问题，`onSelect` 方法新增 `selectedOptions` 完整数据返回，同时对选项的实现使用 `useMergedState` 进行了重构。[#1406](https://github.com/ant-design/x/pull/1406) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1444](https://github.com/ant-design/x/pull/1444) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Sender 新的词槽类型 `content` 和技能功能 `skill`。[#1377](https://github.com/ant-design/x/pull/1377) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🐛 修复 DeepSeekChatProvider 对 `<think>` 标签格式换行处理不当导致 XMarkdown 格式渲染异常问题。[#1445](https://github.com/ant-design/x/pull/1445) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 useXChat `setMessages` 方法调用未触发渲染问题。[#1450](https://github.com/ant-design/x/pull/1450) 由 [hylin](https://github.com/hylin) 提交
- 🐛 修复 rc-util 依赖未声明问题。[#1456](https://github.com/ant-design/x/pull/1456) 由 [hylin](https://github.com/hylin) 提交

### @ant-design/x-markdown

- 🐛 替换 useStreaming 正则解决 ios 兼容性问题。[#1457](https://github.com/ant-design/x/pull/1457) 由 [Div627](https://github.com/Div627) 提交
- 📖 完善文档提升用户体验。[#1451](https://github.com/ant-design/x/pull/1451) 由 [Div627](https://github.com/Div627) 提交
- 🛠 迁移 UI 插件 HighlightCode 和 Mermaid 到 @ant-design/x 达成更合理的依赖关系。[#1402](https://github.com/ant-design/x/pull/1402) 由 [Div627](https://github.com/Div627) 提交

## 2.0.1

`2025-12-03`

### @ant-design/x

- 🐛 修复因 antd 升级到 6.0.1 导致多个组件样式丢失问题。[#1428](https://github.com/ant-design/x/pull/1428) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Attachments 组件使用时 antd 报错问题。[#1395](https://github.com/ant-design/x/pull/1395) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Sender 组件 `allowSpeech` 自定义时 disable 错误问题。[#1398](https://github.com/ant-design/x/pull/1398) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Sender.Switch 组件语义化配置缺失问题。[#1396](https://github.com/ant-design/x/pull/1396) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 修复因版本升级导致的测试用例失败。[#1393](https://github.com/ant-design/x/pull/1393) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 新增 1.x 官网链接。[#1386](https://github.com/ant-design/x/pull/1386) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1394](https://github.com/ant-design/x/pull/1394) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1384](https://github.com/ant-design/x/pull/1384) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1416](https://github.com/ant-design/x/pull/1416) 由 [IsDyh01](https://github.com/IsDyh01) 提交

### @ant-design/x-sdk

- 📖 官网目录、文档、示例全面更新。[#1419](https://github.com/ant-design/x/pull/1419) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 useXChat `requestFallback` 新增 errorInfo 参数解决无法获取接口错误数据问题。[#1419](https://github.com/ant-design/x/pull/1419) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🐛 修复插件 HighlightCode 复制代码错误问题。[#1414](https://github.com/ant-design/x/pull/1414) 由 [Jimi1126](https://github.com/Jimi1126) 提交
- 🐛 修复 XMarkdown 渲染特殊字符失败问题。[#1413](https://github.com/ant-design/x/pull/1413) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 缓存重置逻辑因旧引用未生效问题。[#1420](https://github.com/ant-design/x/pull/1420) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0

`2025-11-22`

🏆 Ant Design X 2.0.0 已发布！

`@ant-design/x` - 智能界面构建框架

基于 Ant Design 设计体系的 React UI 库、专为 AI 驱动界面设计，开箱即用的智能对话组件、无缝集成 API 服务，快速搭建智能应用界面。

`@ant-design/x-markdown` - 高性能流式渲染引擎

专为流式内容优化的 Markdown 渲染解决方案、强大的扩展能力，支持公式、代码高亮、mermaid 图表等极致性能表现，确保流畅的内容展示体验。

`@ant-design/x-sdk` - AI 对话数据流管理

提供完整的工具 API 集合、开箱即用的 AI 对话应用数据流管理、简化开发流程，提升开发效率。

##### 升级必读

🌟 我们准备了升级文档，查看[详情](/docs/react/migration-v2-cn)。

## 2.0.0-alpha.16

`2025-11-17`

### @ant-design/x

- 🛠 删除 components 属性，同时将内部属性提升。[#1338](https://github.com/ant-design/x/pull/1338) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 FileCard 新增图片生成过程以及加载、渲染能力。[#1311](https://github.com/ant-design/x/pull/1311) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Think 将 `blink` 动画样式升级为 css token。[#1318](https://github.com/ant-design/x/pull/1318) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 ThoughtChain 将 `blink` 动画样式升级为 css token。[#1318](https://github.com/ant-design/x/pull/1318) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1335](https://github.com/ant-design/x/pull/1335) 由 [kimteayon](https://github.com/kimteayon)、[#1329](https://github.com/ant-design/x/pull/1329) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🛠 使用 useMemo 优化 markdown 渲染，同时修改基本演示文本和动画演示文本。[#1337](https://github.com/ant-design/x/pull/1337) 由 [Div627](https://github.com/Div627) 提交
- 🆕 XMarkdown 渲染 HTML 标签对 `disabled` 和 `checked` 属性透出。[#1328](https://github.com/ant-design/x/pull/1328) 由 [Div627](https://github.com/Div627) 提交
- 🆕 XMarkdown `hasNextChunk` 增加对表格渲染处理的能力。[#1322](https://github.com/ant-design/x/pull/1322) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 默认的表格渲染的样式。[#1324](https://github.com/ant-design/x/pull/1324) 由 [Div627](https://github.com/Div627) 提交
- 🆕 XMarkdown `incompleteMarkdownComponentMap` 新增多个类型渲染。[#1325](https://github.com/ant-design/x/pull/1325) 由 [Div627](https://github.com/Div627) 提交
- 📖 优化官网站点提升用户体验。[#1326](https://github.com/ant-design/x/pull/1326) 由 [Div627](https://github.com/Div627)。

## 2.0.0-alpha.15

`2025-11-07`

### @ant-design/x

- 🛠 升级 antd 依赖版本到 `6.00-alpha.4`。[#1300](https://github.com/ant-design/x/pull/1300) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1303](https://github.com/ant-design/x/pull/1303) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🛠 重构 markdown 主题样式。[#1305](https://github.com/ant-design/x/pull/1305) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 `code` 标签 `streamStatus` 状态错误问题。[#1307](https://github.com/ant-design/x/pull/1307) 由 [Div627](https://github.com/Div627) 提交
- 🛠 将 `index.less` 改造为 `index.css`。[#1306](https://github.com/ant-design/x/pull/1306) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 `SteamingOption` 为 `StreamingOption`。[#1301](https://github.com/ant-design/x/pull/1301) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 dompurifyConfig.ALLOWED_TAGS 被错误合并到 ADD_TAGS 的问题。[#1297](https://github.com/ant-design/x/pull/1297) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.13

`2025-10-30`

### @ant-design/x

- 🐛 删除 Bubble.List `suffix` 属性，并通过 CSS Token 修改来 typing。[#1285](https://github.com/ant-design/x/pull/1285) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 ThoughtChain.Item 组件新增闪动效果。[#1278](https://github.com/ant-design/x/pull/1278) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Think 组件新增闪动效果。[#1278](https://github.com/ant-design/x/pull/1278) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 ThoughtChain 组件新增闪动效果。[#1286](https://github.com/ant-design/x/pull/1286) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Actions 新增 fadeIn 和 fadeInLeft 效果。[#1288](https://github.com/ant-design/x/pull/1288) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1289](https://github.com/ant-design/x/pull/1289) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Prompts 新增 fadeIn 和 fadeInLeft 效果。[#1289](https://github.com/ant-design/x/pull/1289) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1290](https://github.com/ant-design/x/pull/1290) 由 [Rain120](https://github.com/Rain120)。

### @ant-design/x-markdown

- 🐛 修复传入的 renderer link 被覆盖问题。[#1276](https://github.com/ant-design/x/pull/1276) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.12

`2025-10-29`

### @ant-design/x

- 🆕 Attachments Ref 新增 `select` 方法支持选择文件的能力，同时修复设置了最大数量，并达到了最大数量后仍显示上传按钮的问题。[#1266](https://github.com/ant-design/x/pull/1266) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1269](https://github.com/ant-design/x/pull/1269) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1274](https://github.com/ant-design/x/pull/1274) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🐛 修复 KaTeX 插件渲染失败抛出异常的问题，修改公式渲染规则减少渲染异常。[#1265](https://github.com/ant-design/x/pull/1265) 由 [Div627](https://github.com/Div627) 提交
- 📖 新增 XMarkdown 处理中文链接的代码示例。[#1270](https://github.com/ant-design/x/pull/1270) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 `code` 和 `pre` 标签渲染时返回渲染状态 `streamStatus` 以及块级标识 `block`。[#1272](https://github.com/ant-design/x/pull/1272) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复渲染 markdown 时重复的 DOM key。[#1273](https://github.com/ant-design/x/pull/1273) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.11

`2025-10-27`

### @ant-design/x

- 🆕 Sender 词槽配置改为可变属性，词槽模式下 `insert` 方法新增 `replaceCharacters` 属性入参，支持新增替换功能，同时 `focus` 方法新增词槽 `key` 的配置以支持指定词槽的 `focus` 功能。[#1259](https://github.com/ant-design/x/pull/1259) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Sources 行内模式支持指定当前激活的面板，新增 `activeKey` 属性，同时优化面板切换的交互样式，使体验更好。[#1261](https://github.com/ant-design/x/pull/1261) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 Bubble.List 对滚动条布局和实现以及语义化进行了优化。[#1263](https://github.com/ant-design/x/pull/1263) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🐛 修复 XMarkdown 自定义组件不同状态下入参结构不一致问题。[#1260](https://github.com/ant-design/x/pull/1260) 由 [Div627](https://github.com/Div627) 提交
- 📖 新增 XMarkdown 代码示例。[#1262](https://github.com/ant-design/x/pull/1262) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.10

`2025-10-23`

### @ant-design/x

- 🔥 新组件 Sources。[#1250](https://github.com/ant-design/x/pull/1250) 由 [hy993658052](https://github.com/hy993658052) 提交
- 🆕 Bubble 新增 Bubble.System 和 Bubble.Divider 两个子组件。[#1239](https://github.com/ant-design/x/pull/1239) 由 [anxLiang](https://github.com/anxLiang) 和 [kimteayon](https://github.com/kimteayon) 提交
- Sender
- 🆕 新增词槽焦点事件功能。[#1221](https://github.com/ant-design/x/pull/1221) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复输入框 `onPasteFile` 粘贴多文件回调数据错误问题。[#1221](https://github.com/ant-design/x/pull/1221) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 svg 未做国际化导致的无障碍问题。[#1243](https://github.com/ant-design/x/pull/1243) 由 [kimteayon](https://github.com/kimteayon) 提交
- FileCard
- 🆕 新增语义化实现。[#1220](https://github.com/ant-design/x/pull/1220) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 新增 `jfif` 类型支持。[#1248](https://github.com/ant-design/x/pull/1248) 由 [IsDyh01](https://github.com/IsDyh01) 提交
- 🆕 Attachments 新增语义化实现。[#1220](https://github.com/ant-design/x/pull/1220) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1216](https://github.com/ant-design/x/pull/1216) 由 [kimteayon](https://github.com/kimteayon) 提交， [#1217](https://github.com/ant-design/x/pull/1217) 由 [Div627](https://github.com/Div627) 提交，[#1218](https://github.com/ant-design/x/pull/1218) 由 [IsDyh01](https://github.com/IsDyh01) 提交，[#1224](https://github.com/ant-design/x/pull/1224) 由 [kimteayon](https://github.com/ kimteayon) 提交，[#1232](https://github.com/ant-design/x/pull/1232) 由 [IsDyh01](https://github.com/IsDyh01) 提交，[#1233](https://github.com/ant-design/x/pull/1233) 由 [kimteayon](https://github.com/kimteayon) 提交，[#1243](https://github.com/ant-design/x/pull/1243) 由 [kimteayon](https://github.com/kimteayon) 提交，[#1247](https://github.com/ant-design/x/pull/1247) 由 [elrrrrrrr](https://github.com/elrrrrrrr) 提交

### @ant-design/x-markdown

- 🆕 XMarkdown 新增需闭合标签语法的过程中的渲染组件配置 `incomplete` 以及对应功能。[#1223](https://github.com/ant-design/x/pull/1223) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown openLinksInNewTab 属性配置失效问题。[#1253](https://github.com/ant-design/x/pull/1253) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 动画重复渲染问题。[#1255](https://github.com/ant-design/x/pull/1255) 由 [Div627](https://github.com/Div627) 提交
- 🆕 健壮 XMarkdown 对公式渲染标签识别能力。[#1255](https://github.com/ant-design/x/pull/1255) 由 [Div627](https://github.com/Div627) 提交

### @ant-design/x-sdk

- 🐛 修复 useXChat 处理流数据服务器错误导致 `requestFallback` 回调入参问题。[#1224](https://github.com/ant-design/x/pull/1224) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 useXConversations 新增 activeConversationKey 的实现。[#1252](https://github.com/ant-design/x/pull/1252) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 useXChat `isRequesting` 非多实例问题，以及优化 `requestPlaceholder` 和 `requestFallback` 回调入参。[#1254](https://github.com/ant-design/x/pull/1254) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.9

`2025-09-24`

### @ant-design/x-markdown

- 🐛 修复代码高亮插件样式丢失、组件无法匹配嵌套子元素的问题，并移除默认样式中的 table text-align 属性。[#1212](https://github.com/ant-design/x/pull/1212) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.8

`2025-09-22`

### @ant-design/x

- Bubble
  - 🆕 Bubble.List 新增 `extra` 参数，配合 useXChat 已支持自定义功能。[#1195](https://github.com/ant-design/x/pull/1195) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 `loading` 状态下内容高度被固定问题。[#1178](https://github.com/ant-design/x/pull/1178) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复组件类型导出命名错误问题。[#1182](https://github.com/ant-design/x/pull/1182) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 ThoughtChain.Item 组件类型导出命名错误问题。[#1178](https://github.com/ant-design/x/pull/1178) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 XProvider 监听组件缺少问题。[#1178](https://github.com/ant-design/x/pull/1178) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🛠 重构动画相关实现。[#1198](https://github.com/ant-design/x/pull/1198) 由 [Div627](https://github.com/Div627) 提交、[#1204](https://github.com/ant-design/x/pull/1204) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复插件导出类型错误问题，以及新增示例和文档[#1187](https://github.com/ant-design/x/pull/1187) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 Mermaid 插件切换时渲染异常。[#1175](https://github.com/ant-design/x/pull/1175) 由 [Div627](https://github.com/Div627) 提交
- 🆕 补充 HighlightCode 插件和 Mermaid 插件语义化实现。[#1178](https://github.com/ant-design/x/pull/1178) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 XMarkdown 主题样式覆盖不全问题。 [#1182](https://github.com/ant-design/x/pull/1182) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🆕 useXChat `setMessage` 支持使用回调函数支持获取原始消息，同时 `onRequest` 和 `onReload` 新增 `extra` 参数以支持自定义功能。 [#1195](https://github.com/ant-design/x/pull/1195) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 🆕 更新站点整体文档。 [#1194](https://github.com/ant-design/x/pull/1194) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 更新样板间功能，新增'现代感'样板间。 [#1184](https://github.com/ant-design/x/pull/1184) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1195](https://github.com/ant-design/x/pull/1195) 由 [kimteayon](https://github.com/kimteayon) 提交、 [#1194](https://github.com/ant-design/x/pull/1194) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1170](https://github.com/ant-design/x/pull/1170) 由 [jinyang](https://github.com/jinyang) 提交、[#1186](https://github.com/ant-design/x/pull/1186) 由 [jinyang](https://github.com/jinyang) 提交、[#1192](https://github.com/ant-design/x/pull/1192) 由 [iamkun-2](https://github.com/iamkun-2) 提交、[#1193](https://github.com/ant-design/x/pull/1193) 由 [iamkun-2](https://github.com/iamkun-2) 提交、[#1197](https://github.com/ant-design/x/pull/1197) 由 [elrrrrrrr](https://github.com/elrrrrrrr) 提交、[#1199](https://github.com/ant-design/x/pull/1199) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.7

`2025-09-14`

### @ant-design/x

- Bubble
  - 💄 修复默认 `white-space` 样式问题。[#1147](https://github.com/ant-design/x/pull/1147) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 💄 修复语义化缺失以及 `loading` 状态下在 Bubble.List 下高度错误问题。[#1162](https://github.com/ant-design/x/pull/1162) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复类型导出和文档引入错误问题。[#1160](https://github.com/ant-design/x/pull/1160) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 删除下线工具 `useXAgent` 和 `useXChat`，以及对应的文档引用删除或者替换为 `X SDK`。[#1148](https://github.com/ant-design/x/pull/1148) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 FileCard 组件 `status` 展示缺失问题。[#1156](https://github.com/ant-design/x/pull/1156) 由 [hy993658052](https://github.com/hy993658052) 提交
- 🐛 修复 Sender 组件开启文件粘贴功能时无法粘贴 Excel 单元格文本数据问题。[#1167](https://github.com/ant-design/x/pull/1167) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🆕 新增 Mermaid 插件操作功能。[#1135](https://github.com/ant-design/x/pull/1135) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 流式效果。[#1135](https://github.com/ant-design/x/pull/1135) 由 [Div627](https://github.com/Div627) 提交
- 🆕 新增插件国际化和主题定制功能，以及文档升级。[#1135](https://github.com/ant-design/x/pull/1135) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 新增 XMarkdown 链接 `openLinksInNewTab` 配置、以及主题颜色调整。[#1164](https://github.com/ant-design/x/pull/1164) 由 [Div627](https://github.com/Div627) 提交
- 🐛 修复 XMarkdown 与文档 markdown 样式冲突问题。[#1161](https://github.com/ant-design/x/pull/1161) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🛠 重构 useXChat 工具 `isRequesting` 属性，由方法升级为可监控变量。[#1168](https://github.com/ant-design/x/pull/1168) 由 [hylin](https://github.com/hylin) 提交
- 🆕 新增 useXChat 工具消息 `abort` 状态，同时修复 `requestFallback` 回调方法 `message` 参数错误以及删掉对错误状态的消息过滤。[#1171](https://github.com/ant-design/x/pull/1171) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 📖 优化官网站点提升用户体验。[#1169](https://github.com/ant-design/x/pull/1169) 由 [hylin](https://github.com/hylin) 提交
- 📖 更新官网介绍、模型接入、百宝箱智能体接入、X SDK 等文档，以及样板间代码更新。[#1171](https://github.com/ant-design/x/pull/1171) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.6

`2025-08-28`

### @ant-design/x

- 🐛 修复 Sender 普通模式点击 `Enter` 选中文候选词时触发 `Submit` 的问题。[#1144](https://github.com/ant-design/x/pull/1144) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Sender 词槽模式 `submitType` 为 `shiftEnter` 时无法换行问题。[#1143](https://github.com/ant-design/x/pull/1143) 由 [kimteayon](https://github.com/kimteayon) 提交
- 💄 修复 ThoughtChain.Item `description` 内容过多换行后 `margin` 样式异常。由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 使用 `@ant-design/x-sdk` 重构样板间。[#1139](https://github.com/ant-design/x/pull/1139) 由 [hylin](https://github.com/hylin) 提交
- 🐛 修复 Bubble `prefix` 持续展示。[#1137](https://github.com/ant-design/x/pull/1137) 由 [anxLiang](https://github.com/anxLiang) 提交
- 📖 补充 Bubble.List 文档解释滚动容器问题。[#1133](https://github.com/ant-design/x/pull/1133) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🐛 修复 Attachment 组件上传图片未展示图片问题。[#1140](https://github.com/ant-design/x/pull/1140) 由 [hy993658052](https://github.com/hy993658052) 提交
- 🐛 修复 FileCard 语义化问题以及卡片大小展示问题。[#1130](https://github.com/ant-design/x/pull/1130) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 📦 升级 father 配置。[#1125](https://github.com/ant-design/x/pull/1125) 由 [fireairforce](https://github.com/fireairforce) 提交
- 📖 优化官网站点提升用户体验。[#1142](https://github.com/ant-design/x/pull/1142) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.5

`2025-08-20`

### @ant-design/x

- 🆕 新增 Actions 子组件功能，Actions.Copy、Actions.Audio、Actions.Item。[#1121](https://github.com/ant-design/x/pull/1121) 由 [kimteayon](https://github.com/kimteayon) 提交
- Bubble
  - 🆕 新增 `string content` 时渲染带换行符、制表符的功能。[#1127](https://github.com/ant-design/x/pull/1127) 由 [anxLiang](https://github.com/anxLiang) 提交
  - 🆕 新增语义化实现。[#1116](https://github.com/ant-design/x/pull/1116) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 优化样式和类型问题。[#1108](https://github.com/ant-design/x/pull/1108) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🆕 新增 Sender 组件语义化配置。[#1116](https://github.com/ant-design/x/pull/1116) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-sdk

- 🛠 整体优化 X SDK。[#1114](https://github.com/ant-design/x/pull/1114) 由 [hylin](https://github.com/hylin) 提交

### 其他

- 📖 使用 X SDK 重构样板间。[#1139](https://github.com/ant-design/x/pull/1139) 由 [hylin](https://github.com/hylin) 提交
- 📖 优化官网站点提升用户体验。[#1124](https://github.com/ant-design/x/pull/1124) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1123](https://github.com/ant-design/x/pull/1123) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 发布链路优化。[#1115](https://github.com/ant-design/x/pull/1115) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.3

`2025-08-14`

### @ant-design/x-markdown

- 🛠 优化 version 逻辑以及配置、文档。[#1112](https://github.com/ant-design/x/pull/1112) 由 [Div627](https://github.com/Div627) 提交

## 2.0.0-alpha.1

`2025-08-12`

### @ant-design/x

- 🛠 重构升级组件 Bubble。[#1100](https://github.com/ant-design/x/pull/1100) 由 [anxLiang](https://github.com/anxLiang) 提交、[#1077](https://github.com/ant-design/x/pull/1077) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🛠 重构升级组件 Bubble.List。[#1077](https://github.com/ant-design/x/pull/1077) 由 [anxLiang](https://github.com/anxLiang) 提交
- 🐛 修复 Bubble 组件 `readOnly` 和 `loading` 逻辑不生效问题。[#1101](https://github.com/ant-design/x/pull/1101) 由 [kimteayon](https://github.com/kimteayon) 提交

### 其他

- 🛠 发布链路优化。[#1098](https://github.com/ant-design/x/pull/1098) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1009](https://github.com/ant-design/x/pull/1009) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1087](https://github.com/ant-design/x/pull/1087) 由 [kimteayon](https://github.com/kimteayon) 提交

## 2.0.0-alpha.0

`2025-08-05`

### @ant-design/x

- 🔥 新组件 FileCard。[#1094](https://github.com/ant-design/x/pull/1094) 由 [hy993658052](https://github.com/hy993658052) 提交
- 🔥 新组件 Notification。[#973](https://github.com/ant-design/x/pull/973) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🔥 新组件 Think。[#970](https://github.com/ant-design/x/pull/970) [#966](https://github.com/ant-design/x/pull/966) [#946](https://github.com/ant-design/x/pull/946) 由 [hy993658052](https://github.com/hy993658052) 提交
- 🛠 重构升级组件 Attachments。
- 🛠 重构升级组件 Actions。[#994](https://github.com/ant-design/x/pull/994) 由 [vanndxh](https://github.com/vanndxh) 提交
- 🛠 重构升级组件 Conversations。[#937](https://github.com/ant-design/x/pull/937) [#954](https://github.com/ant-design/x/pull/954) [#955](https://github.com/ant-design/x/pull/955) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 重构升级组件 Sender。[#1073](https://github.com/ant-design/x/pull/1073) 由 [kimteayon](https://github.com/kimteayon) 提交、[#962](https://github.com/ant-design/x/pull/962) 由 [Chuck-Ray](https://github.com/Chuck-Ray) 提交
- 🛠 重构升级组件 ThoughtChain。[#985](https://github.com/ant-design/x/pull/985) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 全部组件 `Ref` 功能补全。[#1081](https://github.com/ant-design/x/pull/1081) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🆕 XProvider 组件国际化逻辑接入。[#952](https://github.com/ant-design/x/pull/952) 由 [kimteayon](https://github.com/kimteayon) 提交

### @ant-design/x-markdown

- 🔥 新组件 XMarkdown。[#1060](https://github.com/ant-design/x/pull/1060) 由 [Div627](https://github.com/Div627) 提交、[#989](https://github.com/ant-design/x/pull/989) 由 [Div627](https://github.com/Div627) 提交
- 🔥 新插件 Latex。[#1060](https://github.com/ant-design/x/pull/1060) 由 [Div627](https://github.com/Div627) 提交、[#989](https://github.com/ant-design/x/pull/989) 由 [Div627](https://github.com/Div627) 提交
- 🔥 新插件 HighlightCode。[#1060](https://github.com/ant-design/x/pull/1060) 由 [Div627](https://github.com/Div627) 提交、[#989](https://github.com/ant-design/x/pull/989) 由 [Div627](https://github.com/Div627) 提交
- 🔥 新插件 Mermaid。[#1060](https://github.com/ant-design/x/pull/1060) 由 [Div627](https://github.com/Div627) 提交、[#989](https://github.com/ant-design/x/pull/989) 由 [Div627](https://github.com/Div627) 提交

### @ant-design/x-sdk

- 🔥 新工具 useXChat。[#1098](https://github.com/ant-design/x/pull/1098) 由 [hylin](https://github.com/hylin) 提交
- 🔥 新工具 useXConversations。[#1098](https://github.com/ant-design/x/pull/1098) 由 [hylin](https://github.com/hylin) 提交
- 🔥 新工具 Chat Provider。[#1098](https://github.com/ant-design/x/pull/1098) 由 [hylin](https://github.com/hylin) 提交
- 🔥 新工具 XRequest。[#1098](https://github.com/ant-design/x/pull/1098) 由 [hylin](https://github.com/hylin) 提交
- 🔥 新工具 XStream。[#1098](https://github.com/ant-design/x/pull/1098) 由 [hylin](https://github.com/hylin) 提交

### 其他

- 🛠 整体框架升级为 Monorepo。[#823](https://github.com/ant-design/x/pull/823) 由 [elrrrrrrr](https://github.com/elrrrrrrr) 提交
- 🛠 整体组件升级 Ant Design V6。[#1012](https://github.com/ant-design/x/pull/1012) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🛠 Ant Design X 发布逻辑升级调整。[#1098](https://github.com/ant-design/x/pull/1098) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1009](https://github.com/ant-design/x/pull/1009) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#1083](https://github.com/ant-design/x/pull/1083) 由 [kimteayon](https://github.com/kimteayon) 提交、[#1001](https://github.com/ant-design/x/pull/1001) 由 [elrrrrrrr](https://github.com/elrrrrrrr) 提交

## 1.6.1

`2025-09-12`

- 🐛 修复 ThoughtChain 组件 `title` 传入 `ReactNode` 时折叠标题无法显示问题。[#1172](https://github.com/ant-design/x/pull/1172) 由 [IsDyh01](https://github.com/IsDyh01) 提交
- 🐛 修复 Sender 组件 `LoadingButton` 传入 `icon` 属性时同时显示两个图标问题。[#1145](https://github.com/ant-design/x/pull/1145) 由 [IsDyh01](https://github.com/IsDyh01) 提交
- 🐛 修复 Sender 组件 `content` 语义化缺失问题。[#703](https://github.com/ant-design/x/pull/703) 由 [HomyeeKing](https://github.com/HomyeeKing) 提交
- 🐛 移除 Bubble 组件打字效果公共前缀逻辑中的冗余条件判断。[#1091](https://github.com/ant-design/x/pull/1091) 由 [AqingCyan](https://github.com/AqingCyan) 提交
- 🐛 修复 useXChat `updating` 状态缺失问题。[#833](https://github.com/ant-design/x/pull/833) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交
- 🐛 修复 Suggestion 组件 `useActive` 中 items 为空数组导致的异常。[#824](https://github.com/ant-design/x/pull/824) 由 [LengYXin](https://github.com/LengYXin) 提交
- 📖 优化官网站点提升用户体验。[#960](https://github.com/ant-design/x/pull/960) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交、[#1048](https://github.com/ant-design/x/pull/1048) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交、[#1118](https://github.com/ant-design/x/pull/1118) 由 [afc163](https://github.com/afc163) 提交、[#1122](https://github.com/ant-design/x/pull/1122) 由 [fireairforce](https://github.com/fireairforce) 提交、[#1120](https://github.com/ant-design/x/pull/1120) 由 [IsDyh01](https://github.com/IsDyh01) 提交

## 1.6.0

`2025-07-30`

- 🆕 Attachments 组件 `FileCard` 新增图标和类型的配置能力。[#1006](https://github.com/ant-design/x/pull/1006) 由 [kieranwv](https://github.com/kieranwv) 提交
- 📖 新增百宝箱智能体接入文档和样板间。[#1063](https://github.com/ant-design/x/pull/1063) 由 [iamkun-2](https://github.com/iamkun-2) 提交
- 📖 优化官网站点提升用户体验。[#1054](https://github.com/ant-design/x/pull/1054) 由 [hylin](https://github.com/hylin) 提交、[#1056](https://github.com/ant-design/x/pull/1056) 由 [hylin](https://github.com/hylin) 提交

## 1.5.0

`2025-07-16`

- 🆕 补充 Bubble 组件对滚动事件 `onScroll` 的监听。[#1021](https://github.com/ant-design/x/pull/1021) 由 [QdabuliuQ](https://github.com/QdabuliuQ) 提交
- 🐛 移除 Bubble 重复的 TS 类型定义。[#1032](https://github.com/ant-design/x/pull/1032) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交
- 🐛 修复 Conversations 组件点击禁用的 `menu` 导致触发 `onActiveChange` 的问题。[#1024](https://github.com/ant-design/x/pull/1024) 由 [QdabuliuQ](https://github.com/QdabuliuQ) 提交
- 🐛 修复 Attachments 组件 `FileList` 语义化配置。[#1017](https://github.com/ant-design/x/pull/1017) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 补充 Actions 组件 html 配置。[#995](https://github.com/ant-design/x/pull/995) 由 [vanndxh](https://github.com/vanndxh) 提交
- 🐛 修复 Conversations label 标签展示问题，同时补充语义化配置。[#898](https://github.com/ant-design/x/pull/898) 由 [yuanliu147](https://github.com/yuanliu147) 提交
- 📖 优化官网站点提升用户体验。[#940](https://github.com/ant-design/x/pull/940) 由 [coding-ice](https://github.com/coding-ice) 提交、[#969](https://github.com/ant-design/x/pull/969) 由 [afc163](https://github.com/afc163) 提交、[#968](https://github.com/ant-design/x/pull/968) 由 [afc163](https://github.com/afc163) 提交、[#1019](https://github.com/ant-design/x/pull/1019) 由 [hylin](https://github.com/hylin) 提交、[#1036](https://github.com/ant-design/x/pull/1036) 由 [kimteayon](https://github.com/kimteayon) 提交

## 1.4.0

`2025-05-30`

- 🔥 新组件 操作列表 - Actions。[#768](https://github.com/ant-design/x/pull/768) 由 [vanndxh](https://github.com/vanndxh) 提交
- 🐛 修复 Bubble.List `footer` 和 `header` 无法获取 key 的问题。[#876](https://github.com/ant-design/x/pull/876) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Conversations 列表标题溢出截断失效问题。[#877](https://github.com/ant-design/x/pull/877) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#816](https://github.com/ant-design/x/pull/816) 由 [Rain120](https://github.com/Rain120) 提交、[#880](https://github.com/ant-design/x/pull/880) 由 [kimteayon](https://github.com/kimteayon) 提交

## 1.3.0

`2025-05-21`

- 📖 新增 Conversation 类型导出。[#258](https://github.com/ant-design/x/pull/258) 由 [ONLY-yours](https://github.com/ONLY-yours) 提交
- 💄 修复 Prompts 滚动条始终显示问题。[#785](https://github.com/ant-design/x/pull/785) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Suggestion 警告使用 antd 废弃 API `onDropdownVisibleChange` 的问题。[#827](https://github.com/ant-design/x/pull/827) 由 [zombieJ](https://github.com/zombieJ) 提交
- 🆕 扩展 Bubble `content` 到 `footer` 和 `header` 的方法实现参数，同时补充 Demo 实现。[#683](https://github.com/ant-design/x/pull/683) 由 [L-Hknu](https://github.com/L-Hknu) 和 [kimteayon](https://github.com/kimteayon) 提交
- 📖 修复 Api Key 在站点露出的安全问题。[#840](https://github.com/ant-design/x/pull/840) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 优化官网站点提升用户体验。[#783](https://github.com/ant-design/x/pull/783) 由 [kimteayon](https://github.com/kimteayon) 提交、[#229](https://github.com/ant-design/x/pull/229) 由 [afc163](https://github.com/afc163) 提交、[#835](https://github.com/ant-design/x/pull/835) 由 [kimteayon](https://github.com/kimteayon) 、[#814](https://github.com/ant-design/x/pull/814) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交

## 1.2.0

`2025-04-25`

- 🐛 删除 Conversations 溢出省略逻辑修复 `tooltip` 展示错误的问题。[#776](https://github.com/ant-design/x/pull/776) 由 [afc163](https://github.com/afc163) 提交
- 🐛 修复 Attachments `image` 卡片样式问题。[#751](https://github.com/ant-design/x/pull/751) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交
- 🐛 修复 ThoughtChain 受控问题。[#752](https://github.com/ant-design/x/pull/752) 由 [Youzi2233](https://github.com/Youzi2233) 提交
- XRequest
  - 🆕 XRequestCallbacks 新增 `onStream` 回调，可对流监听和终止操作。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 XRequestOptions 变更不生效问题，并新增示例。[#736](https://github.com/ant-design/x/pull/736) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 新增模型接入示例。[#725](https://github.com/ant-design/x/pull/725) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 📖 优化 API 方法参数命名不准确问题。[#736](https://github.com/ant-design/x/pull/736) 由 [kimteayon](https://github.com/kimteayon) 提交
- useXAgent
  - 🆕 RequestFn 新增 `onStream` 回调，可对流监听和终止操作。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 RequestFn 新增 `transformStream` 转换函数，用于处理流数据。[#725](https://github.com/ant-design/x/pull/725) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 XAgentConfigPreset 变更不生效问题，并新增示例。[#736](https://github.com/ant-design/x/pull/736) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🐛 修复 RequestFn `onSuccess` 回调类型错误问题，同时更新对应示例。[#725](https://github.com/ant-design/x/pull/725) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 新增模型接入、自定义入参、变更配置示例。[#725](https://github.com/ant-design/x/pull/725) 由 [kimteayon](https://github.com/kimteayon) 提交、[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
- useXChat
  - 🆕 XChatConfig 新增 Input 和 Output 泛型类型。[#725](https://github.com/ant-design/x/pull/725) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 XChatConfig 新增 `transformMessage` 转换函数，可在更新数据时对 `messages` 做转换，同时会更新到 `messages`。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 XChatConfig 新增 `transformStream` 转换函数，用于处理流数据。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 XChatConfig 新增 `resolveAbortController` 回调函数，可获得 `AbortController` 控制器，用于控制流状态。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 新增模型接入示例，删除错误的终止流示例。[#711](https://github.com/ant-design/x/pull/711) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Sender `header` 圆角样式溢出问题。[#732](https://github.com/ant-design/x/pull/732) 由 [Bao0630](https://github.com/Bao0630) 提交
- 📖 新增助手式样板间。[#657](https://github.com/ant-design/x/pull/657) 由 [vanndxh](https://github.com/vanndxh) 提交
- 📖 重构独立式样板间。[#753](https://github.com/ant-design/x/pull/753) 由 [vanndxh](https://github.com/vanndxh) 提交
- 📖 优化官网站点提升用户体验。[#730](https://github.com/ant-design/x/pull/730) 由 [afc163](https://github.com/afc163) 提交、[#758](https://github.com/ant-design/x/pull/758) 由 [coding-ice](https://github.com/coding-ice) 提交、 [#761](https://github.com/ant-design/x/pull/761) 由 [ONLY-yours](https://github.com/ONLY-yours) 提交

## 1.1.1

`2025-04-14`

- Bubble.List
  - 💄 优化 Bubble.List 更新时减少不必要的刷新。[#479](https://github.com/ant-design/x/pull/479) 由 [YumoImer](https://github.com/YumoImer) 提交
  - 🐛 修复 Bubble.List 暗黑主题下滚动条样式不兼容问题。[#727](https://github.com/ant-design/x/pull/727) 由 [kimteayon](https://github.com/kimteayon) 提交
- Conversation
  - 🐛 修复 Conversation 内 ul 和 li 的样式问题。[#726](https://github.com/ant-design/x/pull/726) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 新增 `menu` 的 `getPopupContainer` 的实现。[#698](https://github.com/ant-design/x/pull/698) 由 [yuxuan-ctrl](https://github.com/yuxuan-ctrl) 提交
- 🐛 修复 ThoughtChain 折叠面板无法展开问题。[#720](https://github.com/ant-design/x/pull/720) 由 [kimteayon](https://github.com/kimteayon) 提交
- 🐛 修复 Attachments 图片展示样式问题。[#708](https://github.com/ant-design/x/pull/708) 由 [hy993658052](https://github.com/hy993658052) 提交
- 💄 优化 Sender，使自定义 Actions 的 `disabled` 属性受控。[#666](https://github.com/ant-design/x/pull/666) 由 [afc163](https://github.com/afc163) 提交
- 📖 优化官网站点提升用户体验。[#680](https://github.com/ant-design/x/pull/680) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交、[#699](https://github.com/ant-design/x/pull/699) 由 [afc163](https://github.com/afc163) 提交、[#716](https://github.com/ant-design/x/pull/716) 由 [afc163](https://github.com/afc163) 提交、[#686](https://github.com/ant-design/x/pull/686) 由 [afc163](https://github.com/afc163) 提交、[#728](https://github.com/ant-design/x/pull/728) 由 [kimteayon](https://github.com/kimteayon) 提交

## 1.1.0

`2025-03-28`

- Sender
  - 🆕 新增 `footer` 支持自定义底部内容。[#654](https://github.com/ant-design/x/pull/654) 由 [kimteayon](https://github.com/kimteayon) 提交
  - 🆕 扩展 `autoSize` 支持配置内容高度。[#637](https://github.com/ant-design/x/pull/637) 由 [Zhang-Wei-666](https://github.com/Zhang-Wei-666) 提交
  - 📖 补充 `onFocus` 和 `onBlur` 类型声明。[#625](https://github.com/ant-design/x/pull/625) 由 [aojunhao123](https://github.com/aojunhao123) 提交
- 🆕 扩展 Conversations 组件 `menu.trigger` 支持自定义菜单触发器。[#630](https://github.com/ant-design/x/pull/630) 由 [kimteayon](https://github.com/kimteayon) 提交
- Attachments
  - 🆕 扩展 `ImageProps` 支持自定义图像展示配置。[#613](https://github.com/ant-design/x/pull/613) 由 [hy993658052](https://github.com/hy993658052) 提交
  - 📖 补充 Attachments 组件 `onRemove` API 文档。[#608](https://github.com/ant-design/x/pull/608) 由 [kimteayon](https://github.com/kimteayon) 提交
- 📖 补充 `GPT-Vis` 渲染图表示例。[#603](https://github.com/ant-design/x/pull/603) 由 [lvisei](https://github.com/lvisei) 提交
- 📦 优化 Chat Design X `peerDependencies`。[#611](https://github.com/ant-design/x/pull/611) 由 [pokerface9830](https://github.com/pokerface9830) 提交
- 📖 优化官网站点提升用户体验。[#626](https://github.com/ant-design/x/pull/626) 由 [aojunhao123](https://github.com/aojunhao123) 提交、[#648](https://github.com/ant-design/x/pull/648) 由 [kimteayon](https://github.com/kimteayon) 提交、[#659](https://github.com/ant-design/x/pull/659) 由 [afc163](https://github.com/afc163) 提交、[#667](https://github.com/ant-design/x/pull/667) 由 [jin19980928](https://github.com/jin19980928) 提交

## 1.0.6

`2025-03-14`

- 🆕 扩展 `Sender` 文件粘贴可处理多个文件。[#505](https://github.com/ant-design/x/pull/500) 由 [ztkuaikuai](https://github.com/ztkuaikuai) 提交
- 🆕 扩展 `BubbleList` 角色定义功能。[#500](https://github.com/ant-design/x/pull/500) 由 [chenluda](https://github.com/chenluda) 提交
- 🐛 修复 `Attachments` 组件多文件横向滚动条展示。[#556](https://github.com/ant-design/x/pull/556) 由 [onefeng123](https://github.com/onefeng123) 提交
- 🐛 修复 `Attachments` 组件 onRemove 不生效问题。[#555](https://github.com/ant-design/x/pull/555) 由 [edison-tianhe](https://github.com/edison-tianhe) 提交
- 🐛 修复 `Sender` 组件 actions 缺少 SpeechButton 组件的问题。[#549](https://github.com/ant-design/x/pull/549) 由 [zombieJ](https://github.com/zombieJ) 提交
- 🐛 修复 `Attachments` 组件文件初始化展示问题。[#524](https://github.com/ant-design/x/pull/524) 由 [ztkuaikuai](https://github.com/ztkuaikuai) 提交
- 🐛 修复 `Conversations` 组件滚动条问题。[#485](https://github.com/ant-design/x/pull/485) 由 [LofiSu](https://github.com/LofiSu) 提交
- 📖 优化 `Bubble` 组件 typing 减少不必要的渲染。[#477](https://github.com/ant-design/x/pull/477) 由 [kxcy001123](https://github.com/kxcy001123) 提交
- 📦 优化 Chat Design X 构建 [#578](https://github.com/ant-design/x/pull/578)，[#584](https://github.com/ant-design/x/pull/584) 由 [kimteayon](https://github.com/kimteayon) 提交、 [#578](https://github.com/ant-design/x/pull/578) 由 [kimteayon](https://github.com/kimteayon) 提交、[#587](https://github.com/ant-design/x/pull/587) 由 [afc163](https://github.com/afc163) 提交
- 📖 优化官网站点提升用户体验。[#484](https://github.com/ant-design/x/pull/484) 由 [ztkuaikuai](https://github.com/ztkuaikuai) 提交、 [#495](https://github.com/ant-design/x/pull/495) 由 [ztkuaikuai](https://github.com/ztkuaikuai) 提交、 [#522](https://github.com/ant-design/x/pull/522) 由 [liangchaofei](https://github.com/liangchaofei) 提交、[#537](https://github.com/ant-design/x/pull/537) 由 [wzc520pyfm](https://github.com/wzc520pyfm) 提交、 [#553](https://github.com/ant-design/x/pull/553) 由 [PeachScript](https://github.com/PeachScript) 提交、 [#578](https://github.com/ant-design/x/pull/578) 由 [kimteayon](https://github.com/kimteayon) 提交 、 [#585](https://github.com/ant-design/x/pull/585) 由 [MaricoHan](https://github.com/MaricoHan) 提交

## 1.0.5

`2025-01-13`

- 🐛 修复 `Attachment` 组件移除图标的样式问题。[#460](https://github.com/ant-design/x/pull/460) 由 [Rain120](https://github.com/Rain120) 提交
- 🛠 重构 `BubbleProps`，支持 `ContentType` 类型参数。[#403](https://github.com/ant-design/x/pull/403) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🛠 开发环境和网站支持 React 19。[#432](https://github.com/ant-design/x/pull/432) 由 [YumoImer](https://github.com/YumoImer) 提交
- 📖 优化官网站点提升用户体验。[#456](https://github.com/ant-design/x/pull/456)， [#446](https://github.com/ant-design/x/pull/446)， [#448](https://github.com/ant-design/x/pull/448)， [#444](https://github.com/ant-design/x/pull/444)， [#414](https://github.com/ant-design/x/pull/414)， [#406](https://github.com/ant-design/x/pull/406)， [#404](https://github.com/ant-design/x/pull/404) 由 [wzc520pyfm](https://github.com/wzc520pyfm)， [YumoImer](https://github.com/YumoImer)， [Rain120](https://github.com/Rain120)， [afc163](https://github.com/afc163) 提交

## 1.0.4

`2024-12-25`

- 🆕 扩展 `XStream` 对取消功能的支持。[#319](https://github.com/ant-design/x/pull/319) 由 [ppbl](https://github.com/ppbl) 提交
- 🆕 扩展 `Bubble` 对 `typing.suffix` 打字后缀的支持。[#316](https://github.com/ant-design/x/pull/316) 由 [BQXBQX](https://github.com/BQXBQX) 提交
- 🆕 扩展 `Sender` 组件 `onChange` 对 `event` 事件参数的支持。[#362](https://github.com/ant-design/x/pull/362) 由 [defaultjacky](https://github.com/defaultjacky) 提交
- 🆕 扩展 `Sender` 组件 `ref` 对 `focus`、`blur` 等焦点控制能力的支持。[#397](https://github.com/ant-design/x/pull/397) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🐛 修复 `ThoughtChain` 在非 cssVar 下的样式问题。[#373](https://github.com/ant-design/x/pull/373) 由 [YumoImer](https://github.com/YumoImer) 提交
- 📖 添加 `Petercat` 助理功能。[#375](https://github.com/ant-design/x/pull/375) 由 [xingwanying](https://github.com/xingwanying) 提交
- 📖 优化官网站点提升用户体验。[#389](https://github.com/ant-design/x/pull/389)、[#377](https://github.com/ant-design/x/pull/377)、[#364](https://github.com/ant-design/x/pull/364)、[#368](https://github.com/ant-design/x/pull/368) 由 [afc163](https://github.com/afc163)、[YumoImer](https://github.com/YumoImer) 提交

## 1.0.3

`2024-12-16`

- 💄 优化 `Bubble` 设置 `placement: 'end'` 后的样式。[#314](https://github.com/ant-design/x/pull/314) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🐛 修复 `Bubble.List` 设置 `autoScroll` 后偶现无法触发自动滚动的问题。[#336](https://github.com/ant-design/x/pull/336) 由 [anzhou99Ru](https://github.com/anzhou99Ru) 提交
- 📖 优化官网站点提升用户体验。[#343](https://github.com/ant-design/x/pull/343)、[#334](https://github.com/ant-design/x/pull/334)、[#315](https://github.com/ant-design/x/pull/315)、[#331](https://github.com/ant-design/x/pull/331) 由 [afc163](https://github.com/afc163)、[YumoImer](https://github.com/YumoImer)、[Wxh16144](https://github.com/Wxh16144) 提交
- 🛠 修复 `pnpm lint` 时的错误。[#313](https://github.com/ant-design/x/pull/313) 由 [BQXBQX](https://github.com/BQXBQX) 提交

## 1.0.2

`2024-12-04`

- 🛠 优化 `XRequest` 支持对自定义协议解析。[#293](https://github.com/ant-design/x/pull/293) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🐛 修复 `Attachment` 前后预览按钮无法正常显隐的问题。[#295](https://github.com/ant-design/x/pull/295) 由 [anzhou99](https://github.com/anzhou99) 提交
- 🐛 修复 `useXChat` 对同一条消息重复触发 `onUpdate` 的问题。[#298](https://github.com/ant-design/x/pull/298) 由 [YumoImer](https://github.com/YumoImer) 提交
- 📖 添加 `Bubble` 配合 `GPT-Vis` 的使用演示文档。[#288](https://github.com/ant-design/x/pull/288) 由 [lvisei](https://github.com/lvisei) 提交
- 📦 更新浏览器目标配置减少打包体积。[#282](https://github.com/ant-design/x/pull/282) 由 [afc163](https://github.com/afc163) 提交
- 🛠 修复运行 `pnpm run prestart` 的错误。[#287](https://github.com/ant-design/x/pull/287) 由 [long36708](https://github.com/long36708) 提交

## 1.0.1

`2024-11-29`

- 🛠 优化 `useXAgent` 和 `XStream` 的 TS 类型。[#272](https://github.com/ant-design/x/pull/272) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🛠 调整 `agent` 参数设为可选，以支持仅使用 `useXChat` 的数据管理功能。[#271](https://github.com/ant-design/x/pull/271) 由 [YumoImer](https://github.com/YumoImer) 提交
- 💄 调整 `Conversations` 样式基于 RICH 设计规范。[#242](https://github.com/ant-design/x/pull/242) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🛠 修复使用 `pnpm` 启动项目时幽灵依赖导致无法启动的问题。[#223](https://github.com/ant-design/x/pull/223) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🌈 独立式样板间支持附件上传功能演示。[#250](https://github.com/ant-design/x/pull/250)、[#265](https://github.com/ant-design/x/pull/265) 由 [kelvinelove](https://github.com/kelvinelove) 提交
- 📖 修复缺失的贡献者信息。[#212](https://github.com/ant-design/x/pull/212) 由 [afc163](https://github.com/afc163) 提交
- 📖 优化官网站点提升用户体验。[#277](https://github.com/ant-design/x/pull/277)、[#264](https://github.com/ant-design/x/pull/264)、[#263](https://github.com/ant-design/x/pull/263)、[#262](https://github.com/ant-design/x/pull/262)、[#261](https://github.com/ant-design/x/pull/261)、[#241](https://github.com/ant-design/x/pull/241)、[#246](https://github.com/ant-design/x/pull/246)、[#210](https://github.com/ant-design/x/pull/210)、[#211](https://github.com/ant-design/x/pull/211) 由 [YumoImer](https://github.com/YumoImer)、[afc163](https://github.com/afc163)、[Rain-1214](https://github.com/Rain-1214)、[kelvinelove](https://github.com/kelvinelove)、[tabzzz1](https://github.com/tabzzz1) 提交
- 📦 更新浏览器目标减少打包体积。[#234](https://github.com/ant-design/x/pull/234) 由 [afc163](https://github.com/afc163) 提交

## 1.0.0

`2024-11-22`

🎉 我们非常开心的宣布 [Ant Design X](https://x.ant.design) 1.0.0 版本正式发布啦～

- 🌈 **源自企业级 AI 产品的最佳实践**：基于 RICH 交互范式，提供卓越的 AI 交互体验
- 🧩 **灵活多样的原子组件**：覆盖绝大部分 AI 对话场景，助力快速构建个性化 AI 交互页面
- ⚡ **开箱即用的模型对接能力**：轻松对接符合 OpenAI 标准的模型推理服务
- 🔄 **高效管理对话数据流**：提供好用的数据流管理功能，让开发更高效
- 📦 **丰富的样板间支持**：提供多种模板，快速启动 LUI 应用开发
- 🛡 **TypeScript 全覆盖**：采用 TypeScript 开发，提供完整类型支持，提升开发体验与可靠性
- 🎨 **深度主题定制能力**：支持细粒度的样式调整，满足各种场景的个性化需求

![demos](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UAEeSbJfuM8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## 1.0.0-alpha.12

`2024-11-07`

- 🔥 Sender 支持 `onPasteFile` 事件与 Attachments 支持 `ref.upload` 手动上传文件。[#184](https://github.com/ant-design/x/pull/184) 由 [zombieJ](https://github.com/zombieJ) 提交
- 🔥 Sender `allowSpeech` 支持受控使用三方语音 SDK。 [#187](https://github.com/ant-design/x/pull/187) 由 [zombieJ](https://github.com/zombieJ) 提交

## 1.0.0-alpha.11

`2024-11-06`

- 🔥 新组件 欢迎 - Welcome。 [#179](https://github.com/ant-design/x/pull/179) 由 [zombieJ](https://github.com/zombieJ) 提交
- 🔥 Prompts 支持嵌套层级展示。[#181](https://github.com/ant-design/x/pull/181)由 [zombieJ](https://github.com/zombieJ) 提交
- 🔥 Attachments 支持 Attachments.FileCard 子组件。[#182](https://github.com/ant-design/x/pull/182) 由 [zombieJ](https://github.com/zombieJ) 提交

## 1.0.0-alpha.10

`2024-11-04`

- 🐛 修复 Attachments 组件使用拖动上传时无法触发上传请求的问题。[#178](https://github.com/ant-design/x/pull/178) 由 [YumoImer](https://github.com/YumoImer) 提交

## 1.0.0-alpha.9

`2024-11-01`

- 🐛 修复 Attachments 组件内的代码逻辑问题。[#174](https://github.com/ant-design/x/pull/174) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🐛 修复 Sender.Header 内不可以聚焦的问题。[#175](https://github.com/ant-design/x/pull/175) 由[zombieJ](https://github.com/zombieJ) 提交

## 1.0.0-alpha.7

`2024-10-31`

- 🐛 修复 Attachments 组件第一次上传时无法触发上传请求的问题。 [#172](https://github.com/ant-design/x/pull/172) 由 [YumoImer](https://github.com/YumoImer) 提交

## 1.0.0-alpha.6

`2024-10-25`

- 🔥 新组件 附件 - `Attachments`。[#168](https://github.com/ant-design/x/pull/168) 由 [zombieJ](https://github.com/zombieJ) [#168](https://github.com/ant-design/x/pull/168) 提交
- 🔥 新工具 流 - `XStream`。[#138](https://github.com/ant-design/x/pull/138) 由 [YumoImer](https://github.com/YumoImer) 提交
- 🔥 新工具 请求 - `XRequest`。[#138](https://github.com/ant-design/x/pull/138) 由 [YumoImer](https://github.com/YumoImer) 提交

## 1.0.0-alpha.5

`2024-10-23`

- 🆕 Bubble 支持 `loadingRender` 以自定义加载状态。[#165](https://github.com/ant-design/x/pull/165)
- 🐛 修复不包裹 XProvider 时，组件样式丢失的问题。[#163](https://github.com/ant-design/x/pull/163)

## 1.0.0-alpha.4

`2024-10-17`

- Sender
  - 🆕 Sender 支持 `speech` 语音功能。[#154](https://github.com/ant-design/x/pull/154) 由 [zombieJ](https://github.com/zombieJ) 提交
  - 🆕 Sender 支持 `Sender.Header`。[#156](https://github.com/ant-design/x/pull/156) 由 [zombieJ](https://github.com/zombieJ) 提交
  - 🆕 Sender 样式调整。[#151](https://github.com/ant-design/x/pull/151) 由 [zombieJ](https://github.com/zombieJ) 提交
- 📖 更新文档页面下的组配置。[#155](https://github.com/ant-design/x/pull/155) 由 [YumoImer](https://github.com/YumoImer) 提交
- 📖 调整示例切换按钮样式。[#146](https://github.com/ant-design/x/pull/146) 由 [afc163](https://github.com/afc163) 提交
- 📖 更新 README.md。[#142](https://github.com/ant-design/x/pull/142) 由 [afc163](https://github.com/afc163) 提交

## 1.0.0-alpha.3

`2024-10-10`

- Bubble
  - 🆕 Bubble 新增 `variant` 变体支持，由 [zombieJ](https://github.com/zombieJ) 完成 [#140](https://github.com/ant-design/x/pull/140)
  - 🆕 Bubble 新增 `shape` 形状支持，由 [zombieJ](https://github.com/zombieJ) 完成 [#144](https://github.com/ant-design/x/pull/144)
  - 🆕 Bubble 新增 `header` 和 `footer` 支持自定义头部与底部内容并添加对应语义化 `className`，由 [zombieJ](https://github.com/zombieJ) 完成 [#147](https://github.com/ant-design/x/pull/147)

## 1.0.0-alpha.2

`2024-09-27`

- 🔥 新增 `XProvider` 全局化配置组件，由 [YumoImer](https://github.com/YumoImer) 完成 [#127](https://github.com/ant-design/x/pull/127)
- 🔥 新增 运行时钩子 `useXChat` 数据管理，由 [zombieJ](https://github.com/zombieJ) 完成 [#125](https://github.com/ant-design/x/pull/125)
- 🔥 新增 运行时钩子 `useXAgent` 模型调度，由 [zombieJ](https://github.com/zombieJ) 完成 [#125](https://github.com/ant-design/x/pull/125)
- 🆕 `ThoughtChain` 思维链组件支持 `size` 属性，由 [YumoImer](https://github.com/YumoImer) 完成 [#123](https://github.com/ant-design/x/pull/123)
- 🛠 更新 `.lintstagedrc.json`。 由 [afc163](https://github.com/afc163) 完成 [#128](https://github.com/ant-design/x/pull/128)
- 🛠 更新依赖 `cheerio` 至 `v1.0.0`。 由 [afc163](https://github.com/afc163) 完成 [#121](https://github.com/ant-design/x/pull/121)

## 1.0.0-alpha.1

`2024-09-10`

### 🚀 新特性

- 🔥 新增：`Suggestion` 建议组件，由 [ONLY-yours](https://github.com/ONLY-yours) 完成 [#87](https://github.com/ant-design/x/pull/87)

### 🐛 修复

- 🐛 修复：更改 `Sender` 的 `restProps` 类型，由 [ONLY-yours](https://github.com/ONLY-yours) 完成 [#101](https://github.com/ant-design/x/pull/101)
- 🛠 修复：`bun install` 问题，由 [afc163](https://github.com/afc163) 完成 [#111](https://github.com/ant-design/x/pull/111)

### 🛠 重构

- 🛠 重构：添加层级支持，由 [zombieJ](https://github.com/zombieJ) 完成 [#118](https://github.com/ant-design/x/pull/118)
- 🛠 重构：加速工作流，由 [afc163](https://github.com/afc163) 完成 [#119](https://github.com/ant-design/x/pull/119)
- 🛠 重构：升级开发依赖的 5 个更新，由 [dependabot](https://github.com/dependabot) 完成 [#120](https://github.com/ant-design/x/pull/120)
- 🛠 重构：清理 `README.md`，由 [afc163](https://github.com/afc163) 完成 [#102](https://github.com/ant-design/x/pull/102)
- 🛠 重构：添加 issue 模板，由 [afc163](https://github.com/afc163) 完成 [#103](https://github.com/ant-design/x/pull/103)
- 🛠 重构：添加 `bun.lockb`，由 [afc163](https://github.com/afc163) 完成 [#108](https://github.com/ant-design/x/pull/108)
- 🛠 删除 `index-style-only.js`，由 [afc163](https://github.com/afc163) 完成 [#106](https://github.com/ant-design/x/pull/106)
- 🛠 重构：更新 `main.yml`，由 [afc163](https://github.com/afc163) 完成 [#105](https://github.com/ant-design/x/pull/105)
- 🛠 重构：更新 `package.json`，由 [afc163](https://github.com/afc163) 完成 [#110](https://github.com/ant-design/x/pull/110)

### 📖 文档

- 📖 文档：更新 `README.md`，由 [afc163](https://github.com/afc163) 完成 [#104](https://github.com/ant-design/x/pull/104)
- 📖 文档：更新 `codecov` 徽章，由 [afc163](https://github.com/afc163) 完成 [#112](https://github.com/ant-design/x/pull/112)

## 1.0.0-alpha.0

`2024-09-05`

- 🔥 新组件 Bubble。 [#19](https://github.com/ant-design/x/pull/19) [li-jia-nan](https://github.com/li-jia-nan)
  - 🔥 Bubble 支持方向 [#52](https://github.com/ant-design/x/pull/52) [li-jia-nan](https://github.com/li-jia-nan)
- 🔥 新组件 Bubble.List。 [#57](https://github.com/ant-design/x/pull/57) [zombieJ](https://github.com/zombieJ)
- 🔥 新组件 Conversations。 [#48](https://github.com/ant-design/x/pull/48) [YumoImer](https://github.com/YumoImer)
- 🔥 新组件 Prompts。 [#55](https://github.com/ant-design/x/pull/55) [YumoImer](https://github.com/YumoImer)
- 🔥 新组件 Sender。 [#46](https://github.com/ant-design/x/pull/46) [ONLY-yours](https://github.com/ONLY-yours)
- 🔥 新组件 ThoughtChain。 [#86](https://github.com/ant-design/x/pull/86) [YumoImer](https://github.com/YumoImer)
- 📦 使用 `father` 构建。 [#84](https://github.com/ant-design/x/pull/84) [zombieJ](https://github.com/zombieJ)
- 🛠 修复使用 `antd` 的 es 或 lib 包时 ThemeContext 实例不一致的问题。 [#88](https://github.com/ant-design/x/pull/88) [YumoImer](https://github.com/YumoImer)
- 🛠 重构：API 命名规范 [#73](https://github.com/ant-design/x/pull/73) [zombieJ](https://github.com/zombieJ)
- 🛠 杂项：CI、Github Actions、发布
  - 🛠 [#59](https://github.com/ant-design/x/pull/59) [zombieJ](https://github.com/zombieJ)
  - 🛠 [#62](https://github.com/ant-design/x/pull/62) [zombieJ](https://github.com/zombieJ)
  - 🛠 [#71](https://github.com/ant-design/x/pull/71) [ONLY-yours](https://github.com/ONLY-yours)
  - 🛠 [#72](https://github.com/ant-design/x/pull/72) [YumoImer](https://github.com/YumoImer)
  - 🛠 [#98](https://github.com/ant-design/x/pull/98) [YumoImer](https://github.com/YumoImer)
- 📖 更新 README.md
  - 📖 [#81](https://github.com/ant-design/x/pull/81) [zombieJ](https://github.com/zombieJ)
  - 📖 [#82](https://github.com/ant-design/x/pull/82) [zombieJ](https://github.com/zombieJ)
  - 📖 [#61](https://github.com/ant-design/x/pull/61) [afc163](https://github.com/afc163)

## 0.0.0-alpha.0

`2024-05-10`

- MISC: 项目初始化。
