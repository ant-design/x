---
group:
  title: 其他
  order: 4
order: 2
title: FAQ
---

以下整理了一些 Ant Design X 社区常见的问题和官方答复，在提问之前建议找找有没有类似的问题。此外亦可参考过往的 [issues](https://github.com/ant-design/x/issues)。

## 是否有 Vue 版本？

目前 Ant Design X 只提供 React 版本。Ant Design X 是专为 React 框架设计的 AI 交互组件库，暂时没有 Vue 版本的计划。

如果你使用 Vue 技术栈，建议关注我们的 GitHub 仓库获取最新动态，或者参与到开源贡献中来帮助我们支持更多框架。

## 如何适配移动端？

Ant Design X 基于 Ant Design 的设计体系，具备一定的响应式能力。对于移动端适配，建议采用以下方式：

1. **使用响应式布局**：结合 Ant Design 的栅格系统（Grid）和断点系统
2. **调整组件尺寸**：使用组件的 `size` 属性，在移动端使用 `small` 尺寸
3. **优化交互体验**：
   - 调整 Bubble 组件的气泡大小和间距
   - 使用适合触摸的 Sender 输入框设计
   - 考虑使用 `Conversations` 组件的折叠功能

```tsx
import { Bubble, Sender } from '@ant-design/x';
import { ConfigProvider } from 'antd';

const App = () => (
  <ConfigProvider
    theme={{
      components: {
        // 可以在这里自定义移动端样式
      },
    }}
  >
    <Bubble.List
      items={messages}
      size="small" // 移动端使用小尺寸
    />
    <Sender placeholder="请输入..." size="small" />
  </ConfigProvider>
);
```

目前 Ant Design X 主要面向桌面端的 AI 交互场景，如果你有移动端的特殊需求，建议通过自定义样式或结合移动端 UI 框架来实现更好的体验。
