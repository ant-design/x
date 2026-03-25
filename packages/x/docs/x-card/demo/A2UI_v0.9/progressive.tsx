import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Badge, Button, Card, Progress, Space, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 导入本地 catalog schema
import localCatalog from './catalog.json';

// 注册本地 catalog
registerCatalog(localCatalog as unknown as Catalog);

// ─── 类型定义 ────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

// ─── 模拟数据：产品列表（分批次加载） ──────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  tag?: string;
}

const allProducts: Product[][] = [
  [
    {
      id: 1,
      name: 'Wireless Bluetooth Earphones',
      price: 299,
      category: 'Digital',
      stock: 156,
      tag: 'Hot',
    },
    { id: 2, name: 'Mechanical Keyboard', price: 459, category: 'Digital', stock: 89 },
  ],
  [
    { id: 3, name: 'Smart Watch', price: 1299, category: 'Wearable', stock: 45, tag: 'New' },
    { id: 4, name: 'Portable Power Bank', price: 99, category: 'Accessories', stock: 234 },
  ],
  [
    {
      id: 5,
      name: 'Noise Cancelling Headphones',
      price: 899,
      category: 'Digital',
      stock: 67,
      tag: 'Recommended',
    },
    { id: 6, name: 'Wireless Charger', price: 149, category: 'Accessories', stock: 178 },
  ],
  [
    { id: 7, name: 'Smart Speaker', price: 399, category: 'Home', stock: 112, tag: 'Hot' },
    { id: 8, name: 'Fitness Tracker', price: 199, category: 'Wearable', stock: 256 },
  ],
];

// ─── 角色配置 ────────────────────────────────────────────────────────────────
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

