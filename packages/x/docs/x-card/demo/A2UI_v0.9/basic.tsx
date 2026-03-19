import { Bubble } from '@ant-design/x';
import type { ActionPayload } from '@ant-design/x-card';
import { version, type XAgentCommand_v0_9, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, DatePicker, Radio, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';

const contentHeader =
  '您好！欢迎使用在线预订服务 🎉\n\n 请选择您希望预订的日期和时间，我们将为您安排最合适的座位，期待您的光临～';
const text2 = '请填写下方预订信息并确认';

type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

const role = {
  assistant: {
    contentRender: (content: ContentType) => {
      const contentList = [...content.texts, ...content.card].sort(
        (a, b) => a.timestamp - b.timestamp,
      );
      return contentList.map((node, index) => {
        if ('text' in node && node.text) {
          return <XMarkdown key={index}>{node.text}</XMarkdown>;
        }
        if ('id' in node && node.id) {
          return <XCard.Card key={index} id={node.id} />;
        }
        return null;
      });
    },
  },
};

// ─── Text 组件 ────────────────────────────────────────────────────────────────
interface TextProps {
  text?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | string;
  children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ text, variant, children }) => {
  const content = text ?? children;
  if (!content) return null;
  const styleMap: Record<string, React.CSSProperties> = {
    h1: { fontSize: 20, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' },
    h2: { fontSize: 17, fontWeight: 600, margin: '0 0 8px', color: '#1a1a1a' },
    h3: { fontSize: 15, fontWeight: 600, margin: '0 0 6px', color: '#333' },
    body: { fontSize: 14, color: '#555', margin: 0 },
    success: {
      fontSize: 14,
      fontWeight: 600,
      color: '#52c41a',
      margin: '4px 0 0',
      padding: '6px 10px',
      borderRadius: 8,
      background: '#f6ffed',
      border: '1px solid #b7eb8f',
    },
  };
  const style = styleMap[variant ?? 'body'] ?? styleMap.body;
  return <p style={style}>{content}</p>;
};

// ─── DateTimeInput 组件 ───────────────────────────────────────────────────────
interface DateTimeInputProps {
  action?: { event?: { name?: string } };
  status?: 'success';
  onAction?: (name: string, context: Record<string, any>) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ action, onAction, status }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const disabled = status === 'success';
  const handleChange = (val: Dayjs | null) => {
    setDateValue(val);
    if (!action?.event?.name) return;
    if (val) {
      onAction?.(action.event.name, { selectedDate: val.toISOString() });
    }
  };

  return (
    <DatePicker
      value={dateValue}
      disabled={disabled}
      onChange={handleChange}
      format="YYYY-MM-DD"
      placeholder="请选择日期"
      style={{ width: '100%' }}
    />
  );
};

// ─── BookForm 组件 ────────────────────────────────────────────────────────────
interface BookFormProps {
  children?: React.ReactNode;
}

const BookForm: React.FC<BookFormProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '20px 20px 16px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        minWidth: 280,
        maxWidth: 400,
      }}
    >
      <Space vertical style={{ width: '100%' }} size={12}>
        {children}
      </Space>
    </div>
  );
};

// ─── ActionButton 组件 ────────────────────────────────────────────────────────
interface ActionButtonProps {
  action?: { event?: { name?: string } };
  onAction?: (name: string, context: Record<string, any>) => void;
  variant?: string;
  children?: React.ReactNode;
  status?: 'success';
  selectedDateTime?: string;
  selectedCoffee?: CoffeeItem;
  [key: string]: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onAction,
  variant,
  status,
  children,
  selectedDateTime,
  selectedCoffee,
  ...rest
}) => {
  const handleClick = () => {
    const eventName = action?.event?.name;
    if (eventName && onAction) {
      onAction(eventName, { selectedDateTime, selectedCoffee });
    }
  };

  return (
    <Button
      {...rest}
      disabled={status === 'success'}
      type={variant === 'primary' ? 'primary' : undefined}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

// ─── CoffeeList 组件 ──────────────────────────────────────────────────────────
interface CoffeeItem {
  id?: string | number;
  name: string;
  description?: string;
  price?: number | string;
  image?: string;
  tag?: string;
}

interface CoffeeListProps {
  list?: CoffeeItem[];
  description?: string;
  /** 当前选中项的 id（受控） */
  value?: string | number;
  status?: 'success';
  /** Card 内部 action 触发器，选中时上报 select_coffee 事件 */
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: { event?: { name?: string } };
}

const CoffeeList: React.FC<CoffeeListProps> = ({ list, description, onAction, status, action }) => {
  if (!list || list.length === 0) return null;

  const handleSelect = (itemId: string | number) => {
    if (!action?.event?.name) return;
    const selectedCoffee = list.find((item, index) => (item.id ?? index) === itemId);
    onAction?.(action?.event?.name, { selectedCoffee });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'opacity 0.2s',
      }}
    >
      {description && (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          📋 {description}
        </Typography.Text>
      )}
      <Radio.Group
        onChange={(e) => handleSelect(e.target.value)}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
        disabled={status === 'success'}
        options={list.map((item, index) => ({
          value: item.id ?? index,
          label: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                transition: 'background 0.2s',
              }}
            >
              {/* 图片 / 占位图标 */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #6b3520 0%, #c8855a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 24 }}>☕</span>
                )}
              </div>

              {/* 文字信息 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Typography.Text
                    strong
                    style={{ fontSize: 14, color: '#1a1a1a', lineHeight: '20px' }}
                  >
                    {item.name}
                  </Typography.Text>
                  {item.tag && (
                    <Tag
                      style={{
                        fontSize: 11,
                        padding: '0 6px',
                        lineHeight: '18px',
                        borderRadius: 8,
                        color: '#d46b08',
                        background: '#fff7e6',
                        border: '1px solid #ffd591',
                        margin: 0,
                      }}
                    >
                      {item.tag}
                    </Tag>
                  )}
                </div>
                {item.description && (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, lineHeight: '18px', display: 'block' }}
                    ellipsis
                  >
                    {item.description}
                  </Typography.Text>
                )}
              </div>

              {/* 价格 */}
              {item.price !== undefined && (
                <Typography.Text
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#d46b08',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ¥{item.price}
                </Typography.Text>
              )}
            </div>
          ),
        }))}
      />
    </div>
  );
};

