---
title: 流式渲染
order: 3
---

## 介绍

通过缓存隐藏markdown格式和动画效果，优化 LLM 场景下流式 Markdown 渲染效果。

## 代码演示

<!-- prettier-ignore -->
<!-- <code src="./demo/streaming/typing.tsx" description="配合`Bubble`渲染">打字机效果</code> -->

<code src="./demo/streaming/format.tsx"  description="通过缓存隐藏 Markdown 格式">缓存</code> <code src="./demo/streaming/animation.tsx">动画效果</code>

## 配置说明

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有流式数据 | `boolean` | `false` |
| enableAnimation | 是否开启文字渐显 | `boolean` | `false` |
| animationConfig | 文字动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

#### AnimationConfig

| 属性         | 说明                     | 类型     | 默认值          |
| ------------ | ------------------------ | -------- | --------------- |
| fadeDuration | 淡入动画持续时间（毫秒） | `number` | `200`           |
| easing       | 动画的缓动函数           | `string` | `'ease-in-out'` |

### 使用示例

```tsx
import { XMarkdown } from '@ant-design/x-markdown';

const App = () => {
  return (
    <XMarkdown
      content="# Hello World\n\n这是一个流式渲染的示例。"
      streaming={{
        hasNextChunk: true,
        enableAnimation: true,
        animationConfig: {
          fadeDuration: 200,
          easing: 'ease-in-out',
        },
      }}
    />
  );
};
```
