---
title: Themes
order: 3
---

## How to Import Themes

### Import themes from `@ant-design/x-markdown/themes/theme-name.css`.

```tsx
import XMarkdown from '@ant-design/x-markdown';
import '@ant-design/x-markdown/themes/light.css';

return <XMarkdown className="x-markdown-light" content="Hello XMarkdown!" />;
```

### Import from Browser

Use script and link tags to directly import files in the browser, and inject the `className` into the component.

```html
<script src="**/dist/themes/light.css"></script>
```

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/themes/light.tsx">Using `light` theme</code>
<code src="./demo/themes/dark.tsx">Using `dark` theme</code>
<code src="./demo/themes/custom.tsx">Custom theme</code>

## Contributing Themes

We welcome community contributions for new themes! Please follow these specifications for theme development:

### Theme Naming Conventions

Theme files should follow these naming rules:

- File name: `theme-name.css`
- Class name prefix: `x-markdown-theme-name`
- Example: `x-markdown-ocean.css` corresponds to class name `x-markdown-ocean`

### Theme Development Specifications

#### 1. File Structure

Place your theme files in the `packages/x-markdown/src/themes/` directory:

```
packages/x-markdown/src/themes/
├── light.css          # Default light theme
├── dark.css           # Default dark theme
├── ocean.css          # Custom theme example
└── your-theme-name.css # Your theme file
```

#### 2. Style Naming Rules

Theme styles must follow these naming conventions:

```css
/* Base container */
.x-markdown-theme-name {
  /* Base style variables */
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
}

/* Code block highlighting */
.x-markdown-theme-name .x-markdown-highlight-code {
  background: var(--x-markdown-color-code-bg);
  border: 1px solid var(--x-markdown-color-border);
}

/* Table styles */
.x-markdown-theme-name .x-markdown-table {
  border-color: var(--x-markdown-color-border);
}

/* Blockquote styles */
.x-markdown-theme-name .x-markdown-blockquote {
  border-left-color: var(--x-markdown-color-link);
}
```

#### 3. Development Steps

1. **Create Theme File**:

   ```bash
   touch packages/x-markdown/src/themes/your-theme-name.css
   ```

2. **Define Base Variables**: Use CSS variables to define colors, spacing, and other base styles.

3. **Implement Component Styles**: Implement styles for various Markdown elements:
   - Headings (h1-h6)
   - Code blocks
   - Tables
   - Lists
   - Blockquotes
   - Links
   - Images

4. **Test Theme**: Test your theme in the demo:

   ```tsx
   import '@ant-design/x-markdown/themes/your-theme-name.css';

   <XMarkdown className="x-markdown-your-theme-name" content="# Test Content" />;
   ```

#### 4. Submission Guidelines

Before submitting your theme, please ensure:

1. **Code Standards**:
   - Follow project code standards
   - Pass `npm run lint` checks
   - Pass `npm run test` tests

2. **Documentation**:
   - Add your theme description in `themes.en-US.md`
   - Provide theme preview screenshots
   - Create corresponding demo files

3. **Pull Request**:
   - Create new branch based on `master`
   - Submit clear commit messages
   - Explain theme features and use cases in PR description

### Theme Example

Here is a complete theme example:

```css
/* x-markdown-ocean.css */
.x-markdown-ocean {
  /* Ocean theme color scheme */
  --x-markdown-color-text: #2c3e50;
  --x-markdown-color-bg: #f8fafc;
  --x-markdown-color-border: #e2e8f0;
  --x-markdown-color-primary: #0ea5e9;
  --x-markdown-color-secondary: #64748b;

  /* Code blocks */
  --x-markdown-color-code-bg: #f1f5f9;
  --x-markdown-color-code-border: #cbd5e1;

  /* Headings */
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

### Community Themes

We welcome community contributions for various theme styles, such as:

- Tech-style themes
- Minimalist themes
- Retro-style themes
- Dark theme variants
- Corporate brand themes

Please submit your themes to [GitHub Issues](https://github.com/ant-design/x/issues) or send a Pull Request!
