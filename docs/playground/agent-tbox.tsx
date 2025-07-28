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
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
} from '@ant-design/x';
import { Avatar, Button, Flex, type GetProp, message, Space, Spin } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { TboxClient } from 'tbox-nodejs-sdk';

const tboxClient = new TboxClient({
  httpClientConfig: {
    authorization: 'your-api-key', // Replace with your API key
    isAntdXDemo: true, // Only for Ant Design X demo
  },
});

const zhCN = {
  'what-is-tbox': '什么是百宝箱 Tbox.cn?',
  'what-can-tbox-do': '百宝箱可以做什么?',
  today: '今天',
  yesterday: '昨天',
  'hot-topics': '最热话题',
  'design-guide': '设计指南',
  intent: '意图',
  role: '角色',
  'ai-understands-user-needs': 'AI 理解用户需求并提供解决方案',
  'ai-public-image': 'AI 的公众形象',
  dynamic: '动态',
  component: '组件',
  guide: '指南',
  tutorial: '教程',
  'new-conversation': '新会话',
  rename: '重命名',
  delete: '删除',
  'request-in-progress': '请求正在进行中，请等待请求完成。',
  'demo-button-no-function': '演示按钮，无实际功能',
  'hello-antd-x-tbox-agent': '你好， 我是 Ant Design X & 百宝箱智能体',
  'antd-x-tbox-description':
    '基于 Ant Design 的 AGI 产品界面解决方案，打造更卓越的智能视觉体验，集成了百宝箱 Tbox.cn 的智能体能力，助力产品设计与开发。',
  'ask-me-anything': '向我提问吧',
};

const enUS = {
  'what-is-tbox': 'What is Tbox.cn?',
  'what-can-tbox-do': 'What can Tbox.cn do?',
  today: 'Today',
  yesterday: 'Yesterday',
  'hot-topics': 'Hot Topics',
  'design-guide': 'Design Guide',
  intent: 'Intent',
  role: 'Role',
  'ai-understands-user-needs': 'AI understands user needs and provides solutions',
  'ai-public-image': "AI's public image",
  dynamic: 'Dynamic',
  component: 'Component',
  guide: 'Guide',
  tutorial: 'Tutorial',
  'new-conversation': 'New Conversation',
  rename: 'Rename',
  delete: 'Delete',
  'request-in-progress': 'Request is in progress, please wait for the request to complete.',
  'demo-button-no-function': 'Demo button, no actual function',
  'hello-antd-x-tbox-agent': 'Hello, I am Ant Design X & Tbox Agent',
  'antd-x-tbox-description':
    'An AGI product interface solution based on Ant Design, creating a superior intelligent visual experience, integrating the capabilities of Tbox.cn agents to assist in product design and development.',
  'ask-me-anything': 'Ask me anything...',
};

type BubbleDataType = {
  role: string;
  content: string;
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: t['what-is-tbox'],
    group: t['today'],
  },
  {
    key: 'default-2',
    label: t['what-can-tbox-do'],
    group: t['yesterday'],
  },
];

const HOT_TOPICS = {
  key: '1',
  label: t['hot-topics'],
  children: [
    {
      key: '1-1',
      description: t['what-is-tbox'],
      icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
    },
    {
      key: '1-2',
      description: t['what-can-tbox-do'],
      icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
    },
  ],
};

