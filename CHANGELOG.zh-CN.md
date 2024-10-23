---
order: 6
title: 更新日志
timeline: true
tag: vVERSION
---

`@ant-design/x` 遵循 [Semantic Versioning 2.0.0](http://semver.org/lang/zh-CN/) 语义化版本规范。

#### 发布周期

- 修订版本号：日常 bugfix 更新。
- 次版本号：带有新特性的向下兼容的版本。
- 主版本号：含有破坏性更新和新特性。

---

## 1.0.0-alpha.5

`2024-10-23`

- 🆕 Bubble 支持 `loadingRender` 以自定义加载状态。[#165](https://github.com/ant-design/x/pull/165)
- 🐛 修复不包裹 XProvider 时，组件样式丢失的问题。[#163](https://github.com/ant-design/x/pull/163)

## 1.0.0-alpha.4

`2024-10-17`

- Sender
  - 🆕 Sender 支持 `speech` 语音功能，由 [@zombieJ](https://github.com/zombieJ) [#154](https://github.com/ant-design/x/pull/154)
  - 🆕 Sender 支持 `Sender.Header`，由 [@zombieJ](https://github.com/zombieJ) [#156](https://github.com/ant-design/x/pull/156)
  - 🆕 Sender 样式调整，由 [@zombieJ](https://github.com/zombieJ) [#151](https://github.com/ant-design/x/pull/151)
- 📖 更新文档页面下的组配置，由 [@YumoImer](https://github.com/YumoImer) [#155](https://github.com/ant-design/x/pull/155)
- 📖 调整示例切换按钮样式，由 [@afc163](https://github.com/afc163) [#146](https://github.com/ant-design/x/pull/146)
- 📖 更新 README.md，由 [@afc163](https://github.com/afc163) [#142](https://github.com/ant-design/x/pull/142)

## 1.0.0-alpha.3

`2024-10-10`

- Bubble
  - 🆕 Bubble 新增 `variant` 变体支持，由 [@zombieJ](https://github.com/zombieJ) 完成 [#140](https://github.com/ant-design/x/pull/140)
  - 🆕 Bubble 新增 `shape` 形状支持，由 [@zombieJ](https://github.com/zombieJ) 完成 [#144](https://github.com/ant-design/x/pull/144)
  - 🆕 Bubble 新增 `header` 和 `footer` 支持自定义头部与底部内容并添加对应语义化 `className`，由 [@zombieJ](https://github.com/zombieJ) 完成 [#147](https://github.com/ant-design/x/pull/147)

## 1.0.0-alpha.2

`2024-09-27`

- 🔥 新增 `XProvider` 全局化配置组件，由 [@YumoImer](https://github.com/YumoImer) 完成 [#127](https://github.com/ant-design/x/pull/127)
- 🔥 新增 运行时钩子 `useXChat` 数据管理，由 [@zombieJ](https://github.com/zombieJ) 完成 [#125](https://github.com/ant-design/x/pull/125)
- 🔥 新增 运行时钩子 `useXAgent` 模型调度，由 [@zombieJ](https://github.com/zombieJ) 完成 [#125](https://github.com/ant-design/x/pull/125)
- 🆕 `ThoughtChain` 思维链组件支持 `size` 属性，由 [@YumoImer](https://github.com/YumoImer) 完成 [#123](https://github.com/ant-design/x/pull/123)
- 🛠 更新 `.lintstagedrc.json`, 由 [@afc163](https://github.com/afc163) 完成 [#128](https://github.com/ant-design/x/pull/128)
- 🛠 更新依赖 `cheerio` 至 `v1.0.0`, 由 [@afc163](https://github.com/afc163) 完成 [#121](https://github.com/ant-design/x/pull/121)

## 1.0.0-alpha.1

`2024-09-10`

### 🚀 新特性

- 🔥 新增：`Suggestion` 建议组件，由 [@ONLY-yours](https://github.com/ONLY-yours) 完成 [#87](https://github.com/ant-design/x/pull/87)

### 🐛 修复

- 🐛 修复：更改 `Sender` 的 `restProps` 类型，由 [@ONLY-yours](https://github.com/ONLY-yours) 完成 [#101](https://github.com/ant-design/x/pull/101)
- 🛠 修复：`bun install` 问题，由 [@afc163](https://github.com/afc163) 完成 [#111](https://github.com/ant-design/x/pull/111)

### 🛠 重构

- 🛠 重构：添加层级支持，由 [@zombieJ](https://github.com/zombieJ) 完成 [#118](https://github.com/ant-design/x/pull/118)
- 🛠 重构：加速工作流，由 [@afc163](https://github.com/afc163) 完成 [#119](https://github.com/ant-design/x/pull/119)
- 🛠 重构：升级开发依赖的 5 个更新，由 [@dependabot](https://github.com/dependabot) 完成 [#120](https://github.com/ant-design/x/pull/120)
- 🛠 重构：清理 `README.md`，由 [@afc163](https://github.com/afc163) 完成 [#102](https://github.com/ant-design/x/pull/102)
- 🛠 重构：添加 issue 模板，由 [@afc163](https://github.com/afc163) 完成 [#103](https://github.com/ant-design/x/pull/103)
- 🛠 重构：添加 `bun.lockb`，由 [@afc163](https://github.com/afc163) 完成 [#108](https://github.com/ant-design/x/pull/108)
- 🛠 删除 `index-style-only.js`，由 [@afc163](https://github.com/afc163) 完成 [#106](https://github.com/ant-design/x/pull/106)
- 🛠 重构：更新 `main.yml`，由 [@afc163](https://github.com/afc163) 完成 [#105](https://github.com/ant-design/x/pull/105)
- 🛠 重构：更新 `package.json`，由 [@afc163](https://github.com/afc163) 完成 [#110](https://github.com/ant-design/x/pull/110)

### 📖 文档

- 📖 文档：更新 `README.md`，由 [@afc163](https://github.com/afc163) 完成 [#104](https://github.com/ant-design/x/pull/104)
- 📖 文档：更新 `codecov` 徽章，由 [@afc163](https://github.com/afc163) 完成 [#112](https://github.com/ant-design/x/pull/112)

## 1.0.0-alpha.0

`2024-09-05`

- 🔥 新组件 Bubble. [#19](https://github.com/ant-design/x/pull/19) [@li-jia-nan](https://github.com/li-jia-nan)
  - 🔥 Bubble 支持方向 [#52](https://github.com/ant-design/x/pull/52) [@li-jia-nan](https://github.com/li-jia-nan)
- 🔥 新组件 Bubble.List. [#57](https://github.com/ant-design/x/pull/57) [@zombieJ](https://github.com/zombieJ)
- 🔥 新组件 Conversations. [#48](https://github.com/ant-design/x/pull/48) [@YumoImer](https://github.com/YumoImer)
- 🔥 新组件 Prompts. [#55](https://github.com/ant-design/x/pull/55) [@YumoImer](https://github.com/YumoImer)
- 🔥 新组件 Sender. [#46](https://github.com/ant-design/x/pull/46) [@ONLY-yours](https://github.com/ONLY-yours)
- 🔥 新组件 ThoughtChain. [#86](https://github.com/ant-design/x/pull/86) [@YumoImer](https://github.com/YumoImer)
- 📦 使用 `father` 构建. [#84](https://github.com/ant-design/x/pull/84) [@zombieJ](https://github.com/zombieJ)
- 🛠 修复使用 `antd` 的 es 或 lib 包时 ThemeContext 实例不一致的问题. [#88](https://github.com/ant-design/x/pull/88) [@YumoImer](https://github.com/YumoImer)
- 🛠 重构：API 命名规范 [#73](https://github.com/ant-design/x/pull/73) [@zombieJ](https://github.com/zombieJ)
- 🛠 杂项：CI、Github Actions、发布
  - 🛠 [#59](https://github.com/ant-design/x/pull/59) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#62](https://github.com/ant-design/x/pull/62) [@zombieJ](https://github.com/zombieJ)
  - 🛠 [#71](https://github.com/ant-design/x/pull/71) [@ONLY-yours](https://github.com/ONLY-yours)
  - 🛠 [#72](https://github.com/ant-design/x/pull/72) [@YumoImer](https://github.com/YumoImer)
  - 🛠 [#98](https://github.com/ant-design/x/pull/98) [@YumoImer](https://github.com/YumoImer)
- 📖 更新 README.md
  - 📖 [#81](https://github.com/ant-design/x/pull/81) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#82](https://github.com/ant-design/x/pull/82) [@zombieJ](https://github.com/zombieJ)
  - 📖 [#61](https://github.com/ant-design/x/pull/61) [@afc163](https://github.com/afc163)

## 0.0.0-alpha.0

`2024-05-10`

- MISC: 项目初始化。
