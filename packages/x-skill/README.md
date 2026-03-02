<div align="center"><a name="readme-top"></a>

<img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original">

<h1>Ant Design X Skill</h1>

Intelligent skill library specially designed for Ant Design X

[![CI status](https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg)](https://github.com/ant-design/x/actions/workflows/main.yml) [![NPM version](https://img.shields.io/npm/v/@ant-design/x-skill.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x-skill) [![NPM downloads](https://img.shields.io/npm/dm/@ant-design/x-skill.svg?style=flat-square)](https://npmjs.org/package/@ant-design/x-skill) [![bundle size](https://badgen.net/bundlephobia/minzip/@ant-design/x-skill?style=flat-square)](https://bundlephobia.com/package/@ant-design/x-skill) [![Ant Design](https://img.shields.io/badge/-Ant%20Design-blue?labelColor=black&logo=antdesign&style=flat-square)](https://ant.design)

[Changelog](./CHANGELOG.md) · [Report Bug](https://github.com/ant-design/x/issues/new?template=bug-report.yml) · [Feature Request](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml) · English · [中文](./README-zh_CN.md)

</div>

## ✨ Core Features

- 🤖 **Intelligent Development Experience**: Code generation and optimization suggestions based on best practices, with AI assisting your development
- ⚡ **Significant Efficiency Boost**: Reduce repetitive work and accelerate Ant Design X project development
- 🛡 **Quality Assurance**: Strictly follow Ant Design X design specifications to ensure code quality and consistency
- 🎯 **Full Scenario Coverage**: Cover common AI application scenarios like conversation components, data requests, and state management
- 🔧 **Multi-IDE Support**: Support mainstream AI IDEs like Claude Code, CodeFuse, and Cursor

## 📦 Installation

### One-click Installation (Recommended)

Supports mainstream AI IDEs, complete installation with a single command:

```bash
# Install skill library globally
npm i -g @ant-design/x-skill

# Smart registration to current IDE
npx x-skill
```

### Claude Code Integration

#### Plugin Marketplace Installation (Officially Recommended)

**Step 1: Register Plugin Marketplace**

Execute the following command in Claude Code to add this repository as a plugin source:

```bash
/plugin marketplace add ant-design/x/blob/main/packages/x-skill/
```

**Step 2: Select and Install Skills**

Install the skills included in the x-skill package.

Click `Install now` to complete the installation.

#### Quick Installation

You can also directly install the complete skill package through commands:

```bash
/plugin install x-sdk-skills@x-agent-skills
```

### Manual Installation

Suitable for scenarios requiring customized configuration:

- **Global Installation**: Copy skill files to the `~/.claude/skills` directory, available for all projects
- **Project Installation**: Copy skill files to the `.claude/skills` directory in the project root, available only for the current project

## 🔧 Included Skills

### use-x-chat

Conversation SDK usage guide to help you quickly integrate Ant Design X conversation features.

### x-chat-provider

Chat data flow management, providing efficient data stream processing solutions.

### x-request

Network request best practices, optimizing API calls and data processing.

## 🎯 Applicable Scenarios

- **🚀 New Project Startup**: Quickly set up Ant Design X project framework with complete configuration and best practices
- **⚙️ Feature Development**: Get best practices and code examples for component usage to accelerate feature implementation
- **🔍 Problem Troubleshooting**: Intelligent diagnosis and resolution of common development issues with professional solutions
- **📈 Performance Optimization**: Get professional advice for performance tuning to improve application performance

## 🛠 Development

### Local Development

```bash
# Clone the project
git clone https://github.com/ant-design/x.git

# Enter the skill directory
cd packages/x-skill

# Install dependencies
npm install

# Development mode
npm run dev
```

### Build

```bash
# Build the project
npm run build

# Run tests
npm test
```

## 🤝 How to Contribute

We welcome all forms of contribution, including but not limited to:

- 🐛 [Report Bugs](https://github.com/ant-design/x/issues/new?template=bug-report.yml)
- ✨ [Submit Feature Requests](https://github.com/ant-design/x/issues/new?template=bug-feature-request.yml)
- 📝 [Improve Documentation](https://github.com/ant-design/x/pulls)
- 💻 [Submit Code](https://github.com/ant-design/x/pulls)

Before participating, please read our [Contributor Guide](https://github.com/ant-design/ant-design/blob/master/.github/CONTRIBUTING.md).

## 📞 Community Support

If you encounter problems during use, you can seek help through the following channels:

1. [GitHub Discussions](https://github.com/ant-design/x/discussions) - Discussions and Q&A
2. [GitHub Issues](https://github.com/ant-design/x/issues) - Bug reports and feature requests

## 📄 License

[MIT](./LICENSE)
