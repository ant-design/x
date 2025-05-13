---
group:
  title: Model Integration
title: Others
order: 2
---

Currently, there is no standard protocol defining a "model interface specification," which can lead to compatibility issues between different protocols.

To address this, **X** provides tools to help developers resolve protocol compatibility issues.

## Stream Parsing Tool

`XStream` parses `ReadableStream` data using the SSE protocol by default.

```tsx
import { XStream } from '@ant-design/x';

async function request() {
  const response =
    await fetch();
    // ...
  // .....

  for await (const chunk of XStream({
    readableStream: response.body,
  })) {
    // Your protocol
    console.log(chunk);
  }
}
```

## Request Tool

`XRequest` allows you to pass a custom `fetch` function for request customization.

```tsx
import { XRequest } from '@ant-design/x';

const request = XRequest({
  fetch: yourFetchFn,
});

request.create();
```
