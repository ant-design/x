import {
  CheckOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type {
  AgentActionResult,
  AgentCommandOptions,
  AgentProvider,
  AgentProviderCapabilities,
  AgentProviderContextOptions,
  AgentTransport,
} from '@ant-design/x-sdk';
import { experimentalAgent, useXChat } from '@ant-design/x-sdk';
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Flex,
  Segmented,
  Steps,
  Tag,
  Typography,
} from 'antd';
import React from 'react';

type DemoScenario = 'approval' | 'retry' | 'cancel';

interface DemoInput {
  scenario: DemoScenario;
  locale: 'en-US' | 'zh-CN';
}

interface DemoContext {
  events: AgentProviderContextOptions['events'];
  runId: string;
}

const wait = (signal: AbortSignal, timeout = 500) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }
    const timer = window.setTimeout(resolve, timeout);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(signal.reason ?? new DOMException('The operation was aborted.', 'AbortError'));
      },
      { once: true },
    );
  });

const waitForAbort = (signal: AbortSignal) =>
  new Promise<never>((_, reject) => {
    const abort = () =>
      reject(signal.reason ?? new DOMException('The operation was aborted.', 'AbortError'));
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
  });

class PendingTransport implements AgentTransport<DemoInput, never> {
  readonly kind = 'demo.pending' as const;

  open(_request: DemoInput, signal: AbortSignal): AsyncIterable<never> {
    return {
      [Symbol.asyncIterator]() {
        return { next: () => waitForAbort(signal) };
      },
    };
  }
}

class InteractionProvider implements AgentProvider<DemoInput, DemoInput, never, DemoContext> {
  readonly id = 'demo-agent-interaction';
  readonly protocol = { name: 'agent-event', version: '0.1' } as const;
  readonly capabilities: AgentProviderCapabilities = {
    eventTypes: [
      'run.started',
      'run.cancelled',
      'approval.requested',
      'approval.resolved',
      'tool.requested',
      'tool.running',
      'tool.completed',
      'tool.failed',
      'task.created',
      'task.updated',
      'task.cancelled',
    ],
    transports: ['demo.pending'],
    commands: ['approval.resolve', 'tool.retry', 'run.cancel'],
  };
  readonly transport = new PendingTransport();

  private readonly scenarios = new Map<string, DemoScenario>();
  private readonly resolvedApprovals = new Set<string>();
  private readonly retryCounts = new Map<string, number>();

  createContext(options: AgentProviderContextOptions): DemoContext {
    return { events: options.events, runId: options.runId };
  }

  start(input: DemoInput, context: DemoContext) {
    this.scenarios.set(context.runId, input.scenario);
    const isCN = input.locale === 'zh-CN';
    const started = context.events.create('run.started', { input });

    if (input.scenario === 'approval') {
      return [
        started,
        context.events.create('approval.requested', {
          approvalId: 'deploy-approval',
          description: isCN ? '将 2.9.0 版本部署到生产环境' : 'Deploy release 2.9.0 to production',
          risk: 'high',
          editable: true,
          version: 1,
          data: { environment: 'production', version: '2.9.0' },
        }),
      ];
    }

    if (input.scenario === 'retry') {
      return [
        started,
        context.events.create('tool.requested', {
          toolCallId: 'search-tool-1',
          name: 'knowledge.search',
          arguments: JSON.stringify({ query: 'Agent interaction protocol' }),
          attempt: 1,
        }),
        context.events.create('tool.running', { toolCallId: 'search-tool-1' }),
        context.events.create('tool.failed', {
          toolCallId: 'search-tool-1',
          error: {
            code: 'TIMEOUT',
            message: isCN ? '检索超时' : 'Search timed out',
            retryable: true,
          },
        }),
      ];
    }

    return [
      started,
      context.events.create('task.created', {
        taskId: 'long-task',
        title: isCN ? '生成发布报告' : 'Generate release report',
      }),
      context.events.create('task.updated', { taskId: 'long-task', progress: 0.35 }),
    ];
  }

  prepareRequest(input: DemoInput) {
    return input;
  }

  transformChunk(_chunk: never) {
    return [];
  }

  flush() {
    return [];
  }

  transformError() {
    return [];
  }

