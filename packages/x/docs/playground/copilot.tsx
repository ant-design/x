import {
  AppstoreAddOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  OpenAIFilled,
  PaperClipOutlined,
  PlusOutlined,
  ProductOutlined,
  ReloadOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import type { ConversationItemType } from '@ant-design/x';
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Suggestion,
  Think,
  Welcome,
} from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { SSEFields } from '@ant-design/x-sdk';
import {
  DeepSeekChatProvider,
  useXChat,
  useXConversations,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, GetProp, GetRef, Image, message, Popover, Space, Spin } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

const zhCN = {
  'AI Copilot': 'AI 助手',
  'New session': '新会话',
  Today: '今天',
  'What has Ant Design X upgraded?': 'Ant Design X 有哪些升级？',
  'What components are in Ant Design X?': 'Ant Design X 有哪些组件',
  'New AGI Hybrid Interface': '新的 AGI 混合界面',
  Yesterday: '昨天',
  'How to quickly install and import components?': '如何快速安装和导入组件？',
  'What is Ant Design X?': '什么是 Ant Design X？',
  'Write a report': '写报告',
  'Draw a picture': '画图',
  'Check some knowledge': '查看知识',
  'About React': '关于 React',
  'About Ant Design': '关于 Ant Design',
  'Generating content, please wait...': '正在生成内容，请稍候...',
  'Message is Requesting, you can create a new conversation after request done or abort it right now...':
    '消息正在请求中，您可以在请求完成后创建新对话或立即中止...',
  'It is now a new conversation.': '当前已经是新会话',
  'Request is aborted': '请求已中止',
  'Request failed, please try again!': '请求失败，请重试！',
  'Upload File': '上传文件',
  'Drop file here': '将文件拖到此处',
  'Upload files': '上传文件',
  'Click or drag files to this area to upload': '点击或将文件拖到此处上传',
  'Ask or input / use skills': '提问或输入 / 使用技能',
  Upgrades: '升级',
  Components: '组件',
  More: '更多',
  "Hello, I'm Ant Design X": '你好，我是 Ant Design X',
  'Base on Ant Design, AGI product interface solution, create a better intelligent vision~':
    '基于 Ant Design，AGI 产品界面解决方案，创造更智能的视觉体验~',
  'I can help:': '我可以帮助：',
  'Deep thinking': '深度思考中',
  'Complete thinking': '深度思考完成',
};

const enUS = {
  'AI Copilot': 'AI Copilot',
  'New session': 'New session',
  Today: 'Today',
  'What has Ant Design X upgraded?': 'What has Ant Design X upgraded?',
  'What components are in Ant Design X?': 'What components are in Ant Design X?',
  'New AGI Hybrid Interface': 'New AGI Hybrid Interface',
  Yesterday: 'Yesterday',
  'How to quickly install and import components?': 'How to quickly install and import components?',
  'What is Ant Design X?': 'What is Ant Design X?',
  'Write a report': 'Write a report',
  'Draw a picture': 'Draw a picture',
  'Check some knowledge': 'Check some knowledge',
  'About React': 'About React',
  'About Ant Design': 'About Ant Design',
  'Generating content, please wait...': 'Generating content, please wait...',
  'Message is Requesting, you can create a new conversation after request done or abort it right now...':
    'Message is Requesting, you can create a new conversation after request done or abort it right now...',
  'It is now a new conversation.': 'It is now a new conversation.',
  'Request is aborted': 'Request is aborted',
  'Request failed, please try again!': 'Request failed, please try again!',
  'Upload File': 'Upload File',
  'Drop file here': 'Drop file here',
  'Upload files': 'Upload files',
  'Click or drag files to this area to upload': 'Click or drag files to this area to upload',
  'Ask or input / use skills': 'Ask or input / use skills',
  Upgrades: 'Upgrades',
  Components: 'Components',
  More: 'More',
  "Hello, I'm Ant Design X": "Hello, I'm Ant Design X",
  'Base on Ant Design, AGI product interface solution, create a better intelligent vision~':
    'Base on Ant Design, AGI product interface solution, create a better intelligent vision~',
  'I can help:': 'I can help:',
  'Deep thinking': 'Deep Thinking',
  'Complete thinking': 'Complete Thinking',
};

const isZhCN = window.parent?.location?.pathname?.includes('-cn');
const t = isZhCN ? zhCN : enUS;

