# 使用指南

本文档涵盖基础配置、多 Surface 模式和流式渐进渲染。需要端到端集成示例时阅读本文档。

---

## 基础配置

最小可运行配置：

```tsx
import React, { useState } from 'react';
import { XCard, registerCatalog } from '@ant-design/x-card';
import type { XAgentCommand_v0_9, ActionPayload, Catalog } from '@ant-design/x-card';

// 1. 定义 Catalog
const catalog: Catalog = {
  catalogId: 'local://basic.json',
  components: {
    Text: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
    Column: { type: 'object', properties: { children: {} } },
    Button: {
      type: 'object',
      properties: { text: { type: 'string' }, action: {} },
      required: ['text'],
    },
  },
};
registerCatalog(catalog);

// 2. 自定义组件实现
const components = {
  Text: ({ text }: { text: string }) => <p>{text}</p>,
  Column: ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
  ),
  Button: ({ text, onAction, action }: any) => (
    <button onClick={() => onAction?.(action?.event?.context ?? {})}>{text}</button>
  ),
};

// 3. 构建初始命令
const initialCommands: XAgentCommand_v0_9[] = [
  { version: 'v0.9', createSurface: { surfaceId: 'main', catalogId: 'local://basic.json' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'main',
      components: [
        { id: 'root', component: 'Column', children: ['greeting', 'btn'] },
        { id: 'greeting', component: 'Text', text: { path: '/name' } },
        {
          id: 'btn',
          component: 'Button',
          text: '打招呼',
          action: { event: { name: 'greet', context: {} } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'main', path: '/name', value: 'Alice' } },
];

// 4. 渲染组件
export default function App() {
  const [cmds, setCmds] = useState(initialCommands);

  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'greet') {
      setCmds((prev) => [
        ...prev,
        { version: 'v0.9', updateDataModel: { surfaceId: 'main', path: '/name', value: 'Bob' } },
      ]);
    }
  };

  return (
    <XCard.Box commands={cmds} components={components} onAction={handleAction}>
      <XCard.Card id="main" />
    </XCard.Box>
  );
}
```

---

## 多 Surface 配置

一个 Box 管理多个独立 Surface：

```tsx
export default function MultiSurface() {
  const [cmds, setCmds] = useState<XAgentCommand_v0_9[]>([
    // Surface 1
    { version: 'v0.9', createSurface: { surfaceId: 'profile', catalogId: 'local://cat.json' } },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'profile',
        components: [{ id: 'root', component: 'Text', text: { path: '/user/name' } }],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: { surfaceId: 'profile', path: '/user/name', value: 'Alice' },
    },

    // Surface 2
    { version: 'v0.9', createSurface: { surfaceId: 'cart', catalogId: 'local://cat.json' } },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'cart',
        components: [{ id: 'root', component: 'Text', text: { path: '/total' } }],
      },
    },
    { version: 'v0.9', updateDataModel: { surfaceId: 'cart', path: '/total', value: '¥42.00' } },
  ]);

  return (
    <XCard.Box commands={cmds} components={components}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <XCard.Card id="profile" />
        <XCard.Card id="cart" />
      </div>
    </XCard.Box>
  );
}
```

---

## 流式渲染

随 Agent 流式响应逐步追加命令：

```tsx
export default function StreamingDemo() {
  const [cmds, setCmds] = useState<XAgentCommand_v0_9[]>([]);

  const startStream = async () => {
    // 第一步：立即创建 Surface
    setCmds([
      { version: 'v0.9', createSurface: { surfaceId: 'results', catalogId: 'local://cat.json' } },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'results',
          components: [
            { id: 'root', component: 'Column', children: ['loading', 'list'] },
            { id: 'loading', component: 'Text', text: { path: '/ui/status' } },
            {
              id: 'list',
              component: 'List',
              children: { path: '/items', componentId: 'item_tmpl' },
            },
            { id: 'item_tmpl', component: 'Text', text: { path: 'name' } },
          ],
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'results',
          value: { ui: { status: '加载中...' }, items: [] },
        },
      },
    ]);

    // 第二步：逐步推入数据
    for (let i = 0; i < 5; i++) {
      await delay(500);
      setCmds((prev) => [
        ...prev,
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'results',
            path: `/items/${i}`,
            value: { name: `条目 ${i + 1}` },
          },
        },
      ]);
    }

    // 第三步：完成
    setCmds((prev) => [
      ...prev,
      {
        version: 'v0.9',
        updateDataModel: { surfaceId: 'results', path: '/ui/status', value: '加载完成！' },
      },
    ]);
  };

  return (
    <div>
      <button onClick={startStream}>开始</button>
      <XCard.Box commands={cmds} components={components}>
        <XCard.Card id="results" />
      </XCard.Box>
    </div>
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

---

## 保持 `components` prop 稳定

保持 `components` map 稳定，避免不必要的重渲染：

```tsx
// ✅ 模块级常量 —— 始终稳定
const COMPONENTS = { Text, Button, Column, Card };

// ✅ 依赖为静态时用 useMemo
const components = useMemo(() => ({ Text, Button }), []);

// ❌ 内联对象 —— 每次渲染重新创建，导致 Card 重新挂载
<XCard.Box components={{ Text, Button }} ...>
```

---

## 销毁

交互完成后发送 `deleteSurface` 进行清理：

```tsx
const teardown = () => {
  setCmds((prev) => [...prev, { version: 'v0.9', deleteSurface: { surfaceId: 'main' } }]);
};
```
