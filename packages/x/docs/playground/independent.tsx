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
  PlusOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import type { BubbleListProps, ThoughtChainItemProp } from '@ant-design/x';
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
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  DeepSeekChatProvider,
  SSEFields,
  useXChat,
  useXConversations,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Avatar, Button, Flex, type GetProp, message, Pagination, Space } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';

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
  messageIsRequesting: '消息正在请求中，您可以在请求完成后创建新对话或立即中止...',
  rename: '重命名',
  delete: '删除',
  uploadFile: '上传文件',
  dropFileHere: '将文件拖到此处',
  uploadFiles: '上传文件',
  clickOrDragFilesToUpload: '点击或将文件拖到此处上传',
  askOrInputUseSkills: '提问或输入 / 使用技能',
  'AI understands user needs and provides solutions.': 'AI理解用户需求并提供解决方案',
  "AI's public persona and image": 'AI的公众形象',
  'How AI Can Express Itself in a Way Users Understand': 'AI如何以用户理解的方式表达自己',
  'AI balances "chat" & "do" behaviors.': 'AI平衡"聊天"和"执行"行为',
  'New Conversation': '新会话',
  'Deep thinking': '深度思考中',
  'Complete thinking': '深度思考完成',
  modelIsRunning: '正在调用模型',
  modelExecutionCompleted: '大模型执行完成',
  executionFailed: '执行失败',
  aborted: '已经终止',
  noData: '暂无数据',
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
  messageIsRequesting:
    'Message is Requesting, you can create a new conversation after request done or abort it right now...',
  rename: 'Rename',
  delete: 'Delete',
  uploadFile: 'Upload File',
  dropFileHere: 'Drop file here',
  uploadFiles: 'Upload files',
  clickOrDragFilesToUpload: 'Click or drag files to this area to upload',
  askOrInputUseSkills: 'Ask or input / use skills',
  'AI understands user needs and provides solutions.':
    'AI understands user needs and provides solutions.',
  "AI's public persona and image": "AI's public persona and image",
  'How AI Can Express Itself in a Way Users Understand':
    'How AI Can Express Itself in a Way Users Understand',
  'AI balances "chat" & "do" behaviors.': 'AI balances "chat" & "do" behaviors.',
  'New Conversation': 'New Conversation',
  'Deep thinking': 'Deep Thinking',
  'Complete thinking': 'Complete Thinking',
  modelIsRunning: 'Model is running',
  modelExecutionCompleted: 'Model execution completed',
  executionFailed: 'Execution failed',
  aborted: 'Aborted',
  noData: 'No Data',
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

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
      description: t['AI understands user needs and provides solutions.'],
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: t.role,
      description: t["AI's public persona and image"],
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: t.chat,
      description: t['How AI Can Express Itself in a Way Users Understand'],
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: t.interface,
      description: t['AI balances "chat" & "do" behaviors.'],
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
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      height: 40px;
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
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
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

const ThinkComponent = React.memo((props: { children: string; streamStatus: string }) => {
  const [title, setTitle] = React.useState(t['Deep thinking'] + '...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle(t['Complete thinking']);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

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

const ThoughtChainConfig = {
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
const actionsItems = [
  {
    key: 'pagination',
    actionRender: () => <Pagination simple total={5} pageSize={1} />,
  },
  {
    key: 'feedback',
    actionRender: () => <Actions.Feedback key="feedback" />,
  },
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => {
      return <Actions.Copy text="copy value" />;
    },
  },
  {
    key: 'audio',
    label: 'audio',
    actionRender: () => {
      return <Actions.Audio />;
    },
  },
];

const role: BubbleListProps['role'] = {
  assistant: {
    placement: 'start',
    components: {
      header: (_, { status }) => {
        const config = ThoughtChainConfig[status as keyof typeof ThoughtChainConfig];
        return config ? (
          <ThoughtChain.Item
            style={{
              marginBottom: 8,
            }}
            status={config.status as ThoughtChainItemProp['status']}
            variant="solid"
            icon={<GlobalOutlined />}
            title={config.title}
          />
        ) : null;
      },
      footer: (_, { status }) => {
        return status !== 'updating' && status !== 'loading' ? (
          <div style={{ display: 'flex' }}>
            <Actions items={actionsItems} />
          </div>
        ) : null;
      },
    },
    contentRender: (content: any, { status }) => {
      const newContent = content.replaceAll('\n\n', '<br/>');
      return (
        <XMarkdown
          paragraphTag="div"
          components={{
            think: ThinkComponent,
          }}
          streaming={{
            hasNextChunk: status === 'updating',
          }}
        >
          {newContent}
        </XMarkdown>
      );
    },
    typing: (_, { status }) =>
      status === 'updating'
        ? {
            effect: 'typing',
            step: 5,
            interval: 20,
            suffix: (
              <div
                style={{
                  position: 'absolute',
                  right: 20,
                  bottom: 10,
                }}
              >
                💗
              </div>
            ),
          }
        : false,
  },
  user: { placement: 'end' },
};

const Independent: React.FC = () => {
  const { styles } = useStyle();

  // ==================== State ====================

  const { conversations, addConversation, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);

  const [inputValue, setInputValue] = useState('');

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
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

      {/* 🌟 添加会话 */}
      <Button
        onClick={() => {
          if (isRequesting) {
            message.error(t.messageIsRequesting);
            return;
          }

          const now = dayjs().valueOf().toString();
          addConversation({
            key: now,
            label: `${t['New Conversation']} ${conversations.length + 1}`,
            group: t.today,
          });
          setCurConversation(now);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        {t['New Conversation']}
      </Button>

      {/* 🌟 会话管理 */}
      <Conversations
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
          }))}
          styles={{
            bubble: {
              width: 700,
            },
          }}
          role={role}
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
    <div className={styles.layout}>
      {chatSide}

      <div className={styles.chat}>
        {chatList}
        {chatSender}
      </div>
    </div>
  );
};

export default Independent;
