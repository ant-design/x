import {
  AppstoreAddOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Attachments, Bubble, Conversations, Prompts, Sender, Think, Welcome } from '@ant-design/x';
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
import { Avatar, Button, Flex, type GetProp, message, Space, Spin } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const zhCN = {
  'What is Ant Design X?': '什么是 Ant Design X？',
  Today: '今天',
  'How to quickly install and import components?': '如何快速安装和导入组件？',
  'New AGI Hybrid Interface': '新的 AGI 混合界面',
  Yesterday: '昨天',
  'Hot Topics': '热门话题',
  'Design Guide': '设计指南',
  Intention: '意图',
  Role: '角色',
  Chat: '对话',
  Interface: '界面',
  Upgrades: '升级',
  Components: '组件',
  'RICH Guide': 'RICH 指南',
  'Installation Introduction': '安装介绍',
  'What has Ant Design X upgraded?': 'Ant Design X 有哪些升级？',
  'What components are in Ant Design X?': 'Ant Design X 中有哪些组件？',
  'Come and discover the new design paradigm of the AI era.': '快来发现 AI 时代的新设计范式。',
  'Request is aborted': '请求已中止',
  'Request failed, please try again!': '请求失败，请重试！',
  'Request is in progress, please wait for the request to complete.':
    '请求正在进行中，请等待请求完成。',
  'Message is Requesting, you can create a new conversation after request done or abort it right now...':
    '消息正在请求中，您可以在请求完成后创建新对话或立即中止...',
  Rename: '重命名',
  Delete: '删除',
  'Upload File': '上传文件',
  'Drop file here': '将文件拖到此处',
  'Upload files': '上传文件',
  'Click or drag files to this area to upload': '点击或将文件拖到此处上传',
  'Ask or input / use skills': '提问或输入 / 使用技能',
  'AI understands user needs and provides solutions.': 'AI理解用户需求并提供解决方案',
  "AI's public persona and image": 'AI的公众形象',
  'How AI Can Express Itself in a Way Users Understand': 'AI如何以用户理解的方式表达自己',
  'AI balances "chat" & "do" behaviors.': 'AI平衡"聊天"和"执行"行为',
  'New Conversation': '新会话',
  'Deep thinking': '深度思考中',
  'Complete thinking': '深度思考完成',
};

const enUS = {
  'What is Ant Design X?': 'What is Ant Design X?',
  Today: 'Today',
  'How to quickly install and import components?': 'How to quickly install and import components?',
  'New AGI Hybrid Interface': 'New AGI Hybrid Interface',
  Yesterday: 'Yesterday',
  'Hot Topics': 'Hot Topics',
  'Design Guide': 'Design Guide',
  Intention: 'Intention',
  Role: 'Role',
  Chat: 'Chat',
  Interface: 'Interface',
  Upgrades: 'Upgrades',
  Components: 'Components',
  'RICH Guide': 'RICH Guide',
  'Installation Introduction': 'Installation Introduction',
  'What has Ant Design X upgraded?': 'What has Ant Design X upgraded?',
  'What components are in Ant Design X?': 'What components are in Ant Design X?',
  'Come and discover the new design paradigm of the AI era.':
    'Come and discover the new design paradigm of the AI era.',
  'Request is aborted': 'Request is aborted',
  'Request failed, please try again!': 'Request failed, please try again!',
  'Request is in progress, please wait for the request to complete.':
    'Request is in progress, please wait for the request to complete.',
  'Message is Requesting, you can create a new conversation after request done or abort it right now...':
    'Message is Requesting, you can create a new conversation after request done or abort it right now...',
  Rename: 'Rename',
  Delete: 'Delete',
  'Upload File': 'Upload File',
  'Drop file here': 'Drop file here',
  'Upload files': 'Upload files',
  'Click or drag files to this area to upload': 'Click or drag files to this area to upload',
  'Ask or input / use skills': 'Ask or input / use skills',
  'AI understands user needs and provides solutions.':
    'AI understands user needs and provides solutions.',
  "AI's public persona and image": "AI's public persona and image",
  'How AI Can Express Itself in a Way Users Understand':
    'How AI Can Express Itself in a Way Users Understand',
  'AI balances "chat" & "do" behaviors.': 'AI balances "chat" & "do" behaviors.',
  'New Conversation': 'New Conversation',
  'Deep thinking': 'Deep Thinking',
  'Complete thinking': 'Complete Thinking',
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: t['What is Ant Design X?'],
    group: t['Today'],
  },
  {
    key: 'default-1',
    label: t['How to quickly install and import components?'],
    group: t['Today'],
  },
  {
    key: 'default-2',
    label: t['New AGI Hybrid Interface'],
    group: t['Yesterday'],
  },
];

