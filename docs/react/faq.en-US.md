---
group:
  title: Other
  order: 5
order: 2
title: FAQ
---

Here are the frequently asked questions about Ant Design X and antd that you should look up before you ask in the community or create a new issue. Additionally, you can refer to previous [issues](https://github.com/ant-design/x/issues) for more information.

## How to use markdown rendering?

Currently, you can achieve custom markdown content rendering by using the `markdown-it` library. In the Bubble component, you can customize the rendering method through the `messageRender` prop:

```tsx
import { Bubble } from '@ant-design/x';
import { Typography } from 'antd';
import markdownit from 'markdown-it';

const md = markdownit({ html: true, breaks: true });

const renderMarkdown = (content) => {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );
};

const App = () => (
  <Bubble
    content="**Bold text** and [link](https://x.ant.design)"
    messageRender={renderMarkdown}
  />
);
```

For more detailed examples, please refer to [Bubble Markdown Demo](/components/bubble#components-bubble-demo-markdown).

> **📢 Coming Soon**: Ant Design X 2.0 will have built-in markdown rendering support, allowing direct markdown content rendering without additional configuration.

## Is there a Vue version?

Currently, Ant Design X only provides a React version. Ant Design X is an AI interaction component library specifically designed for the React framework, and there are currently no plans for a Vue version.

If you are using the Vue tech stack, we recommend following our GitHub repository for the latest updates, or participating in open source contributions to help us support more frameworks.

## How to render `<think>` tags?

`<think>` tags are typically used to display AI thinking processes. Currently, you can handle them through custom message transformation:

```tsx
// Reference the implementation in copilot.tsx
const transformMessage = (info) => {
  const { originMessage, chunk } = info || {};
  let currentContent = '';
  let currentThink = '';
  
  // Parse thinking content from AI response
  if (chunk?.data && !chunk?.data.includes('DONE')) {
    const message = JSON.parse(chunk?.data);
    currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
    currentContent = message?.choices?.[0]?.delta?.content || '';
  }

  let content = '';
  
  if (!originMessage?.content && currentThink) {
    content = `<think>${currentThink}`;
  } else if (
    originMessage?.content?.includes('<think>') &&
    !originMessage?.content.includes('</think>') &&
    currentContent
  ) {
    content = `${originMessage?.content}</think>${currentContent}`;
  } else {
    content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
  }

  return { content, role: 'assistant' };
};
```

You can also use the `ThoughtChain` component to display structured thinking steps:

```tsx
import { ThoughtChain } from '@ant-design/x';

const App = () => (
  <ThoughtChain
    items={[
      {
        key: '1',
        title: 'Understanding the problem',
        content: 'Analyzing user needs and problem context',
        status: 'success',
      },
      {
        key: '2', 
        title: 'Thinking solutions',
        content: 'Considering multiple possible solutions',
        status: 'pending',
      }
    ]}
  />
);
```

For more implementation approaches, please refer to [Copilot Example](https://github.com/ant-design/x/blob/main/docs/playground/copilot.tsx) and [ThoughtChain Component Documentation](/components/thought-chain).

> **📢 Coming Soon**: Ant Design X 2.0 will introduce a new Think component specifically for displaying AI thinking processes, providing a more convenient solution for rendering thought chains. See [PR #946](https://github.com/ant-design/x/pull/946).

## How to adapt to mobile?

Ant Design X is based on Ant Design's design system and has responsive capabilities. For mobile adaptation, we recommend the following approaches:

1. **Use responsive layout**: Combine Ant Design's Grid system and breakpoint system
2. **Adjust component sizes**: Use the `size` prop of components, using `small` size on mobile
3. **Optimize interaction experience**:
   - Adjust Bubble component bubble size and spacing
   - Use touch-friendly Sender input box design
   - Consider using the `Conversations` component's collapse functionality

```tsx
import { Bubble, Sender } from '@ant-design/x';
import { ConfigProvider } from 'antd';

const App = () => (
  <ConfigProvider
    theme={{
      components: {
        // You can customize mobile styles here
      }
    }}
  >
    <Bubble.List 
      items={messages}
      size="small" // Use small size for mobile
    />
    <Sender 
      placeholder="Please enter..."
      size="small"
    />
  </ConfigProvider>
);
```

Currently, Ant Design X mainly targets desktop AI interaction scenarios. If you have special mobile requirements, we recommend implementing better experiences through custom styles or combining with mobile UI frameworks.
