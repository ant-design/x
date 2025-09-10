---
group:
  order: 2
  title: 智能体接入
title: 百宝箱
order: 1
---

这篇指南将介绍如何在使用 Ant Design X 搭建的应用中接入百宝箱智能体服务。

## 相关文档

- 百宝箱开放平台概述 - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview)
- 授权管理 - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token)
- OpenAPI - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview)

## 使用 Open API

```tsx
import { TboxClient } from 'tbox-nodejs-sdk';
import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';

const tboxClient = new TboxClient({
  httpClientConfig: {
    authorization: 'TBox-Token-xxx', // 替换真实 token
  },
});

const ChatDemo = () => {
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess }) => {
      const stream = tboxClient.chat({
        appId: '2025*****xxx', // 替换真实 AppID
        query: message,
        userId: '用户唯一标识',
      });

      let content = '';
      stream.on('data', (data) => {
        content += JSON.stringify(data);
        onUpdate(content);
      });
      stream.on('end', () => onSuccess(content));
    },
  });

  const { onRequest, messages } = useXChat({ agent });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Bubble.List
        items={messages.map((msg) => ({
          key: msg.id,
          content: msg.message,
        }))}
      />
      <Sender onSubmit={onRequest} />
    </div>
  );
};
```
