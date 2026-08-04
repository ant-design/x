---
order: 3
title: Surface Runtime
---

`experimentalRuntime` 是协议无关的 Headless Surface 状态层。它先把 A2UI v0.8/v0.9 输入归一化为事务，再经过 Catalog、组件属性、图结构和容量限制校验，最后以不可变快照提交。渲染层只订阅快照，不直接信任 Agent 输入。

> 当前 Runtime 通过 `experimentalRuntime` 命名空间导出，API 在稳定前可能调整。

## 快速开始

```typescript
import { experimentalRuntime } from '@ant-design/x-card';

const CATALOG_ID = 'local://booking';
const catalogs = experimentalRuntime.createSurfaceCatalogRegistry({
  catalogs: [
    {
      $id: CATALOG_ID,
      components: {
        Text: {
          type: 'object',
          required: ['text'],
          properties: { text: {} },
          additionalProperties: false,
        },
      },
    },
  ],
});

const runtime = experimentalRuntime.createSurfaceRuntime({
  catalogs,
  adapters: [experimentalRuntime.a2uiV09Adapter],
  limits: { maxNodesPerSurface: 1000, historyLimit: 8 },
  onIssue: (issue) => reportSurfaceIssue(issue),
});

const result = await runtime.dispatchBatch([
  {
    protocol: 'a2ui',
    version: 'v0.9',
    payload: {
      version: 'v0.9',
      createSurface: { surfaceId: 'booking', catalogId: CATALOG_ID },
    },
  },
  {
    protocol: 'a2ui',
    version: 'v0.9',
    payload: {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'booking',
        components: [{ id: 'root', component: 'Text', text: 'Ready' }],
      },
    },
  },
]);

if (!result.accepted) console.error(result.issue);
```

`dispatchBatch` 具备原子语义：任一输入解码、Catalog 或状态转换失败，整个批次都不会提交，订阅者继续看到最后一个有效快照。

## A2UI v0.8

v0.8 的 Catalog 不在协议命令中携带，因此创建适配器时必须绑定：

```typescript
const runtime = experimentalRuntime.createSurfaceRuntime({
  catalogs,
  adapters: [experimentalRuntime.createA2UIV08Adapter({ catalogId: CATALOG_ID })],
});

await runtime.dispatch({
  protocol: 'a2ui',
  version: 'v0.8',
  payload: {
    surfaceUpdate: {
      surfaceId: 'booking',
      components: [{ id: 'root', component: { Text: { text: { literalString: 'Ready' } } } }],
    },
  },
});
```

这里的 `version` 属于 Runtime 输入信封，用于选择适配器；v0.8 的 `payload` 本身仍保持旧协议格式。

## 订阅与回滚

React 可通过 `useSyncExternalStore(runtime.subscribe, runtime.getSnapshot)` 订阅。快照包含 `surfaces`，每个 Surface 提供 `status`、`revision`、`rootId`、`nodes` 和 `dataModel`。

```typescript
const surface = runtime.getSurface('booking');
const previous = runtime.rollback('booking');
const selected = runtime.rollback('booking', 3);
```

回滚会恢复历史内容，并生成一个大于当前值的新 revision，不会复用旧 revision。

## Runtime API

| 方法                             | 说明                              |
| -------------------------------- | --------------------------------- |
| `dispatch(input)`                | 归一化、校验并提交一个协议输入    |
| `dispatchBatch(inputs)`          | 原子提交一组协议输入              |
| `rollback(surfaceId, revision?)` | 恢复上一快照或指定历史 revision   |
| `getSnapshot()`                  | 获取全部 Surface 的当前不可变快照 |
| `getSurface(surfaceId)`          | 获取单个 Surface 快照             |
| `subscribe(listener)`            | 订阅成功提交和回滚                |
| `dispose()`                      | 停止 Runtime 并释放订阅与历史记录 |

## Catalog Registry API

| 方法                            | 说明                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `register(catalog)`             | 注册本地 Catalog                                       |
| `get(catalogId)`                | 同步读取已注册 Catalog                                 |
| `resolve(catalogId)`            | 读取本地 Catalog，或通过 `loader` 去重加载远程 Catalog |
| `validateNode(catalogId, node)` | 校验组件白名单、必填属性和额外属性                     |
| `clear()`                       | 清空已注册项和待处理加载                               |

Catalog Loader 返回的 `$id` / `catalogId` 必须与请求标识一致。当前属性校验覆盖白名单、`required`、`properties` 和 `additionalProperties`，不是完整 JSON Schema 实现。

## 错误与限制

拒绝结果通过 `SurfaceDispatchResult.issue` 返回，阶段分为 `decode`、`catalog` 和 `reduce`。常见错误码包括 `unsupported_protocol`、`invalid_command`、`component_not_allowed`、`schema_validation_failed`、`revision_conflict`、`graph_invariant_failed` 和 `limit_exceeded`。

可通过 `limits` 配置单 Surface 节点数、图深度、单事务操作数和历史长度。生产环境应将 `onIssue` 接入日志或可观测平台，并在组件层为失败 Surface 提供错误边界。

## 版本选择

新接入建议使用 v0.9。v0.8 适配器用于存量流量兼容；两者会归一化为相同的 `SurfaceTransaction` 和 `SurfaceSnapshot`，因此渲染器无需维护两套状态模型。完整交互可分别查看 [v0.8 生产级 Runtime](/x-cards/a2ui-v-0-8-cn) 和 [v0.9 生产级 Runtime](/x-cards/a2ui-v-0-9-cn)。
