---
group:
  title: Advanced
order: 3
title: CSS Variables
tag: New
---

<!-- prettier-ignore -->
:::info{title=Tips}
The philosophy of X is to embrace the future. In X, the CSS Variables feature will be permanently enabled, which is also what Ant Design v6 aims to do.
:::

## Advanced

### Disable Hash

Hash is one of the features since Ant Design 5.0. Its function is to calculate a unique hash value for each theme, and use it in the class of the component to isolate the theme style.

However, after enabling CSS variables, the component styles of the same antd version will not change with the token —— because we use CSS variables to fill in the dynamic parts of the styles. So if there is only one version of antd in your application, you can choose to disable hash to further reduce the total size of the styles:

```tsx
<XConfigProvider theme={{ cssVar: true, hashed: false }}>
  <App />
</XConfigProvider>
```

By the way, we strongly recommend using `extractStyle` to extract static styles, which will bring a certain amount of performance improvement to the application.

### Customize Theme

With CSS variable mode, the method of modifying the theme is the same as before, refer to [Customize Theme](/docs/react/customize-theme).

## API

`cssVar` configuration:

| Properties | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| prefix | Prefix of CSS Variables, same as `prefixCls` of ConfigProvider by default | string | `ant` | 5.12.0 |
| key | The unique key of theme. Automatically set by `useId` in React 18, but need to be set manually in React 17 or 16 | string | `useId` in React 18 | 5.12.0 |
