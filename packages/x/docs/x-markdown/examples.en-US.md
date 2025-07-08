---
title: Code Examples
order: 2
---

## When To Use

Used for rendering streaming Markdown format returned by LLM.

## Code Demos

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx">Basic Usage</code>
<code src="./demo/codeDemo/streaming.tsx">Streaming Rendering</code>
<code src="./demo/codeDemo/components.tsx">Custom Component Rendering</code>
<code src="./demo/codeDemo/supersets.tsx">Extension Plugins</code>
<code src="./demo/codeDemo/plugin.tsx">Custom Extension Plugin</code>
<code src="./demo/codeDemo/xss.tsx">XSS Protection</code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| content | Markdown content | `string` | - |
| children | Markdown content, same as content | `string` | - |
| components | Custom components | `Record<string, React.ReactNode>` | - |
| streaming | Streaming rendering configuration | `SteamingOption` | - |
| config | Marked.js extension | [`MarkedExtension`](https://marked.js.org/using_advanced#options) | `{ gfm: true }` |
| className | Custom className | `string` | - |
| rootClassName | Root node custom className, same as className | `string` | - |
| style | Custom style | `CSSProperties` | - |

### SteamingOption

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| hasNextChunk | Whether there is next chunk, if false, clear all cache and render | `boolean` | `false` |