  async *executeCommand(command: experimentalAgent.AgentCommand, options: AgentCommandOptions) {
    const events = experimentalAgent.createAgentEventFactory({
      sessionId: command.sessionId,
      runId: command.runId,
      initialSequence: options.initialSequence,
      now: options.now,
    });

    await wait(options.signal);

    if (command.type === 'approval.resolve') {
      this.resolvedApprovals.add(command.runId);
      yield events.create('approval.resolved', {
        approvalId: command.payload.approvalId,
        decision: command.payload.decision,
        data: command.payload.data,
      });
      return;
    }

    if (command.type === 'tool.retry') {
      const attempt = (this.retryCounts.get(command.runId) ?? 1) + 1;
      this.retryCounts.set(command.runId, attempt);
      const toolCallId = `search-tool-${attempt}`;
      yield events.create('tool.requested', {
        toolCallId,
        name: 'knowledge.search',
        arguments: JSON.stringify({ query: 'Agent interaction protocol' }),
        attempt,
        retryOf: command.payload.toolCallId,
      });
      yield events.create('tool.running', { toolCallId });
      await wait(options.signal);
      yield events.create('tool.completed', {
        toolCallId,
        result: { matches: 8, source: 'local-fixture' },
      });
      return;
    }

    const scenario = this.scenarios.get(command.runId);
    if (scenario === 'approval' && !this.resolvedApprovals.has(command.runId)) {
      yield events.create('approval.resolved', {
        approvalId: 'deploy-approval',
        decision: 'expired',
      });
    }
    if (scenario === 'cancel') {
      yield events.create('task.cancelled', {
        taskId: 'long-task',
        reason: command.payload.reason,
      });
    }
    yield events.create('run.cancelled', { reason: command.payload.reason });
  }
}

const statusColor = {
  cancelled: 'default',
  completed: 'success',
  failed: 'error',
  pending: 'processing',
  running: 'processing',
  streaming: 'processing',
  submitting: 'processing',
  succeeded: 'success',
  waiting: 'warning',
} as const;

const scenarioProtocol = {
  approval: {
    command: 'approval.resolve',
    resultEvent: 'approval.resolved',
    startEvent: 'approval.requested',
  },
  cancel: {
    command: 'run.cancel',
    resultEvent: 'run.cancelled',
    startEvent: 'task.updated',
  },
  retry: {
    command: 'tool.retry',
    resultEvent: 'tool.completed',
    startEvent: 'tool.failed',
  },
} as const;

