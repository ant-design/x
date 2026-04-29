## zh-CN

演示 X-Card 在触发 action 时自动解析 context 中的 path 引用为实际值。

当组件触发 action 时（如提交表单），X-Card 会自动将 action 配置中的 `{ path: "xxx" }` 格式转换为 `{ value: "实际值" }` 格式，方便外部直接使用解析后的值。

## en-US

Demonstrates X-Card automatically resolving path references in action context to actual values when an action is triggered.

When a component triggers an action (like submitting a form), X-Card will automatically convert the `{ path: "xxx" }` format in the action configuration to `{ value: "actual_value" }` format, making it convenient for external code to use the resolved values directly.
