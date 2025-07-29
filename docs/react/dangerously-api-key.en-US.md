---
group:
  title: Other
  order: 4
order: 2
title: dangerouslyApiKey Explanation
---

:::warning Please read this carefully, as it is important!!! We provide the `dangerouslyApiKey` option in `useXAgent` and `XRequest`. Here is a detailed explanation of its risks. :::

## Why is it dangerous?

Enabling the `dangerouslyApiKey` option can be risky because it exposes your secret API credentials in the client-side code. Web browsers are inherently less secure than server environments, and any user with access to the browser may inspect, extract, and misuse these credentials. This could lead to unauthorized access using your credentials and potentially jeopardize sensitive data or functionality.

## When is it not dangerous?

- **Internal tools:** If the application is used only in a trusted, controlled internal environment, the risk of credential exposure is mitigated.
- **Limited-scope public APIs:** If your API has a very limited scope, and the exposed credentials do not grant access to sensitive data or critical operations, the potential impact of exposure is reduced.
- **Development or debugging purposes:** If the credentials are temporary, not used in a production environment, or are frequently rotated, temporarily enabling this feature may be acceptable.

## References

- [Why is this dangerous?](https://github.com/openai/openai-node?tab=readme-ov-file#why-is-this-dangerous)