// ─── CoffeeResultCard 组件 ────────────────────────────────────────────────────
interface CoffeeResultCardProps {
  name?: string;
  description?: string;
  price?: number | string;
  tag?: string;
  image?: string;
  date?: string;
}

const CoffeeResultCard: React.FC<CoffeeResultCardProps> = ({
  name,
  description,
  price,
  tag,
  image,
  date,
}) => {
  const formattedDate = date ? dayjs(date).format('YYYY年MM月DD日 HH:mm') : '';

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #3d1f0d 0%, #6b3520 50%, #8b5a2b 100%)',
        boxShadow: '0 8px 32px rgba(61,31,13,0.35)',
        minWidth: 280,
        maxWidth: 380,
        position: 'relative',
      }}
    >
      {/* 顶部装饰光晕 */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />

      {/* 咖啡图标区域 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '28px 24px 16px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 40 }}>☕</span>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ padding: '0 24px 24px' }}>
        {/* 标题行 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Typography.Text
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: 0.5,
            }}
          >
            {name ?? '未知咖啡'}
          </Typography.Text>
          {tag && (
            <Tag
              style={{
                background: 'rgba(255,200,100,0.25)',
                border: '1px solid rgba(255,200,100,0.5)',
                color: '#ffd580',
                fontSize: 11,
                padding: '0 7px',
                lineHeight: '20px',
                borderRadius: 10,
              }}
            >
              {tag}
            </Tag>
          )}
        </div>

        {/* 描述 */}
        {description && (
          <Typography.Text
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: 13,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: 16,
            }}
          >
            {description}
          </Typography.Text>
        )}

        {/* 分割线 */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.12)',
            margin: '0 0 16px',
          }}
        />

        {/* 价格 & 日期信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {price !== undefined ? (
            <div>
              <Typography.Text
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block' }}
              >
                价格
              </Typography.Text>
              <Typography.Text style={{ fontSize: 20, fontWeight: 700, color: '#ffd580' }}>
                ¥{price}
              </Typography.Text>
            </div>
          ) : (
            <div />
          )}

          {formattedDate && (
            <div style={{ textAlign: 'right' }}>
              <Typography.Text
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block' }}
              >
                预订时间
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                {formattedDate}
              </Typography.Text>
            </div>
          )}
        </div>

        {/* 底部成功标签 */}
        <div
          style={{
            marginTop: 16,
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(82,196,26,0.15)',
            border: '1px solid rgba(82,196,26,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 14 }}>✅</span>
          <Typography.Text style={{ fontSize: 13, color: '#95de64', fontWeight: 500 }}>
            预订成功，期待您的光临！
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

// ─── 流式文本 Hook ────────────────────────────────────────────────────────────
const useStreamText = (text: string) => {
  const textRef = React.useRef(0);
  const [textIndex, setTextIndex] = React.useState(textRef.current);
  const textTimestamp = React.useRef(0);
  const [streamStatus, setStreamStatus] = useState('INIT');
  const run = () => {
    const timer = setInterval(() => {
      if (textRef.current < text.length) {
        if (textTimestamp.current === 0) {
          textTimestamp.current = Date.now();
          setStreamStatus('RUNNING');
        }
        textRef.current = Math.min(textRef.current + 3, text.length);
        setTextIndex(textRef.current);
      } else {
        setStreamStatus('FINISHED');
        clearInterval(timer);
      }
    }, 100);
  };
  return { text: text.slice(0, textIndex), streamStatus, timestamp: textTimestamp.current, run };
};

// ─── Agent 指令 ───────────────────────────────────────────────────────────────
const CreateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'booking',
    catalogId: 'https://a2ui.org/specification/v0_9/basic_catalog.json',
  },
};

const UpdateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'booking',
    components: [
      {
        id: 'title',
        component: 'Text',
        text: '咖啡店单机',
        variant: 'h1',
      },
      {
        id: 'datetime',
        component: 'DateTimeInput',
        status: { path: '/booking/status' },
        action: {
          event: { name: 'select_date' },
        },
      },
      {
        id: 'submit-text',
        component: 'Text',
        text: '确定点单',
      },
      {
        component: 'CoffeeList',
        status: { path: '/booking/status' },
        list: { path: '/booking/list/data' },
        description: { path: '/booking/list/description' },
        id: 'coffee_list',
        action: {
          event: { name: 'select_coffee' },
        },
      },
      {
        id: 'status-text',
        component: 'Text',
        status: { path: '/booking/status' },
        variant: 'success',
      },
      {
        id: 'submit-btn',
        component: 'ActionButton',
        child: 'submit-text',
        variant: 'primary',
        status: { path: '/booking/status' },
        selectedDateTime: { path: '/booking/date' },
        selectedCoffee: { path: '/booking/selectedCoffee' },
        action: { event: { name: 'confirm_booking' } },
      },
      {
        id: 'root',
        component: 'BookForm',
        children: ['title', 'datetime', 'coffee_list', 'status-text', 'submit-btn'],
      },
    ],
  },
};

const UpdateModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'booking',
    path: '/booking',
    value: {
      date: '2025-12-16T19:00:00Z',
      list: {
        description: '咖啡列表',
        data: [
          {
            id: 1,
            name: '拿铁咖啡',
            description: '浓缩 + 蒸汽牛奶，丝滑顺口',
            price: 32,
            tag: '热销',
          },
          { id: 2, name: '美式咖啡', description: '纯粹苦香，清爽提神', price: 25 },
          {
            id: 3,
            name: '卡布奇诺',
            description: '奶泡丰富，经典意式风味',
            price: 30,
            tag: '推荐',
          },
        ],
      },
    },
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commands, setCommands] = useState<XAgentCommand_v0_9>();
  const onAgentCommand = (command: XAgentCommand_v0_9) => {
    if ('createSurface' in command) {
      const surfaceId = command.createSurface.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
      setCommands(command);
    } else {
      setCommands(command);
    }
  };

  /** 处理 Card 内部 action 事件 */
  const handleAction = (payload: ActionPayload) => {
    // 用户选择日期时，更新数据模型
    if (payload.name === 'select_date') {
      onAgentCommand({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: payload.surfaceId,
          path: '/booking/date',
          value: payload.context?.selectedDate,
        },
      });
      return;
    }

    // 用户选中咖啡时，记录选中项
    if (payload.name === 'select_coffee') {
      const selectedCoffee = payload.context?.selectedCoffee;
      onAgentCommand({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: payload.surfaceId,
          path: '/booking/selectedCoffee',
          value: {
            id: selectedCoffee.id,
            name: selectedCoffee.name,
            description: selectedCoffee.description,
            price: selectedCoffee.price,
            tag: selectedCoffee.tag,
          },
        },
      });
      return;
    }

    if (payload.name === 'confirm_booking') {
      onAgentCommand({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: payload.surfaceId,
          path: '/booking/status',
          value: 'success',
        },
      });
    }
  };

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    timestamp: timestampHeader,
    run: runHeader,
  } = useStreamText(contentHeader);
  const { text: textFooter, timestamp: timestampFooter, run: runFooter } = useStreamText(text2);

  useEffect(() => {
    runHeader();
  }, []);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      onAgentCommand(CreateCard);
      // 逐帧发送，确保每条指令独立触发 Card 的 useEffect
      setTimeout(() => onAgentCommand(UpdateCard), 0);
      setTimeout(() => onAgentCommand(UpdateModel), 16);
      runFooter();
    }
  }, [streamStatusHeader]);

  const items = [
    {
      content: {
        texts: [
          { text: textHeader, timestamp: timestampHeader },
          { text: textFooter, timestamp: timestampFooter },
        ].filter((item) => item.timestamp !== 0),
        card,
      } as ContentType,
      role: 'assistant',
      key: '1',
    },
  ];

  return (
    <div>
      {version}
      <XCard.Box
        commands={commands}
        onAction={handleAction}
        components={{
          Text,
          DateTimeInput,
          BookForm,
          ActionButton,
          CoffeeList,
          CoffeeResultCard,
        }}
      >
        <Bubble.List items={items} style={{ height: 620 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
