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
import enUS_X from '@ant-design/x/locale/en_US';
import zhCN_X from '@ant-design/x/locale/zh_CN';
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
import enUS_antd from 'antd/locale/en_US';
import zhCN_antd from 'antd/locale/zh_CN';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useMarkdownTheme } from '../x-markdown/demo/_utils';

// ==================== Local ====================
const zhCN = {
  whatIsAntDesignX: '什么是 Ant Design X？',
  today: '今天',
  howToQuicklyInstallAndImportComponents: '如何快速安装和导入组件？',
  newAgiHybridInterface: '新的 AGI 混合界面',
  yesterday: '昨天',
  hotTopics: '热门话题',
  designGuide: '设计指南',
  intention: '意图',
  role: '角色',
  chat: '对话',
  interface: '界面',
  upgrades: '升级',
  components: '组件',
  richGuide: 'RICH 指南',
  installationIntroduction: '安装介绍',
  whatHasAntDesignXUpgraded: 'Ant Design X 有哪些升级？',
  whatComponentsAreInAntDesignX: 'Ant Design X 中有哪些组件？',
  comeAndDiscoverNewDesignParadigm: '快来发现 AI 时代的新设计范式。',
  requestIsAborted: '请求已中止',
  requestFailedPleaseTryAgain: '请求失败，请重试！',
  requestIsInProgress: '请求正在进行中，请等待请求完成。',
  rename: '重命名',
  delete: '删除',
  uploadFile: '上传文件',
  dropFileHere: '将文件拖到此处',
  uploadFiles: '上传文件',
  clickOrDragFilesToUpload: '点击或将文件拖到此处上传',
  askOrInputUseSkills: '提问或输入 / 使用技能',
  aiUnderstandsUserNeedsAndProvidesSolutions: 'AI理解用户需求并提供解决方案',
  AIPublicPersonAndImage: 'AI的公众形象',
  HowAICanExpressItselfWayUsersUnderstand: 'AI如何以用户理解的方式表达自己',
  AIBalances: 'AI平衡"聊天"和"执行"行为',
  DeepThinking: '深度思考中',
  CompleteThinking: '深度思考完成',
  modelIsRunning: '正在调用模型',
  modelExecutionCompleted: '大模型执行完成',
  executionFailed: '执行失败',
  aborted: '已经终止',
  noData: '暂无数据',
  NewConversation: '新对话',
  curConversation: '当前对话',
  nowNenConversation: '当前已经是新会话',
  isMock: '当前为模拟功能',
  retry: '重新生成',
};

const enUS = {
  whatIsAntDesignX: 'What is Ant Design X?',
  today: 'Today',
  howToQuicklyInstallAndImportComponents: 'How to quickly install and import components?',
  newAgiHybridInterface: 'New AGI Hybrid Interface',
  yesterday: 'Yesterday',
  hotTopics: 'Hot Topics',
  designGuide: 'Design Guide',
  intention: 'Intention',
  role: 'Role',
  chat: 'Chat',
  interface: 'Interface',
  upgrades: 'Upgrades',
  components: 'Components',
  richGuide: 'RICH Guide',
  installationIntroduction: 'Installation Introduction',
  whatHasAntDesignXUpgraded: 'What has Ant Design X upgraded?',
  whatComponentsAreInAntDesignX: 'What components are in Ant Design X?',
  comeAndDiscoverNewDesignParadigm: 'Come and discover the new design paradigm of the AI era.',
  requestIsAborted: 'Request is aborted',
  requestFailedPleaseTryAgain: 'Request failed, please try again!',
  requestIsInProgress: 'Request is in progress, please wait for the request to complete.',
  rename: 'Rename',
  delete: 'Delete',
  uploadFile: 'Upload File',
  dropFileHere: 'Drop file here',
  uploadFiles: 'Upload files',
  clickOrDragFilesToUpload: 'Click or drag files to this area to upload',
  askOrInputUseSkills: 'Ask or input / use skills',
  aiUnderstandsUserNeedsAndProvidesSolutions: 'AI understands user needs and provides solutions.',
  AIPublicPersonAndImage: "AI's public persona and image",
  HowAICanExpressItselfWayUsersUnderstand: 'How AI Can Express Itself in a Way Users Understand',
  AIBalances: 'AI balances "chat" & "do" behaviors.',
  DeepThinking: 'Deep Thinking',
  CompleteThinking: 'Complete Thinking',
  modelIsRunning: 'Model is running',
  modelExecutionCompleted: 'Model execution completed',
  executionFailed: 'Execution failed',
  aborted: 'Aborted',
  noData: 'No Data',
  NewConversation: 'New Conversation',
  curConversation: 'Current Conversation',
  nowNenConversation: 'It is now a new conversation.',
  isMock: 'It is Mock',
  retry: 'retry',
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

// ==================== Style ====================
const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
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
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    // sender 样式
    sender: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 700px;
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
      message: { role: 'user', content: t.howToQuicklyInstallAndImportComponents },
      status: 'success',
    },
    {
      message: {
        role: 'assistant',
        content: `# 快速安装和导入组件 \n \`npm install @ant-design/x --save \` \n [查看详情](/components/introduce${isZhCN ? '-cn' : ''}/)`,
      },
      status: 'success',
    },
  ],
  'default-2': [
    { message: { role: 'user', content: t.newAgiHybridInterface }, status: 'success' },
    {
      message: {
        role: 'assistant',
        content: `RICH 设计范式 \n [查看详情](/docs/spec/introduce${isZhCN ? '-cn' : ''}/)`,
      },
      status: 'success',
    },
  ],
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: t.whatIsAntDesignX,
    group: t.today,
  },
  {
    key: 'default-1',
    label: t.howToQuicklyInstallAndImportComponents,
    group: t.today,
  },
  {
    key: 'default-2',
    label: t.newAgiHybridInterface,
    group: t.yesterday,
  },
];

