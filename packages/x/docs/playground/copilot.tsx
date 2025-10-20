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
import type { BubbleListProps, ConversationItemType } from '@ant-design/x';
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
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import type { SSEFields } from '@ant-design/x-sdk';
import {
  DeepSeekChatProvider,
  useXChat,
  useXConversations,
  XModelParams,
  XModelResponse,
  XRequest,
} from '@ant-design/x-sdk';
import { Button, Flex, GetProp, GetRef, Image, message, Popover, Space } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import locale from './_utils/local';

const DEFAULT_CONVERSATIONS_ITEMS: ConversationItemType[] = [
  {
    key: '5',
    label: locale.newSession,
    group: locale.today,
  },
  {
    key: '4',
    label: locale.whatHasAntDesignXUpgraded,
    group: locale.today,
  },
  {
    key: '3',
    label: locale.newAgiHybridInterface,
    group: locale.today,
  },
  {
    key: '2',
    label: locale.howToQuicklyInstallAndImportComponents,
    group: locale.yesterday,
  },
  {
    key: '1',
    label: locale.whatIsAntDesignX,
    group: locale.yesterday,
  },
];
const MOCK_SUGGESTIONS = [
  { label: locale.writeAReport, value: 'report' },
  { label: locale.drawAPicture, value: 'draw' },
  {
    label: locale.checkSomeKnowledge,
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      { label: locale.aboutReact, value: 'react' },
      { label: locale.aboutAntDesign, value: 'antd' },
    ],
  },
];
const MOCK_QUESTIONS = [
  locale.whatHasAntDesignXUpgraded,
  locale.whatComponentsAreInAntDesignX,
  locale.howToQuicklyInstallAndImportComponents,
];

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
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
  };
});

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

const role: BubbleListProps['role'] = {
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
    contentRender(content: string) {
      const newContent = content.replace('/\n\n/g', '<br/><br/>');
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
};

const Copilot = (props: CopilotProps) => {
  const { copilotOpen, setCopilotOpen } = props;
  const { styles } = useCopilotStyle();
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);

  // ==================== State ====================
  const {
    conversations,
    activeConversationKey,
    setActiveConversationKey,
    addConversation,
    getConversation,
    setConversation,
  } = useXConversations({
    defaultConversations: DEFAULT_CONVERSATIONS_ITEMS,
    defaultActiveConversationKey: DEFAULT_CONVERSATIONS_ITEMS[0].key,
  });
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);

  const [inputValue, setInputValue] = useState('');

  // ==================== Runtime ====================

  const { onRequest, messages, isRequesting, abort } = useXChat({
    provider: providerFactory(activeConversationKey), // every conversation has its own provider
    conversationKey: activeConversationKey,
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: 'assistant',
      };
    },
    requestFallback: (message, info) => {
      console.log(message, info);
      return message;
    },
  });

  // ==================== Event ====================
  const handleUserSubmit = (val: string) => {
    onRequest({
      messages: [{ role: 'user', content: val }],
    });

    // session title mock
    const conversation = getConversation(activeConversationKey);
    if (conversation?.label === locale.newSession) {
      setConversation(activeConversationKey, { ...conversation, label: val?.slice(0, 20) });
    }
  };

  const onPasteFile = (files: FileList) => {
    for (const file of files) {
      attachmentsRef.current?.upload(file);
    }
    setAttachmentsOpen(true);
  };

  // ==================== Nodes ====================
  const chatHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>✨ {locale.aiCopilot}</div>
      <Space size={0}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (messages?.length) {
              const timeNow = dayjs().valueOf().toString();
              addConversation({ key: timeNow, label: 'New session', group: 'Today' });
              setActiveConversationKey(timeNow);
            } else {
              message.error(locale.itIsNowANewConversation);
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
                i.key === activeConversationKey ? { ...i, label: `[current] ${i.label}` } : i,
              )}
              activeKey={activeConversationKey}
              groupable
              onActiveChange={setActiveConversationKey}
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
            status: i.status,
            loading: i.status === 'loading',
          }))}
          role={role}
        />
      ) : (
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant="borderless"
            title={`👋 ${locale.helloImAntDesignX}`}
            description={locale.baseOnAntDesign}
            className={styles.chatWelcome}
          />

          <Prompts
            vertical
            title={locale.iCanHelp}
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
      title={locale.uploadFile}
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
            ? { title: locale.dropFileHere }
            : {
                icon: <CloudUploadOutlined />,
                title: locale.uploadFiles,
                description: locale.clickOrDragFilesToThisAreaToUpload,
              }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <Flex vertical gap={12} className={styles.chatSend}>
      <Flex gap={12} align="center">
        <Button
          icon={<ScheduleOutlined />}
          onClick={() => handleUserSubmit('What has Ant Design X upgraded?')}
        >
          {locale.upgrades}
        </Button>
        <Button
          icon={<ProductOutlined />}
          onClick={() => handleUserSubmit('What component assets are available in Ant Design X?')}
        >
          {locale.components}
        </Button>
        <Button icon={<AppstoreAddOutlined />}>{locale.more}</Button>
      </Flex>
      {/** 输入框 */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={isRequesting}
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
            placeholder={locale.askOrInputUseSkills}
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
    </Flex>
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
      width: 100%;
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
