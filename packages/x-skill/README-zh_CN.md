# Ant Design X 技能库

## 概述

本技能库包含 Ant Design X 的指令、脚本和资源。Agent 会动态加载这些资源，以提升 Ant Design X 的使用效率和问题解决能力。

# 如何使用

以下方法都可以安装和使用 Ant Design X 技能库：

## 使用 Ant Design X 提供的统一指令安装

1. 安装依赖

```bash
npm i -g @ant-design/x-skill
```

2. 注册插件

```bash
npx  x-skill
```

## 在 Claude Code 中使用

### 通过插件市场安装（推荐）

#### 方式一：注册插件市场

1. 在 Claude Code 中运行以下命令，将此仓库注册为插件市场：

   ```bash
   /plugin marketplace add ant-design/x/blob/main/packages/x-skill/
   ```

2. 按顺序选择并安装所需技能：
   - use-x-chat
   - x-chat-provider
   - x-request
   - 点击 "Install now"

#### 方式二：直接安装

也可以直接通过以下命令安装插件：

```bash
/plugin install x-sdk-skills@x-agent-skills
```

### 手动安装

如需手动安装技能：

- **全局技能**：将技能文件复制到 `~/.claude/skills` 目录
- **项目技能**：将技能文件复制到项目根目录下的 `.claude/skills` 目录
