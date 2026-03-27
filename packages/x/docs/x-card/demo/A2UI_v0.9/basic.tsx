import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, DatePicker, Radio, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Import local catalog schema
import localCatalog from './catalog.json';

// Register local catalog
registerCatalog(localCatalog as unknown as Catalog);

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

// ─── Text Component ────────────────────────────────────────────────────────────────
interface TextProps {
  text?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | string;
  children?: React.ReactNode;
}

const Text: React.FC<TextProps> = ({ text, variant, children }) => {
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
  return <p style={style}>{content}</p>;
};

// ─── DateTimeInput Component ───────────────────────────────────────────────────────
interface DateTimeInputProps {
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  status?: 'success';
  onAction?: (name: string, context: Record<string, any>) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ action, onAction, status }) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const disabled = status === 'success';

  const handleChange = (val: Dayjs | null) => {
    setDateValue(val);
    if (!action?.event?.name || !val) return;

    // Construct context based on action.event.context keys
    const context: Record<string, any> = {};
    if (action.event.context) {
      // The key in context is the data field that the component needs to pass
      // For example, { time: { path: '/booking/res/time' } } contains 'time'
      Object.keys(action.event.context).forEach((key) => {
        context[key] = val.toISOString();
      });
    }

    onAction?.(action.event.name, context);
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
        minWidth: 280,
        marginBlock: 16,
        maxWidth: 400,
      }}
    >
      <Space vertical style={{ width: '100%' }} size={12}>
        {children}
      </Space>
    </div>
  );
};

interface ActionButtonProps {
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
  variant?: string;
  children?: React.ReactNode;
  status?: 'success' | 'error' | 'loading';
  res?: any; // res data bound from dataModel
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
    const eventName = action?.event?.name;
    if (!eventName || !onAction) return;

    // Business logic validation: determine status based on res data
    // res and status are both passed as props after being resolved from dataModel by resolvePropsV09
    const context: Record<string, any> = {};
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

interface CoffeeListProps {
  list?: CoffeeItem[];
  description?: string;
  /** Currently selected item id (controlled) */
  value?: string | number;
  status?: 'success';
  /** Card internal action trigger */
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const CoffeeList: React.FC<CoffeeListProps> = ({ list, description, onAction, status, action }) => {
  if (!list || list.length === 0) return null;

  const handleSelect = (itemId: string | number) => {
    if (!action?.event?.name) return;

    const selectedCoffee = list.find((item, index) => (item.id ?? index) === itemId);
    if (!selectedCoffee) return;

    // Construct context based on action.event.context keys
    const context: Record<string, any> = {};
    if (action.event.context) {
      Object.keys(action.event.context).forEach((key) => {
        // The key in context is the data field that the component needs to pass
        // For example, { coffee: { path: '/booking/res/coffee' } } contains 'coffee'
        context[key] = selectedCoffee;
      });
    }

    onAction?.(action.event.name, context);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
                width: 300,
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                transition: 'background 0.2s',
              }}
            >
              {/* Image / Placeholder icon */}
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

              {/* Text information */}
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

              {/* Price */}
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
  image,
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
        position: 'relative',
      }}
    >
      {/* Top decorative glow */}
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

      {/* Coffee icon area */}
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

      {/* Content area */}
      <div style={{ padding: '0 24px 24px' }}>
        {/* Title row */}
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
            {name ?? 'Unknown Coffee'}
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

        {/* Description */}
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

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.12)',
            margin: '0 0 16px',
          }}
        />

        {/* Price & date info */}
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
                {formattedDate}
              </Typography.Text>
            </div>
          )}
        </div>

        {/* Bottom success tag */}
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
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

// ─── Agent Commands ───────────────────────────────────────────────────────────────
const CreateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'booking',
    catalogId: 'local://coffee_booking_catalog.json',
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
        text: 'Coffee Shop Order',
        variant: 'h1',
      },
      {
        id: 'datetime',
        component: 'DateTimeInput',
        status: { path: '/booking/status' },
        action: {
          event: {
            name: 'select_date',
            context: {
              time: {
                path: '/booking/res/time',
              },
            },
          },
        },
      },
      {
        id: 'submit-text',
        component: 'Text',
        text: 'Confirm Order',
      },
      {
        component: 'CoffeeList',
        status: { path: '/booking/status' },
        list: { path: '/booking/list/data' },
        description: { path: '/booking/list/description' },
        id: 'coffee_list',
        action: {
          event: {
            name: 'select_coffee',
            context: {
              coffee: {
                path: '/booking/res/coffee',
              },
            },
          },
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
        res: { path: '/booking/res' },
        action: {
          event: {
            name: 'confirm_booking',
            context: {
              status: {
                path: '/booking/status',
              },
              res: {
                path: '/booking/res',
              },
            },
          },
        },
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
      res: {
        time: new Date().toISOString(), // Initialize to current date
      },
      list: {
        description: 'Coffee List',
        data: [
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
        ],
      },
    },
  },
};

// ─── Result Card Configuration ─────────────────────────────────────────────────────
const CreateResultCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'result',
    catalogId: 'local://coffee_booking_catalog.json',
  },
};

const UpdateResultCard = (res: any): XAgentCommand_v0_9 => {
  return {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'result',
      components: [
        {
          id: 'result-card',
          component: 'CoffeeResultCard',
          name: res?.coffee?.name,
          description: res?.coffee?.description,
          price: res?.coffee?.price,
          tag: res?.coffee?.tag,
          image: res?.coffee?.image,
          date: res?.time,
        },
        {
          id: 'root',
          component: 'BookForm',
          children: ['result-card'],
        },
      ],
    },
  };
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  // Command queue: each time a new command is appended, the entire array reference changes to trigger Box/Card's useEffect
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_9[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_9) => {
    if ('createSurface' in command) {
      const surfaceId = command.createSurface.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
    }
    // Append to end of queue, ensuring each command is processed by Box/Card
    setCommandQueue((prev) => [...prev, command]);
  };

  /** Handle Card internal action events (fully automated) */
  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'confirm_booking') {
      const { res, status } = payload.context || {};

      // Only show result card on success
      if (status === 'success' && res) {
        // 1. Show confirmation text
        runFooter();

        // 2. Delete booking form card
        onAgentCommand({
          version: 'v0.9',
          deleteSurface: {
            surfaceId: 'booking',
          },
        });

        // 3. Create and update result card
        onAgentCommand(CreateResultCard);
        onAgentCommand(UpdateResultCard(res));
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
      // Send commands in A2UI v0.9 spec order, command queue ensures sequential processing, no setTimeout needed
      onAgentCommand(CreateCard);
      onAgentCommand(UpdateCard);
      onAgentCommand(UpdateModel);
    }
  }, [streamStatusHeader, sessionKey]);

  // Reload (complete reset)
  const handleReload = useCallback(() => {
    resetHeader();
    resetFooter();

    // Drive Surface cleanup via deleteSurface command
    const deleteCommands: XAgentCommand_v0_9[] = [
      { version: 'v0.9', deleteSurface: { surfaceId: 'booking' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'result' } },
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