const HOT_TOPICS = {
  key: '1',
  label: t['Hot Topics'],
  children: [
    {
      key: '1-1',
      description: t['What has Ant Design X upgraded?'],
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: t['New AGI Hybrid Interface'],
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
    {
      key: '1-3',
      description: t['What components are in Ant Design X?'],
      icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
    },
    {
      key: '1-4',
      description: t['Come and discover the new design paradigm of the AI era.'],
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
    },
    {
      key: '1-5',
      description: t['How to quickly install and import components?'],
      icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: t['Design Guide'],
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: t['Intention'],
      description: t['AI understands user needs and provides solutions.'],
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: t['Role'],
      description: t["AI's public persona and image"],
    },
    {
      key: '2-3',
      icon: <CommentOutlined />,
      label: t['Chat'],
      description: t['How AI Can Express Itself in a Way Users Understand'],
    },
    {
      key: '2-4',
      icon: <PaperClipOutlined />,
      label: t['Interface'],
      description: t['AI balances "chat" & "do" behaviors.'],
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: t['Upgrades'],
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: t['Components'],
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: t['RICH Guide'],
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: t['Installation Introduction'],
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
    // sider 样式
    sider: css`
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
    siderFooter: css`
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
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
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

const ThinkComponent = React.memo((props: { children: string; status: string }) => {
  const [title, setTitle] = React.useState(t['Deep thinking'] + '...');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.status === 'done') {
      setTitle(t['Complete thinking']);
      setLoading(false);
    }
  }, [props.status]);

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

  const { onRequest, messages, requesting, abort } = useXChat({
    provider: providerFactory(curConversation), // every conversation has its own provider
    conversationKey: curConversation,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: t['Request is aborted'],
          role: 'assistant',
        };
      }
      console.log(error, 'error');
      return {
        content: t['Request failed, please try again!'],
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
  const chatSider = (
    <div className={styles.sider}>
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
          if (requesting) {
            message.error(
              t[
                'Message is Requesting, you can create a new conversation after request done or abort it right now...'
              ],
            );
            return;
          }

          const now = dayjs().valueOf().toString();
          addConversation({
            key: now,
            label: `${t['New Conversation']} ${conversations.length + 1}`,
            group: t['Today'],
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
              label: t['Rename'],
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: t['Delete'],
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

      <div className={styles.siderFooter}>
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
            classNames: {
              content: i.status === 'loading' ? styles.loadingMessage : '',
            },
            typing:
              i.status === 'loading'
                ? { effect: 'typing', step: 5, interval: 20, suffix: <>💗</> }
                : false,
          }))}
          style={{ paddingInline: 'calc(calc(100% - 700px) /2)' }}
          role={{
            assistant: {
              placement: 'start',
              components: {
                footer: (
                  <div style={{ display: 'flex' }}>
                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                    <Button type="text" size="small" icon={<CopyOutlined />} />
                    <Button type="text" size="small" icon={<LikeOutlined />} />
                    <Button type="text" size="small" icon={<DislikeOutlined />} />
                  </div>
                ),
              },
              loadingRender: () => <Spin size="small" />,
              contentRender(content: any) {
                const newContent = content.replaceAll('\n\n', '<br/>');
                return (
                  <XMarkdown
                    content={newContent}
                    components={{
                      think: ThinkComponent,
                    }}
                  />
                );
              },
            },
            user: { placement: 'end' },
          }}
        />
      ) : (
        <Space
          orientation="vertical"
          size={16}
          style={{ paddingInline: 'calc(calc(100% - 700px) /2)' }}
          className={styles.placeholder}
        >
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
          <Flex gap={16}>
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
      title={t['Upload File']}
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
            ? { title: t['Drop file here'] }
            : {
                icon: <CloudUploadOutlined />,
                title: t['Upload files'],
                description: t['Click or drag files to this area to upload'],
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
        loading={requesting}
        className={styles.sender}
        allowSpeech
        placeholder={t['Ask or input / use skills']}
      />
    </Flex>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      {chatSider}

      <div className={styles.chat}>
        {chatList}
        {chatSender}
      </div>
    </div>
  );
};

export default Independent;
