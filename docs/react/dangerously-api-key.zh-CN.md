---
group:
  title: 其他
  order: 4
order: 2
title: dangerouslyApiKey 说明
tag: New
---

<!-- prettier-ignore -->
:::warning
请认真阅读，这很重要 !!! 我们在 `useXAgent` 、 `XRequest` 里提供了 `dangerouslyApiKey` 这里对其做一个详细的说明。
:::

## 为什么危险 ？

启用此 `dangerouslyApiKey` 选项可能会很危险，因为它会在客户端代码中暴露您的秘密 API 凭据。Web 浏览器本质上不如服务器环境安全，任何有权访问浏览器的用户都可能检查、提取和滥用这些凭据。这可能会导致使用您的凭据进行未经授权的访问，并可能危及敏感数据或功能。

## 什么时候这才不会危险呢？

- 内部工具：如果应用程序仅在用户受信任的受控内部环境中使用，则可以减轻凭证暴露的风险。
- 范围有限的公共 API：如果您的 API 范围非常有限，并且公开的凭据不授予对敏感数据或关键操作的访问权限，则公开的潜在影响就会降低。
- 开发或调试目的：如果凭证的有效期是短暂的、不在生产环境中使用或者经常轮换，那么暂时启用此功能可能是可以接受的。

## 参考文献

- [Why is this dangerous?](https://github.com/openai/openai-node?tab=readme-ov-file#why-is-this-dangerous)
