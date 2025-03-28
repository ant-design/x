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
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  Conversations,
  Sender,
  Suggestion,
  Welcome,
  XRequest,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import type { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList';
import type { Conversation } from '@ant-design/x/es/conversations';
import { Button, GetProp, GetRef, Popover, Skeleton, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const MOCK_SESSION_LIST = [
  {
    key: '5',
    label: '新会话',
    group: '今天',
  },
  {
    key: '4',
    label: 'Ant Design X 全新升级了什么？',
    group: '今天',
  },
  {
    key: '3',
    label: '全新 AGI 混合界面',
    group: '今天',
  },
  {
    key: '2',
    label: '如何快速安装和引入组件？',
    group: '昨天',
  },
  {
    key: '1',
    label: 'Ant Design X 是什么？',
    group: '昨天',
  },
];
const MOCK_SUGGESTIONS = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];
const MOCK_QUESTIONS = [
  'Ant Design X 全新升级了什么？',
  'Ant Design X 组件资产有哪些？',
  '如何快速安装和引入组件？',
];
const AGENT_PLACEHOLDER = '内容生成中，请稍后···';

const useCopilotStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      box-sizing: border-box;
      color: ${token.colorText};
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 24px;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 10px 14px 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerAction: css`
      display: flex;
      align-items: center;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      overflow: auto;
      padding: 16px;
      flex: 1;
    `,
    chatWelcome: css`
      padding: 12px 16px;
      border-radius: 2px 12px 12px 12px;
      background: ${token.colorBgTextHover};
      margin-bottom: 16px;
    `,
    questionTip: css`
      color: ${token.colorTextDescription};
      font-size: 14px;
    `,
    question: css`
      height: 42px;
      border-radius: 12px;
      margin-top: 12px;
      display: flex;
      padding: 0 12px;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid ${token.colorBorder};
      width: fit-content;
      font-size: 14px;
      &:hover {
        opacity: 0.8;
      }
    `,
    // chatSend 样式
    chatSend: css`
      padding: 12px;
    `,
    sendAction: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    `,
    speechButton: css`
      font-size: 24px;
      color: ${token.colorText} !important;
    `,
  };
});

interface CopilotChatProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

const CopilotChat = (props: CopilotChatProps) => {
  const { copilotOpen, setCopilotOpen } = props;
  const { styles } = useCopilotStyle();
  const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);

  // ==================== State ====================

  const [sessionList] = useState<Conversation[]>(MOCK_SESSION_LIST);
  const [curSession, setCurSession] = useState(sessionList[0].key);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);

  // ==================== Runtime ====================
  const [agent] = useXAgent<BubbleDataType>({
    request: async (params, { onSuccess, onUpdate }) => {
      let fullContent = '';

      const modelRequest = XRequest({
        baseURL: 'https://api.siliconflow.cn/v1/chat/completions',
        model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
        dangerouslyApiKey: 'Bearer sk-ravoadhrquyrkvaqsgyeufqdgphwxfheifujmaoscudjgldr',
      });

      modelRequest.create(
        {
          message: params.message,
          messages: params.messages as Record<string, any>[],
          stream: true,
        },
        {
          onSuccess: () => {
            onSuccess({
              content: fullContent,
              role: 'assistant',
            });
            setLoading(false);
          },
          onError: (error) => {
            console.error('onError', error);
            setLoading(false);
          },
          onUpdate: (msg) => {
            try {
              const parsed = JSON.parse(msg?.data);
              const content = parsed.choices[0].delta.content;
              if (content) {
                fullContent += content;
              }
              onUpdate({
                content: fullContent || AGENT_PLACEHOLDER,
                role: 'assistant',
              });
            } catch (err) {
              console.error('err', err);
            }
          },
        },
      );
    },
  });

  const { messages, onRequest, setMessages } = useXChat<BubbleDataType, BubbleDataType>({
    agent,
    requestPlaceholder: {
      content: AGENT_PLACEHOLDER,
    },
  });

  // ==================== Event ====================
  const handleUserSubmit = (val: string) => {
    onRequest({ content: val, role: 'user' });
    setLoading(true);
  };

  const onPasteFile = (_: File, files: FileList) => {
    for (const file of files) {
      attachmentsRef.current?.upload(file);
    }
    setAttachmentsOpen(true);
  };

  const onSenderChange = (val: string, onTrigger: (info?: boolean) => void) => {
    if (val === '/') {
      onTrigger();
    } else if (!val) {
      onTrigger(false);
    }
    setInputValue(val);
  };

  // ==================== Nodes ====================
  const ChatHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>✨ AI Copilot</div>
      <div className={styles.headerAction}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (messages?.length) {
              setMessages([]);
            } else {
              message.error('当前已是新对话');
            }
          }}
          className={styles.headerButton}
        />
        <Popover
          placement="bottom"
          styles={{ body: { padding: 0, maxHeight: 600 } }}
          content={
            <Conversations
              items={sessionList?.map((i) =>
                i.key === curSession ? { ...i, label: `[当前会话] ${i.label}` } : i,
              )}
              activeKey={curSession}
              groupable
              onActiveChange={setCurSession}
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
      </div>
    </div>
  );

  const ChatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /** 消息列表 */
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            styles: {
              content:
                i.status === 'loading'
                  ? {
                      backgroundImage:
                        'linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)',
                      backgroundSize: '100% 2px',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'bottom',
                    }
                  : {},
            },
          }))}
          roles={{
            assistant: {
              placement: 'start',
              typing: { step: 5, interval: 20 },
              footer: (
                <div style={{ display: 'flex' }}>
                  <Button type="text" size="small" icon={<ReloadOutlined />} />
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} />
                  <Button type="text" size="small" icon={<DislikeOutlined />} />
                </div>
              ),
            },
            user: { placement: 'end' },
          }}
        />
      ) : (
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant="borderless"
            title="👋 Hello, I'm Ant Design X"
            description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
            className={styles.chatWelcome}
          />

          <span className={styles.questionTip}>我可以帮您：</span>
          {MOCK_QUESTIONS.map((i) => (
            <div className={styles.question} key={i} onClick={() => handleUserSubmit(i)}>
              {i}
            </div>
          ))}
        </>
      )}
    </div>
  );

  const SendHeader = (
    <Sender.Header
      title="上传文件"
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
            ? { title: 'Drop file here' }
            : {
                icon: <CloudUploadOutlined />,
                title: 'Upload files',
                description: 'Click or drag files to this area to upload',
              }
        }
      />
    </Sender.Header>
  );
  const ChatSend = (
    <div className={styles.chatSend}>
      <div className={styles.sendAction}>
        <Button icon={<ScheduleOutlined />} onClick={() => handleUserSubmit('全新升级了什么？')}>
          了解升级
        </Button>
        <Button icon={<ProductOutlined />} onClick={() => handleUserSubmit('组件资产有哪些？')}>
          组件资产
        </Button>
        <Button icon={<AppstoreAddOutlined />}>更多</Button>
      </div>

      {/** 输入框 */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={loading}
            value={inputValue}
            onChange={(v) => onSenderChange(v, onTrigger)}
            onSubmit={() => {
              handleUserSubmit(inputValue);
              setInputValue('');
            }}
            onCancel={() => setLoading(false)}
            allowSpeech
            placeholder="问我问题或输入 / 使用技能"
            onKeyDown={onKeyDown}
            header={SendHeader}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 24 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            onPasteFile={onPasteFile}
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } = info.components;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <SpeechButton className={styles.speechButton} />
                  {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
                </div>
              );
            }}
          />
        )}
      </Suggestion>
    </div>
  );

  return (
    <div className={styles.copilotChat} style={{ width: copilotOpen ? 400 : 0 }}>
      {/** 对话区 - header */}
      {ChatHeader}

      {/** 对话区 - 消息列表 */}
      {ChatList}

      {/** 对话区 - 输入框 */}
      {ChatSend}
    </div>
  );
};

const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      display: flex;
      border-radius: 16px;
    `,
    workarea: css`
      flex: 1;
      height: 100%;
      background: ${token.colorBgLayout};
      display: flex;
      flex-direction: column;
    `,
    workareaHeader: css`
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 48px 14px 28px;
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
      line-height: 24px;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
      }
    `,
    workareaBody: css`
      border-radius: 16px;
      flex: 1;
      background: ${token.colorBgContainer};
      padding: 16px;
    `,
  };
});

const Copilot = () => {
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
          <Skeleton />
        </div>
      </div>

      {/** 右侧对话区 */}
      <CopilotChat copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
    </div>
  );
};

export default Copilot;
