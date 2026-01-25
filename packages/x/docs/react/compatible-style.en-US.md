---
group:
  order: 4
  title: Advanced Usage
order: 1
title: Style Compatibility
---

## `@layer` Style Priority Demotion

- Supported version: `>=5.17.0`
- MDN documentation: [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- Browser compatibility: [caniuse](https://caniuse.com/?search=%40layer)
- Minimum Chrome support version: 99
- Enabled by default: No

Ant Design X supports configuring `layer` for unified priority demotion. After demotion, antdx styles will always have lower priority than default CSS selectors, making it easier for users to override styles (please be sure to check `@layer` browser compatibility). When StyleProvider enables `layer`, child elements **must** be wrapped with XProvider to update icon-related styles:

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

antd and antdx styles will be encapsulated in `@layer` to reduce priority:

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

When using, you need to manually adjust `@layer` to control the style override order:

```css
@layer antd, antdx;
```

### TailwindCSS v3

In global.css, adjust @layer to control the style override order. Place tailwind-base before antd and antdx:

```css
@layer tailwind-base, antd, antdx;

@layer tailwind-base {
  @tailwind base;
}
@tailwind components;
@tailwind utilities;
```

### TailwindCSS v4

In global.css, adjust @layer to control the style override order, placing antd and antdx in appropriate positions:

```css
@layer theme, base, antd, antdx, components, utilities;

@import 'tailwindcss';
```

For more information, please refer to [antd Style Compatibility](https://ant-design.antgroup.com/docs/react/compatible-style).
