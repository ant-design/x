---
group:
  title: 进阶使用
order: 3
title: 使用 CSS 变量
tag: New
---

<!-- prettier-ignore -->
:::info{title=Tips}
X 的理念是拥抱未来，X 中将永久开启 CSS 变量功能，且这也是 antd v6 要做的事情。
:::

## 进阶使用

### 关闭 hash

hash 是 Ant Design 5.0 以来的特性之一，其功能是为每一份主题计算一个独特的 hash 值，并将其用在组件的 class 上，用于隔离主题样式。

但是启用了 CSS 变量之后，相同 antd 版本下的组件样式将不会随着 token 变化而改变 —— 因为我们用 CSS 变量填充了样式中的动态部分。所以如果你的应用中只存在一个版本的 antd，你可以选择关闭 hash 来进一步减小样式体积：

```tsx
<XProvider theme={{ cssVar: true, hashed: false }}>
  <App />
</XProvider>
```

同时我们非常推荐使用 `extractStyle` 来抽取静态样式，这样会为应用性能带来一定量的提升。

### 修改主题

在 CSS 变量模式下，修改主题的方法与之前无异，参考 [定制主题](/docs/react/customize-theme-cn)。

## API

`cssVar` 目前支持的参数：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefix | CSS 变量的前缀，默认与 ConfigProvider 上配置的 `prefixCls` 相同。 | string | `ant` | 5.12.0 |
| key | 当前主题的唯一识别 key. 在 React 18 中会默认用 `useId` 填充，小于 React 18 的版本需要手动填充。 | string | `useId` in React 18 | 5.12.0 |
