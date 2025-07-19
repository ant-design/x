---
title: Themes
order: 3
---

## How to Import Themes

### Import from `@ant-design/x-markdown/themes/theme-name.css`

```tsx
import { XMarkdown } from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/light.css';

return <XMarkdown className="x-markdown-light" content="" />;
```

### Browser Import

Use script and link tags to directly import files in browser, and inject `className` to the component.

```html
<script src="**/dist/themes/light.css"></script>
```

## Demos

<!-- prettier-ignore -->
<code src="./demo/themes/light.tsx">light</code>
<code src="./demo/themes/dark.tsx">dark</code>

## Contributing Themes
