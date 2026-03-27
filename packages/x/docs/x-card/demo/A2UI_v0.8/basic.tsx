import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, DatePicker, Radio, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const contentHeader =
  'Hello! Welcome to our online booking service 🎉\n\n Please select your preferred date and time, and we will arrange the best seat for you. We look forward to seeing you!';
const orderConfirmation =
  '✅ Booking confirmed! Your order has been confirmed. We look forward to seeing you!';

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

// ─── Text Component ────────────────────────────────────────────────────────
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

  // If status is success, use success style
  const finalStyle = status === 'success' ? styleMap.success : style;

  return <p style={finalStyle}>{content}</p>;
};

// ─── DateTimeInput Component ───────────────────────────────────────────────────────
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

    // v0.8 format: action.context is an array [{ key, value: { path } }]
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
      placeholder="Select date"
      style={{ width: '100%' }}
    />
  );
};

// ─── BookForm Component ────────────────────────────────────────────────────────────
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
        marginBlock: 16,
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

// ─── ActionButton Component ────────────────────────────────────────────────────────
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

    // v0.8 format: action.context is an array is an array
    // Component has already received path-bound values via props (like res, status)
    // Here we construct context to report to the upper layer
    const context: Record<string, any> = {};

    // Business logic validation
    if (!res?.time || !res?.coffee) {
      context.status = 'error';
      context.errorMessage = 'Please select date and coffee first';
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

// ─── CoffeeList Component ──────────────────────────────────────────────────────────
interface CoffeeItem {
  id?: string | number;
  name: string;
  description?: string;
  price?: number | string;
  image?: string;
  tag?: string;
}

// Default coffee list data
const DEFAULT_COFFEE_LIST: CoffeeItem[] = [
  {
    id: 1,
    name: 'Latte',
    description: 'Espresso + Steamed Milk, smooth and silky',
    price: 32,
    tag: 'Hot',
  },
  { id: 2, name: 'Americano', description: 'Pure bitter aroma, refreshing', price: 25 },
  {
    id: 3,
    name: 'Cappuccino',
    description: 'Rich foam, classic Italian style',
    price: 30,
    tag: 'Recommended',
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
  // If no list is passed, use default data
  const coffeeList = list && list.length > 0 ? list : DEFAULT_COFFEE_LIST;

  const handleSelect = (itemId: string | number) => {
    if (!action?.name) return;

    const selectedCoffee = coffeeList.find((item, index) => (item.id ?? index) === itemId);
    if (!selectedCoffee) return;

    // v0.8 format: action.context is an array
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

// ─── CoffeeResultCard Component ────────────────────────────────────────────────────
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
  const formattedDate = date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '';

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
            {name ?? 'Unknown Coffee'}
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
                Price
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
                Booking Time
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                {date ? dayjs(date).format('YYYY-MM-DD HH:mm') : ''}
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
            Booking confirmed! We look forward to seeing you!
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

// ─── Streaming Text Hook ────────────────────────────────────────────────────────────
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
// v0.8 Agent Command Definition
// ═══════════════════════════════════════════════════════════════════════════════

// v0.8 Command 1: surfaceUpdate - Define component structure
const SurfaceUpdateCommand: XAgentCommand_v0_8 = {
  surfaceUpdate: {
    surfaceId: 'booking',
    components: [
      {
        id: 'title',
        component: {
          Text: {
            text: { literalString: 'Coffee Shop Order' },
            variant: { literalString: 'h1' },
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
            description: { literalString: 'Please select your favorite coffee' },
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
            text: { literalString: 'Confirm Order' },
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

// v0.8 Command 2: dataModelUpdate - Update data model
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

// v0.8 Command 3: beginRendering - Start rendering
const BeginRenderingCommand: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'booking',
    root: 'root',
  },
};

// Result card command
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

// v0.8 Command: Delete booking card
const DeleteBookingCommand: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'booking',
  },
};

// ─── App Component ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  // Command queue: each time a new command is appended, the entire array reference changes to trigger Box/Card's useEffect
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_8[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_8) => {
    if ('surfaceUpdate' in command) {
      const surfaceId = command.surfaceUpdate.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
    }
    // Append to end of queue, ensuring every command is processed by Box/Card
    setCommandQueue((prev) => [...prev, command]);
  };

  /** Handle Card internal action events */
  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'confirm_booking') {
      const { res, status } = payload.context || {};

      if (status === 'success' && res) {
        runFooter();

        // v0.8: Delete booking card first
        onAgentCommand(DeleteBookingCommand);
        // Create result card — command queue guarantees order, no setTimeout needed
        onAgentCommand(ResultSurfaceUpdateCommand(res));
        onAgentCommand(ResultBeginRenderingCommand);
      } else if (status === 'error') {
        console.log('❌ Booking failed:', payload.context?.errorMessage);
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
      // v0.8 command sequence: surfaceUpdate → dataModelUpdate → beginRendering
      // Command queue guarantees sequential processing, no setTimeout magic numbers needed
      onAgentCommand(SurfaceUpdateCommand);
      onAgentCommand(DataModelUpdateCommand);
      onAgentCommand(BeginRenderingCommand);
    }
  }, [streamStatusHeader, sessionKey]);

  const handleReload = useCallback(() => {
    resetHeader();
    resetFooter();
    const deleteCommands: XAgentCommand_v0_8[] = [
      { deleteSurface: { surfaceId: 'booking' } },
      { deleteSurface: { surfaceId: 'result' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);
    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 50);
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
          Reload
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
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
