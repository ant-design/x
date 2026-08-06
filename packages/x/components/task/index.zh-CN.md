---
category: Components
group:
  title: 确认
  order: 1
title: Task
subtitle: 任务
description: 展示 Agent 长任务的状态、进度、结果与失败信息。
tag: 2.9.0
---

## 何时使用

- 展示由 Agent 创建并持续更新的长任务。
- 在对话或执行时间线中呈现任务进度、完成结果、错误或取消原因。
- `Task` 只负责单个任务实体的展示；任务编排使用 `ThoughtChain`，多任务时间线由应用层组合。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/status.tsx">任务状态</code>
<code src="./demo/controlled.tsx">受控展开</code>
<code src="./demo/custom-render.tsx">自定义渲染</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### TaskProps

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| item | 任务展示模型 | [TaskItem](#taskitem) | - |
| expanded | 是否展开详情，受控模式 | boolean | - |
| defaultExpanded | 默认是否展开；未设置时根据状态决定 | boolean | - |
| onExpandedChange | 展开状态变化回调 | (expanded: boolean) => void | - |
| statusRender | 自定义状态图标 | (status: TaskStatus, item: TaskItem) => ReactNode | - |
| progressRender | 自定义进度区域 | (progress: number, item: TaskItem) => ReactNode | - |
| resultRender | 自定义结果 | (result: unknown, item: TaskItem) => ReactNode | - |
| errorRender | 自定义错误 | (error: TaskError, item: TaskItem) => ReactNode | - |
| actions | 自定义操作区 | ReactNode \| (item: TaskItem) => ReactNode | - |
| classNames | 语义化结构类名 | Record&lt;SemanticDOM, string&gt; | - |
| styles | 语义化结构样式 | Record&lt;SemanticDOM, CSSProperties&gt; | - |
| prefixCls | 样式类名前缀 | string | - |
| rootClassName | 根节点样式类 | string | - |

### TaskItem

```typescript
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface TaskItem {
  id: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: TaskStatus;
  progress?: number;
  result?: unknown;
  error?: TaskError;
  reason?: React.ReactNode;
}
```

`progress` 使用 `0` 到 `1` 的比例，与 `AgentTaskState.progress` 保持一致。完成态始终展示为 100%。

`running` 和 `failed` 默认展开，其他状态默认收起；状态变化时，非受控组件会切换到新状态的默认展开方式。只有存在自定义内容、结果、错误或取消原因时才显示展开按钮。

对象结果使用安全序列化，循环引用会显示类型摘要。真实任务执行、取消与重试由应用层或 Agent Command 负责，可通过 `actions` 注入相应操作。

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Task"></ComponentTokenTable>
