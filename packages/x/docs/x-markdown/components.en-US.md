---
group:
  title: Components
  order: 5
title: Overview
order: 1
---

The `components` property allows you to replace standard HTML tags with custom React components.

## Basic Usage

```tsx
import React from 'react';
import { XMarkdown } from '@ant-design/x-markdown';

const CustomHeading = ({ children, ...props }) => (
  <h1 style={{ color: '#1890ff' }} {...props}>
    {children}
  </h1>
);

const App = () => <XMarkdown content="# Hello World" components={{ h1: CustomHeading }} />;
```

## Performance Optimization

### 1. Avoid Inline Component Definitions

```tsx
// ❌ Bad: Creates new component on every render
<XMarkdown components={{ h1: (props) => <h1 {...props} /> }} />;

// ✅ Good: Use predefined component
const Heading = (props) => <h1 {...props} />;
<XMarkdown components={{ h1: Heading }} />;
```

### 2. Use React.memo

```tsx
const StaticContent = React.memo(({ children }) => <div className="static">{children}</div>);
```

## Streaming Rendering Handling

XMarkdown will pass the `streamStatus` prop to components by default, indicating whether the component is closed, which is useful for handling streaming rendering.

### Status Determination

```tsx
const StreamingComponent = ({ streamStatus, children }) => {
  if (streamStatus === 'loading') {
    return <div className="loading">Loading...</div>;
  }
  return <div>{children}</div>;
};
```

## Data Fetching Example

Components support two data fetching methods: directly parsing data from Markdown, or initiating network requests independently.

### Data Fetching

```tsx
const UserCard = ({ domNode, streamStatus }) => {
  const [user, setUser] = useState(null);
  const username = domNode.attribs?.['data-username'];

  useEffect(() => {
    if (username && streamStatus === 'done') {
      fetch(`/api/users/${username}`)
        .then((r) => r.json())
        .then(setUser);
    }
  }, [username, streamStatus]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
};
```

## Supported Tag Mapping

### Standard HTML Tags

| Tag        | Component Name |
| ---------- | -------------- |
| `a`        | `a`            |
| `h1-h6`    | `h1-h6`        |
| `p`        | `p`            |
| `img`      | `img`          |
| `table`    | `table`        |
| `ul/ol/li` | `ul/ol/li`     |
| `code/pre` | `code/pre`     |

### Custom Tags

```tsx
// Support any custom tags
<XMarkdown
  components={{
    'my-component': MyComponent,
    'user-card': UserCard,
  }}
/>
```

## ComponentProps

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| domNode | Component DOM node from html-react-parser, containing parsed DOM node information | [`DOMNode`](https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace) | - |
| streamStatus | Streaming rendering supports two states: `loading` indicates content is being loaded, `done` indicates loading is complete. Currently only supports HTML format and fenced code blocks. Since indented code has no clear end marker, it always returns `done` status | `'loading' \| 'done'` | - |
| children | Content wrapped in the component, containing the text content of DOM nodes | `React.ReactNode` | - |
| rest | Component properties, supports all standard HTML attributes (such as `href`, `title`, `className`, etc.) and custom data attributes | `Record<string, any>` | - |

## FAQ

### Block-level HTML Tags Not Properly Closed

When block-level HTML tags contain empty lines (\n\n) internally, the Markdown parser treats empty lines as the start of new paragraphs, thereby interrupting recognition of the original HTML block. This causes closing tags to be incorrectly parsed as inline HTML or plain text, ultimately breaking the tag structure.

**Example Problem:**

Input Markdown:

```markdown
<think>
This is thinking content

The thinking content contains empty lines </think>

This is main content
```

Incorrect Output:

```html
<think>
  This is thinking content

  <p>The thinking content contains empty lines</p>
  <p>This is main content</p>
</think>
```

**Root Cause:** According to [CommonMark](https://spec.commonmark.org/0.30/#html-blocks) specification, HTML block recognition depends on strict formatting rules. Once two consecutive line breaks (i.e., empty lines) appear inside an HTML block and do not meet specific HTML block type continuation conditions (such as `<div>`, `<pre>`, etc.), the parser will terminate the current HTML block and process subsequent content as Markdown paragraphs.

Custom tags (like `<think>` ) are typically not recognized as "paragraph-spanning" HTML block types, making them highly susceptible to empty line interference.

**Solutions:**

1. **Option 1**: Remove all empty lines inside tags

```markdown
<think>
This is thinking content
The thinking content has no empty lines
</think>
```

2. **Option 2**: Add empty lines before, after, and inside HTML tags to make them independent blocks

```markdown
<think>

This is thinking content

The thinking content contains empty lines

</think>
```
