# Extensions Guide

## Components

`components` is the main extension point. Use it to map Markdown or custom HTML tags to React components.

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

### Rules for component mappings

- Keep the mapping object stable across renders.
- Use `streamStatus` to separate temporary loading UI from final rendering.
- If a custom component contains block children, consider `paragraphTag` to avoid invalid nested markup.
- Keep custom tags semantically clear and avoid ambiguous mixed Markdown/HTML blocks.

## Plugins

Built-in plugins are imported from `@ant-design/x-markdown/plugins/...` and wired through `config`.

```tsx
import Latex from '@ant-design/x-markdown/plugins/Latex';

<XMarkdown
  content={content}
  config={{
    extensions: Latex(),
  }}
/>;
```

Use a plugin when the syntax extension belongs in parsing, not when it is only a visual replacement of a rendered node.

## Themes

Start from a built-in theme stylesheet.

```tsx
import '@ant-design/x-markdown/themes/light.css';

<XMarkdown className="x-markdown-light" content={content} />;
```

For customization:

1. Keep the built-in theme class.
2. Add one custom class.
3. Override only the CSS variables you actually need.

## Custom Tag Guidance

- Keep custom tag blocks well formed.
- Avoid stray blank lines inside custom HTML blocks unless the syntax is intentional.
- If newlines inside custom tags matter, review `protectCustomTagNewlines`.

## Pick the Right Tool

- Use `components` for replacing rendered nodes with React components.
- Use plugins for parsing new syntax.
- Use themes for typography, spacing, and color.
- Use `dompurifyConfig` and `escapeRawHtml` for safety, not for visual customization.
