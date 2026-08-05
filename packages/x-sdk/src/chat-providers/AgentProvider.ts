import type { AgentCommand, AgentCommandType } from '../agent/command';
import type {
  AgentEvent,
  AgentEventFactory,
  AgentEventProtocolVersion,
  AgentEventType,
} from '../agent/protocol';

export type AgentTransportKind = 'sse' | 'websocket' | 'async-iterable' | `${string}.${string}`;

export interface AgentProviderCapabilities {
  eventTypes: readonly AgentEventType[];
  transports: readonly AgentTransportKind[];
  commands?: readonly AgentCommandType[];
  resumable?: boolean;
  extensions?: Readonly<Record<`${string}.${string}`, unknown>>;
}

export interface AgentCommandOptions {
  signal: AbortSignal;
  initialSequence: number;
  now?: () => number;
}

export interface AgentRunOptions {
  sessionId: string;
  runId: string;
  signal?: AbortSignal;
  initialSequence?: number;
  now?: () => number;
  createEventId?: (sequence: number, type: AgentEventType) => string;
}

export interface AgentProviderContextOptions extends AgentRunOptions {
  events: AgentEventFactory;
}

export interface AgentProvider<Input, Request, Chunk, Context = unknown> {
  readonly id: string;
  readonly protocol: {
    readonly name: 'agent-event';
    readonly version: AgentEventProtocolVersion;
  };
  readonly capabilities: AgentProviderCapabilities;
  readonly transport: AgentTransport<Request, Chunk>;

  createContext(options: AgentProviderContextOptions): Context;
  start(input: Input, context: Context): readonly AgentEvent[];
  prepareRequest(input: Input, context: Context): Request;
  transformChunk(chunk: Chunk, context: Context): readonly AgentEvent[];
  flush(context: Context): readonly AgentEvent[];
  transformError(error: unknown, context: Context): readonly AgentEvent[];
  classifyError?(error: unknown, context: Context): { retryable: boolean };
  executeCommand?(command: AgentCommand, options: AgentCommandOptions): AsyncIterable<AgentEvent>;
}

export interface AgentTransport<Request, Chunk> {
  readonly kind: AgentTransportKind;
  open(request: Request, signal: AbortSignal): AsyncIterable<Chunk>;
}

export interface RunAgentProviderOptions<Input, Request, Chunk, Context> {
  provider: AgentProvider<Input, Request, Chunk, Context>;
  input: Input;
  run: AgentRunOptions;
  onEvent: (event: AgentEvent) => void;
}

export interface RunAgentCommandOptions {
  provider: AgentProvider<any, any, any, any>;
  command: AgentCommand;
  signal?: AbortSignal;
  initialSequence: number;
  now?: () => number;
  onEvent: (event: AgentEvent) => void;
}

export function isAgentProvider(value: unknown): value is AgentProvider<unknown, unknown, unknown> {
  if (!value || typeof value !== 'object') return false;
  const protocol = (value as Partial<AgentProvider<unknown, unknown, unknown>>).protocol;
  return protocol?.name === 'agent-event';
}
