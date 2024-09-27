---
order: 6
title: Changelog
toc: false
timeline: true
tag: vVERSION
---

`@ant-design/x` follows [Semantic Versioning 2.0.0](http://semver.org/).

#### Release Schedule

- Weekly release: Patch version for routine bugfix.
- Monthly release: minor version at the end for new features.
- Major version release for breaking change and new features.

---

## 1.0.0-alpha.2

`2024-09-27`

- 🔥 New Componen `XProvider` for global configuration, by [@YumoImer](https://github.com/YumoImer) [#127](https://github.com/ant-design/x/pull/127)
- 🔥 New Runtime Hook `useXChat` for data management, by [@zombieJ](https://github.com/zombieJ) [#125](https://github.com/ant-design/x/pull/125)
- 🔥 New Runtime Hook `useXAgent` for model scheduling, by [@zombieJ](https://github.com/zombieJ) [#125](https://github.com/ant-design/x/pull/125)
- 🆕 `ThoughtChain` component now support the `size` property, by [@YumoImer](https://github.com/YumoImer) [#123](https://github.com/ant-design/x/pull/123)
- 🛠 Updated `.lintstagedrc.json`, by [@afc163](https://github.com/afc163) [#128](https://github.com/ant-design/x/pull/128)
- 🛠 Updated dependency `cheerio` to `v1.0.0`, by [@afc163](https://github.com/afc163) [#121](https://github.com/ant-design/x/pull/121)

## 1.0.0-alpha.1

`2024-09-10`

### 🚀 Features

- 🔥 feat: Suggestion 建议组件 by [@ONLY-yours](https://github.com/ONLY-yours) in [#87](https://github.com/ant-design/x/pull/87)

### 🐛 Fixes

- 🐛 fix: change the Sender restProps type by [@ONLY-yours](https://github.com/ONLY-yours) in [#101](https://github.com/ant-design/x/pull/101)
- 🛠 fix: bun install by [@afc163](https://github.com/afc163) in [#111](https://github.com/ant-design/x/pull/111)

### 🛠 Refactors

- 🛠 chore: add layer support by [@zombieJ](https://github.com/zombieJ) in [#118](https://github.com/ant-design/x/pull/118)
- 🛠 chore: speed up workflows by [@afc163](https://github.com/afc163) in [#119](https://github.com/ant-design/x/pull/119)
- 🛠 chore(deps-dev): bump the dev-dependencies group with 5 updates by [@dependabot](https://github.com/dependabot) in [#120](https://github.com/ant-design/x/pull/120)
- 🛠 chore: clean up README.md by [@afc163](https://github.com/afc163) in [#102](https://github.com/ant-design/x/pull/102)
- 🛠 chore: add issue templates by [@afc163](https://github.com/afc163) in [#103](https://github.com/ant-design/x/pull/103)
- 🛠 chore: add bun.lockb by [@afc163](https://github.com/afc163) in [#108](https://github.com/ant-design/x/pull/108)
- 🛠 chore: Delete index-style-only.js by [@afc163](https://github.com/afc163) in [#106](https://github.com/ant-design/x/pull/106)
- 🛠 chore: Update main.yml by [@afc163](https://github.com/afc163) in [#105](https://github.com/ant-design/x/pull/105)
- 🛠 chore: Update package.json by [@afc163](https://github.com/afc163) in [#110](https://github.com/ant-design/x/pull/110)

### 📖 Documentation

- 📖 docs: Update README.md by [@afc163](https://github.com/afc163) in [#104](https://github.com/ant-design/x/pull/104)
- 📖 docs: Update codecov badge by [@afc163](https://github.com/afc163) in [#112](https://github.com/ant-design/x/pull/112)

## 1.0.0-alpha.0

`2024-09-05`

- 🔥 New Component Bubble. [#19](https://github.com/ant-design/x/pull/19) [@li-jia-nan](https://github.com/li-jia-nan)
  - 🔥 Bubble support direction [#52](https://github.com/ant-design/x/pull/52) [@li-jia-nan](https://github.com/li-jia-nan)
- 🔥 New Component Bubble.List. [#57](https://github.com/ant-design/x/pull/57) [@zombieJ](https://github.com/zombieJ)
- 🔥 New Component Conversations. [#48](https://github.com/ant-design/x/pull/48) [@YumoImer](https://github.com/YumoImer)
- 🔥 New Component Prompts. [#55](https://github.com/ant-design/x/pull/55) [@YumoImer](https://github.com/YumoImer)
- 🔥 New Component Sender. [#46](https://github.com/ant-design/x/pull/46) [@ONLY-yours](https://github.com/ONLY-yours)
- 🔥 New Component ThoughtChain. [#86](https://github.com/ant-design/x/pull/86) [@YumoImer](https://github.com/YumoImer)
- 📦 Use `father` to build. [#84](https://github.com/ant-design/x/pull/84) [@zombieJ](https://github.com/zombieJ)
- 🛠 Fix ThemeContext instances being inconsistent when using `antd` es or lib package. [#88](https://github.com/ant-design/x/pull/88) [@YumoImer](https://github.com/YumoImer)
- 🛠 Refactor: API Naming Conventions [#73](https://github.com/ant-design/x/pull/73) [@zombieJ](https://github.com/zombieJ)
- 🛠 MISC: CI, Github Actions, Publish
  - 🛠 [#59](https://github.com/ant-design/x/pull/59) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#62](https://github.com/ant-design/x/pull/62) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#71](https://github.com/ant-design/x/pull/71) [@ONLY-yours](https://github.com/ONLY-yours)
  - 🛠 [#72](https://github.com/ant-design/x/pull/72) [@YumoImer](https://github.com/YumoImer)
  - 🛠 [#98](https://github.com/ant-design/x/pull/98) [@YumoImer](https://github.com/YumoImer)
- 📖 Update README.md
  - 📖 [#81](https://github.com/ant-design/x/pull/81) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#82](https://github.com/ant-design/x/pull/82) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#61](https://github.com/ant-design/x/pull/61) [@afc163](https://github.com/afc163)

## 0.0.0-alpha.0

`2024-05-10`

- MISC: Project initialization.
