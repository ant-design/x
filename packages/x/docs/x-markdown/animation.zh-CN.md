---
title: 流式动画效果
order: 4
---

## 介绍

为流式渲染的内容添加优雅的动画效果，支持文字渐显动画，提升用户体验。

## 代码演示

<code src="./demo/streaming/animation.tsx">动画效果</code>

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

## 动画效果说明

文字渐显动画提供了以下特性：

- **平滑过渡**：文字以淡入的方式逐步显示
- **可配置时长**：支持自定义动画持续时间
- **缓动函数**：支持多种缓动效果（ease-in-out、linear、ease-in、ease-out）
- **性能优化**：使用 CSS3 transform 和 opacity 实现高性能动画

当 `enableAnimation` 设置为 `true` 时，新接收到的内容会以淡入动画的方式显示，为用户提供更流畅的阅读体验。
