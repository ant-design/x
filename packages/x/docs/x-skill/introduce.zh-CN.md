---
order: 1
title: 介绍
---

`@ant-design/x-skill` 是专为 Ant Design X 打造的智能技能库，提供了一系列精心设计的 Agent 技能。这些技能能够显著提升开发效率，帮助您快速构建高质量的 AI 对话应用、Markdown 富内容渲染流程，并有效解决开发过程中遇到的各种问题。

## 🎯 适用场景

- **新项目启动**：快速搭建 Ant Design X 项目框架
- **功能开发**：获取组件使用最佳实践和代码示例
- **问题排查**：智能诊断和解决常见开发问题
- **性能优化**：获取性能调优的专业建议

## ✨ 核心优势

- **智能化开发**：基于最佳实践的代码生成和优化建议
- **效率提升**：减少重复性工作，加速项目开发
- **质量保证**：遵循 Ant Design X 设计规范，确保代码质量
- **场景丰富**：覆盖对话组件、数据请求、状态管理、Markdown 渲染等常见场景

## 🔧 包含的技能

- **use-x-chat**：对话 SDK 使用指南
- **x-chat-provider**：聊天数据流管理
- **x-request**：网络请求最佳实践
- **x-markdown**：面向流式内容的 Markdown 渲染与扩展指南

## 🚀 快速开始

我们提供了多种灵活的安装方式，您可以根据实际需求选择最适合的方案：

### 方式一：一键安装（推荐）

支持 Claude Code、CodeFuse、Cursor 等主流 AI IDE，一条命令即可完成安装：

#### 基础安装

```bash
# 全局安装技能库
npm i -g @ant-design/x-skill

# 智能注册到当前 IDE（交互式安装）
npx x-skill
```

#### 版本管理

支持指定版本标签安装，确保获取特定版本的功能：

```bash
# 查看所有可用版本
x-skill --list-versions

# 或
x-skill -l

# 安装指定版本（替换 <tag> 为具体版本号）
x-skill --tag <tag>
# 或
x-skill -t <tag>

# 查看当前安装器的版本（非 skill 版本）
x-skill --version
# 或
x-skill -V
x-skill -v
```

#### 使用示例

```bash
# 安装最新稳定版本
x-skill

# 安装指定版本确保兼容性
x-skill --tag 2.3.0

# 查看帮助信息
x-skill --help
```

### 方式二：Claude Code 集成

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

### 方式三：手动安装

适用于需要定制化配置的场景，以 `Claude Code` 为例：

- **全局安装**：将技能文件复制到 `~/.claude/skills` 目录，所有项目可用
- **项目安装**：将技能文件复制到项目根目录下的 `.claude/skills` 目录，仅当前项目可用
