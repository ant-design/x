# RFC：Approval 组件

> 状态：提议目标包：`@ant-design/x` 依赖：[x-sdk Agent Interaction Runtime](./x-sdk-agent-interaction.zh-CN.md) 关联规划：[第二阶段详细系分](../roadmap/phase-2-breakdown.zh-CN.md) 更新日期：2026-08-03

## 1. 摘要

新增 `Approval` 受控组件，用于在 Agent 执行敏感工具前向用户展示操作说明、风险和待执行数据，并支持允许、拒绝、修改后执行三种决策。

组件只提交决策意图，不直接产生 `approval.resolved` Event，不执行工具，也不实现权限系统。Runtime 接受命令并返回事件后，组件才展示最终决策状态。

```text
approval.requested Event
  -> AgentApprovalState
  -> ApprovalViewModel
  -> <Approval />
  -> onResolve(decision, data)
  -> agentActions.resolveApproval
  -> approval.resolve Command
  -> Runtime
  -> approval.resolved Event
```

## 2. 问题

第一阶段已有：

- `approval.requested` 和 `approval.resolved` Event。
- `AgentApprovalState` 的 description、risk、data、decision 和 status。
- ToolCall 与 Approval 通过 `toolCallId` 关联。

当前没有解决：

- 用户如何安全地提交决策。
- 修改后执行的数据由谁维护和校验。
- 高风险操作如何醒目但不过度打扰。
- 命令提交中如何防止重复决策。
- Runtime 已处理、Run 已取消或审批过期时如何禁用。
- Command 失败和业务拒绝如何区分。
- 焦点、键盘和 Screen Reader 如何工作。

## 3. 目标

- 提供允许、拒绝、修改后执行三种明确决策。
- 支持 low、medium、high 风险展示。
- 支持受控修改值、自定义编辑器和同步/异步校验。
- 将 Command 提交状态与 Approval Runtime 状态分离。
- 防止重复提交和基于过期版本提交。
- 支持过期、已处理、取消和错误展示。
- 与 `AgentApprovalState` 结构兼容，但不硬依赖 `@ant-design/x-sdk`。
- 满足键盘、焦点、Screen Reader 和 WCAG 2.1 AA 基础要求。

## 4. 非目标

- 不实现企业权限中心、角色系统或长期授权。
- 不提供“一直允许此工具”的默认能力。
- 不实现通用 JSON Schema 表单引擎。
- 不在组件中执行工具。
- 不记录完整审计日志，只提供必要回调和展示状态。
- 不自动批准 low-risk 操作。
- 不在前端判断 Runtime 是否真的完成了审批。

## 5. 用户体验

### 5.1 默认结构

```text
[高风险] Agent 请求执行退款

将为订单 20260803001 退款 128.00 元。

待执行参数
订单号  20260803001
金额    128.00

[拒绝] [修改后执行] [允许]
```

### 5.2 决策流程

允许：

```text
点击允许 -> submitting -> 等待 Runtime Event -> approved
```

拒绝：

```text
点击拒绝 -> 可选填写原因 -> submitting -> rejected
```

修改后执行：

```text
进入编辑态 -> 修改数据 -> 本地校验 -> 提交 modified Command
  -> Runtime 再校验 -> approval.resolved(modified)
```

### 5.3 状态

| 状态        | 含义                                       | 是否可操作 |
| ----------- | ------------------------------------------ | ---------- |
| waiting     | 等待用户决策                               | 是         |
| submitting  | Command 正在提交                           | 否         |
| approved    | Runtime 已允许                             | 否         |
| rejected    | Runtime 已拒绝                             | 否         |
| modified    | Runtime 已接受修改值                       | 否         |
| expired     | 审批已过期                                 | 否         |
| cancelled   | Run 已取消                                 | 否         |
| submitError | Command 提交失败，Runtime 状态仍是 waiting | 可重新提交 |

`submitting` 和 `submitError` 属于 Command State；其他状态来自 Approval ViewModel。

## 6. 公开 API

### 6.1 ViewModel

```ts
export type ApprovalRisk = 'low' | 'medium' | 'high' | (string & {});
export type ApprovalDecision = 'approved' | 'rejected' | 'modified';
export type ApprovalStatus =
  'waiting' | 'approved' | 'rejected' | 'modified' | 'expired' | 'cancelled';

export interface ApprovalItem<Data = unknown> {
  id: React.Key;
  title?: React.ReactNode;
  description?: React.ReactNode;
  risk?: ApprovalRisk;
  data?: Data;
  decision?: ApprovalDecision;
  status: ApprovalStatus;
  editable?: boolean;
  expiresAt?: number;
  version?: string | number;
  toolName?: string;
}
```

