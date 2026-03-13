| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content to render | `string` | - |
| children | Markdown content (use either `content` or `children`) | `string` | - |
| components | Map HTML nodes to custom React components | `Record<string, React.ComponentType<ComponentProps> \| keyof JSX.IntrinsicElements>` | - |
| streaming | Streaming behavior config | `StreamingOption` | - |
| config | Marked parse config, applied last and may override built-in renderers | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| rootClassName | Extra CSS class for the root element | `string` | - |
| className | Extra CSS class for the root container | `string` | - |
| paragraphTag | HTML tag for paragraphs (avoids validation issues when custom components contain block elements) | `keyof JSX.IntrinsicElements` | `'p'` |
| style | Inline styles for the root container | `CSSProperties` | - |
| prefixCls | CSS class name prefix for component nodes | `string` | - |
| openLinksInNewTab | Add `target="_blank"` to all links so they open in a new tab | `boolean` | `false` |
| dompurifyConfig | DOMPurify config for HTML sanitization and XSS protection | [`DOMPurify.Config`](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) | - |
| protectCustomTagNewlines | Whether to preserve newlines inside custom tags | `boolean` | `false` |
| escapeRawHtml | Escape raw HTML in Markdown as plain text (do not parse as real HTML), to prevent XSS while keeping content visible | `boolean` | `false` |
| debug | Enable debug mode (performance overlay) | `boolean` | `false` |

### StreamingOption

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether more chunks are expected. Set `false` to flush cache and finish rendering | `boolean` | `false` |
| enableAnimation | Whether to enable fade-in animation for block elements | `boolean` | `false` |
| animationConfig | Animation options (for example fade duration and easing) | `AnimationConfig` | - |
| tail | Enable tail indicator | `boolean \| TailConfig` | `false` |
| incompleteMarkdownComponentMap | Map incomplete Markdown fragments to custom loading components | `Partial<Record<'link' \| 'image' \| 'html' \| 'emphasis' \| 'list' \| 'table' \| 'inline-code', string>>` | `{ link: 'incomplete-link', image: 'incomplete-image' }` |

### TailConfig

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Content to display as tail | `string` | `'▋'` |
| component | Custom tail component, takes precedence over content | `React.ComponentType<{ content?: string }>` | - |

### AnimationConfig

| Property     | Description         | Type     | Default         |
| ------------ | ------------------- | -------- | --------------- |
| fadeDuration | Duration in ms      | `number` | `200`           |
| easing       | CSS easing function | `string` | `'ease-in-out'` |

## Related Docs

- [Component Extension](EXTENSIONS.md)
- [Streaming](STREAMING.md)
