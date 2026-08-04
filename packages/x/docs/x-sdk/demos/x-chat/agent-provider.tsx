import {
  FileTextOutlined,
  RobotOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { BubbleListProps, ThoughtChainItemType } from '@ant-design/x';
import { Bubble, Prompts, Sender, ThoughtChain } from '@ant-design/x';
import type {
  AgentEntityStatus,
  AgentMessageState,
  AgentProvider,
  AgentProviderCapabilities,
  AgentProviderContextOptions,
  AgentState,
  AgentTransport,
} from '@ant-design/x-sdk';
import { useXChat } from '@ant-design/x-sdk';
import { Avatar, Badge, Divider, Flex, Grid, Progress, Segmented, Tag, Typography } from 'antd';
import React from 'react';

interface DemoInput {
  prompt: string;
  locale: 'en-US' | 'zh-CN';
  outcome: 'success' | 'failure';
}

type DemoChunk =
  | { type: 'reasoning.delta'; delta: string }
  | { type: 'reasoning.completed'; summary: string }
  | { type: 'task.created'; title: string; description: string }
  | { type: 'task.updated'; progress: number }
  | { type: 'task.completed'; result: unknown }
  | { type: 'tool.requested'; name: string; arguments: string }
  | { type: 'tool.running' }
  | { type: 'tool.completed'; result: unknown }
  | { type: 'artifact.created'; name: string; mediaType: string }
  | { type: 'artifact.completed'; content: string }
  | { type: 'message.delta'; delta: string }
  | { type: 'message.completed' };

interface DemoContext {
  events: AgentProviderContextOptions['events'];
  input?: DemoInput;
  reasoningOpen: boolean;
  toolOpen: boolean;
  taskOpen: boolean;
  artifactOpen: boolean;
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
        summary: isCN
          ? '已拆解目标，准备检索资料并生成摘要。'
          : 'Plan ready: research and draft a summary.',
      },
      {
        type: 'task.created',
        title: isCN ? '整理调研摘要' : 'Prepare research brief',
        description: isCN
          ? '检索资料、提炼要点并生成文档'
          : 'Search, synthesize, and generate a document',
      },
      { type: 'task.updated', progress: 20 },
      {
        type: 'tool.requested',
        name: 'knowledge.search',
        arguments: JSON.stringify({ query: request.prompt }),
      },
      { type: 'tool.running' },
      {
        type: 'tool.completed',
        result: { matches: 6, source: 'local-fixture' },
      },
      { type: 'task.updated', progress: 72 },
      {
        type: 'artifact.created',
        name: isCN ? '调研摘要.md' : 'research-brief.md',
        mediaType: 'text/markdown',
      },
      {
        type: 'artifact.completed',
        content: isCN
          ? '# 调研摘要\n\n已整理 3 条关键结论。'
          : '# Research brief\n\nThree findings ready.',
      },
      { type: 'task.completed', result: { findings: 3 } },
      {
        type: 'message.delta',
        delta: isCN
          ? '调研已完成。我从本地知识库筛选了 6 条资料，'
          : 'Research complete. I reviewed six local sources ',
      },
      {
        type: 'message.delta',
        delta: isCN
          ? '提炼出 3 条关键结论，并生成了可继续编辑的调研摘要。'
          : 'and distilled three findings into an editable research brief.',
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
      'task.created',
      'task.updated',
      'task.completed',
      'task.failed',
      'task.cancelled',
      'artifact.created',
      'artifact.completed',
      'artifact.failed',
    ],
    transports: ['demo.async-iterable'],
  };
  readonly transport = new DemoTransport();

  createContext(options: AgentProviderContextOptions): DemoContext {
    return {
      events: options.events,
      reasoningOpen: false,
      toolOpen: false,
      taskOpen: false,
      artifactOpen: false,
      messageOpen: false,
    };
  }

  start(input: DemoInput, context: DemoContext) {
    context.input = input;
    context.reasoningOpen = true;
    context.messageOpen = true;
    return [
      context.events.create('run.started', { input }),
      context.events.create('message.started', {
        messageId: 'user-message',
        role: 'user',
        content: input.prompt,
      }),
      context.events.create('message.completed', { messageId: 'user-message' }),
      context.events.create('message.started', {
        messageId: 'assistant-message',
        role: 'assistant',
      }),
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
      case 'task.created':
        context.taskOpen = true;
        return [
          events.create('task.created', {
            taskId: 'research-task',
            title: chunk.title,
            description: chunk.description,
          }),
        ];
      case 'task.updated':
        return [
          events.create('task.updated', {
            taskId: 'research-task',
            progress: chunk.progress / 100,
          }),
        ];
      case 'task.completed':
        context.taskOpen = false;
        return [events.create('task.completed', { taskId: 'research-task', result: chunk.result })];
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
      case 'artifact.created':
        context.artifactOpen = true;
        return [
          events.create('artifact.created', {
            artifactId: 'research-brief',
            name: chunk.name,
            mediaType: chunk.mediaType,
          }),
        ];
      case 'artifact.completed':
        context.artifactOpen = false;
        return [
          events.create('artifact.completed', {
            artifactId: 'research-brief',
            content: chunk.content,
            version: 1,
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
    if (context.taskOpen) {
      events.push(
        isAbort
          ? context.events.create('task.cancelled', {
              taskId: 'research-task',
              reason: 'Run cancelled',
            })
          : context.events.create('task.failed', {
              taskId: 'research-task',
              error: agentError,
            }),
      );
    }
    if (context.artifactOpen) {
      events.push(
        context.events.create('artifact.failed', {
          artifactId: 'research-brief',
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

const toThoughtStatus = (status: AgentEntityStatus): ThoughtChainItemType['status'] => {
  if (status === 'completed') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'cancelled') return 'abort';
  return 'loading';
};

const getRunEntities = <T extends { runId: string }>(
  entities: Readonly<Record<string, T>>,
  runId: string,
) => Object.values(entities).filter((entity) => entity.runId === runId);

const AgentResponse = ({
  agentState,
  isCN,
  message,
}: {
  agentState: AgentState;
  isCN: boolean;
  message: AgentMessageState;
}) => {
  const reasoning = getRunEntities(agentState.reasoning, message.runId).at(-1);
  const tool = getRunEntities(agentState.toolCalls, message.runId).at(-1);
  const task = getRunEntities(agentState.tasks, message.runId).at(-1);
  const artifact = getRunEntities(agentState.artifacts, message.runId).at(-1);
  const run = agentState.runs[message.runId];
  const answer = contentToText(message.content);

  const chainItems: ThoughtChainItemType[] = [
    reasoning && {
      key: 'reasoning',
      title: isCN ? '分析任务' : 'Analyze request',
      description: reasoning.summary || reasoning.content,
      status: toThoughtStatus(reasoning.status),
      icon: <ThunderboltOutlined />,
    },
    task && {
      key: 'task',
      title: task.title,
      description: task.description,
      status: toThoughtStatus(task.status),
      content: (
        <Progress
          percent={task.status === 'completed' ? 100 : Math.round((task.progress ?? 0) * 100)}
          showInfo={false}
          size="small"
          status={task.status === 'failed' ? 'exception' : undefined}
        />
      ),
    },
    tool && {
      key: 'tool',
      title: isCN ? '检索本地知识库' : 'Search local knowledge',
      description: tool.name,
      status: toThoughtStatus(tool.status),
      icon: <SearchOutlined />,
      collapsible: true,
      content: (
        <Typography.Text type="secondary">
          {tool.status === 'completed'
            ? isCN
              ? '找到 6 条相关资料'
              : 'Found six relevant sources'
            : tool.arguments}
        </Typography.Text>
      ),
    },
    artifact && {
      key: 'artifact',
      title: isCN ? `生成 ${artifact.name}` : `Create ${artifact.name}`,
      description: artifact.mediaType,
      status: toThoughtStatus(artifact.status),
      icon: <FileTextOutlined />,
    },
  ].filter(Boolean) as ThoughtChainItemType[];

  return (
    <Flex vertical gap={12} style={{ minWidth: 0 }}>
      <Flex align="center" gap={8} wrap>
        <Badge status={run ? statusMap[run.status] : 'processing'} />
        <Typography.Text strong>Agent Runtime</Typography.Text>
        <Tag variant="filled">{run?.status ?? 'running'}</Tag>
      </Flex>
      {chainItems.length > 0 && <ThoughtChain items={chainItems} line="solid" />}
      {answer && (
        <>
          <Divider style={{ margin: 0 }} />
          <Typography.Paragraph style={{ margin: 0 }}>{answer}</Typography.Paragraph>
        </>
      )}
      {message.status === 'failed' && (
        <Typography.Text type="danger">{message.error?.message}</Typography.Text>
      )}
      {message.status === 'cancelled' && (
        <Typography.Text type="secondary">
          {isCN ? '本次运行已取消。' : 'This run was cancelled.'}
        </Typography.Text>
      )}
    </Flex>
  );
};

const App = () => {
  const screens = Grid.useBreakpoint();
  const isCN = typeof location !== 'undefined' && location.pathname.endsWith('-cn');
  const [content, setContent] = React.useState('');
  const [outcome, setOutcome] = React.useState<DemoInput['outcome']>('success');
  const [provider] = React.useState(() => new DemoAgentProvider());
  const { messages, agentState, onRequest, abort, isRequesting } = useXChat({ provider });

  const submit = (prompt: string) => {
    if (!prompt.trim() || isRequesting) return;
    onRequest({ prompt, locale: isCN ? 'zh-CN' : 'en-US', outcome });
    setContent('');
  };

  const promptItems = [
    {
      key: 'research',
      icon: <SearchOutlined />,
      label: isCN ? '调研 Agent UI 的设计趋势' : 'Research Agent UI trends',
      description: isCN ? '检索资料并生成摘要' : 'Search and create a brief',
    },
    {
      key: 'compare',
      icon: <FileTextOutlined />,
      label: isCN ? '整理 Provider 方案对比' : 'Compare Provider approaches',
      description: isCN ? '输出结构化结论' : 'Produce structured findings',
    },
  ];

  const role: BubbleListProps['role'] = {
    ai: {
      placement: 'start',
      avatar: screens.sm ? <Avatar icon={<RobotOutlined />} /> : undefined,
      variant: 'filled',
      style: { maxWidth: '100%' },
      styles: {
        content: {
          maxWidth: screens.sm ? 680 : '100%',
          width: screens.sm ? 'min(680px, 100%)' : '100%',
        },
      },
    },
    user: { placement: 'end' },
  };

  const bubbleItems: BubbleListProps['items'] = messages.length
    ? messages.map(({ id, message, status }) => ({
        key: id,
        role: message.role === 'user' ? 'user' : 'ai',
        content:
          message.role === 'user' ? (
            contentToText(message.content)
          ) : (
            <AgentResponse agentState={agentState} isCN={isCN} message={message} />
          ),
        status,
      }))
    : [
        {
          key: 'welcome',
          role: 'ai',
          content: (
            <Flex vertical gap={12}>
              <div>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {isCN ? '你好，我是本地研究 Agent' : 'Hi, I am a local research agent'}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {isCN
                    ? '选择一个任务，查看推理、工具、任务和产物如何在聊天中实时更新。'
                    : 'Pick a task to see reasoning, tools, tasks, and artifacts update in chat.'}
                </Typography.Text>
              </div>
              <Prompts
                vertical
                items={promptItems}
                onItemClick={({ data }) => submit(String(data.label))}
                styles={{ item: { borderRadius: 6 } }}
              />
            </Flex>
          ),
        },
      ];

  return (
    <Flex vertical gap={12}>
      <Bubble.List
        autoScroll
        role={role}
        style={{ height: screens.sm ? 460 : 420 }}
        styles={{ scroll: { paddingInline: screens.sm ? 4 : 0 } }}
        items={bubbleItems}
      />

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
        styles={{ input: { border: 'none', boxShadow: 'none', outline: 'none' } }}
        onSubmit={submit}
      />
    </Flex>
  );
};

export default App;
