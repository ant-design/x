# 核心指南

## 包职责边界

| 需求                          | 对应包                   |
| ----------------------------- | ------------------------ |
| 把消息内容渲染成 Markdown     | `@ant-design/x-markdown` |
| 构建聊天 UI 容器              | `@ant-design/x`          |
| 管理 Provider、请求与消息状态 | `@ant-design/x-sdk`      |

## 安装与最小渲染

```bash
npm install @ant-design/x-markdown
```

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const content = `
# Hello

- item 1
- item 2
`;

export default () => <XMarkdown content={content} />;
```

## 安全默认值

- `content` 和 `children` 二选一即可，不要同时传。
- 先让纯 Markdown 渲染正确，再加插件或自定义组件。
- 当模型输出可能包含外链时，优先开启 `openLinksInNewTab`。
- 如果原始 HTML 只需要保留文本展示，优先使用 `escapeRawHtml`。
- 如果必须渲染真实 HTML，请显式检查 `dompurifyConfig`。

## 常见集成模式

### 基础内容块

```tsx
<XMarkdown content={message} className="x-markdown-light" />
```

### 聊天消息渲染

在 `useXChat` 产出消息列表之后，再用 `XMarkdown` 负责内容展示。

```tsx
<XMarkdown content={message.message.content} openLinksInNewTab escapeRawHtml />
```

### 最小检查清单

- 先确认内容本身真的是 Markdown，而不是结构化组件协议。
- 不要把渲染逻辑塞进 Provider。
- 不要把请求逻辑塞进 `XMarkdown`。
- 主题和自定义组件放在基础渲染稳定之后再加。

## 何时继续阅读其他参考

- 内容是流式分块到达时，阅读 [STREAMING.md](STREAMING.md)
- 需要自定义标签、代码块、插件、主题时，阅读 [EXTENSIONS.md](EXTENSIONS.md)
- 需要完整属性表时，阅读 `API.md`
