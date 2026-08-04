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
import { Alert, Button, Descriptions, Divider, Flex, Segmented, Tag, Typography } from 'antd';
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

const App = () => {
  const isCN = typeof location !== 'undefined' && location.pathname.endsWith('-cn');
  const [scenario, setScenario] = React.useState<DemoScenario>('approval');
  const [provider] = React.useState(() => new InteractionProvider());
  const [pendingAction, setPendingAction] = React.useState<string>();
  const [lastResult, setLastResult] = React.useState<AgentActionResult>();
  const [actionError, setActionError] = React.useState<string>();
  const { agentState, agentActions, commandStates, onRequest, isRequesting } = useXChat({
    provider,
  });

  const run = Object.values(agentState.runs).at(-1);
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

  return (
    <Flex vertical gap={16}>
      <Flex gap={8} wrap>
        <Segmented
          value={scenario}
          disabled={isRequesting}
          options={[
            { label: isCN ? '审批' : 'Approval', value: 'approval' },
            { label: isCN ? '工具重试' : 'Tool retry', value: 'retry' },
            { label: isCN ? '取消运行' : 'Run cancel', value: 'cancel' },
          ]}
          onChange={(value) => setScenario(value as DemoScenario)}
        />
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          disabled={isRequesting}
          onClick={start}
        >
          {isCN ? '启动 Run' : 'Start Run'}
        </Button>
      </Flex>

      <Descriptions size="small" column={{ xs: 1, sm: 3 }}>
        <Descriptions.Item label="Run ID">{run?.id ?? '-'}</Descriptions.Item>
        <Descriptions.Item label={isCN ? '运行状态' : 'Run status'}>
          {run ? <Tag color={statusColor[run.status]}>{run.status}</Tag> : '-'}
        </Descriptions.Item>
        <Descriptions.Item label={isCN ? '最近命令' : 'Last command'}>
          {lastResult?.commandId ?? '-'}
        </Descriptions.Item>
      </Descriptions>

      {approval && (
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

      {tools.length > 0 && (
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

      {task && (
        <Flex gap={8} align="center" wrap>
          <Typography.Text>{task.title}</Typography.Text>
          <Tag color={statusColor[task.status]}>{task.status}</Tag>
          <Typography.Text type="secondary">
            {Math.round((task.progress ?? 0) * 100)}%
          </Typography.Text>
        </Flex>
      )}

      {run?.status === 'running' && (
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

      {actionError && <Alert type="error" showIcon message={actionError} />}

      <Divider style={{ margin: 0 }} />
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
            <Typography.Text type="secondary">{isCN ? '暂无命令' : 'No commands'}</Typography.Text>
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
                  <Typography.Text code>{entry.kind}</Typography.Text>
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
    </Flex>
  );
};

export default App;