const DESIGN_GUIDE = {
  key: '2',
  label: t['design-guide'],
  children: [
    {
      key: '2-1',
      icon: <HeartOutlined />,
      label: t['intent'],
      description: t['ai-understands-user-needs'],
    },
    {
      key: '2-2',
      icon: <SmileOutlined />,
      label: t['role'],
      description: t['ai-public-image'],
    },
  ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: t['dynamic'],
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: t['component'],
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: t['guide'],
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: t['tutorial'],
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

const Independent: React.FC = () => {
  const { styles } = useStyle();
  const streamRef = useRef<any>(null); // 存储 tbox stream 对象
  const abortControllerRef = useRef<AbortController | null>(null); // 存储 AbortController

  // ==================== State ====================
  const [messageHistory, setMessageHistory] = useState<Record<string, typeof messages>>({});

  const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS_ITEMS);
  const [curConversation, setCurConversation] = useState(DEFAULT_CONVERSATIONS_ITEMS[0].key);

  const [inputValue, setInputValue] = useState('');

  /**
   * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
   */

  // ==================== Runtime ====================
  const [agent] = useXAgent<BubbleDataType, any, string>({
    request: async ({ message }, { onUpdate, onSuccess, onError, onStream }) => {
      const stream = tboxClient.chat({
        appId: 'your-app-id', // Replace with your app ID
        query: message.content,
        userId: 'antd-x',
      });

      streamRef.current = stream;
      const abortController = new AbortController();
      const originalAbort = abortController.abort.bind(abortController);
      abortController.abort = () => {
        stream.abort();
        originalAbort();
      };
      onStream?.(abortController);

      const dataArr = [] as string[];

      stream.on('data', (data) => {
        dataArr.push(data);
        onUpdate(data);
      });

      stream.on('error', (error) => {
        onError(error);
      });

      stream.on('end', () => {
        onSuccess(dataArr);
      });

      stream.on('abort', () => {
        onSuccess(dataArr);
      });
    },
  });
  const loading = agent.isRequesting();

  const { onRequest, messages, setMessages } = useXChat({
    agent,
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
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {};
      if (!chunk) {
        return {
          content: originMessage?.content || '',
          role: 'assistant',
        };
      }
      let parsedPayload: { text?: string } | undefined;
      try {
        const payload = (chunk as any).data?.payload || '{}';
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        console.error('Failed to parse payload:', e);
      }
      let content = originMessage?.content || '';
      if (parsedPayload?.text) {
        content += parsedPayload.text;
      }
      return {
        content: content,
        role: 'assistant',
      };
    },
    resolveAbortController: (controller) => {
      // 存储传入的 controller，这个已经包装了 stream.abort() 方法
      abortControllerRef.current = controller;
    },
  });

  // ==================== Event ====================
  const onSubmit = (val: string) => {
    if (!val) return;

    if (loading) {
      message.error('Request is in progress, please wait for the request to complete.');
      return;
    }

    onRequest({
      stream: true,
      message: { role: 'user', content: val },
    });
  };

  const onFooterButtonClick = () => {
    message.info(t['demo-button-no-function']);
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
          if (agent.isRequesting()) {
            message.error(t['request-in-progress']);
            return;
          }

          const now = dayjs().valueOf().toString();
          setConversations([
            {
              key: now,
              label: `${t['new-conversation']} ${conversations.length + 1}`,
              group: t['today'],
            },
            ...conversations,
          ]);
          setCurConversation(now);
          setMessages([]);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        {t['new-conversation']}
      </Button>

      {/* 🌟 会话管理 */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={async (val) => {
          if (agent.isRequesting()) {
            message.error(t['request-in-progress']);
            return;
          }
          abortControllerRef.current?.abort();
          // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
          // In future versions, the sessionId capability will be added to resolve this problem.
          setTimeout(() => {
            setCurConversation(val);
            setMessages(messageHistory?.[val] || []);
          }, 100);
        }}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: t['rename'],
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: t['delete'],
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter((item) => item.key !== conversation.key);
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                // This feature will be fixed in a future version.
                setTimeout(() => {
                  if (conversation.key === curConversation) {
                    setCurConversation(newKey);
                    setMessages(messageHistory?.[newKey] || []);
                  }
                }, 200);
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
            typing: i.status === 'loading' ? { suffix: <>💗</> } : false,
          }))}
          style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }}
          roles={{
            assistant: {
              placement: 'start',
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
              loadingRender: () => <Spin size="small" />,
            },
            user: { placement: 'end' },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          style={{ paddingInline: 'calc(calc(100% - 700px) /2)' }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title={t['hello-antd-x-tbox-agent']}
            description={t['antd-x-tbox-description']}
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
          abortControllerRef.current?.abort();
        }}
        loading={loading}
        className={styles.sender}
        actions={(_, info) => {
          const { SendButton, LoadingButton } = info.components;
          return (
            <Flex gap={4}>
              {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
            </Flex>
          );
        }}
        placeholder={t['ask-me-anything']}
      />
    </>
  );

  useEffect(() => {
    // history mock
    if (messages?.length) {
      setMessageHistory((prev) => ({
        ...prev,
        [curConversation]: messages,
      }));
    }
  }, [messages]);

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
