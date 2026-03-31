---
name: x-markdown
version: 2.5.0
description: 当任务涉及 @ant-design/x-markdown 的 Markdown 渲染、流式输出、自定义组件映射、插件、主题或聊天富内容展示时使用。
---

# 🎯 技能定位

**本技能专注解决一个问题**：如何用 `@ant-design/x-markdown` 正确、稳定地渲染 Markdown 内容。

覆盖范围包括：

- 基础渲染与包职责边界
- LLM 流式输出与不完整语法处理
- 自定义组件映射与聊天富内容渲染
- 插件、主题与安全默认配置

## 目录导航

- [📦 包职责边界](#-包职责边界)
- [🚀 快速决策指南](#-快速决策指南)
- [🛠 推荐工作流](#-推荐工作流)
- [🚨 开发规则](#-开发规则)
- [🤝 技能协作](#-技能协作)
- [🔗 参考资源](#-参考资源)

# 📦 包职责边界

| 层级       | 包名                     | 职责                                            |
| ---------- | ------------------------ | ----------------------------------------------- |
| **UI层**   | `@ant-design/x`          | 聊天 UI、Bubble、Sender、交互组件               |
| **数据层** | `@ant-design/x-sdk`      | Provider、请求、流式数据流、状态管理            |
| **渲染层** | `@ant-design/x-markdown` | Markdown 解析、流式渲染、插件、主题、自定义渲染 |

> ⚠️ `x-markdown` 不是聊天状态管理工具。它负责把已有消息内容渲染出来，不负责请求和消息流本身。

# 🚀 快速决策指南

| 当你需要... | 优先阅读 | 典型结果 |
| --- | --- | --- |
| 用最小配置渲染 Markdown | [CORE.md](reference/CORE.md) | 用 `XMarkdown` 渲染基础内容 |
| 渲染 LLM 流式输出 | [STREAMING.md](reference/STREAMING.md) | 正确处理 `hasNextChunk`、占位符、尾部指示器 |
| 把标签映射到业务组件 | [EXTENSIONS.md](reference/EXTENSIONS.md) | 为自定义标签、代码块、富内容组件建立稳定映射 |
| 增加插件或主题定制 | [EXTENSIONS.md](reference/EXTENSIONS.md) | 完成插件导入、主题类名接入、最小 CSS 覆盖 |
| 查看属性细节和默认值 | [API.md](reference/API.md) | 获取 `XMarkdown` 与 streaming 的完整属性表 |

# 🛠 推荐工作流

1. 先看 [CORE.md](reference/CORE.md)，先让基础渲染跑通。
2. 只有在内容是分块到达时，才继续看 [STREAMING.md](reference/STREAMING.md)。
3. 只有在需要自定义标签、插件、主题时，才继续看 [EXTENSIONS.md](reference/EXTENSIONS.md)。
4. 属性名与默认值以 [API.md](reference/API.md) 为准，不要凭记忆猜。

## 最小使用示例

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

export default () => <XMarkdown content="# Hello" />;
```

# 🚨 开发规则

- `components` 映射尽量保持稳定，不要在每次渲染时创建新的内联组件对象。
- 最后一块内容必须设置 `streaming.hasNextChunk = false`，否则不完整占位内容不会被刷新成最终结果。
- 谨慎处理原始 HTML。如果只想保留文本展示，优先使用 `escapeRawHtml`。
- 如果必须渲染 HTML，请显式审查 `dompurifyConfig`，不要依赖模糊默认行为。
- 主题覆盖尽量最小化。先继承 `x-markdown-light` 或 `x-markdown-dark`，只改必要变量。
- 如果自定义组件依赖完整语法，再在 `streamStatus === 'done'` 时执行昂贵逻辑。

# 🤝 技能协作

| 场景 | 推荐技能组合 | 原因 |
| --- | --- | --- |
| 聊天中的富文本回答 | `x-chat-provider` → `x-request` → `use-x-chat` → `x-markdown` | 前三者负责数据流，`x-markdown` 负责最终内容渲染 |
| 内置 Provider + Markdown 回复 | `x-request` → `use-x-chat` → `x-markdown` | 请求配置与渲染职责分离 |
| 独立的 Markdown 页面或文档视图 | `x-markdown` | 不需要聊天状态管理 |

## 边界规则

- 适配接口格式，用 **`x-chat-provider`**
- 配置传输、认证、重试、流分隔，用 **`x-request`**
- 管理 React 聊天状态，用 **`use-x-chat`**
- 处理 Markdown 解析、流式恢复和富组件渲染，用 **`x-markdown`**

# 🔗 参考资源

- [CORE.md](reference/CORE.md) - 包职责、安装与起步、安全默认值、常见渲染模式
- [STREAMING.md](reference/STREAMING.md) - 分块渲染、不完整语法恢复、loading/done 行为
- [EXTENSIONS.md](reference/EXTENSIONS.md) - 组件映射、插件、主题、自定义标签建议
- [API.md](reference/API.md) - 从官方 `x-markdown` 文档生成的 API 参考

## 官方文档

- [XMarkdown 介绍](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/introduce.zh-CN.md)
- [XMarkdown 示例](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/examples.zh-CN.md)
- [XMarkdown 流式渲染](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/streaming.zh-CN.md)
- [XMarkdown Components](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/components.zh-CN.md)
- [XMarkdown 插件](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/plugins.zh-CN.md)
- [XMarkdown 主题](https://github.com/ant-design/x/blob/main/packages/x/docs/x-markdown/themes.zh-CN.md)
