---
group:
  order: 2
  title: 智能体接入
title: 百宝箱
tag: Updated
order: 1
---

这篇指南将介绍如何在使用 Ant Design X 搭建的应用中接入百宝箱智能体服务。

## 相关文档

- 百宝箱开放平台官网 - [https://tbox.cn/open](https://tbox.cn/open)
- 百宝箱开放平台概述 - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview)
- 授权管理 - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token)
- OpenAPI - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview)

### tbox-nodejs-sdk

```ts
import { TboxClient } from 'tbox-nodejs-sdk';

const client = new TboxClient({
  httpClientConfig: {
    authorization: 'Tbox-your-token-xxx',
  },
});

const stream = client.chat({
  appId: 'your-app-id',
  query: '今天杭州天气怎么样？',
  userId: 'user123',
});

stream.on('data', (data) => {
  console.log('Received data:', data);
});

stream.on('end', () => {
  console.log('Stream ended');
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});
```

## 使用 X SDK 接入 tbox-nodejs-sdk

使用URL接入智能体是 X SDK提供的基础能力，详情请查看[X SDK](/x-sdks/introduce-cn)，百宝箱完整样板间请查看[样板间-百宝箱](/docs/playground/agent-tbox-cn)。

### 示例

<code src="./demo/tbox.tsx" title="使用X SDK接入"></code>