// ─── ProductCard 组件（产品卡片） ────────────────────────────────────────────
interface ProductCardProps {
  name?: string;
  price?: number;
  category?: string;
  stock?: number;
  tag?: string;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, category, stock, tag, index }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 延迟显示，实现渐进动画
    const timer = setTimeout(
      () => {
        setVisible(true);
      },
      index ? index * 150 : 0,
    );
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card
      hoverable
      style={{
        width: '100%',
        maxWidth: 320,
        borderRadius: 12,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #f0f0f0',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        {/* 标签和名称 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text
            strong
            style={{ fontSize: 16, color: '#1a1a1a', flex: 1, lineHeight: '22px' }}
          >
            {name}
          </Typography.Text>
          {tag && (
            <Tag
              color="orange"
              style={{
                fontSize: 11,
                padding: '0 8px',
                lineHeight: '20px',
                borderRadius: 8,
                margin: 0,
              }}
            >
              {tag}
            </Tag>
          )}
        </div>

        {/* 价格 */}
        <div>
          <Typography.Text style={{ fontSize: 20, fontWeight: 700, color: '#ff4d4f' }}>
            ¥{price}
          </Typography.Text>
        </div>

        {/* 底部信息 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge
            color="blue"
            text={
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {category}
              </Typography.Text>
            }
          />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Stock: {stock}
          </Typography.Text>
        </div>
      </Space>
    </Card>
  );
};

// ─── ProductContainer 组件（产品容器） ────────────────────────────────────────
interface ProductContainerProps {
  children?: React.ReactNode;
}

const ProductContainer: React.FC<ProductContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid #e8e8e8',
        padding: 20,
        background: '#fafafa',
        minWidth: 320,
        maxWidth: 720,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── LoadingIndicator 组件（加载指示器） ─────────────────────────────────────
interface LoadingIndicatorProps {
  progress?: number;
  total?: number;
  loading?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  progress = 0,
  total = 100,
  loading,
}) => {
  const percent = Math.round((progress / total) * 100);

  return (
    <div
      style={{
        padding: '16px 20px',
        background: '#fff',
        borderRadius: 12,
        marginBlock: 16,
        border: '1px solid #e8e8e8',
        minWidth: 320,
        maxWidth: 720,
      }}
    >
      <Space vertical style={{ width: '100%' }} size={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Text style={{ fontSize: 14, fontWeight: 500 }}>
            {loading ? 'Loading product data...' : 'Loading complete'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {progress}/{total} products
          </Typography.Text>
        </div>
        <Progress
          percent={percent}
          status={loading ? 'active' : 'success'}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          showInfo={false}
        />
      </Space>
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
    // 清除之前的定时器
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
    // 清除定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 重置状态
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

// ─── Agent 指令 ────────────────────────────────────────────────────────────────
const CreateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'progressive-demo',
    catalogId: 'local://coffee_booking_catalog.json',
  },
};

// 创建更新卡片指令（根据产品数据）
const UpdateProductCard = (products: Product[]): XAgentCommand_v0_9 => {
  const productComponents = products.map((product, idx) => ({
    id: `product-${product.id}`,
    component: 'ProductCard',
    name: product.name,
    price: product.price,
    category: product.category,
    stock: product.stock,
    tag: product.tag,
    index: idx,
  }));

  return {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'progressive-demo',
      components: [
        ...productComponents,
        {
          id: 'root',
          component: 'ProductContainer',
          children: products.map((p) => `product-${p.id}`),
        },
      ],
    },
  };
};

// 创建加载指示器指令
const CreateLoadingIndicator = (): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  createSurface: {
    surfaceId: 'loading-indicator',
    catalogId: 'local://coffee_booking_catalog.json',
  },
});

const UpdateLoadingIndicator = (
  progress: number,
  total: number,
  loading: boolean,
): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'loading-indicator',
    components: [
      {
        id: 'root',
        component: 'LoadingIndicator',
        progress,
        total,
        loading,
      },
    ],
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commands, setCommands] = useState<XAgentCommand_v0_9>();
  const [sessionKey, setSessionKey] = useState(0);

  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const batchCountRef = useRef(0);

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

  const welcomeText =
    '🎉 Welcome to the progressive product showcase!\n\nProduct data will be loaded in batches, 2 products at a time. You can observe how components are displayed progressively.';
  const completeText = '✅ All products loaded! Total 8 products loaded.';

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    timestamp: timestampHeader,
    run: runHeader,
    reset: resetHeader,
  } = useStreamText(welcomeText);

  const {
    text: textFooter,
    timestamp: timestampFooter,
    run: runFooter,
    reset: resetFooter,
  } = useStreamText(completeText);

  useEffect(() => {
    runHeader();
  }, [sessionKey, runHeader]);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      onAgentCommand(CreateLoadingIndicator());
      setTimeout(() => {
        onAgentCommand(UpdateLoadingIndicator(0, 8, true));
      }, 50);

      setTimeout(() => {
        onAgentCommand(CreateCard);
      }, 100);

      setTimeout(() => {
        startProgressiveLoading();
      }, 300);
    }
  }, [streamStatusHeader, sessionKey]);

  const startProgressiveLoading = useCallback(() => {
    batchCountRef.current = 0;

    // 累积已加载的产品
    const loadedProducts: Product[] = [];

    const loadNextBatch = () => {
      if (batchCountRef.current >= allProducts.length) {
        onAgentCommand(UpdateLoadingIndicator(8, 8, false));
        setTimeout(() => runFooter(), 500);
        return;
      }

      const currentProducts = allProducts[batchCountRef.current];
      // 累积产品
      loadedProducts.push(...currentProducts);

      const progress = (batchCountRef.current + 1) * 2;
      onAgentCommand(UpdateLoadingIndicator(progress, 8, true));

      setTimeout(() => {
        // 传入累积的所有产品
        onAgentCommand(UpdateProductCard([...loadedProducts]));
      }, 50);

      batchCountRef.current++;
      loadingTimerRef.current = setTimeout(loadNextBatch, 1500);
    };

    loadNextBatch();
  }, [runFooter]);

  const handleReload = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }

    resetHeader();
    resetFooter();
    batchCountRef.current = 0;
    setCard([]);
    setCommands(undefined);

    onAgentCommand({
      version: 'v0.9',
      deleteSurface: { surfaceId: 'loading-indicator' },
    });
    onAgentCommand({
      version: 'v0.9',
      deleteSurface: { surfaceId: 'progressive-demo' },
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
          Reload
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commands}
        components={{
          ProductCard,
          ProductContainer,
          LoadingIndicator,
        }}
      >
        <Bubble.List items={items} style={{ height: 800 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
