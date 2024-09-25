import { useEvent } from 'rc-util';
import React from 'react';
import { BubbleDataType } from '../bubble/BubbleList';
import { XAgent } from '../useXAgent';
import useSyncState from './useSyncState';

export type SimpleType = string | number | boolean | object;

export type MessageStatus = 'local' | 'loading' | 'success' | 'error';

// export type ReturnMessage<Message> = Message | DefaultMessageInfo<Message>;

type RequestPlaceholderFn<Message extends SimpleType> = (
  message: Message,
  info: { messages: Message[] },
) => Message;

type RequestFallbackFn<Message extends SimpleType> = (
  message: Message,
  info: { error: Error; messages: Message[] },
) => Message | Promise<Message>;

export interface XChatConfig<
  AgentMessage extends SimpleType = string,
  BubbleMessage extends SimpleType = AgentMessage,
> {
  agent: XAgent<AgentMessage>;

  defaultMessages?: DefaultMessageInfo<AgentMessage>[];

  /** Convert agent message to bubble usage message type */
  parser?: (message: AgentMessage) => BubbleMessage | BubbleMessage[];

  // request: (
  //   message: Message,
  //   info: {
  //     messages: MessageInfo<Message>[];
  //   },
  // ) => Promise<RequestResult<Message>>;
  requestPlaceholder?: AgentMessage | RequestPlaceholderFn<AgentMessage>;
  requestFallback?: AgentMessage | RequestFallbackFn<AgentMessage>;
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

// function formatMessageResult<Message>(result: ReturnMessage<Message>): MessageInfo<Message>[] {
//   return toArray(result).reduce((acc, item) => {
//     if (item && typeof item === 'object' && 'message' in item && 'status' in item) {
//       const messages = toArray(item.message);
//       const msgResults: StandardRequestResult<Message>[] = messages.map((message) => ({
//         ...item,
//         message,
//       }));
//       return [...acc, ...msgResults];
//     }

//     const msgResult: StandardRequestResult<Message> = {
//       message: item,
//     };
//     return [...acc, msgResult];
//   }, [] as StandardRequestResult<Message>[]);
// }

export default function useXChat<
  AgentMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = AgentMessage,
>(config: XChatConfig<AgentMessage, ParsedMessage>) {
  const { defaultMessages, agent, requestFallback, requestPlaceholder, parser } = config;

  // const [requesting, setRequesting] = React.useState(false);

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

  const onRequest = useEvent((message: AgentMessage) => {
    let loadingMsgId: number | string | null = null;

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

    // setRequesting(true);

    // Request
    const updatingMsgId: number | string | null = null;
    const updateMessage = (message: AgentMessage, status: MessageStatus) => {
      let msg = getMessages().find((info) => info.id === updatingMsgId);

      if (!msg) {
        // Create if not exist
        msg = createMessage(message, status);
        setMessages((ori) => {
          const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
          return [...oriWithoutPending, msg!];
        });
      } else {
        // Update directly
        setMessages((ori) => {
          return ori.map((info) => {
            if (info.id === updatingMsgId) {
              return {
                ...info,
                message,
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
              ...ori.filter((info) => info.id !== loadingMsgId),
              createMessage(fallbackMsg, 'error'),
            ]);
          } else {
            // Remove directly
            setMessages((ori) => {
              return ori.filter((info) => info.id !== loadingMsgId);
            });
          }
        },
      },
    );

    // request(message, { messages })
    //   .then((result) => {
    //     const msgResults = formatMessageResult(result);
    //     setMessages((ori) => {
    //       const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);

    //       return [
    //         ...oriWithoutPending,
    //         ...msgResults.map((item) => createMessage(item.message, item.status || 'success')),
    //       ];
    //     });
    //   })
    //   .catch(async (error) => {
    //     if (requestFallback) {
    //       const fallbackResult =
    //         typeof requestFallback === 'function'
    //           ? await requestFallback(message, { error, messages: getMessages() })
    //           : requestFallback;

    //       setMessages((ori) => [
    //         ...ori.filter((info) => info.id !== loadingMsgId),
    //         ...formatMessageResult(fallbackResult).map((item) =>
    //           createMessage(item.message, item.status || 'error'),
    //         ),
    //       ]);
    //     }
    //   })
    //   .finally(() => {
    //     setRequesting(false);
    //   });

    // idRef.current += 1;
  });

  return {
    onRequest,
    messages,
    parsedMessages,
    // requesting,
    setMessages,
  } as const;
}