const HOT_TOPICS = {
  key: '1',
  label: t.hotTopics,
  children: [
    {
      key: '1-1',
      description: t.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: t.newAgiHybridInterface,
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: t.whatComponentsAreInAntDesignX,
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: t.comeAndDiscoverNewDesignParadigm,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: t.howToQuicklyInstallAndImportComponents,
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: t.designGuide,
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: t.intention,
      description: t.aiUnderstandsUserNeedsAndProvidesSolutions,
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: t.role,
      description: t.AIPublicPersonAndImage,
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: t.chat,
      description: t.HowAICanExpressItselfWayUsersUnderstand,
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: t.interface,
      description: t.AIBalances,
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: t.upgrades,
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: t.components,
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: t.richGuide,
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: t.installationIntroduction,
    icon: <AppstoreAddOutlined />,
  },
];

const THOUGHT_CHAIN_CONFIG = {
  loading: {
    title: t.modelIsRunning,
    status: 'loading',
  },
  updating: {
    title: t.modelIsRunning,
    status: 'loading',
  },
  success: {
    title: t.modelExecutionCompleted,
    status: 'success',
  },
  error: {
    title: t.executionFailed,
    status: 'error',
  },
  abort: {
    title: t.aborted,
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

const ThinkComponent = React.memo((props: { children: string; streamStatus: string }) => {
  const [title, setTitle] = React.useState(t.DeepThinking + '...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(t.CompleteThinking);
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
  id?: string;
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
      label: t.retry,
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
            message.info(t.isMock);
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
  const locale = isZhCN ? { ...zhCN_antd, ...zhCN_X } : { ...enUS_antd, ...enUS_X };
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
        content: t.noData,
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
              messageApi.error(t.nowNenConversation);
              return;
            }
            const now = dayjs().valueOf().toString();
            addConversation({
              key: now,
              label: `${t.NewConversation} ${conversations.length + 1}`,
              group: t.today,
            });
            setCurConversation(now);
          },
        }}
        items={conversations.map(({ key, label }) => ({
          key,
          label: key === curConversation ? `[${t.curConversation}]${label}` : label,
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
              label: t.rename,
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: t.delete,
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
              width: 700,
            },
          }}
          role={getRole(className)}
        />
      ) : (
        <Space orientation="vertical" size={16} align="center" className={styles.placeholder}>
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="Hello, I'm Ant Design X"
            description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex
            gap={16}
            style={{
              width: 700,
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
        </Space>
      )}
    </div>
  );
  const senderHeader = (
    <Sender.Header
      title={t.uploadFile}
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
            ? { title: t.dropFileHere }
            : {
                icon: <CloudUploadOutlined />,
                title: t.uploadFiles,
                description: t.clickOrDragFilesToUpload,
              }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <Flex vertical gap={12}>
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
        placeholder={t.askOrInputUseSkills}
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
