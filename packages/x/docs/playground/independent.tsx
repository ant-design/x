import {
  AppstoreAddOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HeartOutlined,
  PaperClipOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ActionsFeedbackProps, BubbleListProps, ThoughtChainItemProps } from '@ant-design/x';
import {
  Actions,
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
} from '@ant-design/x';
import type { ComponentProps } from '@ant-design/x-markdown';
import XMarkdown from '@ant-design/x-markdown';
import type { DefaultMessageInfo, MessageInfo } from '@ant-design/x-sdk';
import {
  DeepSeekChatProvider,
  SSEFields,
  useXChat,
  useXConversations,
  XModelMessage,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Avatar, Button, Flex, type GetProp, message, Pagination, Space } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';
import { useMarkdownTheme } from '../x-markdown/demo/_utils';
import locale from './_utils/local';

// ==================== Style ====================
const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    // side 样式
    side: css`
      background: ${token.colorBgLayout}80;
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
    flex:1;
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
    // chat list 样式
    chat: css`
      height: 100%;
      width: calc(100% - 280px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      justify-content:space-between;
      .ant-bubble-content-updating {
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      }
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      display: flex;
      height: calc(100% - 120px);
      flex-direction: column;
      align-items: center;
      width: 100%;
    `,
    placeholder: css`
      padding-top: 32px;
      width: 100%;
      padding-inline: ${token.paddingLG}px;
     box-sizing: border-box;
    `,
    // sender 样式
    sender: css`
      width: 100%;
      max-width: 840px;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 840px;
      margin: 0 auto;
      color: ${token.colorText};
    `,
  };
});

// ==================== Static Config ====================
const HISTORY_MESSAGES: {
  [key: string]: DefaultMessageInfo<ChatMessage>[];
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

const HOT_TOPICS = {
  key: '1',
  label: locale.hotTopics,
  children: [
    {
      key: '1-1',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: locale.newAgiHybridInterface,
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: locale.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: locale.comeAndDiscoverNewDesignParadigm,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: locale.howToQuicklyInstallAndImportComponents,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: locale.designGuide,
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: locale.intention,
      description: locale.aiUnderstandsUserNeedsAndProvidesSolutions,
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: locale.role,
      description: locale.aiPublicPersonAndImage,
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: locale.chat,
      description: locale.howAICanExpressItselfWayUsersUnderstand,
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: locale.interface,
      description: locale.aiBalances,
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: locale.upgrades,
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: locale.components,
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: locale.richGuide,
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: locale.installationIntroduction,
    icon: <AppstoreAddOutlined />,
  },
];

const THOUGHT_CHAIN_CONFIG = {
  loading: {
    title: locale.modelIsRunning,
    status: 'loading',
  },
  updating: {
    title: locale.modelIsRunning,
    status: 'loading',
  },
  success: {
    title: locale.modelExecutionCompleted,
    status: 'success',
  },
  error: {
    title: locale.executionFailed,
    status: 'error',
  },
  abort: {
    title: locale.aborted,
    status: 'abort',
  },
};

// ==================== Type ====================
interface ChatMessage extends XModelMessage {
  extra?: {
    feedback: ActionsFeedbackProps['value'];
  };
}

// ==================== Context ====================
const ChatContext = React.createContext<{
  onReload?: (key: string | number, info?: any) => any;
  setMessage?: (
    id: string | number,
    message:
      | Partial<MessageInfo<XModelMessage>>
      | ((message: MessageInfo<XModelMessage>) => Partial<MessageInfo<XModelMessage>>),
  ) => boolean;
}>({});

// ==================== Sub Component ====================

const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState(locale.deepThinking + '...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

const Footer: React.FC<{
  id?: string | number;
  content: string;
  status?: string;
  extra?: ChatMessage['extra'];
}> = ({ id, content, extra, status }) => {
  const context = React.useContext(ChatContext);
  const Items = [
    {
      key: 'pagination',
      actionRender: <Pagination simple total={1} pageSize={1} />,
    },
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
    {
      key: 'audio',
      actionRender: (
        <Actions.Audio
          onClick={() => {
            message.info(locale.isMock);
          }}
        />
      ),
    },
    {
      key: 'feedback',
      actionRender: (
        <Actions.Feedback
          styles={{
            liked: {
              color: '#f759ab',
            },
          }}
          value={extra?.feedback || 'default'}
          key="feedback"
          onChange={(val) => {
            if (id) {
              context?.setMessage?.(id, () => ({
                extra: {
                  feedback: val,
                },
              }));
              message.success(`${id}: ${val}`);
            } else {
              message.error('has no id!');
            }
          }}
        />
      ),
    },
  ];
  return status !== 'updating' && status !== 'loading' ? (
    <div style={{ display: 'flex' }}>{id && <Actions items={Items} />}</div>
  ) : null;
};

// ==================== Chat Provider ====================
/**
 * 🔔 Please replace the BASE_URL, MODEL with your own values.
 */
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

const historyMessageFactory = (conversationKey: string): DefaultMessageInfo<ChatMessage>[] => {
  return HISTORY_MESSAGES[conversationKey] || [];
};

const getRole = (className: string): BubbleListProps['role'] => ({
  assistant: {
    placement: 'start',
    components: {
      header: (_, { status }) => {
        const config = THOUGHT_CHAIN_CONFIG[status as keyof typeof THOUGHT_CHAIN_CONFIG];
        return config ? (
          <ThoughtChain.Item
            style={{
              marginBottom: 8,
            }}
            status={config.status as ThoughtChainItemProps['status']}
            variant="solid"
            icon={<GlobalOutlined />}
            title={config.title}
          />
        ) : null;
      },
      footer: (content, { status, key, extra }) => (
        <Footer
          content={content}
          status={status}
          extra={extra as ChatMessage['extra']}
          id={key as string}
        />
      ),
    },
    contentRender: (content: any, { status }) => {
      const newContent = content.replaceAll('\n\n', '<br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          components={{
            think: ThinkComponent,
          }}
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

const Independent: React.FC = () => {
  const { styles } = useStyle();
  // ==================== State ====================

  const { conversations, addConversation, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });

  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [className] = useMarkdownTheme();
  const [messageApi, contextHolder] = message.useMessage();
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);

  const [inputValue, setInputValue] = useState('');

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort, onReload, setMessage } = useXChat<ChatMessage>({
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

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;
    onRequest({
      messages: [{ role: 'user', content: val }],
    });
  };

  // ==================== Nodes ====================
  const chatSide = (
    <div className={styles.side}>
      {/* 🌟 Logo */}
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
      {/* 🌟 会话管理 */}
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
        items={conversations.map(({ key, label, ...other }) => ({
          key,
          label: key === curConversation ? `[${locale.curConversation}]${label}` : label,
          ...other,
        }))}
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
              label: locale.rename,
              key: 'rename',
              icon: <EditOutlined />,
            },
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

      <div className={styles.sideFooter}>
        <Avatar size={24} />
        <Button type="text" icon={<QuestionCircleOutlined />} />
      </div>
    </div>
  );

  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            key: i.id,
            status: i.status,
            loading: i.status === 'loading',
            extra: i.extra,
          }))}
          styles={{
            bubble: {
              maxWidth: 840,
            },
          }}
          role={getRole(className)}
        />
      ) : (
        <Flex
          vertical
          style={{
            maxWidth: 840,
          }}
          gap={16}
          align="center"
          className={styles.placeholder}
        >
          <Welcome
            style={{
              width: '100%',
            }}
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title={locale.welcome}
            description={locale.welcomeDescription}
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex
            gap={16}
            justify="space-around"
            style={{
              width: '100%',
            }}
          >
            <Prompts
              items={[HOT_TOPICS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[DESIGN_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => {
                onSubmit(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Flex>
      )}
    </div>
  );
  const senderHeader = (
    <Sender.Header
      title={locale.uploadFile}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      styles={{ content: { padding: 0 } }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={(info) => setAttachedFiles(info.fileList)}
        placeholder={(type) =>
          type === 'drop'
            ? { title: locale.dropFileHere }
            : {
                icon: <CloudUploadOutlined />,
                title: locale.uploadFiles,
                description: locale.clickOrDragFilesToUpload,
              }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <Flex
      vertical
      gap={12}
      align="center"
      style={{
        marginInline: 24,
      }}
    >
      {/* 🌟 提示词 */}
      {!attachmentsOpen && (
        <Prompts
          items={SENDER_PROMPTS}
          onItemClick={(info) => {
            onSubmit(info.data.description as string);
          }}
          styles={{
            item: { padding: '6px 12px' },
          }}
          className={styles.senderPrompt}
        />
      )}
      {/* 🌟 输入框 */}
      <Sender
        value={inputValue}
        header={senderHeader}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={() => {
          abort();
        }}
        prefix={
          <Button
            type="text"
            icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
          />
        }
        loading={isRequesting}
        className={styles.sender}
        allowSpeech
        placeholder={locale.askOrInputUseSkills}
      />
    </Flex>
  );

  // ==================== Render =================

  return (
    <XProvider locale={locale}>
      <ChatContext.Provider value={{ onReload, setMessage }}>
        {contextHolder}
        <div className={styles.layout}>
          {chatSide}
          <div className={styles.chat}>
            {chatList}
            {chatSender}
          </div>
        </div>
      </ChatContext.Provider>
    </XProvider>
  );
};

export default Independent;
