import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  HeartOutlined,
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
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { TransformMessage } from '@ant-design/x-sdk';
import {
  AbstractChatProvider,
  AbstractXRequestClass,
  useXChat,
  useXConversations,
  XRequestOptions,
} from '@ant-design/x-sdk';
import { Avatar, Button, Flex, type GetProp, Pagination, Space } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { TboxClient } from 'tbox-nodejs-sdk';

const tboxClient = new TboxClient({
  httpClientConfig: {
    authorization: 'your-api-key', // Replace with your API key
    isAntdXDemo: true, // Only for Ant Design X demo
  },
});

const zhCN = {
  whatIsTbox: '什么是百宝箱 Tbox.cn?',
  whatCanTboxDo: '百宝箱可以做什么?',
  today: '今天',
  yesterday: '昨天',
  hotTopics: '最热话题',
  designGuide: '设计指南',
  intent: '意图',
  role: '角色',
  aiUnderstandsUserNeeds: 'AI 理解用户需求并提供解决方案',
  aiPublicImage: 'AI 的公众形象',
  dynamic: '动态',
  component: '组件',
  guide: '指南',
  tutorial: '教程',
  newConversation: '新会话',
  rename: '重命名',
  delete: '删除',
  requestInProgress: '请求正在进行中，请等待请求完成。',
  demoButtonNoFunction: '演示按钮，无实际功能',
  helloAntdXTboxAgent: '你好， 我是 Ant Design X & 百宝箱智能体',
  antdXTboxDescription:
    '基于 Ant Design 的 AGI 产品界面解决方案，打造更卓越的智能视觉体验，集成了百宝箱 Tbox.cn 的智能体能力，助力产品设计与开发。',
  askMeAnything: '向我提问吧',
  DeepThinking: '深度思考中',
  CompleteThinking: '深度思考完成',
  noData: '暂无数据',
  modelIsRunning: '正在调用模型',
  modelExecutionCompleted: '大模型执行完成',
  executionFailed: '执行失败',
  aborted: '已经终止',
};

const enUS = {
  whatIsTbox: 'What is Tbox.cn?',
  whatCanTboxDo: 'What can Tbox.cn do?',
  today: 'Today',
  yesterday: 'Yesterday',
  hotTopics: 'Hot Topics',
  designGuide: 'Design Guide',
  intent: 'Intent',
  role: 'Role',
  aiUnderstandsUserNeeds: 'AI understands user needs and provides solutions',
  aiPublicImage: "AI's public image",
  dynamic: 'Dynamic',
  component: 'Component',
  guide: 'Guide',
  tutorial: 'Tutorial',
  newConversation: 'New Conversation',
  rename: 'Rename',
  delete: 'Delete',
  requestInProgress: 'Request is in progress, please wait for the request to complete.',
  demoButtonNoFunction: 'Demo button, no actual function',
  helloAntdXTboxAgent: 'Hello, I am Ant Design X & Tbox Agent',
  antdXTboxDescription:
    'An AGI product interface solution based on Ant Design, creating a superior intelligent visual experience, integrating the capabilities of Tbox.cn agents to assist in product design and development.',
  askMeAnything: 'Ask me anything...',
  DeepThinking: 'Deep thinking',
  CompleteThinking: 'Deep thinking completed',
  noData: 'No Data',
  modelIsRunning: 'Model is running',
  modelExecutionCompleted: 'Model execution completed',
  executionFailed: 'Execution failed',
  aborted: 'Aborted',
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: t.whatIsTbox,
    group: t.today,
  },
  {
    key: 'default-1',
    label: t.whatCanTboxDo,
    group: t.yesterday,
  },
];