### 6.2 Props

```ts
export type ApprovalSemanticType =
  'root' | 'header' | 'risk' | 'title' | 'description' | 'content' | 'editor' | 'error' | 'actions';

export interface ApprovalResolveInfo<Data> {
  decision: ApprovalDecision;
  data?: Data;
  version?: string | number;
}

export interface ApprovalEditorInfo<Data> {
  value: Data | undefined;
  onChange: (value: Data) => void;
  error?: React.ReactNode;
  disabled: boolean;
}

export interface ApprovalProps<Data = unknown> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'title'
> {
  item: ApprovalItem<Data>;
  submitting?: boolean;
  submitError?: React.ReactNode;
  value?: Data;
  defaultValue?: Data;
  onValueChange?: (value: Data) => void;
  validate?: (value: Data | undefined) => React.ReactNode | Promise<React.ReactNode>;
  editorRender?: (info: ApprovalEditorInfo<Data>) => React.ReactNode;
  dataRender?: (data: Data | undefined, item: ApprovalItem<Data>) => React.ReactNode;
  onResolve?: (info: ApprovalResolveInfo<Data>) => void;
  actionRender?: (info: {
    item: ApprovalItem<Data>;
    defaultActions: React.ReactNode;
  }) => React.ReactNode;
  classNames?: Partial<Record<ApprovalSemanticType, string>>;
  styles?: Partial<Record<ApprovalSemanticType, React.CSSProperties>>;
  prefixCls?: string;
  rootClassName?: string;
}
```

## 7. API 行为

### 7.1 受控原则

- `item.status` 只由调用方更新。
- `submitting` 和 `submitError` 来自 Command State。
- 修改值支持 `value` 受控和 `defaultValue` 非受控模式。
- 点击动作只触发 `onResolve`，组件不自行改成 approved/rejected/modified。
- `onResolve` 缺失时所有决策按钮禁用。

### 7.2 修改后执行

显示条件：

```text
item.status === 'waiting'
item.editable === true
editorRender 存在
```

提交顺序：

1. 进入编辑态时以 `value ?? item.data` 初始化。
2. 点击提交后调用 `validate`。
3. 校验返回内容时阻止提交并显示错误。
4. 校验通过后触发 `onResolve({ decision: 'modified', data, version })`。
5. Runtime 必须再次校验，前端校验不是安全边界。

### 7.3 过期

- `expiresAt` 只用于倒计时和及时禁用。
- 客户端到期后停止提交，但不伪造 `approval.resolved(expired)`。
- Runtime 返回过期事件后，调用方把 `item.status` 更新为 expired。
- 客户端时间与 Runtime 冲突时以 Runtime Event 为准。

### 7.4 重复提交

- `submitting` 时所有动作禁用。
- 同一次用户决策使用稳定 `idempotencyKey`。
- submitError 后重试沿用原幂等键，除非用户修改了决策或数据。
- Runtime 返回已处理错误时，调用方刷新 Approval 状态，不继续提交。

## 8. 与 x-sdk 的连接

```tsx
const item = experimentalAgent.selectApproval(agentState, {
  runId,
  approvalId,
});

const commandState = getApprovalCommandState(commandStates, approvalId);

<Approval
  item={item}
  submitting={commandState?.status === 'submitting'}
  submitError={commandState?.error?.message}
  editorRender={renderRefundEditor}
  validate={validateRefund}
  onResolve={({ decision, data, version }) =>
    agentActions.resolveApproval({
      runId,
      approvalId,
      decision,
      data,
      expectedVersion: version,
    })
  }
/>;
```

阶段一状态增量：

```ts
interface AgentApprovalState {
  // 已有字段保持不变
  editable?: boolean;
  expiresAt?: number;
  version?: string | number;
}
```

对应 `approval.requested` payload 增加同名可选字段，保持旧 Provider 兼容。

## 9. 风险展示

| 风险   | 默认表现                              | 行为                     |
| ------ | ------------------------------------- | ------------------------ |
| low    | 中性标签                              | 仍需明确点击允许         |
| medium | 警告标签和说明                        | 允许按钮保持主操作       |
| high   | danger 标签、风险说明和更明确按钮文案 | 不提供快捷批准或长期授权 |
| 未知值 | 中性“未知风险”                        | 不按 low-risk 处理       |

