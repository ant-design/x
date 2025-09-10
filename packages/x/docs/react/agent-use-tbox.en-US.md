---
group:
  order: 2
  title: Agent Integration
title: Tbox
order: 1
---

This guide will introduce how to integrate the agent service provided by Tbox into an application built with Ant Design X.

## Documentation

- Tbox Open platform - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview)
- Tbox Open Token - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token)
- OpenAPI - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview)

## Use Open API

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
