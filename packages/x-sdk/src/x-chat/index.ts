import { useEvent } from 'rc-util';
import React from 'react';
import type { AnyObject } from '../_util/type';
import { ConversationData } from '../x-conversations';
import { XRequestClass } from '../x-request';
import type { SSEOutput } from '../x-stream';
import { AbstractChatProvider } from './providers';
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

export type RequestParams<Message> = {
  [Key: PropertyKey]: Message;
} & AnyObject;

export interface XChatConfig<
  ChatMessage extends SimpleType = string,
  BubbleMessage extends SimpleType = ChatMessage,
  Input = ChatMessage,
  Output = ChatMessage,
> {
  provider?: AbstractChatProvider<ChatMessage, Input, Output>;
  conversationKey?: ConversationData['key'];
  defaultMessages?: DefaultMessageInfo<ChatMessage>[];
  /** Convert agent message to bubble usage message type */
  parser?: (message: ChatMessage) => BubbleMessage | BubbleMessage[];
  requestPlaceholder?: ChatMessage | RequestPlaceholderFn<ChatMessage>;
  requestFallback?: ChatMessage | RequestFallbackFn<ChatMessage>;
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
  ChatMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
>(config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) {
  const { defaultMessages, requestFallback, requestPlaceholder, parser, provider } = config;

  // ========================= Agent Messages =========================
  const idRef = React.useRef(0);
  const requestHandlerRef = React.useRef<XRequestClass<Input, Output>>(undefined);

  const [messages, setMessages, getMessages] = useSyncState<MessageInfo<ChatMessage>[]>(() =>
    (defaultMessages || []).map((info, index) => ({
      id: `default_${index}`,
      status: 'local',
      ...info,
    })),
  );

  const createMessage = (message: ChatMessage, status: MessageStatus) => {
    const msg: MessageInfo<ChatMessage> = {
      id: `msg_${idRef.current}`,
      message,
      status,
    };

    idRef.current += 1;

    return msg;
  };

  const setMessage = (id: string, data: { message?: ChatMessage; status?: MessageStatus }) => {
    setMessages((ori) => {
      return ori.map((info) => {
        if (info.id === id) {
          return {
            ...info,
            ...data,
          };
        }
        return info;
      });
    });
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
  const getFilteredMessages = (msgs: MessageInfo<ChatMessage>[]) =>
    msgs
      .filter((info) => info.status !== 'loading' && info.status !== 'error')
      .map((info) => info.message);

  provider?.injectGetMessages(() => {
    return getFilteredMessages(getMessages());
  });
  // For agent to use. Will filter out loading and error message
  const getRequestMessages = () => getFilteredMessages(getMessages());

  const innerOnRequest = (
    requestParams: Partial<Input>,
    opts?: {
      updatingId: number | string;
      reload: boolean;
    },
  ) => {
    if (!provider) {
      return;
    }
    const { updatingId, reload } = opts || {};
    let loadingMsgId: number | string | null | undefined = null;
    const message = provider.transformLocalMessage(requestParams);
    if (reload) {
      loadingMsgId = updatingId;
      setMessages((ori) => {
        const nextMessages = [...ori];
        if (requestPlaceholder) {
          let placeholderMsg: ChatMessage;
          if (typeof requestPlaceholder === 'function') {
            // typescript has bug that not get real return type when use `typeof function` check
            placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<ChatMessage>)(message, {
              messages: getFilteredMessages(nextMessages),
            });
          } else {
            placeholderMsg = requestPlaceholder;
          }
          nextMessages.forEach((info) => {
            if (info.id === updatingId) {
              info.status = 'loading';
              info.message = placeholderMsg;
            }
          });
        }
        return nextMessages;
      });
    } else {
      // Add placeholder message
      setMessages((ori) => {
        let nextMessages = [...ori, createMessage(message, 'local')];
        if (requestPlaceholder) {
          let placeholderMsg: ChatMessage;
          if (typeof requestPlaceholder === 'function') {
            // typescript has bug that not get real return type when use `typeof function` check
            placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<ChatMessage>)(message, {
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
    }

    // Request
    let updatingMsgId: number | string | null | undefined = null;
    const updateMessage = (status: MessageStatus, chunk: Output, chunks: Output[]) => {
      let msg = getMessages().find((info) => info.id === updatingMsgId);
      if (!msg) {
        if (reload && updatingId) {
          msg = getMessages().find((info) => info.id === updatingId);
          if (msg) {
            msg.status = status;
            msg.message = provider.transformMessage({ chunk, status, chunks });
            setMessages((ori) => {
              return [...ori];
            });
            updatingMsgId = msg.id;
          }
        } else {
          // Create if not exist
          const transformData = provider.transformMessage({ chunk, status, chunks });
          msg = createMessage(transformData, status);
          setMessages((ori) => {
            const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
            return [...oriWithoutPending, msg!];
          });
          updatingMsgId = msg.id;
        }
      } else {
        // Update directly
        setMessages((ori) => {
          return ori.map((info) => {
            if (info.id === updatingMsgId) {
              const transformData = provider.transformMessage({
                originMessage: info.message,
                chunk,
                chunks,
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
    provider.injectRequest({
      onUpdate: (chunk: Output) => {
        updateMessage('loading', chunk, []);
      },
      onSuccess: (chunks: Output[]) => {
        updateMessage('success', undefined as Output, chunks);
      },
      onError: async (error: Error) => {
        if (requestFallback) {
          let fallbackMsg: ChatMessage;
          // Update as error
          if (typeof requestFallback === 'function') {
            // typescript has bug that not get real return type when use `typeof function` check
            fallbackMsg = await (requestFallback as RequestFallbackFn<ChatMessage>)(message, {
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
    });
    requestHandlerRef.current = provider.request;
    provider.request.run(provider.transformParams(requestParams, provider.request.options));
  };

  const onRequest = useEvent((requestParams: Partial<Input>) => {
    if (!provider) {
      throw new Error('provider is required');
    }
    innerOnRequest(requestParams);
  });

  const onReload = (id: string | number, requestParams: Partial<Input>) => {
    if (!provider) {
      throw new Error('provider is required');
    }
    if (!id || !getMessages().find((info) => info.id === id)) {
      console.error(`message [${id}] is not found`);
      return;
    }
    innerOnRequest(requestParams, {
      updatingId: id,
      reload: true,
    });
  };

  return {
    onRequest,
    messages,
    parsedMessages,
    setMessages,
    setMessage,
    abort: () => {
      if (!provider) {
        throw new Error('provider is required');
      }
      requestHandlerRef.current?.abort();
    },
    isRequesting: () => {
      if (!provider) {
        throw new Error('provider is required');
      }
      return requestHandlerRef.current?.isRequesting;
    },
    onReload,
  } as const;
}
