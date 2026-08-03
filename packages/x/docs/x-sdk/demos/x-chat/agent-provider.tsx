import { Bubble, Sender } from '@ant-design/x';
import type {
  AgentProvider,
  AgentProviderCapabilities,
  AgentProviderContextOptions,
  AgentTransport,
} from '@ant-design/x-sdk';
import { useXChat } from '@ant-design/x-sdk';
import {
  Badge,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Grid,
  Progress,
  Segmented,
  Typography,
} from 'antd';
import React from 'react';

interface DemoInput {
  prompt: string;
  locale: 'en-US' | 'zh-CN';
  outcome: 'success' | 'failure';
}

type DemoChunk =
  | { type: 'reasoning.delta'; delta: string }
  | { type: 'reasoning.completed'; summary: string }
  | { type: 'tool.requested'; name: string; arguments: string }
  | { type: 'tool.running' }
  | { type: 'tool.completed'; result: unknown }
  | { type: 'message.started' }
  | { type: 'message.delta'; delta: string }
  | { type: 'message.completed' };

interface DemoContext {
  events: AgentProviderContextOptions['events'];
  input?: DemoInput;
  reasoningOpen: boolean;
  toolOpen: boolean;
  messageOpen: boolean;
}

const wait = (signal: AbortSignal, timeout = 360) =>
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

class DemoTransport implements AgentTransport<DemoInput, DemoChunk> {
  readonly kind = 'demo.async-iterable' as const;

  async *open(request: DemoInput, signal: AbortSignal): AsyncIterable<DemoChunk> {
    const isCN = request.locale === 'zh-CN';
    const chunks: DemoChunk[] = [
      {
        type: 'reasoning.delta',
        delta: isCN ? '识别问题目标并选择所需能力。' : 'Identify the goal and select a capability.',
      },
      {
        type: 'reasoning.completed',
        summary: isCN ? '需要查询本地知识索引。' : 'The local knowledge index is required.',
      },
      {
        type: 'tool.requested',
        name: 'knowledge.search',
        arguments: JSON.stringify({ query: request.prompt }),
      },
      { type: 'tool.running' },
      {
        type: 'tool.completed',
        result: { matches: 3, source: 'local-fixture' },
      },
      { type: 'message.started' },
      {
        type: 'message.delta',
        delta: isCN
          ? '已完成通用 Agent Provider 调用。'
          : 'The generic Agent Provider run is complete. ',
      },
      {
        type: 'message.delta',
        delta: isCN
          ? '同一套 useXChat 可以消费消息、推理和工具状态。'
          : 'The same useXChat instance consumed messages, reasoning, and tool state.',
      },
      { type: 'message.completed' },
    ];

    for (const chunk of chunks) {
      await wait(signal);
      yield chunk;
      if (request.outcome === 'failure' && chunk.type === 'tool.running') {
        await wait(signal);
        throw new Error(isCN ? '本地 Runtime 模拟失败' : 'The local Runtime simulated a failure');
      }
    }
  }
}

class DemoAgentProvider implements AgentProvider<DemoInput, DemoInput, DemoChunk, DemoContext> {
  readonly id = 'demo-agent-provider';
  readonly protocol = { name: 'agent-event', version: '0.1' } as const;
  readonly capabilities: AgentProviderCapabilities = {
    eventTypes: [
      'run.started',
      'run.completed',
      'run.failed',
      'run.cancelled',
      'message.started',
      'message.delta',
      'message.completed',
      'message.failed',
      'message.cancelled',
      'reasoning.started',
      'reasoning.delta',
      'reasoning.completed',
      'reasoning.failed',
      'reasoning.cancelled',
      'tool.requested',
      'tool.running',
      'tool.completed',
      'tool.failed',
      'tool.cancelled',
    ],
    transports: ['demo.async-iterable'],
  };
  readonly transport = new DemoTransport();

  createContext(options: AgentProviderContextOptions): DemoContext {
    return {
      events: options.events,
      reasoningOpen: false,
      toolOpen: false,
      messageOpen: false,
    };
  }

  start(input: DemoInput, context: DemoContext) {
    context.input = input;
    context.reasoningOpen = true;
    return [
      context.events.create('run.started', { input }),
      context.events.create('message.started', {
        messageId: 'user-message',
        role: 'user',
        content: input.prompt,
      }),
      context.events.create('message.completed', { messageId: 'user-message' }),
      context.events.create('reasoning.started', { reasoningId: 'reasoning' }),
    ];
  }

  prepareRequest(input: DemoInput) {
    return input;
  }

  transformChunk(chunk: DemoChunk, context: DemoContext) {
    const { events } = context;
    switch (chunk.type) {
      case 'reasoning.delta':
        return [events.create('reasoning.delta', { reasoningId: 'reasoning', delta: chunk.delta })];
      case 'reasoning.completed':
        context.reasoningOpen = false;
        return [
          events.create('reasoning.completed', {
            reasoningId: 'reasoning',
            summary: chunk.summary,
          }),
        ];
      case 'tool.requested':
        context.toolOpen = true;
        return [
          events.create('tool.requested', {
            toolCallId: 'tool-call',
            name: chunk.name,
            arguments: chunk.arguments,
          }),
        ];
      case 'tool.running':
        return [events.create('tool.running', { toolCallId: 'tool-call' })];
      case 'tool.completed':
        context.toolOpen = false;
        return [events.create('tool.completed', { toolCallId: 'tool-call', result: chunk.result })];
      case 'message.started':
        context.messageOpen = true;
        return [
          events.create('message.started', {
            messageId: 'assistant-message',
            role: 'assistant',
          }),
        ];
      case 'message.delta':
        return [
          events.create('message.delta', {
            messageId: 'assistant-message',
            delta: chunk.delta,
          }),
        ];
      case 'message.completed':
        context.messageOpen = false;
        return [events.create('message.completed', { messageId: 'assistant-message' })];
    }
  }

