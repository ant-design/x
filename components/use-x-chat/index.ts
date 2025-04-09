import { useEvent } from 'rc-util';
import React from 'react';
import { AnyObject } from '../_util/type';
import { XAgent } from '../use-x-agent';
import { XRequestParams } from '../x-request';
import { XStreamOptions } from '../x-stream';
import useSyncState from './useSyncState';

export type SimpleType = string | number | boolean | object;

export type MessageStatus = 'local' | 'loading' | 'success' | 'error';

type RequestPlaceholderFn<Message extends SimpleType> = (
  message: Message,
  info: { messages: Message[] },
) => Message;

type RequestFallbackFn<Message extends SimpleType> = (
  message: Message,
  info: { error: Error; messages: Message[] },
) => Message | Promise<Message>;

type TransformMessageFn<Message> = (info: {
  originMessage?: Message;
  currentMessage: any;
  status: MessageStatus;
}) => Message;
export interface XChatConfig<
  AgentMessage extends SimpleType = string,
  BubbleMessage extends SimpleType = AgentMessage,
> {
  agent?: XAgent<AgentMessage>;
  defaultMessages?: DefaultMessageInfo<AgentMessage>[];

  /** Convert agent message to bubble usage message type */
  parser?: (message: AgentMessage) => BubbleMessage | BubbleMessage[];
  requestPlaceholder?: AgentMessage | RequestPlaceholderFn<AgentMessage>;
  requestFallback?: AgentMessage | RequestFallbackFn<AgentMessage>;
  transformMessage?: TransformMessageFn<AgentMessage>;
  transformStream?: XStreamOptions<AgentMessage>['transformStream'];
  resolveAbortController?: (abortController: AbortController) => void;
}

export interface MessageInfo<Message extends SimpleType> {
  id: number | string;
  message: Message;
  status: MessageStatus;
}

export type DefaultMessageInfo<Message extends SimpleType> = Pick<MessageInfo<Message>, 'message'> &
  Partial<Omit<MessageInfo<Message>, 'message'>>;

export type RequestResultObject<Message> = {
  message: Message | Message[];
  status: MessageStatus;
};

interface RequestParams<Message> extends XRequestParams, AnyObject {
  message: Message;
}

export type RequestResult<Message extends SimpleType> =
  | Message
  | Message[]
  | RequestResultObject<Message>
  | RequestResultObject<Message>[];

export type StandardRequestResult<Message extends SimpleType> = Omit<
  RequestResultObject<Message>,
  'message' | 'status'
> & {
  message: Message;
  status?: MessageStatus;
};

function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

export default function useXChat<
  AgentMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = AgentMessage,
