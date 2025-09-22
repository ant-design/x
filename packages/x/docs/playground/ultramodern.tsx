import { DeleteOutlined, OpenAIOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Actions,
  Bubble,
  BubbleListProps,
  Conversations,
  Sender,
  SenderProps,
  XProvider,
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  DeepSeekChatProvider,
  DefaultMessageInfo,
  SSEFields,
  useXChat,
  useXConversations,
  XModelMessage,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Flex, GetRef, message } from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { useMarkdownTheme } from '../x-markdown/demo/_utils';
import locale from './_utils/local';

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      overflow:hidden;
    `,
    side: css`
      background: ${token.colorBgLayout};
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
    `,
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;
      gap: 8px;
      margin: 24px 0;

      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    conversations: css`
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;
      flex: 1;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    sideFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    chat: css`
      height: 100%;
      width: calc(100% - 240px);
      overflow: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
       padding-inline: ${token.paddingLG}px;
      gap: 16px;
      .ant-bubble-content-updating {
        background-image: linear-gradient(
          90deg,
          #ff6b23 0%,
          #af3cb8 31%,
          #53b6ff 89%
        );
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
    `,
    startPage: css`
    display:flex;
    width: 100%;
    max-width: 840px;
    flex-direction: column;
    align-items: center;
    height: 100%;
    `,
    agentName: css`
    margin-block-start: 25%;
    font-size: 32px;
    margin-block-end: 38px;
    font-weight: 600;
    `,
    chatList: css`
      display: flex;
      align-items: center;
      width:100%;
      height: calc(100% - 120px);
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    `,
  };
});

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: (key: string | number, info: any) => any;
}>({});
const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: locale.whatIsAntDesignX,
    group: locale.today,
  },
  {
    key: 'default-1',
    label: locale.howToQuicklyInstallAndImportComponents,
    group: locale.today,
  },
  {
    key: 'default-2',
    label: locale.newAgiHybridInterface,
    group: locale.yesterday,
  },
];
const HISTORY_MESSAGES: {
  [key: string]: DefaultMessageInfo<XModelMessage>[];
} = {
  'default-1': [
    {
      message: { role: 'user', content: locale.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: locale.aiMessage_2,
      },
      status: 'success',
    },
  ],
  'default-2': [
    { message: { role: 'user', content: locale.newAgiHybridInterface }, status: 'success' },
    {
      message: {
        role: 'assistant',
        content: locale.aiMessage_1,
      },
      status: 'success',
    },
  ],
};

const initialSlotConfig: SenderProps['initialSlotConfig'] = [
  { type: 'text', value: locale.slotTextStart },
  {
    type: 'select',
    key: 'destination',
    props: {
      defaultValue: 'X SDK',
      options: ['X SDK', 'X Markdown', 'Bubble'],
    },
  },
  { type: 'text', value: locale.slotTextEnd },
];
const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<XModelMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};
const providerCaches = new Map<string, DeepSeekChatProvider>();
const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new DeepSeekChatProvider({
        request: XRequest<XModelParams, Partial<Record<SSEFields, XModelResponse>>>(
          'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b',
          {
            manual: true,
            params: {
              stream: true,
              model: 'DeepSeek-R1-Distill-Qwen-7B',
            },
          },
        ),
      }),
    );
  }
  return providerCaches.get(conversationKey);
};
const Footer: React.FC<{
  id?: string;
  content: string;
  status?: string;
}> = ({ id, content, status }) => {
  const context = React.useContext(ChatContext);
  const Items = [
    {
      key: 'retry',
      label: locale.retry,
      icon: <SyncOutlined />,
      onItemClick: () => {
        if (id) {
          context?.onReload?.(id, {
            userAction: 'retry',
          });
        }
      },
    },
    {
      key: 'copy',
      actionRender: <Actions.Copy text={content} />,
    },
  ];
  return status !== 'updating' && status !== 'loading' ? (
    <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
  ) : null;
};

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    components: {
      footer: (content, { status, key }) => (
        <Footer content={content} status={status} id={key as string} />
      ),
    },
    contentRender: (content: any, { status }) => {
      const newContent = content.replaceAll('\n\n', '<br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          className={className}
          streaming={{
            hasNextChunk: status === 'updating',
            enableAnimation: true,
          }}
        >
          {newContent}
        </XMarkdown>
      );
    },
  },
  user: { placement: 'end' },
});

