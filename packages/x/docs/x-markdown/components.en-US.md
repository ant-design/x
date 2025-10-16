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

XMarkdown will pass the `streamStatus` prop to components by default, which indicates whether the component is closed, making it easier to handle streaming rendering.

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

Components support two data fetching methods: directly parsing data from Markdown or initiating network requests independently.

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

## Supported Tag Mappings

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
// Support for any custom tags
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
| streamStatus | Streaming status, `loading` indicates loading in progress, `done` indicates loading completed | `'loading' \| 'done'` | - |
| children | Content wrapped in the component, containing text content of DOM nodes | `React.ReactNode` | - |
| rest | Component properties, supports all standard HTML attributes (such as `href`, `title`, `className`, etc.) and custom data attributes | `Record<string, any>` | - |
