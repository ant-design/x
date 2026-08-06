## zh-CN

这个 Demo 用三个本地场景展示同一条交互链路：Agent Event 先把待处理状态交给 SDK，用户操作再发送 Agent Command，Provider 返回的新事件最终更新实体状态。

- 审批：`approval.requested` -> `approval.resolve` -> `approval.resolved`
- 工具重试：`tool.failed` -> `tool.retry` -> `tool.completed`
- 取消运行：`task.updated` -> `run.cancel` -> `run.cancelled`

页面上方展示当前应执行的操作和三步进度，下方的 SDK 内部状态用于核对 Command States 与 AgentTimeline。

## en-US

This demo uses three local scenarios to show the same interaction flow: an Agent Event first puts actionable state into the SDK, a user action sends an Agent Command, and the Provider's next event updates the entity state.

- Approval: `approval.requested` -> `approval.resolve` -> `approval.resolved`
- Tool retry: `tool.failed` -> `tool.retry` -> `tool.completed`
- Run cancellation: `task.updated` -> `run.cancel` -> `run.cancelled`

The main area presents the current action and its three-step progress. The SDK state section below exposes Command States and AgentTimeline for verification.
