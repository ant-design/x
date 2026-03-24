import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, DatePicker, Radio, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const contentHeader =
  '您好！欢迎使用在线预订服务 🎉\n\n 请选择您希望预订的日期和时间，我们将为您安排最合适的座位，期待您的光临～';
const orderConfirmation = '✅ 预订成功！您的订单已确认，期待您的光临～';

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
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'success' | string;
  children?: React.ReactNode;
  status?: string;
}

const Text: React.FC<TextProps> = ({ text, variant, children, status }) => {
  const content = text ?? children;
  if (!content) return null;
  const styleMap: Record<string, React.CSSProperties> = {
    h1: { fontSize: 20, fontWeight: 700, margin: '0 0 12px' },
    h2: { fontSize: 17, fontWeight: 600, margin: '0 0 8px' },
    h3: { fontSize: 15, fontWeight: 600, margin: '0 0 6px' },
    body: { fontSize: 14, margin: 0 },
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

  // 如果有 status 且为 success，使用 success 样式
  const finalStyle = status === 'success' ? styleMap.success : style;

  return <p style={finalStyle}>{content}</p>;
};

// ─── DateTimeInput 组件 ───────────────────────────────────────────────────────
interface DateTimeInputProps {
  action?: {
    name: string;
    context?: Array<{ key: string; value: { path: string } }>;
  };
  status?: 'success';
  onAction?: (name: string, context: Record<string, any>) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ action, onAction, status }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const disabled = status === 'success';

  const handleChange = (val: Dayjs | null) => {
    setDateValue(val);
    if (!action?.name || !val) return;

    // v0.8 格式: action.context 是数组 [{ key, value: { path } }]
    const context: Record<string, any> = {};
    if (action.context) {
      action.context.forEach((item) => {
        context[item.key] = val.toISOString();
      });
    }

    onAction?.(action.name, context);
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
  action?: {
    name: string;
    context?: Array<{ key: string; value: { path: string } }>;
  };
  onAction?: (name: string, context: Record<string, any>) => void;
  variant?: string;
  children?: React.ReactNode;
  status?: 'success' | 'error' | 'loading';
  res?: any;
  [key: string]: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onAction,
  variant,
  status: currentStatus,
  children,
  res,
  ...rest
}) => {
  const handleClick = () => {
    const eventName = action?.name;
    if (!eventName || !onAction) return;

    // v0.8 格式: action.context 是数组
    // 组件已经通过 props 接收了路径绑定的值（如 res、status）
    // 这里构造 context 上报给上层
    const context: Record<string, any> = {};

    // 业务逻辑验证
    if (!res?.time || !res?.coffee) {
      context.status = 'error';
      context.errorMessage = '请先选择日期和咖啡';
    } else {
      context.status = 'success';
      context.res = res;
    }

    onAction(eventName, context);
  };

  return (
    <Button
      {...rest}
      disabled={currentStatus === 'success'}
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

// 默认咖啡列表数据
const DEFAULT_COFFEE_LIST: CoffeeItem[] = [
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
];

interface CoffeeListProps {
  list?: CoffeeItem[];
  description?: string;
  value?: string | number;
  status?: 'success';
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: {
    name: string;
    context?: Array<{ key: string; value: { path: string } }>;
  };
}

const CoffeeList: React.FC<CoffeeListProps> = ({ list, description, onAction, status, action }) => {
  // 如果没有传入 list，使用默认数据
  const coffeeList = list && list.length > 0 ? list : DEFAULT_COFFEE_LIST;

  const handleSelect = (itemId: string | number) => {
    if (!action?.name) return;

    const selectedCoffee = coffeeList.find((item, index) => (item.id ?? index) === itemId);
    if (!selectedCoffee) return;

    // v0.8 格式: action.context 是数组
    const context: Record<string, any> = {};
    if (action.context) {
      action.context.forEach((item) => {
        context[item.key] = selectedCoffee;
      });
    }

    onAction?.(action.name, context);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {description && (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          📋 {description}
        </Typography.Text>
      )}
      <Radio.Group
        onChange={(e) => handleSelect(e.target.value)}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
        disabled={status === 'success'}
        options={coffeeList.map((item, index) => ({
          value: item.id ?? index,
          label: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: 300,
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
              }}
            >
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
                }}
              >
                <span style={{ fontSize: 24 }}>☕</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Typography.Text strong style={{ fontSize: 14 }}>
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
                  <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                    {item.description}
                  </Typography.Text>
                )}
              </div>
              {item.price !== undefined && (
                <Typography.Text style={{ fontSize: 15, fontWeight: 700, color: '#d46b08' }}>
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
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px 16px' }}>
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
          }}
        >
          <span style={{ fontSize: 40 }}>☕</span>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Typography.Text style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
            {name ?? '未知咖啡'}
          </Typography.Text>
          {tag && (
            <Tag
              style={{
                background: 'rgba(255,200,100,0.25)',
                border: '1px solid rgba(255,200,100,0.5)',
                color: '#ffd580',
                fontSize: 11,
              }}
            >
              {tag}
            </Tag>
          )}
        </div>

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

        <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 0 16px' }} />

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
  const [textIndex, setTextIndex] = React.useState(0);
  const textTimestamp = React.useRef(0);
  const [streamStatus, setStreamStatus] = useState('INIT');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const run = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (textRef.current < text.length) {
        if (textTimestamp.current === 0) {
          textTimestamp.current = Date.now();
          setStreamStatus('RUNNING');
        }
        textRef.current = Math.min(textRef.current + 3, text.length);
        setTextIndex(textRef.current);
      } else {
        setStreamStatus('FINISHED');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);
  }, [text]);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    textRef.current = 0;
    textTimestamp.current = 0;
    setTextIndex(0);
    setStreamStatus('INIT');
  }, []);

  return {
    text: text.slice(0, textIndex),
    streamStatus,
    timestamp: textTimestamp.current,
    run,
    reset,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// v0.8 Agent 命令定义
// ═══════════════════════════════════════════════════════════════════════════════

// v0.8 命令 1: surfaceUpdate - 定义组件结构
const SurfaceUpdateCommand: XAgentCommand_v0_8 = {
  surfaceUpdate: {
    surfaceId: 'booking',
    components: [
      {
        id: 'title',
        component: {
          Text: {
            text: { literalString: '咖啡店单机' },
            usageHint: 'h1',
          },
        },
      },
      {
        id: 'datetime',
        component: {
          DateTimeInput: {
            status: { path: '/status' },
            action: {
              name: 'select_date',
              context: [
                {
                  key: 'time',
                  value: { path: '/res/time' },
                },
              ],
            },
          },
        },
      },
      {
        id: 'coffee_list',
        component: {
          CoffeeList: {
            description: { literalString: '请选择您喜欢的咖啡' },
            status: { path: '/status' },
            action: {
              name: 'select_coffee',
              context: [
                {
                  key: 'coffee',
                  value: { path: '/res/coffee' },
                },
              ],
            },
          },
        },
      },
      {
        id: 'status-text',
        component: {
          Text: {
            status: { path: '/status' },
            variant: { literalString: 'success' },
          },
        },
      },
      {
        id: 'submit-text',
        component: {
          Text: {
            text: { literalString: '确定点单' },
          },
        },
      },
      {
        id: 'submit-btn',
        component: {
          ActionButton: {
            child: 'submit-text',
            variant: { literalString: 'primary' },
            status: { path: '/status' },
            res: { path: '/res' },
            action: {
              name: 'confirm_booking',
              context: [
                { key: 'status', value: { path: '/status' } },
                { key: 'res', value: { path: '/res' } },
              ],
            },
          },
        },
      },
      {
        id: 'root',
        component: {
          BookForm: {
            children: {
              explicitList: ['title', 'datetime', 'coffee_list', 'status-text', 'submit-btn'],
            },
          },
        },
      },
    ],
  },
};

// v0.8 命令 2: dataModelUpdate - 更新数据模型
const DataModelUpdateCommand: XAgentCommand_v0_8 = {
  dataModelUpdate: {
    surfaceId: 'booking',
    contents: [
      {
        key: 'res',
        valueMap: [{ key: 'time', valueString: new Date().toISOString() }],
      },
    ],
  },
};

// v0.8 命令 3: beginRendering - 开始渲染
const BeginRenderingCommand: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'booking',
    root: 'root',
  },
};

