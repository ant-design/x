---
group:
  order: 4
  title: 进阶使用
order: 1
title: 样式兼容
---

## `@layer` 样式优先级降权

- 支持版本：`>=5.17.0`
- MDN 文档：[@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- 浏览器兼容性：[caniuse](https://caniuse.com/?search=%40layer)
- Chrome 最低支持版本：99
- 默认启用：否

Ant Design X 支持配置 `layer` 进行统一降权。经过降权后，antdx 的样式将始终低于默认的 CSS 选择器优先级，以便于用户进行样式覆盖（请务必注意检查 `@layer` 浏览器兼容性）。StyleProvider 开启 `layer` 时，子元素**必须**包裹 XProvider 以更新图标相关样式：

```tsx | pure
import { StyleProvider } from '@ant-design/cssinjs';
import { XProvider } from '@ant-design/x';

export default () => (
  <StyleProvider layer>
    <XProvider>
      <Bubble />
    </XProvider>
  </StyleProvider>
);
```

antd 和 antdx 的样式会被封装在 `@layer` 中，以降低优先级：

```diff
++  @layer antd {
      :where(.css-cUMgo0).ant-btn {
        color: #fff;
      }
++  }

++  @layer antdx {
      :where(.css-bAMboO).ant-sender {
        width: 100%;
      }
++  }
```

使用时需要手动调整 `@layer` 来控制样式的覆盖顺序

```css
@layer antd, antdx;
```

### TailwindCSS v3

在 global.css 中，调整 @layer 来控制样式的覆盖顺序。让 tailwind-base 置于 antd, antdx 之前：

```css
@layer tailwind-base, antd, antdx;

@layer tailwind-base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```

### TailwindCSS v4

在 global.css 中，调整 @layer 来控制样式的覆盖顺序，让 antd, antdx 置于恰当位置：

```css
@layer theme, base, antd, antdx, components, utilities;

@import 'tailwindcss';
```

更多可以参考 [antd 样式兼容](https://ant-design.antgroup.com/docs/react/compatible-style-cn)。