const HOT_TOPICS = {
  key: '1',
  label: t.hotTopics,
  children: [
    {
      key: '1-1',
      description: t.whatIsTbox,
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: t.whatCanTboxDo,
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
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
      label: t.intent,
      description: t.aiUnderstandsUserNeeds,
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: t.role,
      description: t.aiPublicImage,
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: t.dynamic,
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: t.component,
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: t.guide,
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: t.tutorial,
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
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;

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
    typing: css`
      position: absolute;
      right: 20px;
      bottom: 10px;
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

interface TBoxMessage {
  content: string;
  role: string;
}

interface TBoxInput {
  message: TBoxMessage;
}

interface TBoxOutput {
  text?: string;
}

class TBoxRequest<
  Input extends TBoxInput = TBoxInput,
  Output extends TBoxOutput = TBoxOutput,
> extends AbstractXRequestClass<Input, Output> {
  tboxClient: TboxClient;
  tboxStream: any;

  _isTimeout = false;
  _isStreamTimeout = false;
  _isRequesting = false;

  constructor(baseURL: string, options: XRequestOptions<Input, Output>) {
    super(baseURL, options);
    this.tboxClient = new TboxClient({
      httpClientConfig: {
        authorization: 'your-api-key', // Replace with your API key
        isAntdXDemo: true, // Only for Ant Design X demo
      },
    });
  }
  get asyncHandler(): Promise<any> {
    return Promise.resolve();
  }
  get isTimeout(): boolean {
    return this._isTimeout;
  }
  get isStreamTimeout(): boolean {
    return this._isStreamTimeout;
  }
  get isRequesting(): boolean {
    return this._isRequesting;
  }
  get manual(): boolean {
    return true;
  }
  run(params?: Input | undefined): void {
    const stream = tboxClient.chat({
      appId: 'your-app-id', // Replace with your app ID
      query: params?.message.content || '',
      userId: 'antd-x',
    });
    this.tboxStream = stream;
    const { callbacks } = this.options;

    const dataArr: Output[] = [];

    stream.on('data', (data) => {
      let parsedPayload: Output;
      try {
        const payload = (data as any).data?.payload || '{}';
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        console.error('Failed to parse payload:', e);
        return;
      }

      if (parsedPayload?.text) {
        dataArr.push(parsedPayload);
        callbacks?.onUpdate?.(parsedPayload, new Headers());
      }
    });

    stream.on('error', (error) => {
      if (!error?.message?.includes('abort')) {
        callbacks?.onError(error);
      }
    });

    stream.on('end', () => {
      callbacks?.onSuccess(dataArr, new Headers());
    });

    stream.on('abort', () => {
      callbacks?.onError({ name: 'AbortError', message: '' });
    });
  }
  abort(): void {
    this.tboxStream?.abort?.();
  }
}

class TBoxProvider<
  ChatMessage extends TBoxMessage = TBoxMessage,
  Input extends TBoxInput = TBoxInput,
  Output extends TBoxOutput = TBoxOutput,
> extends AbstractChatProvider<ChatMessage, Input, Output> {
  transformParams(requestParams: Partial<Input>, options: XRequestOptions<Input, Output>): Input {
    if (typeof requestParams !== 'object') {
      throw new Error('requestParams must be an object');
    }
    return {
      ...(options?.params || {}),
      ...(requestParams || {}),
    } as Input;
  }
  transformLocalMessage(requestParams: Partial<Input>): ChatMessage {
    return requestParams.message as unknown as ChatMessage;
  }
  transformMessage(info: TransformMessage<ChatMessage, Output>): ChatMessage {
    const { originMessage, chunk } = info || {};
    if (!chunk) {
      return {
        content: originMessage?.content || '',
        role: 'assistant',
      } as ChatMessage;
    }

    const content = originMessage?.content || '';
    return {
      content: content + chunk.text,
      role: 'assistant',
    } as ChatMessage;
  }
}

/**
 * 🔔 Please replace the BASE_URL, MODEL with your own values.
 */
const providerCaches = new Map<string, TBoxProvider>();
const providerFactory = (conversationKey: string) => {
  if (!providerCaches.get(conversationKey)) {
    providerCaches.set(
      conversationKey,
      new TBoxProvider({
        request: new TBoxRequest('TBox Client', {}),
      }),
    );
  }
  return providerCaches.get(conversationKey);
};

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

const AgentTBox: React.FC = () => {
  const { styles } = useStyle();

  // ==================== State ====================

  const { conversations, addConversation, setConversations } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [inputValue, setInputValue] = useState('');

  /**
   * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
   */

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
      message: { role: 'user', content: val },
    });
  };

  // ==================== Nodes ====================
  const chatSide = (
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
          const now = dayjs().valueOf().toString();
          addConversation({
            key: now,
            label: `${t.newConversation} ${conversations.length + 1}`,
            group: t.today,
          });
          setCurConversation(now);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        {t.newConversation}
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
          console.log(status, '1111');
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
      contentRender: (content, { status }) => (
        <XMarkdown
          content={content as string}
          components={{
            think: ThinkComponent,
          }}
          streaming={{ hasNextChunk: status === 'updating', enableAnimation: true }}
        />
      ),
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
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /* 🌟 消息列表 */
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            status: i.status,
            loading: i.status === 'loading',
            key: i.id,
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
            style={{ width: 700 }}
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title={t.helloAntdXTboxAgent}
            description={t.antdXTboxDescription}
            extra={
              <Space>
                <Button icon={<ShareAltOutlined />} />
                <Button icon={<EllipsisOutlined />} />
              </Space>
            }
          />
          <Flex style={{ width: 700 }} gap={16}>
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
  const chatSender = (
    <>
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
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={() => {
          abort();
        }}
        loading={isRequesting}
        className={styles.sender}
        placeholder={t.askMeAnything}
      />
    </>
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

export default AgentTBox;
