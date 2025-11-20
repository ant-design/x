---
title: 主题
order: 3
---

## 如何引入主题

### 可从 `@ant-design/x-markdown/themes/主题名.css` 引入主题。

```tsx
import XMarkdown from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/light.css';

return <XMarkdown className="x-markdown-light" content="Hello XMarkdown!" />;
```

### 从浏览器引入

在浏览器中使用 script 和 link 标签直接引入文件，并注入`类名`到组件 。

```html
<script src="**/dist/themes/light.css"></script>
```

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/themes/light.tsx">使用 `light` 主题</code>
<code src="./demo/themes/dark.tsx">使用 `dark` 主题</code>
<code src="./demo/themes/custom.tsx">自定义主题</code>

## 贡献主题

我们欢迎社区贡献新的主题！请按照以下规范进行主题开发：

### 主题命名规范

主题文件应遵循以下命名规则：

- 文件名：`主题名.css`
- 类名前缀：`x-markdown-主题名`
- 示例：`x-markdown-ocean.css` 对应类名 `x-markdown-ocean`

### 主题开发规范

#### 1. 文件结构

将你的主题文件放置在 `packages/x-markdown/src/themes/` 目录下：

```
packages/x-markdown/src/themes/
├── light.css          # 默认亮色主题
├── dark.css           # 默认暗色主题
├── ocean.css          # 自定义主题示例
└── 你的主题名.css      # 你的主题文件
```

#### 2. 样式命名规则

主题样式必须遵循以下命名规范：

```css
/* 基础容器 */
.x-markdown-主题名 {
  /* 基础样式变量 */
  --font-size: 14px;
  --primary-color: #1677ff;
  --primary-color-hover: #4096ff;
  --heading-color: #000000;
  --text-color: rgba(0, 0, 0, 0.85);
  --border-color: rgba(240, 240, 240, 1);
  --line-color: rgba(5, 5, 5, 0.06);
  --light-bg: rgba(0, 0, 0, 0.04);
  --table-head-bg: rgba(250, 250, 250, 1);
  --table-body-bg: rgba(255, 255, 255, 1);
  --cite-bg: rgba(0, 0, 0, 0.1);
  --cite-hover-bg: rgba(0, 0, 0, 0.2);
  --border-radius-middle: 6px;
  --border-radius-small: 4px;
  --td-th-padding: 10px 12px;
  --border-font-weight: 600;
  --margin-block: 0 0 16px 0;
  --padding-ul-ol: 0 0 0 16px;
  --margin-ul-ol: 0 0 16px 28px;
  --margin-li: 0 0 14px 0;
  --hr-margin: 24px 0;
  --table-margin: 0 0 24px 0;
  --margin-pre: 0 0 16px 0;
  --padding-code: 16px;
}

/* 代码块高亮 */
.x-markdown-主题名 .x-markdown-highlight-code {
  background: var(--x-markdown-color-code-bg);
  border: 1px solid var(--x-markdown-color-border);
}

/* 表格样式 */
.x-markdown-主题名 .x-markdown-table {
  border-color: var(--x-markdown-color-border);
}

/* 引用样式 */
.x-markdown-主题名 .x-markdown-blockquote {
  border-left-color: var(--x-markdown-color-link);
}
```

#### 3. 开发步骤

1. **创建主题文件**：

   ```bash
   touch packages/x-markdown/src/themes/你的主题名.css
   ```

2. **定义基础变量**：使用 CSS 变量定义颜色、间距等基础样式。

3. **实现组件样式**：为各个 Markdown 元素实现样式：
   - 标题 (h1-h6)
   - 代码块
   - 表格
   - 列表
   - 引用
   - 链接
   - 图片

4. **测试主题**：在 demo 中测试你的主题：

   ```tsx
   import '@ant-design/x-markdown/themes/你的主题名.css';

   <XMarkdown className="x-markdown-你的主题名" content="# 测试内容" />;
   ```

#### 4. 提交规范

在提交你的主题前，请确保：

1. **代码规范**：
   - 遵循项目代码规范
   - 通过 `npm run lint` 检查
   - 通过 `npm run test` 测试

2. **文档完善**：
   - 在 `themes.zh-CN.md` 中添加你的主题说明
   - 提供主题预览截图
   - 创建对应的 demo 文件

3. **Pull Request**：
   - 基于 `master` 分支创建新分支
   - 提交清晰的 commit 信息
   - 在 PR 描述中说明主题特点和使用场景

### 主题示例

以下是一个完整的主题示例：

```css
/* x-markdown-ocean.css */
.x-markdown-ocean {
  /* 海洋主题配色 */
  --x-markdown-color-text: #2c3e50;
  --x-markdown-color-bg: #f8fafc;
  --x-markdown-color-border: #e2e8f0;
  --x-markdown-color-primary: #0ea5e9;
  --x-markdown-color-secondary: #64748b;

  /* 代码块 */
  --x-markdown-color-code-bg: #f1f5f9;
  --x-markdown-color-code-border: #cbd5e1;

  /* 标题 */
  --x-markdown-color-h1: #0f172a;
  --x-markdown-color-h2: #1e293b;
  --x-markdown-color-h3: #334155;
}

.x-markdown-ocean h1 {
  color: var(--x-markdown-color-h1);
  border-bottom: 2px solid var(--x-markdown-color-primary);
}

.x-markdown-ocean pre {
  background: var(--x-markdown-color-code-bg);
  border: 1px solid var(--x-markdown-color-code-border);
  border-radius: 6px;
}
```

### 社区主题

我们欢迎社区贡献各种风格的主题，如：

- 科技风格主题
- 极简主义主题
- 复古风格主题
- 暗色主题变种
- 企业品牌主题

请将你的主题提交到 [GitHub Issues](https://github.com/ant-design/x/issues) 或发送 Pull Request！
