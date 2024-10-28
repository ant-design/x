---
order: 0
title: Ant Design X of React
---

Following the Ant Design specification, we developed a React UI library `@ant-design/x` that Crafting AI-driven interfaces with React, seamlessly integrating smart chat components and API services at your fingertips.

<div class="pic-plus">
  <img width="150" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original" />
  <span>+</span>
  <img width="160" src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
</div>

---

## ✨ Features

- 🌈 Enterprise-class UI designed for web applications.
- 📦 A set of high-quality React components out of the box.
- 🛡 Written in TypeScript with predictable static types.
- ⚙️ Whole package of design resources and development tools.
- 🌍 Internationalization support for dozens of languages.
- 🎨 Powerful theme customization in every detail.

## Environment Support

- Modern browsers
- Server-side Rendering
- [Electron](https://www.electronjs.org/)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Electron |
| --- | --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

Polyfills are needed for IE browsers. We recommend [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) for it. You can set `targets` config if you are using [umi](http://umijs.org/).

## Version

- Stable: [![npm package](https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square)](https://www.npmjs.com/package/@ant-design/x)

You can subscribe to this feed for new version notifications: https://github.com/ant-design/x/releases.atom

## Installation

### Using npm or yarn or pnpm or bun

**We recommend using [npm](https://www.npmjs.com/) or [yarn](https://github.com/yarnpkg/yarn/) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/) to install**, it not only makes development easier, but also allow you to take advantage of the rich ecosystem of Javascript packages and tooling.

<InstallDependencies npm='$ npm install @ant-design/x --save' yarn='$ yarn add @ant-design/x' pnpm='$ pnpm install @ant-design/x --save' bun='$ bun add @ant-design/x'></InstallDependencies>

If you are in a bad network environment, you can try other registries and tools like [cnpm](https://github.com/cnpm/cnpm).

### Import in Browser

Add `script` and `link` tags in your browser and use the global variable `antd`.

We provide `antdx.js`, `antdx.min.js`, and `antdx.min.js.map` in the `dist` directory of the npm package. You can also download them via [![CDNJS](https://img.shields.io/cdnjs/v/@ant-design/x.svg?style=flat-square)](https://cdnjs.com/libraries/@ant-design), [![](https://data.jsdelivr.com/v1/package/npm/@ant-design/x/badge)](https://www.jsdelivr.com/package/npm/@ant-design/x), or [UNPKG](https://unpkg.com/@ant-design/x/dist/).

> **We strongly discourage loading the entire files** this will add bloat to your application and make it more difficult to receive bugfixes and updates. Antd is intended to be used in conjunction with a build tool, such as [webpack](https://webpack.github.io/), which will make it easy to import only the parts of antd that you are using.

> Note: You should import `react`、`react-dom`、`dayjs` before using `antdx.js`.

## Usage

```jsx
import React from 'react';
import { Bubble } from '@ant-design/x';

const App = () => {
  return <Bubble content="Hello World!" />;
};

export default App;
```

### Use modularized antd

`@ant-design/x` supports ES modules tree shaking by default.

### TypeScript

`@ant-design/x` provides a built-in ts definition.

## Links

- [Home page](/)
- [China Mirrors](https://github.com/ant-design/ant-design/issues/25661)
- [Components](/components/overview)
- [Ant Design Pro](https://pro.ant.design/)
- [Ant Design Pro Components](https://procomponents.ant.design/)
- [Ant Design Charts](https://charts.ant.design)
- [Change Log](/changelog)
- [rc-components](https://react-component.github.io/)
- [Mobile Components](https://mobile.ant.design)
- [Mini Program Components](https://mini.ant.design)
- [Ant Design Icons](https://github.com/ant-design/ant-design-icons)
- [Ant Design Colors](https://github.com/ant-design/ant-design-colors)
- [Landing Pages](https://landing.ant.design)
- [Motion](https://motion.ant.design)
- [Scaffold Market](https://scaffold.ant.design)
- [Developer Instruction](https://github.com/ant-design/ant-design/wiki/Development)
- [Versioning Release Note](https://github.com/ant-design/ant-design/wiki/%E8%BD%AE%E5%80%BC%E8%A7%84%E5%88%99%E5%92%8C%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B)
- [FAQ](/docs/react/faq)
- [CodeSandbox Template](https://u.ant.design/codesandbox-repro) for bug reports
- [Awesome Ant Design](https://github.com/websemantics/awesome-ant-design)
- [Customize Theme](/docs/react/customize-theme)
- [How to Apply for Being A Collaborator](https://github.com/ant-design/ant-design/wiki/Collaborators#how-to-apply-for-being-a-collaborator)

## Non-React Implementations

Welcome to contribute!

## Companies using antdx

Ant Design X is widely used in AI-driven user interfaces within Ant Group. If your company and products use Ant Design X, feel free to leave a comment [here](https://github.com/ant-design/x/issues/126).

## Contributing

Please read our [CONTRIBUTING.md](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md) first.

If you'd like to help us improve antd, just create a [Pull Request](https://github.com/ant-design/ant-design/pulls). Feel free to report bugs and issues [here](http://new-issue.ant.design/).

> If you're new to posting issues, we ask that you read [_How To Ask Questions The Smart Way_](http://www.catb.org/~esr/faqs/smart-questions.html) and [How to Ask a Question in Open Source Community](https://github.com/seajs/seajs/issues/545) and [How to Report Bugs Effectively](http://www.chiark.greenend.org.uk/~sgtatham/bugs.html) prior to posting. Well written bug reports help us help you!

## Need Help?

If you encounter any issues while using Ant Design X, you can seek help through the following channels. We also encourage experienced users to assist newcomers via these platforms.

When asking questions on GitHub Discussions, it's recommended to use the `Q&A` tag.

1. [GitHub Discussions](https://github.com/ant-design/x/discussions)
2. [GitHub Issues](https://github.com/ant-design/x/issues)
