---
group:
  title: 流式处理
  order: 4
title: 动画效果
order: 2
---

为流式渲染的内容添加优雅的动画效果，支持文本的渐进式显示，提升用户阅读体验。

## 代码演示

<code src="./demo/streaming/animation.tsx">流式动画效果</code>

## API

### streaming

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| hasNextChunk | 是否还有后续数据 | `boolean` | `false` |
| enableAnimation | 启用文本淡入动画 | `boolean` | `false` |
| animationConfig | 文本动画配置 | `AnimationConfig` | `{ fadeDuration: 200, easing: 'ease-in-out' }` |

### AnimationConfig

| 属性         | 说明                     | 类型     | 默认值          |
| ------------ | ------------------------ | -------- | --------------- |
| fadeDuration | 淡入动画持续时间（毫秒） | `number` | `200`           |
| easing       | 动画缓动函数             | `string` | `'ease-in-out'` |

## FAQ

### 动画效果不生效？

A: 请检查以下条件：

- `enableAnimation` 是否设置为 `true`
- `hasNextChunk` 是否正确控制
- 浏览器是否支持 CSS3 动画

### 动画导致性能问题？

A: 建议优化：

- 减少 `fadeDuration` 时间
- 使用 `linear` 缓动函数
- 分批渲染大量内容
