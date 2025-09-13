---
group:
  order: 2
  title: Agent Integration
title: TBox
order: 1
---

This guide introduces how to integrate TBox agent services into applications built with Ant Design X.

## Related Documentation

- TBox Open Platform Overview - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_overview)
- Authorization Management - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_open_token)
- OpenAPI - [https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview](https://alipaytbox.yuque.com/sxs0ba/doc/tbox_openapi_overview)

### tbox-nodejs-sdk

```ts
import { TboxClient } from 'tbox-nodejs-sdk';

const client = new TboxClient({
  httpClientConfig: {
    authorization: 'TBox-your-token-xxx',
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

## Integrate tbox-nodejs-sdk with X SDK

Using URL to integrate agents is a basic capability provided by X SDK. For details, see [X SDK](/sdks/introduce). For the complete TBox template, see [Template - TBox](/docs/playground/agent-tbox).

### Example

<code src="./demo/tbox.tsx" title="Integrate with X SDK"></code>
