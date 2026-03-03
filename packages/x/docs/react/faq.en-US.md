---
group:
  title: Other
  order: 4
order: 2
title: FAQ
---

Here are the frequently asked questions about Ant Design X and antd that you should look up before you ask in the community or create a new issue. Additionally, you can refer to previous [issues](https://github.com/ant-design/x/issues) for more information.

## Is there a Vue version?

Currently, Ant Design X only provides a React version. Ant Design X is an AI interaction component library specifically designed for the React framework, and there are currently no plans for a Vue version.

If you are using the Vue tech stack, we recommend following our GitHub repository for the latest updates, or participating in open source contributions to help us support more frameworks.

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
      },
    }}
  >
    <Bubble.List
      items={messages}
      size="small" // Use small size for mobile
    />
    <Sender placeholder="Please enter..." size="small" />
  </ConfigProvider>
);
```

Currently, Ant Design X mainly targets desktop AI interaction scenarios. If you have special mobile requirements, we recommend implementing better experiences through custom styles or combining with mobile UI frameworks.
