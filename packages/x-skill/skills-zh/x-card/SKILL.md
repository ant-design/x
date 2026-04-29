---
name: x-card
version: 2.6.0
description: 当需要用 @ant-design/x-card 让 AI Agent 动态渲染富交互 UI 时使用——涵盖 XCard.Box、XCard.Card、A2UI v0.9 命令、数据绑定、Catalog、Actions 和流式渲染模式。
---

# 🎯 技能定位

**本技能覆盖 `@ant-design/x-card`** —— A2UI 协议的 React 实现，使 AI Agent 能够通过结构化 JSON 命令流动态渲染富交互 UI。

覆盖范围：

- `XCard.Box` + `XCard.Card` 组件用法
- A2UI v0.9 命令类型：`createSurface`、`updateComponents`、`updateDataModel`、`deleteSurface`
- 自定义组件注册与 Catalog 管理
- 通过 JSON Pointer 路径（RFC 6901）进行数据绑定
- Action 处理 —— 将用户事件回传给 Agent
- 流式渐进渲染模式
- v0.8 ↔ v0.9 协议差异

> **范围说明**：v0.9 是推荐协议，v0.8 仅为向后兼容保留——所有新功能请使用 v0.9。

## 目录导航

- [📦 技术栈概览](#-技术栈概览)
- [🗂️ 组件架构](#-组件架构)
- [🚀 快速决策指南](#-快速决策指南)
- [🛠 推荐工作流](#-推荐工作流)
- [🚨 开发规则](#-开发规则)
- [🤝 技能协作](#-技能协作)
- [🔗 参考资源](#-参考资源)

# 📦 技术栈概览

| 包名                 | 职责                                                               |
| -------------------- | ------------------------------------------------------------------ |
| `@ant-design/x-card` | A2UI 协议的 React 渲染器 —— `XCard.Box`、`XCard.Card`、Catalog API |
| `@ant-design/x`      | 聊天 UI 组件（Bubble、Sender 等）—— 本技能不涉及                   |
| `@ant-design/x-sdk`  | 数据 Provider、流式处理 —— 本技能不涉及                            |

```bash
npm install @ant-design/x-card
```

**导出内容：**

```typescript
import {
  XCard,
  registerCatalog,
  loadCatalog,
  validateComponent,
  clearCatalogCache,
} from '@ant-design/x-card';
import type {
  XAgentCommand_v0_9,
  XAgentCommand_v0_8,
  ActionPayload,
  Catalog,
  CatalogComponent,
} from '@ant-design/x-card';

// 子组件
XCard.Box; // 容器：接收命令，持有 Catalog 映射
XCard.Card; // 渲染器：按 id 渲染单个 Surface
```

# 🗂️ 组件架构

```
XCard.Box
├── 持有：catalogMap、surfaceCatalogMap
├── 分发：commands → 所有 XCard.Card 子组件
├── 汇聚：所有 Card 的 onAction 事件
└── XCard.Card (id="surface-a")
│   ├── 持有：组件树、数据模型、commandVersion
│   └── 处理：数据绑定解析、Action 触发
└── XCard.Card (id="surface-b")
    └── ...
```

## XCard.Box 属性

```typescript
interface BoxProps {
  commands?: (XAgentCommand_v0_9 | XAgentCommand_v0_8)[];
  /** 组件名称必须以大写字母开头 */
  components?: Record<string, React.ComponentType<any>>;
  onAction?: (payload: ActionPayload) => void;
  children?: React.ReactNode; // 应包含 XCard.Card 元素
}
```

## XCard.Card 属性

```typescript
interface CardProps {
  id: string; // 要渲染的 surfaceId
}
```

## ActionPayload

```typescript
interface ActionPayload {
  name: string; // 来自 action.event.name
  surfaceId: string; // 触发动作的 Surface
  /**
   * 组件传递的上下文，已自动解析 path 引用
   *
   * 对于 action.event.context 中使用 { path: "xxx" } 格式的字段：
   * - X-Card 会自动将其解析为 { value: "实际值" } 格式
   * - 其他属性（如 label）会被保留
   *
   * 示例输入配置：
   *   { username: { path: "/form/username", label: "用户名" } }
   *
   * 示例解析后 context：
   *   { username: { value: "张三", label: "用户名" } }
   */
  context: Record<string, any>;
}
```

# 🚀 快速决策指南

| 当你需要...                 | 优先阅读                                                        |
| --------------------------- | --------------------------------------------------------------- |
| 配置 XCard.Box + XCard.Card | [USAGE.md → 基础配置](reference/USAGE.md#basic-setup)           |
| 从 Agent 发送命令到卡片     | [COMMANDS.md](reference/COMMANDS.md)                            |
| 注册自定义组件 Catalog      | [CATALOG.md → 本地 Catalog](reference/CATALOG.md#local-catalog) |
| 把组件属性绑定到实时数据    | [DATA_BINDING.md](reference/DATA_BINDING.md)                    |
| 处理用户交互/表单提交       | [ACTIONS.md](reference/ACTIONS.md)                              |
| 构建流式渐进 UI             | [USAGE.md → 流式渲染](reference/USAGE.md#streaming)             |
| 从 v0.8 迁移到 v0.9         | [COMMANDS.md → v0.8 vs v0.9](reference/COMMANDS.md#v08-vs-v09)  |
| 查询完整类型定义            | [API.md](reference/API.md)                                      |

# 🛠 推荐工作流

1. **定义 Catalog** —— 注册本地 Catalog 或使用 A2UI Basic Catalog URL。
2. **注册自定义组件** —— 通过 `XCard.Box` 的 `components` prop 传入。
3. **构建 React 树** —— 用 `XCard.Box` 包裹，每个 Surface 对应一个 `XCard.Card`。
4. **注入命令** —— 将 `XAgentCommand_v0_9[]` 传入 `commands` prop（通常来自 Agent 流式响应）。
5. **处理 Action** —— 在 `onAction` 中接收 `ActionPayload`，追加新命令作为响应。

## 最小可运行示例

```tsx
import React, { useState } from 'react';
import { XCard, registerCatalog } from '@ant-design/x-card';
import type { XAgentCommand_v0_9, ActionPayload, Catalog } from '@ant-design/x-card';

// 1. 定义并注册本地 Catalog
const myCatalog: Catalog = {
  catalogId: 'local://my_catalog.json',
  components: {
    Text: {
      type: 'object',
      properties: { text: { type: 'string' }, variant: { type: 'string' } },
      required: ['text'],
    },
    Button: {
      type: 'object',
      properties: { text: { type: 'string' }, action: {} },
      required: ['text'],
    },
  },
};
registerCatalog(myCatalog);

// 2. 自定义组件实现
const Text: React.FC<{ text: string; variant?: string }> = ({ text, variant }) => (
  <p className={`text-${variant ?? 'body'}`}>{text}</p>
);

const Button: React.FC<{ text: string; onAction?: (ctx: any) => void; action?: any }> = ({
  text,
  onAction,
  action,
}) => <button onClick={() => onAction?.(action?.event?.context ?? {})}>{text}</button>;

// 3. 构建命令（来自 Agent 流）
const commands: XAgentCommand_v0_9[] = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'welcome',
      catalogId: 'local://my_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'welcome',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'btn'] },
        { id: 'title', component: 'Text', text: { path: '/user/name' }, variant: 'h1' },
        {
          id: 'btn',
          component: 'Button',
          text: '开始',
          action: { event: { name: 'start', context: {} } },
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'welcome',
      path: '/user/name',
      value: 'Alice',
    },
  },
];

// 4. 渲染
export default function App() {
  const [cmdQueue, setCmdQueue] = useState<XAgentCommand_v0_9[]>(commands);

  const handleAction = (payload: ActionPayload) => {
    console.log('Action:', payload.name, payload.context);
    // 根据 Agent 响应追加新命令
    setCmdQueue((prev) => [...prev /* 新命令 */]);
  };

  return (
    <XCard.Box commands={cmdQueue} components={{ Text, Button }} onAction={handleAction}>
      <XCard.Card id="welcome" />
    </XCard.Box>
  );
}
```

# 🚨 开发规则

- **每条命令必须包含 `"version": "v0.9"`** —— 缺少会导致协议拒绝。
- **每个 Surface 有且仅有一个 `id: "root"` 组件** —— 这是组件树的根节点。
- **只用扁平邻接表** —— 不要把组件对象嵌套在其他组件对象内；子组件只能通过 `id` 字符串引用。
- **结构与数据分离** —— `updateComponents` 负责布局，`updateDataModel` 负责内容/状态。
- **挂载前先注册 Catalog** —— 在组件树渲染之前调用 `registerCatalog()`。
- **`components` map 传给 `XCard.Box`，而不是 `XCard.Card`** —— Box 负责向所有 Card 分发。
- **不要内联重建 `components` 对象** —— 用 `useMemo` 或模块级常量保持稳定，避免不必要的重渲染。
- **表单输入组件必须用 `value: { path: "..." }` 双向绑定** —— 字面量值不会更新数据模型。
- **流式场景**：追加新命令到数组而不是替换整个数组 —— Card 会增量处理差异。
- **`action.event.context` 中的路径是写入目标** —— 它们指向用户输入数据在数据模型中的存储位置，不要作为读取来源解析。
- **Action context 中的 path 引用会被自动解析** —— 触发 action 时，X-Card 会自动将 action 配置中的 `{ path: "xxx" }` 转换为 `{ value: "实际值" }` 格式。这适用于 v0.9（`action.event.context = { key: { path } }`）和 v0.8（`action.context = [{ key, value: { path } }]`）两种格式。
- **v0.8 的 `action.context` 是数组格式** —— `[{ key, value: { path } }]`，与 v0.9 的对象格式 `{ key: { path } }` 不同，混用会导致 action 数据丢失。

# 🤝 技能协作

| 场景                         | 技能组合                                 |
| ---------------------------- | ---------------------------------------- |
| AI 对话 + 结构化卡片响应     | `use-x-chat` + `x-components` + `x-card` |
| 独立的 Agent 表单 UI         | 仅 `x-card`                              |
| 流式 Markdown + 卡片侧边栏   | `x-markdown` + `x-card`                  |
| HTTP 流式 Agent 数据注入卡片 | `x-request` → 将响应作为命令传入         |

# 🔗 参考资源

- [USAGE.md](reference/USAGE.md) —— 配置指南、流式模式、多 Surface 示例
- [COMMANDS.md](reference/COMMANDS.md) —— 四种 A2UI v0.9 命令类型，v0.8 vs v0.9 差异
- [DATA_BINDING.md](reference/DATA_BINDING.md) —— JSON Pointer 路径、动态类型、双向绑定、模板迭代
- [ACTIONS.md](reference/ACTIONS.md) —— Action 定义、ActionPayload、表单提交模式
- [CATALOG.md](reference/CATALOG.md) —— 本地 Catalog 注册、远程 URL 加载、自定义组件 Schema
- [API.md](reference/API.md) —— Box、Card、命令、Catalog、Action 的完整 TypeScript 类型

## 官方文档

- [A2UI 是什么](https://a2ui.org/introduction/what-is-a2ui/)
- [A2UI v0.9 规范](https://a2ui.org/specification/v0.9-a2ui/)
- [概念：数据绑定](https://a2ui.org/concepts/data-binding/)
- [概念：Catalog](https://a2ui.org/concepts/catalogs/)
- [指南：Agent 开发](https://a2ui.org/guides/agent-development/)
- [GitHub：google/A2UI](https://github.com/google/A2UI)