const DEFAULT_CONVERSATIONS_ITEMS: ConversationItemType[] = [
  {
    key: '5',
    label: t['New session'],
    group: t['Today'],
  },
  {
    key: '4',
    label: t['What has Ant Design X upgraded?'],
    group: t['Today'],
  },
  {
    key: '3',
    label: t['New AGI Hybrid Interface'],
    group: t['Today'],
  },
  {
    key: '2',
    label: t['How to quickly install and import components?'],
    group: t['Yesterday'],
  },
  {
    key: '1',
    label: t['What is Ant Design X?'],
    group: t['Yesterday'],
  },
];
const MOCK_SUGGESTIONS = [
  { label: t['Write a report'], value: 'report' },
  { label: t['Draw a picture'], value: 'draw' },
  {
    label: t['Check some knowledge'],
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      { label: t['About React'], value: 'react' },
      { label: t['About Ant Design'], value: 'antd' },
    ],
  },
];
const MOCK_QUESTIONS = [
  t['What has Ant Design X upgraded?'],
  t['What components are in Ant Design X?'],
  t['How to quickly install and import components?'],
];
const AGENT_PLACEHOLDER = t['Generating content, please wait...'];

const useCopilotStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      color: ${token.colorText};
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      width: 300px;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      margin-block-start: ${token.margin}px;
      display: flex;
      height: calc(100% - 194px);
      flex-direction: column;
    `,
    chatWelcome: css`
      margin-inline: ${token.margin}px;
      padding: 12px 16px;
      border-radius: 2px 12px 12px 12px;
      background: ${token.colorBgTextHover};
      margin-bottom: ${token.margin}px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    // chatSend 样式
    chatSend: css`
      padding: ${token.padding}px;
    `,
    sendAction: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      justify-content:space-between;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
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

interface CopilotProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

const Copilot = (props: CopilotProps) => {
  const { copilotOpen, setCopilotOpen } = props;
  const { styles } = useCopilotStyle();
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);

  // ==================== State ====================
  const { conversations, addConversation, getConversation, setConversation } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
  });
  const [curConversation, setCurConversation] = useState<string>(
    DEFAULT_CONVERSATIONS_ITEMS[0].key,
  );

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);

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
      return {
        content: t['Request failed, please try again!'],
        role: 'assistant',
      };
    },
  });

  // ==================== Event ====================
  const handleUserSubmit = (val: string) => {
    onRequest({
      messages: [{ role: 'user', content: val }],
    });

    // session title mock
    const conversation = getConversation(curConversation);
    if (conversation?.label === t['New session']) {
      setConversation(curConversation, { ...conversation, label: val?.slice(0, 20) });
    }
  };

  const onPasteFile = (_: File, files: FileList) => {
    for (const file of files) {
      attachmentsRef.current?.upload(file);
    }
    setAttachmentsOpen(true);
  };

  // ==================== Nodes ====================
  const chatHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>✨ {t['AI Copilot']}</div>
      <Space size={0}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (messages?.length) {
              const timeNow = dayjs().valueOf().toString();
              addConversation({ key: timeNow, label: 'New session', group: 'Today' });
              setCurConversation(timeNow);
            } else {
              message.error(t['It is now a new conversation.']);
            }
          }}
          className={styles.headerButton}
        />
        <Popover
          placement="bottom"
          styles={{ body: { padding: 0, maxHeight: 600 } }}
          content={
            <Conversations
              items={conversations?.map((i) =>
                i.key === curConversation ? { ...i, label: `[current] ${i.label}` } : i,
              )}
              activeKey={curConversation}
              groupable
              onActiveChange={async (val) => {
                setCurConversation(val);
              }}
              styles={{ item: { padding: '0 8px' } }}
              className={styles.conversations}
            />
          }
        >
          <Button type="text" icon={<CommentOutlined />} className={styles.headerButton} />
        </Popover>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setCopilotOpen(false)}
          className={styles.headerButton}
        />
      </Space>
    </div>
  );
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /** 消息列表 */
        <Bubble.List
          style={{ paddingInline: 16 }}
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
              loadingRender: () => (
                <Space>
                  <Spin size="small" />
                  {AGENT_PLACEHOLDER}
                </Space>
              ),
              contentRender(content: any) {
                const newContent = content.replaceAll('\n\n', '<br/><br/>');
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
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant="borderless"
            title={`👋 ${t["Hello, I'm Ant Design X"]}`}
            description={
              t[
                'Base on Ant Design, AGI product interface solution, create a better intelligent vision~'
              ]
            }
            className={styles.chatWelcome}
          />

          <Prompts
            vertical
            title={t['I can help:']}
            items={MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))}
            onItemClick={(info) => handleUserSubmit(info?.data?.description as string)}
            style={{
              marginInline: 16,
            }}
            styles={{
              title: { fontSize: 14 },
            }}
          />
        </>
      )}
    </div>
  );
  const sendHeader = (
    <Sender.Header
      title={t['Upload File']}
      styles={{ content: { padding: 0 } }}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={() => false}
        items={files}
        onChange={({ fileList }) => setFiles(fileList)}
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
    <div className={styles.chatSend}>
      <div className={styles.sendAction}>
        <Button
          icon={<ScheduleOutlined />}
          onClick={() => handleUserSubmit('What has Ant Design X upgraded?')}
        >
          {t['Upgrades']}
        </Button>
        <Button
          icon={<ProductOutlined />}
          onClick={() => handleUserSubmit('What component assets are available in Ant Design X?')}
        >
          {t['Components']}
        </Button>
        <Button icon={<AppstoreAddOutlined />}>{t['More']}</Button>
      </div>

      {/** 输入框 */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={requesting}
            value={inputValue}
            onChange={(v) => {
              onTrigger(v === '/');
              setInputValue(v);
            }}
            onSubmit={() => {
              handleUserSubmit(inputValue);
              setInputValue('');
            }}
            onCancel={() => {
              abort();
            }}
            allowSpeech
            placeholder={t['Ask or input / use skills']}
            onKeyDown={onKeyDown}
            header={sendHeader}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            onPasteFile={onPasteFile}
          />
        )}
      </Suggestion>
    </div>
  );

  return (
    <div className={styles.copilotChat} style={{ width: copilotOpen ? 400 : 0 }}>
      {/** 对话区 - header */}
      {chatHeader}

      {/** 对话区 - 消息列表 */}
      {chatList}

      {/** 对话区 - 输入框 */}
      {chatSender}
    </div>
  );
};

