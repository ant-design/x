# 扩展指南

## Components

`components` 是主要扩展入口，可把 Markdown 或自定义 HTML 标签映射到 React 组件。

```tsx
import { Mermaid, Sources, Think } from '@ant-design/x';
import { XMarkdown } from '@ant-design/x-markdown';

<XMarkdown
  content={content}
  components={{
    mermaid: Mermaid,
    think: Think,
    sources: Sources,
  }}
/>;
```

### 组件映射规则

- 映射对象尽量保持稳定，避免每次渲染创建新对象。
- 用 `streamStatus` 区分临时 loading UI 和最终渲染结果。
- 如果自定义组件内部包含块级元素，必要时用 `paragraphTag` 避免非法嵌套。
- 自定义标签应语义明确，避免混乱的 Markdown/HTML 混写。

## 插件

内置插件从 `@ant-design/x-markdown/plugins/...` 导入，并通过 `config` 接入。

```tsx
import Latex from '@ant-design/x-markdown/plugins/Latex';

<XMarkdown
  content={content}
  config={{
    extensions: Latex(),
  }}
/>;
```

当需求属于“新增解析语法”时用插件；仅仅是替换已渲染节点的视觉表现时，用 `components` 更合适。

## 主题

先从内置主题样式开始。

```tsx
import '@ant-design/x-markdown/themes/light.css';

<XMarkdown className="x-markdown-light" content={content} />;
```

如果要定制：

1. 保留内置主题类名
2. 额外加一个自定义类名
3. 只覆盖真正需要的 CSS 变量

## 自定义标签建议

- 保持自定义标签结构完整
- 除非语法有意为之，否则避免在自定义 HTML 块内部插入多余空行
- 如果自定义标签内换行需要保留，检查 `protectCustomTagNewlines`

## 如何选工具

- 用 `components` 替换渲染后的节点
- 用插件扩展 Markdown 解析能力
- 用主题控制排版、间距和颜色
- 用 `dompurifyConfig` 与 `escapeRawHtml` 处理安全，不要拿它们做视觉定制