>(config: XChatConfig<AgentMessage, ParsedMessage>) {
  const {
    defaultMessages,
    agent,
    requestFallback,
    requestPlaceholder,
    parser,
    transformMessage,
    transformStream,
    resolveAbortController,
  } = config;

  // ========================= Agent Messages =========================
  const idRef = React.useRef(0);

  const [messages, setMessages, getMessages] = useSyncState<MessageInfo<AgentMessage>[]>(() =>
    (defaultMessages || []).map((info, index) => ({
      id: `default_${index}`,
      status: 'local',
      ...info,
    })),
  );

  const createMessage = (message: AgentMessage, status: MessageStatus) => {
    const msg: MessageInfo<AgentMessage> = {
      id: `msg_${idRef.current}`,
      message,
      status,
    };

    idRef.current += 1;

    return msg;
  };

  // ========================= BubbleMessages =========================
  const parsedMessages = React.useMemo(() => {
    const list: MessageInfo<ParsedMessage>[] = [];

    messages.forEach((agentMsg) => {
      const rawParsedMsg = parser ? parser(agentMsg.message) : agentMsg.message;
      const bubbleMsgs = toArray(rawParsedMsg as ParsedMessage);

      bubbleMsgs.forEach((bubbleMsg, bubbleMsgIndex) => {
        let key = agentMsg.id;
        if (bubbleMsgs.length > 1) {
          key = `${key}_${bubbleMsgIndex}`;
        }

        list.push({
          id: key,
          message: bubbleMsg,
          status: agentMsg.status,
        });
      });
    });

    return list;
  }, [messages]);

  // ============================ Request =============================
  const getFilteredMessages = (msgs: MessageInfo<AgentMessage>[]) =>
    msgs
      .filter((info) => info.status !== 'loading' && info.status !== 'error')
      .map((info) => info.message);

  // For agent to use. Will filter out loading and error message
  const getRequestMessages = () => getFilteredMessages(getMessages());

  const getTransformMessage: TransformMessageFn<AgentMessage> = (params) =>
    typeof transformMessage === 'function' ? transformMessage(params) : params.currentMessage;

  const onRequest = useEvent((requestParams: AgentMessage | RequestParams<AgentMessage>) => {
    if (!agent)
      throw new Error(
        'The agent parameter is required when using the onRequest method in an agent generated by useXAgent.',
      );

    let loadingMsgId: number | string | null = null;
    let message: AgentMessage;
    let otherRequestParams = {};

    if (
      typeof requestParams === 'object' &&
      (requestParams as RequestParams<AgentMessage>)?.message
    ) {
      const { message: requestParamsMessage, ...other } =
        requestParams as RequestParams<AgentMessage>;
      message = requestParamsMessage;
      otherRequestParams = other;
    } else {
      message = requestParams as AgentMessage;
    }
    // Add placeholder message
    setMessages((ori) => {
      let nextMessages = [...ori, createMessage(message, 'local')];

      if (requestPlaceholder) {
        let placeholderMsg: AgentMessage;
        if (typeof requestPlaceholder === 'function') {
          // typescript has bug that not get real return type when use `typeof function` check
          placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<AgentMessage>)(message, {
            messages: getFilteredMessages(nextMessages),
          });
        } else {
          placeholderMsg = requestPlaceholder;
        }

        const loadingMsg = createMessage(placeholderMsg, 'loading');
        loadingMsgId = loadingMsg.id;

        nextMessages = [...nextMessages, loadingMsg];
      }

      return nextMessages;
    });

    // Request
    let updatingMsgId: number | string | null = null;
    const updateMessage = (message: AgentMessage, status: MessageStatus) => {
      let msg = getMessages().find((info) => info.id === updatingMsgId);

      if (!msg) {
        // Create if not exist
        const transformData = getTransformMessage({ currentMessage: message, status });
        msg = createMessage(transformData, status);
        setMessages((ori) => {
          const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
          return [...oriWithoutPending, msg!];
        });
        updatingMsgId = msg.id;
      } else {
        // Update directly
        setMessages((ori) => {
          return ori.map((info) => {
            if (info.id === updatingMsgId) {
              const transformData = getTransformMessage({
                originMessage: info.message,
                currentMessage: message,
                status,
              });
              return {
                ...info,
                message: transformData,
                status,
              };
            }
            return info;
          });
        });
      }

      return msg;
    };
    agent.request(
      {
        message,
        messages: getRequestMessages(),
        ...otherRequestParams,
      },
      {
        onUpdate: (message) => {
          updateMessage(message, 'loading');
        },
        onSuccess: (message) => {
          updateMessage(message, 'success');
        },
        onError: async (error: Error) => {
          if (requestFallback) {
            let fallbackMsg: AgentMessage;
            // Update as error
            if (typeof requestFallback === 'function') {
              // typescript has bug that not get real return type when use `typeof function` check
              fallbackMsg = await (requestFallback as RequestFallbackFn<AgentMessage>)(message, {
                error,
                messages: getRequestMessages(),
              });
            } else {
              fallbackMsg = requestFallback;
            }

            setMessages((ori) => [
              ...ori.filter((info) => info.id !== loadingMsgId && info.id !== updatingMsgId),
              createMessage(fallbackMsg, 'error'),
            ]);
          } else {
            // Remove directly
            setMessages((ori) => {
              return ori.filter((info) => info.id !== loadingMsgId && info.id !== updatingMsgId);
            });
          }
        },
        onStream: (controller) => {
          resolveAbortController?.(controller);
        },
      },
      transformStream,
    );
  });

  return {
    onRequest,
    messages,
    parsedMessages,
    setMessages,
  } as const;
}
