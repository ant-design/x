<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X Skill</h1>

专为 Ant Design X 打造的智能技能库

[![CI status](https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg)](https://github.com/ant-design/x/actions/workflows/main.yml) [![NPM version](https://img.shields.io/npm/v/@ant-design/x-skill.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x-skill) [![NPM downloads](https://img.shields.io/npm/dm/@ant-design/x-skill.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x-skill) [![bundle size](https://badgen.net/bundlephobia/minzip/@ant-design/x-skill?style=flat-square)](https://bundlephobia.com/package/@ant-design/x-skill) [![Ant Design](https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square)](https://ant.design)

[更新日志](./CHANGELOG.md) · [报告问题](https://github.com/ant-design/x/issues/new?template=bug-report.yml) · [功能请求](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml) · [English](./README.md) · 中文

</div>

## ✨ 核心特性

- 🤖 **智能化开发体验**：基于最佳实践的代码生成和优化建议，让 AI 辅助您的开发
- ⚡ **效率大幅提升**：减少重复性工作，加速 Ant Design X 项目开发
- 🛡 **质量保证**：严格遵循 Ant Design X 设计规范，确保代码质量和一致性
- 🎯 **场景全覆盖**：覆盖对话组件、数据请求、状态管理、Markdown 渲染等常见 AI 应用场景
- 🔧 **多 IDE 支持**：支持 Claude Code、CodeFuse、Cursor 等主流 AI IDE

## 📦 安装

### 一键安装（推荐）

支持主流 AI IDE，一条命令即可完成安装：

```bash
# 全局安装技能库
npm i -g @ant-design/x-skill

# 智能注册到当前 IDE
npx x-skill
```

### Claude Code 集成

#### 插件市场安装（官方推荐）

**步骤 1：注册插件市场**

在 Claude Code 中执行以下命令，将本仓库添加为插件源：

```bash
/plugin marketplace add ant-design/x/blob/main/packages/x-skill/
```

**步骤 2：选择并安装技能**

安装 x-skill 技能包含的技能。

点击 `Install now` 完成安装。

#### 快速安装

也可以直接通过命令安装完整技能包：

```bash
/plugin install x-sdk-skills@x-agent-skills
```

### 手动安装

适用于需要定制化配置的场景：

- **全局安装**：将技能文件复制到 `~/.claude/skills` 目录，所有项目可用
- **项目安装**：将技能文件复制到项目根目录下的 `.claude/skills` 目录，仅当前项目可用

## 🔧 包含的技能

### use-x-chat

对话 SDK 使用指南，帮助您快速集成 Ant Design X 的对话功能。

### x-chat-provider

聊天数据流管理，提供高效的数据流处理方案。

### x-request

网络请求最佳实践，优化 API 调用和数据处理。

### x-markdown

Markdown 渲染指南，覆盖流式输出、自定义组件映射、插件与主题。

## 🎯 适用场景

- **🚀 新项目启动**：快速搭建 Ant Design X 项目框架，包含完整的配置和最佳实践
- **⚙️ 功能开发**：获取组件使用、渲染与集成的最佳实践和代码示例，加速功能实现
- **🔍 问题排查**：智能诊断和解决常见开发问题，提供专业的解决方案
- **📈 性能优化**：获取性能调优的专业建议，提升应用性能

## 🛠 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/ant-design/x.git

# 进入技能目录
cd packages/x-skill

# 安装依赖
npm install

# 开发模式
npm run dev
```

### 构建

```bash
# 构建项目
npm run build

# 运行测试
npm test
```

## 🤝 如何贡献

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 [报告 Bug](https://github.com/ant-design/x/issues/new?template=bug-report.yml)
- ✨ [提交功能请求](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml)
- 📝 [改进文档](https://github.com/ant-design/x/pulls)
- 💻 [提交代码](https://github.com/ant-design/x/pulls)

在参与贡献之前，请阅读我们的[贡献指南](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md)。

## 📞 社区支持

如果您在使用过程中遇到问题，可以通过以下渠道寻求帮助：

1. [GitHub Discussions](https://github.com/ant-design/x/discussions) - 讨论和问答
2. [GitHub Issues](https://github.com/ant-design/x/issues) - 问题报告和功能请求

## 📄 许可证

[MIT](./LICENSE)
