import {
  AppstoreAddOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PlusOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Bubble, Conversations, Prompts, Sender, Welcome } from '@ant-design/x';
import {
  AbstractChatProvider,
  AbstractXRequestClass,
  TransformMessage,
  useXChat,
  useXConversations,
  XRequestOptions,
} from '@ant-design/x-sdk';
import { Avatar, Button, Flex, type GetProp, message, Space, Spin } from 'antd';
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
  loadingMessage: '加载中💗',
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
  loadingMessage: 'Loading...',
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
      flex: 1;
      overflow: auto;
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
      callbacks?.onError(error);
    });

    stream.on('end', () => {
      callbacks?.onSuccess(dataArr, new Headers());
    });

    stream.on('abort', () => {
      callbacks?.onSuccess(dataArr, new Headers());
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
        content: t.loadingMessage,
        role: 'assistant',
      };
    },
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: 'Request failed, please try again!',
        role: 'assistant',
      };
    },
  });

  const loading = isRequesting();

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;

    onRequest({
      message: { role: 'user', content: val },
    });
  };

  const onFooterButtonClick = () => {
    message.info(t.demoButtonNoFunction);
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
            classNames: {
              content: i.status === 'loading' ? styles.loadingMessage : '',
            },
            typing:
              i.status === 'loading'
                ? { effect: 'typing', suffix: <>💗</>, keepPrefix: true }
                : false,
            key: i.id,
          }))}
          style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }}
          role={{
            assistant: {
              placement: 'start',
              components: {
                footer: (
                  <div style={{ display: 'flex' }}>
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={onFooterButtonClick}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={onFooterButtonClick}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<LikeOutlined />}
                      onClick={onFooterButtonClick}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<DislikeOutlined />}
                      onClick={onFooterButtonClick}
                    />
                  </div>
                ),
              },
              loadingRender: () => <Spin size="small" />,
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
            title={t.helloAntdXTboxAgent}
            description={t.antdXTboxDescription}
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
        loading={loading}
        className={styles.sender}
        placeholder={t.askMeAnything}
      />
    </>
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

export default AgentTBox;