const App = () => {
  const [className] = useMarkdownTheme();
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const { conversations, addConversation, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort, onReload } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
    defaultMessages: historyMessageFactory(curConversation),
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: 'assistant',
      };
    },
  });

  const { styles } = useStyle();
  const [messageApi, contextHolder] = message.useMessage();
  const [deepThink, setDeepThink] = useState<boolean>(true);

  return (
    <XProvider locale={locale}>
      {contextHolder}
      <ChatContext.Provider value={{ onReload }}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <div className={styles.logo}>
              <img
                src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                draggable={false}
                alt="logo"
                width={24}
                height={24}
              />
              <span>Ant Design X</span>
            </div>
            <Conversations
              creation={{
                onClick: () => {
                  if (messages.length === 0) {
                    messageApi.error(locale.itIsNowANewConversation);
                    return;
                  }
                  const now = dayjs().valueOf().toString();
                  addConversation({
                    key: now,
                    label: `${locale.newConversation} ${conversations.length + 1}`,
                    group: locale.today,
                  });
                  setCurConversation(now);
                },
              }}
              items={conversations}
              className={styles.conversations}
              activeKey={curConversation}
              onActiveChange={async (val) => {
                setCurConversation(val);
              }}
              groupable
              styles={{ item: { padding: '0 8px' } }}
              menu={(conversation) => ({
                items: [
                  {
                    label: locale.delete,
                    key: 'delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => {
                      const newList = conversations.filter((item) => item.key !== conversation.key);
                      const newKey = newList?.[0]?.key;
                      setConversations(newList);
                      if (conversation.key === curConversation) {
                        setCurConversation(newKey);
                      }
                    },
                  },
                ],
              })}
            />
          </div>
          <div className={styles.chat}>
            <div className={styles.chatList}>
              {messages?.length !== 0 && (
                /* 🌟 消息列表 */
                <Bubble.List
                  items={messages?.map((i) => ({
                    ...i.message,
                    key: i.id,
                    status: i.status,
                    loading: i.status === 'loading',
                    extra: i.message.extra,
                  }))}
                  styles={{
                    root: {
                      marginBlockEnd: 24,
                    },
                    bubble: {
                      maxWidth: 840,
                    },
                  }}
                  role={getRole(className)}
                />
              )}
              <div
                style={{ width: '100%', maxWidth: 840 }}
                className={classNames({ [styles.startPage]: messages.length === 0 })}
              >
                {messages.length === 0 && (
                  <div className={styles.agentName}>{locale.agentName}</div>
                )}
                <Sender
                  suffix={false}
                  ref={senderRef}
                  initialSlotConfig={initialSlotConfig}
                  loading={isRequesting}
                  onSubmit={(val) => {
                    if (!val) return;
                    onRequest({
                      messages: [{ role: 'user', content: val }],
                    });

                    senderRef.current?.clear?.();
                  }}
                  onCancel={() => {
                    abort();
                  }}
                  placeholder={locale.placeholder}
                  footer={(actionNode) => {
                    return (
                      <Flex justify="space-between" align="center">
                        <Flex gap="small" align="center">
                          <Sender.Switch
                            value={deepThink}
                            onChange={(checked: boolean) => {
                              setDeepThink(checked);
                            }}
                            icon={<OpenAIOutlined />}
                          >
                            {locale.deepThink}
                          </Sender.Switch>
                        </Flex>
                        <Flex align="center">{actionNode}</Flex>
                      </Flex>
                    );
                  }}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default App;
