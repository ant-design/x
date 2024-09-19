import { useEvent } from 'rc-util';
import React from 'react';
import useSyncState from './useSyncState';

export type SimpleType = string | number | boolean | object;

export type MessageStatus = 'local' | 'loading' | 'success' | 'error';

export interface XAgentConfig<Message> {
  defaultMessages?: MessageInfo<Message>[];

  request: (
    message: Message,
    info: {
      messages: MessageInfo<Message>[];
    },
  ) => Promise<RequestResult<Message>>;
  requestPlaceholder?:
    | Message
    | ((
        message: Message,
        info: {
          messages: MessageInfo<Message>[];
        },
      ) => Message);
  requestFallback?:
    | RequestResult<Message>
    | ((
        message: Message,
        info: { error: Error; messages: MessageInfo<Message>[] },
      ) => Promise<RequestResult<Message>>);
}

export interface MessageInfo<Message> {
  id: number | string;
  message: Message;
  status: MessageStatus;
}

export type RequestResultObject<Message> = {
  message: Message | Message[];
  status: MessageStatus;
};

export type RequestResult<Message> =
  | Message
  | Message[]
  | RequestResultObject<Message>
  | RequestResultObject<Message>[];

export type StandardRequestResult<Message> = Omit<
  RequestResultObject<Message>,
  'message' | 'status'
> & {
  message: Message;
  status?: MessageStatus;
};

function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

function formatMessageResult<Message>(
  result: RequestResult<Message>,
): StandardRequestResult<Message>[] {
  return toArray(result).reduce((acc, item) => {
    if (item && typeof item === 'object' && 'message' in item && 'status' in item) {
      const messages = toArray(item.message);
      const msgResults: StandardRequestResult<Message>[] = messages.map((message) => ({
        ...item,
        message,
      }));
      return [...acc, ...msgResults];
    }

    const msgResult: StandardRequestResult<Message> = {
      message: item,
    };
    return [...acc, msgResult];
  }, [] as StandardRequestResult<Message>[]);
}

export default function useXAgent<Message extends SimpleType>(config: XAgentConfig<Message>) {
  const { defaultMessages, request, requestFallback, requestPlaceholder } = config;

  const [requesting, setRequesting] = React.useState(false);
  const [messages, setMessages, getMessages] = useSyncState<MessageInfo<Message>[]>(
    defaultMessages || [],
  );

  const idRef = React.useRef(0);

  const createMessage = (message: Message, status: MessageStatus) => {
    const msg: MessageInfo<Message> = {
      id: `msg_${idRef.current}`,
      message,
      status,
    };

    idRef.current += 1;

    return msg;
  };

  const onRequest = useEvent((message: Message) => {
    let loadingMsgId: number | string | null = null;

    setMessages((ori) => {
      let nextMessages = [...ori, createMessage(message, 'local')];

      if (requestPlaceholder) {
        const requestPlaceholderMessage =
          typeof requestPlaceholder === 'function'
            ? requestPlaceholder(message, { messages: nextMessages })
            : requestPlaceholder;

        const loadingMsg = createMessage(requestPlaceholderMessage, 'loading');
        loadingMsgId = loadingMsg.id;

        nextMessages = [...nextMessages, loadingMsg];
      }

      return nextMessages;
    });

    setRequesting(true);

    request(message, { messages })
      .then((result) => {
        const msgResults = formatMessageResult(result);
        setMessages((ori) => {
          const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);

          return [
            ...oriWithoutPending,
            ...msgResults.map((item) => createMessage(item.message, item.status || 'success')),
          ];
        });
      })
      .catch(async (error) => {
        if (requestFallback) {
          const fallbackResult =
            typeof requestFallback === 'function'
              ? await requestFallback(message, { error, messages: getMessages() })
              : requestFallback;

          setMessages((ori) => [
            ...ori.filter((info) => info.id !== loadingMsgId),
            ...formatMessageResult(fallbackResult).map((item) =>
              createMessage(item.message, item.status || 'error'),
            ),
          ]);
        }
      })
      .finally(() => {
        setRequesting(false);
      });

    idRef.current += 1;
  });

  return {
    onRequest,
    messages,
    requesting,
    setMessages,
  } as const;
}
