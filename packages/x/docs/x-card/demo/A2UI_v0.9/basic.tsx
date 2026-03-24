import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, DatePicker, Radio, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 导入本地 catalog schema
import localCatalog from './catalog.json';

// 注册本地 catalog
registerCatalog(localCatalog as unknown as Catalog);

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

// ─── DateTimeInput 组件 ───────────────────────────────────────────────────────
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

    // 根据 action.event.context 的 key 来构造 context
    const context: Record<string, any> = {};
    if (action.event.context) {
      // context 中的 key 就是组件需要传递的数据字段
      // 例如 { time: { path: '/booking/res/time' } } 中的 time
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
  res?: any; // 从 dataModel 绑定的 res 数据
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

    // 根据 action.event.context 的 key 来构造 context
    const context: Record<string, any> = {};
    if (action?.event?.context) {
      Object.keys(action.event.context).forEach((key) => {
        const contextValue = action.event!.context![key];

        // 如果是 { path: string } 形式，使用从 dataModel 解析的值（如 res）
        if (contextValue && typeof contextValue === 'object' && 'path' in contextValue) {
          context[key] = res;
        }
        // 否则直接使用字面值（如 status: 'success'）
        else {
          context[key] = contextValue;
        }
      });
    }

    // 组件内部可以根据业务逻辑修改或添加 context
    // 例如：验证数据，决定 status 的值
    if (context.status === undefined || typeof context.status === 'object') {
      // 如果 status 未设置或是路径绑定，由组件决定
      if (!res?.time || !res?.coffee) {
        context.status = 'error';
        context.errorMessage = '请先选择日期和咖啡';
      } else {
        context.status = 'success';
      }
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

interface CoffeeListProps {
  list?: CoffeeItem[];
  description?: string;
  /** 当前选中项的 id（受控） */
  value?: string | number;
  status?: 'success';
  /** Card 内部 action 触发器 */
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

    // 根据 action.event.context 的 key 来构造 context
    const context: Record<string, any> = {};
    if (action.event.context) {
      Object.keys(action.event.context).forEach((key) => {
        // context 中的 key 就是组件需要传递的数据字段
        // 例如 { coffee: { path: '/booking/res/coffee' } } 中的 coffee
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

// ─── Agent 指令 ───────────────────────────────────────────────────────────────
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
        text: '咖啡店单机',
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
        text: '确定点单',
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
        time: new Date().toISOString(), // 初始化为当前日期
      },
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

// ─── 结果卡片配置 ─────────────────────────────────────────────────────────────
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
  const [commands, setCommands] = useState<XAgentCommand_v0_9>();
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_9) => {
    if ('createSurface' in command) {
      const surfaceId = command.createSurface.surfaceId;
      setCard((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });

      setCommands(command);
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
      setCommands(command);
    } else {
      setCommands(command);
    }
  };

  /** 处理 Card 内部 action 事件（完全自动化） */
  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'confirm_booking') {
      const { res, status } = payload.context || {};

      // 只在成功时显示结果卡片
      if (status === 'success' && res) {
        // 1. 显示确认文本
        runFooter();

        // 2. 删除预订表单卡片
        onAgentCommand({
          version: 'v0.9',
          deleteSurface: {
            surfaceId: 'booking',
          },
        });

        // 3. 创建并更新结果卡片（增加延迟确保 catalog 加载完成）
        onAgentCommand(CreateResultCard);

        // 增加 delay 确保命令被处理
        setTimeout(() => {
          onAgentCommand(UpdateResultCard(res));
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
      onAgentCommand(CreateCard);
      setTimeout(() => onAgentCommand(UpdateCard), 0);
      setTimeout(() => onAgentCommand(UpdateModel), 16);
    }
  }, [streamStatusHeader, sessionKey]);

  // 重新加载（完全重置）
  const handleReload = useCallback(() => {
    resetHeader();
    resetFooter();
    setCard([]);

    onAgentCommand({
      version: 'v0.9',
      deleteSurface: { surfaceId: 'booking' },
    });
    onAgentCommand({
      version: 'v0.9',
      deleteSurface: { surfaceId: 'result' },
    });

    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 100);
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
