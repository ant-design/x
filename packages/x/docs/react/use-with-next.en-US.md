---
group:
  title: Basic Usage
  order: 3
order: 3
title: Usage with Next.js
---

Here’s the translation of your guide on using `@ant-design/x` with Next.js:

---

[Next.js](https://nextjs.org/) is currently one of the most popular React server-side rendering frameworks. This article will guide you on how to use `@ant-design/x` components in a Next.js project.

## Installation and Initialization

Before you start, you might need to install [yarn](https://github.com/yarnpkg/yarn/), [pnpm](https://pnpm.io/zh/), or [bun](https://bun.sh/).

<InstallDependencies npm='$ npx create-next-app antdx-demo' yarn='$ yarn create next-app antdx-demo' pnpm='$ pnpm create next-app antdx-demo' bun='$ bun create next-app antdx-demo'></InstallDependencies>

The tool will automatically initialize a scaffold and install various necessary dependencies. During the installation process, you may need to choose some configuration options. If you encounter network issues, try configuring a proxy or using another npm registry, such as switching to the Taobao mirror: `npm config set registry https://registry.npmmirror.com`.

Once the initialization is complete, navigate to the project directory and start the development server.

```bash
$ cd antdx-demo
$ npm run dev
```

Visit http://localhost:3000/ in your browser, and seeing the Next.js logo means the setup is successful.

## Importing @ant-design/x

Now, install and import `@ant-design/x` from yarn, npm, pnpm, or bun.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

Modify `src/app/page.tsx` to import the Bubble component from `@ant-design/x`.

```tsx
import React from 'react';
import { Bubble } from '@ant-design/x';

const Home = () => (
  <div className="App">
    <Bubble content="Hello world!" />
  </div>
);

export default Home;
```

You should now see the Bubble component from `@ant-design/x` on your page. You can proceed to use other components to develop your application. For other development processes, you can refer to the [official Next.js documentation](https://nextjs.org/docs).

You may notice that the `@ant-design/x` component does not have styles on the first screen. Below, we'll address how to handle SSR (Server-Side Rendering) styles for Next.js.

## Using App Router <Badge>Updated</Badge>

If you are using the App Router in Next.js and `@ant-design/x` as your component library, you can improve user experience by extracting and injecting `@ant-design/x`'s initial styles into HTML to avoid page flashes.

1. Install `@ant-design/nextjs-registry`

<InstallDependencies npm='$ npm install @ant-design/nextjs-registry --save' yarn='$ yarn add @ant-design/nextjs-registry' pnpm='$ pnpm install @ant-design/nextjs-registry --save' bun='$ bun add @ant-design/nextjs-registry'></InstallDependencies>

2. Use it in `app/layout.tsx`

```tsx
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>{children}</AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
```

<!-- prettier-ignore -->
:::warning
Note: The Next.js App Router does not currently support importing child components directly using `.` (e.g., `<Select.Option />`, `<Typography.Text />`). To avoid errors, import these child components from their respective paths.
:::

For more details, refer to [with-nextjs-app-router-inline-style](https://github.com/ant-design/ant-design-examples/tree/main/examples/with-nextjs-app-router-inline-style).

## Using Pages Router

If you are using the Pages Router in Next.js and `@ant-design/x` as your component library, you can improve user experience by extracting and injecting `@ant-design/x`'s initial styles into HTML to avoid page flashes.

1. Install `@ant-design/cssinjs`

> Developer Note:
>
> Ensure that the version of `@ant-design/cssinjs` installed matches the version in `@ant-design/x`'s local `node_modules`, to avoid issues with multiple React instances. (Tip: You can check the local version with `npm ls @ant-design/cssinjs`.)

<InstallDependencies npm='$ npm install @ant-design/cssinjs --save' yarn='$ yarn add @ant-design/cssinjs' pnpm='$ pnpm install @ant-design/cssinjs --save' bun='$ bun add @ant-design/cssinjs'></InstallDependencies>

2. Modify `pages/_document.tsx`

```tsx
import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
```

3. Support for Custom Themes

```ts
// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
  },
};

export default theme;
```

4. Modify `pages/_app.tsx`

```tsx
import React from 'react';
import { XProvider } from '@ant-design/x';
import type { AppProps } from 'next/app';

import theme from './theme/themeConfig';

const App = ({ Component, pageProps }: AppProps) => (
  <XProvider theme={theme}>
    <Component {...pageProps} />
  </XProvider>
);

export default App;
```

5. Use `@ant-design/x` in your pages

```tsx
import React from 'react';
import { Bubble } from '@ant-design/x';

const Home = () => (
  <div className="App">
    <Bubble content="Hello world!" />
  </div>
);

export default Home;
```

For more details, refer to [with-nextjs-inline-style](https://github.com/ant-design/ant-design-examples/tree/main/examples/with-nextjs-inline-style).