const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
      min-width: 1000px;
      height: 100vh;
      display: flex;
    `,
    workarea: css`
      flex: 1;
      background: ${token.colorBgLayout};
      display: flex;
      flex-direction: column;
    `,
    workareaHeader: css`
      box-sizing: border-box;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px 0 28px;
      border-bottom: 1px solid ${token.colorBorder};
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
      color: ${token.colorText};
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    headerButton: css`
      background-image: linear-gradient(78deg, #8054f2 7%, #3895da 95%);
      border-radius: 12px;
      height: 24px;
      width: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      &:hover {
        opacity: 0.8;
      }
    `,
    workareaBody: css`
      flex: 1;
      padding: ${token.padding}px;
      background: ${token.colorBgContainer};
      border-radius: ${token.borderRadius}px;
      min-height: 0;
    `,
    bodyContent: css`
      overflow: auto;
      height: 100%;
      padding-right: 10px;
    `,
    bodyText: css`
      color: ${token.colorText};
      padding: 8px;
    `,
  };
});

const CopilotDemo = () => {
  const { styles: workareaStyles } = useWorkareaStyle();

  // ==================== State =================
  const [copilotOpen, setCopilotOpen] = useState(true);

  // ==================== Render =================
  return (
    <div className={workareaStyles.copilotWrapper}>
      {/** 左侧工作区 */}
      <div className={workareaStyles.workarea}>
        <div className={workareaStyles.workareaHeader}>
          <div className={workareaStyles.headerTitle}>
            <img
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
              draggable={false}
              alt="logo"
              width={20}
              height={20}
            />
            Ant Design X
          </div>
          {!copilotOpen && (
            <div onClick={() => setCopilotOpen(true)} className={workareaStyles.headerButton}>
              ✨ AI Copilot
            </div>
          )}
        </div>

        <div
          className={workareaStyles.workareaBody}
          style={{ margin: copilotOpen ? 16 : '16px 48px' }}
        >
          <div className={workareaStyles.bodyContent}>
            <Image
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp"
              preview={false}
            />
            <div className={workareaStyles.bodyText}>
              <h4>What is the RICH design paradigm?</h4>
              <div>
                RICH is an AI interface design paradigm we propose, similar to how the WIMP paradigm
                relates to graphical user interfaces.
              </div>
              <br />
              <div>
                The ACM SIGCHI 2005 (the premier conference on human-computer interaction) defined
                that the core issues of human-computer interaction can be divided into three levels:
              </div>
              <ul>
                <li>
                  Interface Paradigm Layer: Defines the design elements of human-computer
                  interaction interfaces, guiding designers to focus on core issues.
                </li>
                <li>
                  User model layer: Build an interface experience evaluation model to measure the
                  quality of the interface experience.
                </li>
                <li>
                  Software framework layer: The underlying support algorithms and data structures
                  for human-computer interfaces, which are the contents hidden behind the front-end
                  interface.
                </li>
              </ul>
              <div>
                The interface paradigm is the aspect that designers need to focus on and define the
                most when a new human-computer interaction technology is born. The interface
                paradigm defines the design elements that designers should pay attention to, and
                based on this, it is possible to determine what constitutes good design and how to
                achieve it.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** 右侧对话区 */}
      <Copilot copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
    </div>
  );
};

export default CopilotDemo;
