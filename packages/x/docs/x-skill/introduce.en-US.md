---
order: 1
title: Introduction
---

`@ant-design/x-skill` is an intelligent skill library specifically designed for Ant Design X, providing a series of carefully crafted Agent skills. These skills significantly enhance development efficiency, help you quickly build high-quality AI conversation applications, and effectively solve various problems encountered during development.

## 🎯 Use Cases

- **New Project Setup**: Quickly scaffold Ant Design X project framework
- **Feature Development**: Get best practices and code examples for component usage
- **Problem Troubleshooting**: Intelligent diagnosis and resolution of common development issues
- **Performance Optimization**: Get professional advice on performance tuning

## ✨ Core Advantages

- **Intelligent Development**: Code generation and optimization suggestions based on best practices
- **Efficiency Boost**: Reduce repetitive work and accelerate project development
- **Quality Assurance**: Follow Ant Design X design specifications to ensure code quality
- **Rich Scenarios**: Cover common scenarios like conversation components, data requests, and state management

## 🔧 Included Skills

Please check the [Skills List](/x-skills/skills)

## 🚀 Quick Start

We provide multiple flexible installation methods, you can choose the most suitable option based on your actual needs:

### Method 1: One-click Installation (Recommended)

Supports mainstream AI IDEs like Claude Code, CodeFuse, Cursor, CodeX complete installation with a single command:

### Basic Installation

```bash
# Install skill library globally
npm i -g @ant-design/x-skill

# Smart registration to current IDE (interactive installation)
npx x-skill
```

### Version Management

Supports installation with specific version tags to ensure getting specific version features:

```bash
# View all available versions
x-skill --list-versions

# or
x-skill -l

# Install specific version (replace <tag> with actual version number)
x-skill --tag <tag>
# or
x-skill -t <tag>

# View current installer version (not skill version)
x-skill --version
# or
x-skill -V
x-skill -v
```

### Usage Examples

```bash
# Install latest stable version
x-skill

# Install specific version to ensure compatibility
x-skill --tag 2.3.0

# View help information
x-skill --help
```

### Method 2: Claude Code Integration

#### Plugin Marketplace Installation (Official Recommendation)

**Step 1: Register Plugin Marketplace**

Execute the following command in Claude Code to add this repository as a plugin source:

```bash
/plugin marketplace add ant-design/x/blob/main/packages/x-skill/
```

**Step 2: Select and Install Skills**

Install the skills included in x-skill.

Click `Install now` to complete the installation.

#### Quick Installation

You can also directly install the complete skill package via command:

```bash
/plugin install x-sdk-skills@x-agent-skills
```

### Method 3: Manual Installation

Suitable for scenarios requiring customized configuration, using `Claude Code` as an example:

- **Global Installation**: Copy skill files to `~/.claude/skills` directory, available for all projects
- **Project Installation**: Copy skill files to `.claude/skills` directory in the project root, available only for the current project
