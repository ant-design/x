---
title: Themes
order: 3
---

Themes let you keep Markdown typography, colors, and spacing consistent. Built-in options are light and dark; you can also customize via CSS variables or overrides.

## Quick Usage

Import the theme stylesheet and set the theme class on the root:

```tsx
import { XMarkdown } from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/light.css';

export default () => <XMarkdown className="x-markdown-light" content="# Hello" />;
```

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/themes/switch.tsx">Theme Switch</code>
<code src="./demo/themes/custom.tsx">Custom Theme</code>

## Custom Theme (Minimal Steps)

1. Start from a built-in class (`x-markdown-light` is recommended) and add your own class.
2. Override only the CSS variables you need in that custom class.
3. Keep untouched variables inherited from the built-in theme.

```css
.x-markdown-light.x-markdown-custom {
  --primary-color: #0f766e;
  --primary-color-hover: #0d9488;
  --heading-color: #0f172a;
  --text-color: #1f2937;
  --light-bg: rgba(15, 118, 110, 0.08);
}
```

See full variable names in `packages/x-markdown/src/themes/light.css` and `packages/x-markdown/src/themes/dark.css`.
