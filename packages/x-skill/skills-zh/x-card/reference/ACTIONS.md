# Actions 参考

本文档介绍用户交互如何通过 `onAction` 从组件流回 Agent。实现按钮处理器、表单提交或任何用户交互时阅读本文档。

---

## Action 流程

```
组件（Button 点击）
  → Card 解析 action.event.context 中的路径
  → Card 调用 onAction(ActionPayload)
  → XCard.Box 转发到你的 onAction 处理器
  → 你的代码向 Agent 发送新命令 / 更新 cmdQueue
```

---

## ActionPayload

```typescript
interface ActionPayload {
  name: string; // 来自 action.event.name
  surfaceId: string; // 触发动作的 Surface
  /**
   * 触发 Action 时当前 Surface 的完整 dataModel 快照。
   * 这是整个数据模型，不只是 action.event.context 中定义的字段。
   */
  context: Record<string, any>;
}
```

---

## 在组件上定义 Action

```json
{
  "id": "submit_btn",
  "component": "Button",
  "text": "提交",
  "action": {
    "event": {
      "name": "submit_form",
      "context": {
        "email": { "path": "/form/email" },
        "name": { "path": "/form/name" },
        "subscribe": { "path": "/form/subscribe" }
      }
    }
  }
}
```

用户点击按钮时，`onAction` 收到：

```typescript
{
  name: 'submit_form',
  surfaceId: 'contact_form',
  // context 是当前 Surface 完整的 dataModel 快照
  context: {
    form: {
      email: 'alice@example.com',
      name: 'Alice',
      subscribe: true
    },
    ui: { loading: false }
    // ... 数据模型中的所有字段
  }
}

// 从 context 中取值时，按照数据模型结构访问：
// payload.context.form.email
// payload.context.form.name
```

---

## 在 React 中处理 Action

```tsx
const handleAction = (payload: ActionPayload) => {
  if (payload.name === 'submit_form') {
    // context 是完整的 dataModel 快照，按数据模型结构取值
    const { email, name } = payload.context.form;
    // 1. 调用 Agent API
    // 2. 追加新命令作为响应
    setCmdQueue(prev => [
      ...prev,
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: payload.surfaceId,
          components: [
            { id: 'root', component: 'Text', text: `感谢 ${name}！确认邮件已发送至 ${email}。` }
          ]
        }
      }
    ]);
  }
};

<XCard.Box commands={cmdQueue} onAction={handleAction} components={...}>
  <XCard.Card id="contact_form" />
</XCard.Box>
```

---

## 表单提交模式

完整的表单提交闭环（含验证）：

```tsx
// 1. Agent 发送表单结构
const formCommands: XAgentCommand_v0_9[] = [
  { version: 'v0.9', createSurface: { surfaceId: 'form', catalogId: 'local://cat.json' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'root', component: 'Column', children: ['email_input', 'submit_btn'] },
        {
          id: 'email_input',
          component: 'TextField',
          label: '邮箱',
          value: { path: '/form/email' },
          checks: [
            { call: 'required', args: { value: { path: '/form/email' } }, message: '邮箱不能为空' },
            { call: 'email', args: { value: { path: '/form/email' } }, message: '邮箱格式不正确' },
          ],
        },
        {
          id: 'submit_btn',
          component: 'Button',
          text: '提交',
          action: { event: { name: 'submit', context: { email: { path: '/form/email' } } } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'form', path: '/form', value: { email: '' } } },
];

// 2. 处理提交（context 是完整 dataModel 快照）
const handleAction = async (payload: ActionPayload) => {
  if (payload.name === 'submit') {
    // 显示加载状态
    setCmdQueue((prev) => [
      ...prev,
      { version: 'v0.9', updateDataModel: { surfaceId: 'form', path: '/ui/loading', value: true } },
    ]);
    // 调用 Agent 处理，返回后展示结果
    const result = await callAgent(payload.context);
    setCmdQueue((prev) => [
      ...prev,
      {
        version: 'v0.9',
        updateDataModel: { surfaceId: 'form', path: '/ui/loading', value: false },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'form',
          components: [{ id: 'root', component: 'Text', text: `完成：${result}` }],
        },
      },
    ]);
  }
};
```

---

## 客户端函数 Action

纯本地操作（不需要服务端往返）：

```json
{
  "id": "link_btn",
  "component": "Button",
  "text": "打开文档",
  "action": {
    "functionCall": {
      "call": "openUrl",
      "args": { "url": "https://a2ui.org" }
    }
  }
}
```

内置函数：`openUrl`、`formatString`、`formatNumber`、`formatDate`、`formatCurrency`、`pluralize`、`and`、`or`、`not`。

---

## Button 上的校验 checks

带 `checks` 的 Button 在条件不满足时自动禁用：

```json
{
  "id": "submit_btn",
  "component": "Button",
  "text": "提交",
  "checks": [
    {
      "condition": {
        "call": "and",
        "args": {
          "values": [
            { "call": "required", "args": { "value": { "path": "/form/name" } } },
            { "call": "email", "args": { "value": { "path": "/form/email" } } }
          ]
        }
      },
      "message": "姓名和有效邮箱均为必填项"
    }
  ],
  "action": {
    "event": {
      "name": "submit",
      "context": { "name": { "path": "/form/name" }, "email": { "path": "/form/email" } }
    }
  }
}
```

> ⚠️ `action.event.context` 中的路径是**写入目标**，指向用户输入数据在数据模型中的存储位置。Card 在 Action 触发时通过读取数据模型来解析这些路径——不要将其误认为读取绑定来源。