  flush(context: DemoContext) {
    return [
      context.events.create('run.completed', {
        output: { source: 'local-fixture' },
        usage: { inputTokens: context.input?.prompt.length ?? 0, outputTokens: 24 },
      }),
    ];
  }

  transformError(error: unknown, context: DemoContext) {
    const isAbort =
      error instanceof DOMException
        ? error.name === 'AbortError'
        : error instanceof Error && error.name === 'AbortError';
    const events = [];
    const agentError = {
      message: error instanceof Error ? error.message : String(error),
    };

    if (context.reasoningOpen) {
      events.push(
        isAbort
          ? context.events.create('reasoning.cancelled', {
              reasoningId: 'reasoning',
              reason: 'Run cancelled',
            })
          : context.events.create('reasoning.failed', {
              reasoningId: 'reasoning',
              error: agentError,
            }),
      );
    }
    if (context.toolOpen) {
      events.push(
        isAbort
          ? context.events.create('tool.cancelled', {
              toolCallId: 'tool-call',
              reason: 'Run cancelled',
            })
          : context.events.create('tool.failed', {
              toolCallId: 'tool-call',
              error: agentError,
            }),
      );
    }
    if (context.messageOpen) {
      events.push(
        isAbort
          ? context.events.create('message.cancelled', {
              messageId: 'assistant-message',
              reason: 'Run cancelled',
            })
          : context.events.create('message.failed', {
              messageId: 'assistant-message',
              error: agentError,
            }),
      );
    }
    events.push(
      isAbort
        ? context.events.create('run.cancelled', { reason: 'User cancelled the run' })
        : context.events.create('run.failed', {
            error: agentError,
          }),
    );
    return events;
  }
}

const contentToText = (content: unknown) => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .map((part) => (part && typeof part === 'object' && 'text' in part ? String(part.text) : ''))
    .join('');
};

const statusMap = {
  cancelled: 'default',
  completed: 'success',
  failed: 'error',
  running: 'processing',
} as const;

const App = () => {
  const screens = Grid.useBreakpoint();
  const isCN = typeof location !== 'undefined' && location.pathname.endsWith('-cn');
  const [content, setContent] = React.useState('');
  const [outcome, setOutcome] = React.useState<DemoInput['outcome']>('success');
  const [provider] = React.useState(() => new DemoAgentProvider());
  const { messages, agentState, onRequest, abort, isRequesting } = useXChat({ provider });

  const runs = Object.values(agentState.runs);
  const latestRun = runs[runs.length - 1];
  const reasoning = Object.values(agentState.reasoning).at(-1);
  const tool = Object.values(agentState.toolCalls).at(-1);
  const progress = !tool
    ? 0
    : tool.status === 'completed'
      ? 100
      : tool.status === 'running'
        ? 60
        : 25;

  return (
    <Flex vertical gap="middle">
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: screens.md ? 'minmax(0, 1fr) minmax(260px, 320px)' : '1fr',
        }}
      >
        <Flex vertical style={{ minWidth: 0 }}>
          {messages.length ? (
            <Bubble.List
              autoScroll
              style={{ height: 360 }}
              items={messages.map(({ id, message, status }) => ({
                key: id,
                role: message.role === 'user' ? 'user' : 'ai',
                placement: message.role === 'user' ? 'end' : 'start',
                content: contentToText(message.content),
                status,
              }))}
            />
          ) : (
            <Flex align="center" justify="center" style={{ height: 360 }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={isCN ? '暂无运行记录' : 'No runs yet'}
              />
            </Flex>
          )}
        </Flex>

        <section aria-label={isCN ? '运行状态' : 'Run state'}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            {isCN ? '运行状态' : 'Run state'}
          </Typography.Title>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={isCN ? '状态' : 'Status'}>
              {latestRun ? (
                <Badge status={statusMap[latestRun.status]} text={latestRun.status} />
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label={isCN ? '推理摘要' : 'Reasoning'}>
              {reasoning?.summary || reasoning?.content || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={isCN ? '工具' : 'Tool'}>
              {tool ? `${tool.name} · ${tool.status}` : '-'}
            </Descriptions.Item>
          </Descriptions>
          <Progress
            percent={progress}
            size="small"
            status={latestRun?.status === 'failed' ? 'exception' : undefined}
          />
          <Divider />
          <Typography.Text type="secondary">
            {isCN
              ? `事件 ${Object.keys(agentState.processedEventIds).length} · 协议问题 ${agentState.issues.length}`
              : `${Object.keys(agentState.processedEventIds).length} events · ${agentState.issues.length} protocol issues`}
          </Typography.Text>
        </section>
      </div>

      <Segmented
        block
        disabled={isRequesting}
        value={outcome}
        options={[
          { label: isCN ? '正常运行' : 'Success', value: 'success' },
          { label: isCN ? '模拟失败' : 'Failure', value: 'failure' },
        ]}
        onChange={(value) => setOutcome(value as DemoInput['outcome'])}
      />
      <Sender
        loading={isRequesting}
        value={content}
        onChange={setContent}
        onCancel={abort}
        placeholder={isCN ? '输入任务' : 'Enter a task'}
        onSubmit={(prompt) => {
          if (!prompt.trim()) return;
          onRequest({ prompt, locale: isCN ? 'zh-CN' : 'en-US', outcome });
          setContent('');
        }}
      />
    </Flex>
  );
};

export default App;
