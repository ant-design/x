---
title: CodeHighlighter
group: Components
order: 1
---

# CodeHighlighter

Used to display code blocks with syntax highlighting.

## When To Use

- When you need to display code snippets with syntax highlighting
- When you want to provide copy functionality for code blocks
- When you need to show code language information in the header

## Examples

### Basic Usage

<code src="./demo/basic.tsx"></code>

### Custom Header

<code src="./demo/custom-header.tsx"></code>

### No Header

<code src="./demo/no-header.tsx"></code>

### Multiple Languages

<code src="./demo/multiple-languages.tsx"></code>

## API

### CodeHighlighter

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| lang | Code language type | string | - |
| children | Code content | string | - |
| header | Header content, no header displayed when null | ReactNode \| null | - |
| prefixCls | Prefix for style classnames | string | - |
| style | Root node style | CSSProperties | - |
| highlightProps | Additional props for syntax highlighter | Partial<SyntaxHighlighterProps> | - |
| classNames | Semantic structure class names | Partial<Record<SemanticType, string>> | - |
| styles | Semantic structure styles | Partial<Record<SemanticType, CSSProperties>> | - |

### SemanticType

```typescript
type SemanticType = 'root' | 'header' | 'headerTitle' | 'code';
```

## Design Token

<ComponentTokenTable component="CodeHighlighter"></ComponentTokenTable>

## Semantic DOM

```html
<div class="ant-codeHighlighter">
  <div class="ant-codeHighlighter-header">
    <span class="ant-codeHighlighter-header-title">javascript</span>
    <!-- Copy button -->
  </div>
  <div class="ant-codeHighlighter-code">
    <pre>
      <code>
        <!-- Syntax highlighted code -->
      </code>
    </pre>
  </div>
</div>
```