// 结果卡片命令
const ResultSurfaceUpdateCommand = (res: any): XAgentCommand_v0_8 => ({
  surfaceUpdate: {
    surfaceId: 'result',
    components: [
      {
        id: 'result-card',
        component: {
          CoffeeResultCard: {
            name: { literalString: res?.coffee?.name ?? '' },
            description: { literalString: res?.coffee?.description ?? '' },
            price: { literalString: String(res?.coffee?.price ?? '') },
            tag: { literalString: res?.coffee?.tag ?? '' },
            date: { literalString: res?.time ?? '' },
          },
        },
      },
      {
        id: 'root',
        component: {
          BookForm: {
            children: { explicitList: ['result-card'] },
          },
        },
      },
    ],
  },
});

const ResultBeginRenderingCommand: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'result',
    root: 'root',
  },
};

// v0.8 命令: 删除 booking 卡片
const DeleteBookingCommand: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'booking',
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commands, setCommands] = useState<XAgentCommand_v0_8>();
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_8) => {
    if ('surfaceUpdate' in command) {
      const surfaceId = command.surfaceUpdate.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    }
    // 处理删除命令，从 card 列表中移除
    if ('deleteSurface' in command) {
      const surfaceId = command.deleteSurface.surfaceId;
      setCard((prev) => prev.filter((c) => c.id !== surfaceId));
    }
    setCommands(command);
  };

  /** 处理 Card 内部 action 事件 */
  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'confirm_booking') {
      const { res, status } = payload.context || {};

      if (status === 'success' && res) {
        runFooter();

        // v0.8: 先删除 booking 卡片
        onAgentCommand(DeleteBookingCommand);
        // 创建结果卡片
        setTimeout(() => {
          onAgentCommand(ResultSurfaceUpdateCommand(res));
        }, 100);
        setTimeout(() => {
          onAgentCommand(ResultBeginRenderingCommand);
        }, 200);
      } else if (status === 'error') {
        console.log('❌ 预订失败:', payload.context?.errorMessage);
      }
    }
  };

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    timestamp: timestampHeader,
    run: runHeader,
    reset: resetHeader,
  } = useStreamText(contentHeader);

  const {
    text: textFooter,
    timestamp: timestampFooter,
    run: runFooter,
    reset: resetFooter,
  } = useStreamText(orderConfirmation);

  useEffect(() => {
    runHeader();
  }, [sessionKey, runHeader]);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      // v0.8 命令序列：
      // 1. surfaceUpdate - 定义组件结构
      onAgentCommand(SurfaceUpdateCommand);
      // 2. dataModelUpdate - 填充数据
      setTimeout(() => onAgentCommand(DataModelUpdateCommand), 16);
      // 3. beginRendering - 触发渲染
      setTimeout(() => onAgentCommand(BeginRenderingCommand), 32);
    }
  }, [streamStatusHeader, sessionKey]);

  const handleReload = useCallback(() => {
    resetHeader();
    resetFooter();
    setCard([]);
    setSessionKey((prev) => prev + 1);
  }, [resetHeader, resetFooter]);

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
      key: sessionKey,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={handleReload}>
          重新加载
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
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