const App = () => {
  const isCN = typeof location !== 'undefined' && location.pathname.endsWith('-cn');
  const [scenario, setScenario] = React.useState<DemoScenario>('approval');
  const [conversationIndex, setConversationIndex] = React.useState(0);
  const [isResetting, setIsResetting] = React.useState(false);
  const [provider] = React.useState(() => new InteractionProvider());
  const [pendingAction, setPendingAction] = React.useState<string>();
  const [lastResult, setLastResult] = React.useState<AgentActionResult>();
  const [actionError, setActionError] = React.useState<string>();
  const { agentState, agentActions, commandStates, onRequest } = useXChat({
    provider,
    conversationKey: `agent-command-demo-${conversationIndex}`,
  });

  const latestRun = Object.values(agentState.runs).at(-1);
  const run = isResetting ? undefined : latestRun;

  React.useEffect(() => {
    if (isResetting && !latestRun) {
      setIsResetting(false);
    }
  }, [isResetting, latestRun]);

  const approval = run
    ? experimentalAgent.selectApproval(agentState, {
        runId: run.id,
        approvalId: 'deploy-approval',
      })
    : undefined;
  const tools = run
    ? Object.values(agentState.toolCalls).filter((tool) => tool.runId === run.id)
    : [];
  const task = run
    ? Object.values(agentState.tasks).find((item) => item.runId === run.id)
    : undefined;
  const commands = Object.values(commandStates).filter(
    (command) => !run || command.command.runId === run.id,
  );
  const timeline = run ? experimentalAgent.selectAgentTimeline(agentState, { runId: run.id }) : [];
  const protocol = scenarioProtocol[scenario];
  const commandState = commands.at(-1);
  const interactionCompleted = Boolean(lastResult);
  const currentStep = !run ? 0 : interactionCompleted ? 2 : 1;

  const scenarioTitle = {
    approval: isCN ? '生产发布需要人工审批' : 'Production deployment needs approval',
    cancel: isCN ? '长任务仍在执行' : 'A long-running task is in progress',
    retry: isCN ? '知识检索工具执行失败' : 'The knowledge search tool failed',
  }[scenario];
  const scenarioDescription = {
    approval: isCN
      ? 'Agent 发起高风险操作前暂停，等待用户批准或拒绝。'
      : 'The Agent pauses before a high-risk action and waits for a decision.',
    cancel: isCN
      ? 'Agent 正在生成发布报告，用户可以主动终止整个 Run。'
      : 'The Agent is generating a release report and the user can stop the Run.',
    retry: isCN
      ? '第一次调用因超时失败，用户可以要求 Agent 重新执行工具。'
      : 'The first call timed out and the user can ask the Agent to run the tool again.',
  }[scenario];
  const resultMessage = {
    approval:
      approval?.decision === 'approved'
        ? isCN
          ? '发布审批已批准'
          : 'Deployment approved'
        : isCN
          ? '发布审批已拒绝'
          : 'Deployment rejected',
    cancel: isCN ? 'Run 和关联任务均已取消' : 'The Run and its task were cancelled',
    retry: isCN ? '第二次工具调用执行成功' : 'The second tool call succeeded',
  }[scenario];

  const runAction = async (key: string, action: () => Promise<AgentActionResult>) => {
    setPendingAction(key);
    setActionError(undefined);
    try {
      setLastResult(await action());
    } catch (error) {
      setActionError(error instanceof Error ? error.message : String(error));
    } finally {
      setPendingAction(undefined);
    }
  };

  const start = () => {
    setLastResult(undefined);
    setActionError(undefined);
    onRequest({ scenario, locale: isCN ? 'zh-CN' : 'en-US' });
  };

  const reset = () => {
    setIsResetting(true);
    setConversationIndex((current) => current + 1);
    setLastResult(undefined);
    setActionError(undefined);
    setPendingAction(undefined);
  };

  return (
    <Flex vertical gap={20}>
      <Segmented
        block
        value={scenario}
        disabled={Boolean(run) || isResetting}
        options={[
          { label: isCN ? '审批' : 'Approval', value: 'approval' },
          { label: isCN ? '工具重试' : 'Tool retry', value: 'retry' },
          { label: isCN ? '取消运行' : 'Run cancel', value: 'cancel' },
        ]}
        onChange={(value) => setScenario(value as DemoScenario)}
      />

      <Steps
        size="small"
        current={currentStep}
        status={actionError ? 'error' : 'process'}
        items={[
          { title: isCN ? 'Agent 发起交互' : 'Agent requests action' },
          { title: isCN ? '用户发送命令' : 'User sends command' },
          { title: isCN ? '状态完成更新' : 'State is updated' },
        ]}
      />

      {!run && (
        <Alert
          showIcon
          type="info"
          title={scenarioTitle}
          description={
            <Flex vertical gap={12} align="flex-start">
              <Typography.Text>{scenarioDescription}</Typography.Text>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={isResetting}
                onClick={start}
              >
                {isCN ? '启动场景' : 'Start scenario'}
              </Button>
            </Flex>
          }
        />
      )}

      {run && !interactionCompleted && (
        <Flex vertical gap={12}>
          <Flex gap={8} align="center" wrap>
            <Tag color="blue">Agent Event</Tag>
            <Typography.Text code>{protocol.startEvent}</Typography.Text>
            <Typography.Text type="secondary">
              {isCN ? '已更新到 SDK 状态' : 'received by SDK state'}
            </Typography.Text>
          </Flex>

          {approval && !interactionCompleted && (
            <Flex vertical gap={8}>
              <Typography.Text strong>{approval.description}</Typography.Text>
              <Flex gap={8} align="center" wrap>
                <Tag color={statusColor[approval.status]}>{approval.status}</Tag>
                <Tag color="red">{approval.risk}</Tag>
                {approval.status === 'waiting' && (
                  <>
                    <Button
                      icon={<CheckOutlined />}
                      loading={pendingAction === 'approve'}
                      onClick={() =>
                        void runAction('approve', () =>
                          agentActions.resolveApproval({
                            runId: approval.runId,
                            approvalId: approval.id,
                            decision: 'approved',
                            expectedVersion: approval.version,
                          }),
                        )
                      }
                    >
                      {isCN ? '批准' : 'Approve'}
                    </Button>
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      loading={pendingAction === 'reject'}
                      onClick={() =>
                        void runAction('reject', () =>
                          agentActions.resolveApproval({
                            runId: approval.runId,
                            approvalId: approval.id,
                            decision: 'rejected',
                            expectedVersion: approval.version,
                          }),
                        )
                      }
                    >
                      {isCN ? '拒绝' : 'Reject'}
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
          )}

          {scenario === 'retry' && tools.length > 0 && !interactionCompleted && (
            <Flex vertical gap={8}>
              {tools.map((tool) => (
                <Flex key={tool.id} justify="space-between" align="center" gap={12} wrap>
                  <Flex vertical gap={2} style={{ minWidth: 0 }}>
                    <Flex gap={8} align="center" wrap>
                      <Typography.Text>{tool.name}</Typography.Text>
                      <Tag color={statusColor[tool.status]}>{tool.status}</Tag>
                    </Flex>
                    <Typography.Text type="secondary">
                      {`attempt: ${tool.attempt ?? 1}${tool.retryOf ? `, retryOf: ${tool.retryOf}` : ''}`}
                    </Typography.Text>
                  </Flex>
                  {tool.status === 'failed' && tool.error?.retryable && (
                    <Button
                      icon={<RedoOutlined />}
                      loading={pendingAction === `retry-${tool.id}`}
                      onClick={() =>
                        void runAction(`retry-${tool.id}`, () =>
                          agentActions.retryTool({ runId: tool.runId, toolCallId: tool.id }),
                        )
                      }
                    >
                      {isCN ? '重试' : 'Retry'}
                    </Button>
                  )}
                </Flex>
              ))}
            </Flex>
          )}

          {scenario === 'cancel' && task && !interactionCompleted && (
            <Flex gap={8} align="center" wrap>
              <Typography.Text>{task.title}</Typography.Text>
              <Tag color={statusColor[task.status]}>{task.status}</Tag>
              <Typography.Text type="secondary">
                {Math.round((task.progress ?? 0) * 100)}%
              </Typography.Text>
            </Flex>
          )}

          {scenario === 'cancel' && run.status === 'running' && !interactionCompleted && (
            <Button
              danger
              icon={<StopOutlined />}
              loading={pendingAction === 'cancel'}
              onClick={() =>
                void runAction('cancel', () =>
                  agentActions.cancelRun({ runId: run.id, reason: 'Cancelled from the demo' }),
                )
              }
            >
              {isCN ? '取消 Run' : 'Cancel Run'}
            </Button>
          )}

          <Typography.Text type="secondary">
            {isCN ? '下一步将发送' : 'Next command'}{' '}
            <Typography.Text code>{protocol.command}</Typography.Text>
          </Typography.Text>
        </Flex>
      )}

      {interactionCompleted && (
        <Alert
          showIcon
          type="success"
          title={resultMessage}
          description={
            <Flex vertical gap={4}>
              <Typography.Text>
                <Tag color="green">Agent Command</Tag>
                <Typography.Text code>{protocol.command}</Typography.Text>{' '}
                {isCN ? '执行成功' : 'succeeded'}
              </Typography.Text>
              <Typography.Text>
                <Tag color="blue">Agent Event</Tag>
                <Typography.Text code>{protocol.resultEvent}</Typography.Text>{' '}
                {isCN ? '已更新实体状态' : 'updated the entity state'}
              </Typography.Text>
              <Button icon={<RedoOutlined />} onClick={reset}>
                {isCN ? '体验其他场景' : 'Try another scenario'}
              </Button>
            </Flex>
          }
        />
      )}

      {actionError && <Alert type="error" showIcon title={actionError} />}

      {run && (
        <>
          <Divider style={{ margin: 0 }} />
          <Typography.Title level={5} style={{ margin: 0 }}>
            {isCN ? 'SDK 内部状态' : 'SDK state'}
          </Typography.Title>
          <Descriptions size="small" column={{ xs: 1, sm: 3 }}>
            <Descriptions.Item label="Run ID">{run.id}</Descriptions.Item>
            <Descriptions.Item label={isCN ? '运行状态' : 'Run status'}>
              <Tag color={statusColor[run.status]}>{run.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={isCN ? '命令 ID' : 'Command ID'}>
              {lastResult?.commandId ?? commandState?.command.commandId ?? '-'}
            </Descriptions.Item>
          </Descriptions>
          <Flex gap={24} wrap>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <Typography.Title level={5}>{isCN ? '命令状态' : 'Command states'}</Typography.Title>
              {commands.length ? (
                <Flex vertical gap={8}>
                  {commands.map((command) => (
                    <Flex
                      key={command.key}
                      justify="space-between"
                      align="center"
                      gap={8}
                      style={{ width: '100%' }}
                    >
                      <Typography.Text code>{command.command.type}</Typography.Text>
                      <Tag color={statusColor[command.status]}>{command.status}</Tag>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Typography.Text type="secondary">
                  {isCN ? '暂无命令' : 'No commands'}
                </Typography.Text>
              )}
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <Typography.Title level={5}>AgentTimeline</Typography.Title>
              {timeline.length ? (
                <Flex vertical gap={8}>
                  {timeline.map((entry) => (
                    <Flex
                      key={`${entry.kind}:${entry.entity.runId}:${entry.entity.id}`}
                      justify="space-between"
                      align="center"
                      gap={8}
                      style={{ width: '100%' }}
                    >
                      <Typography.Text code>
                        {entry.kind}:{entry.entity.id}
                      </Typography.Text>
                      <Tag color={statusColor[entry.entity.status]}>{entry.entity.status}</Tag>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Typography.Text type="secondary">
                  {isCN ? '暂无实体事件' : 'No entity events'}
                </Typography.Text>
              )}
            </div>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default App;
