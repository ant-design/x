---
title: Code Demo
order: 2
---

## When To Use

Used to render the streaming Markdown format returned by LLM.

## Code Demo

<!-- prettier-ignore -->
<code src="./demo/codeDemo/basic.tsx">Basic</code>
<code src="./demo/codeDemo/streaming.tsx">Streaming</code>
<code src="./demo/codeDemo/components.tsx">Components</code>
<code src="./demo/codeDemo/supersets.tsx">Plugins</code>
<code src="./demo/codeDemo/plugin.tsx">Custom Plugin</code>

## API

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| content | Markdown content to render | `string` | - | - |
| children | Alternative way to provide markdown content (will override content if both provided) | `string` | - | - |
| options | Configuration options for markdown parsing | `Options` | `{ gfm: true }` | - |
| walkTokens | A function which is called for every token. | `function` | `null` | - |
| components | Custom React components to override default markdown rendering | `Record<string, React.ReactNode>` | - | - |
| streaming | Options for streaming markdown content | `SteamingOption` | - | - |
| plugins | Marked.js extension plugins | `MarkedExtension[]` | - | - |
| className | Additional CSS class for the container | `string` | - | - |
| style | Inline styles for the container | `CSSProperties` | - | - |

### Options

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| break | Enable GFM line breaks (requires gfm: true) | `boolean` | - |  |
| gfm | Enable [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) | `boolean` | `true` |  |

### SteamingOption

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| hasNextChunk | Is there a next chunk, If false, clear all caches and render | `boolean` | `false` |  |