风险不能只用颜色表达，必须同时有文本或图标标签。

## 10. 数据与安全

- 默认数据渲染只支持安全文本和格式化 JSON。
- 不使用 `dangerouslySetInnerHTML` 渲染 Runtime 数据。
- `dataRender` 和 `editorRender` 的安全责任由调用方承担。
- 错误信息不默认展示堆栈、Token、认证信息和完整请求头。
- 组件不缓存长期授权和敏感参数。
- 修改值通过 `expectedVersion` 防止基于旧审批提交。
- 高风险操作必须保留 Runtime 侧权限和参数校验。

## 11. 交互与无障碍

- 根节点使用有名称的 `role="region"`。
- 风险说明通过 `aria-describedby` 关联决策操作。
- 三个决策使用原生 button，拒绝不是仅图标按钮。
- 首次进入编辑态后聚焦第一个可编辑控件，由 editor 提供 focus target。
- 校验失败时聚焦错误摘要，并通过 `aria-live="assertive"` 播报一次。
- submitting 使用 `aria-busy="true"`，按钮保持原位置，避免布局变化。
- 状态完成后将焦点移到结果摘要；组件卸载时由调用方决定焦点回退。
- Escape 退出编辑态但不自动拒绝。
- 仅用 Tab、Shift+Tab、Enter、Space、Escape 可完成操作。

## 12. Design Token

```ts
interface ApprovalToken {
  lowRiskColor: string;
  mediumRiskColor: string;
  highRiskColor: string;
  headerBg: string;
  contentBg: string;
  actionGap: number;
  editorGap: number;
}
```

按钮、Alert、Typography、边框、圆角和间距优先复用 Ant Design 全局 Token。

## 13. 文件改动

```text
packages/x/components/approval/
├── Approval.tsx
├── interface.ts
├── index.tsx
├── style/index.ts
├── demo/
│   ├── basic.tsx
│   ├── risk.tsx
│   ├── modify.tsx
│   └── controlled.tsx
├── __tests__/
│   ├── index.test.tsx
│   └── a11y.test.tsx
├── index.zh-CN.md
└── index.en-US.md
```

同时修改组件总出口、主题 Token 类型、XProvider 组件配置和包导出测试。

## 14. 测试计划

### 14.1 单元与组件测试

- waiting、approved、rejected、modified、expired、cancelled 状态。
- low、medium、high 和未知风险。
- 允许、拒绝、修改三种回调 payload。
- 受控/非受控修改值。
- 同步/异步校验通过、失败和异常。
- submitting 防重复点击，submitError 后可重试。
- expiresAt 到期禁用但不伪造 Event。
- Runtime 状态先于 Command Promise 返回时保持一致。
- 自定义 data/editor/action renderer。
- 键盘、焦点、RTL 和 `jest-axe`。

### 14.2 集成测试

- `approval.requested` 可映射到 waiting Approval。
- approved/rejected/modified Event 正确关闭操作区。
- Command 失败不改变 AgentApprovalState。
- 相同幂等键不会触发两次 Runtime 副作用。
- expectedVersion 冲突显示可恢复错误并刷新状态。
- 关联 ToolCall 完成后 Approval 与 Timeline 一致。

## 15. 备选方案

### 15.1 使用 Modal.confirm

不作为核心实现。审批是 Agent Timeline 中可持续存在的实体，不应只存在于瞬时弹窗；业务方仍可在 `actionRender` 中增加二次确认。

### 15.2 内置 JSON Schema 表单

P0 不采用。它会把阶段三的 Schema、Catalog 和安全治理提前引入；首版使用 editorRender 和 validate。

### 15.3 点击后前端直接 dispatch resolved Event

不采用。前端点击只是意图，Runtime 可能拒绝、超时或已处理，直接写 Event 会破坏事实一致性。

## 16. 验收标准

- 允许、拒绝、修改后执行三条路径都经过 Command -> Runtime -> Event。
- Command 状态与 Approval Runtime 状态严格分离。
- high-risk 操作没有自动批准和长期授权入口。
- 修改值在前端与 Runtime 两侧均可校验，并携带版本。
- 重复点击、超时、已处理和网络失败均有确定行为。
- 键盘、焦点、Screen Reader、RTL、SSR 和 WCAG 基础门禁通过。
- 不新增 `@ant-design/x` 到 `@ant-design/x-sdk` 的硬依赖。
