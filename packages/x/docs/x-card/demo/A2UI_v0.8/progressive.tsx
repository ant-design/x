import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Badge, Button, Card, Progress, Space, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// ─── Type Definitions ────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

// ─── Mock Data: Product List (batch loading) ──────────────────────────────────────
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

// ─── Role Configuration ────────────────────────────────────────────────────────────────
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

// ─── ProductCard Component (Product Card) ────────────────────────────────────────────
interface ProductCardProps {
  name?: string;
  price?: number | string;
  category?: string;
  stock?: number | string;
  tag?: string;
  index?: number | string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, category, stock, tag, index }) => {
  const [visible, setVisible] = useState(false);

  // v0.8 values may be passed as strings, needs conversion
  const numPrice = typeof price === 'string' ? Number(price) : price;
  const numStock = typeof stock === 'string' ? Number(stock) : stock;
  const numIndex = typeof index === 'string' ? Number(index) : index;

  useEffect(() => {
    // Delayed display for progressive animation
    const timer = setTimeout(
      () => {
        setVisible(true);
      },
      numIndex ? numIndex * 150 : 0,
    );
    return () => clearTimeout(timer);
  }, [numIndex]);

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
      styles={{ body: { padding: 16 } }}
    >
      <Space vertical style={{ width: '100%' }} size={8}>
        {/* Tag and name */}
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

        {/* Price */}
        <div>
          <Typography.Text style={{ fontSize: 20, fontWeight: 700, color: '#ff4d4f' }}>
            ¥{numPrice}
          </Typography.Text>
        </div>

        {/* Bottom info */}
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
            Stock: {numStock}
          </Typography.Text>
        </div>
      </Space>
    </Card>
  );
};

// ─── ProductContainer Component (Product Container) ────────────────────────────────────────
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

// ─── LoadingIndicator Component (Loading Indicator) ─────────────────────────────────────
interface LoadingIndicatorProps {
  progress?: number | string;
  total?: number | string;
  loading?: boolean | string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  progress = 0,
  total = 100,
  loading,
}) => {
  // v0.8 values may be passed as strings, needs conversion
  const numProgress = typeof progress === 'string' ? Number(progress) : progress;
  const numTotal = typeof total === 'string' ? Number(total) : total;
  const boolLoading = typeof loading === 'string' ? loading === 'true' : loading;

  const percent = Math.round((numProgress / numTotal) * 100);

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
            {boolLoading ? 'Loading product data...' : 'Loading complete'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {numProgress}/{numTotal} products
          </Typography.Text>
        </div>
        <Progress
          percent={percent}
          status={boolLoading ? 'active' : 'success'}
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

// ─── Streaming Text Hook ────────────────────────────────────────────────────────────
const useStreamText = (text: string) => {
  const textRef = React.useRef(0);
  const [textIndex, setTextIndex] = React.useState(0);
  const textTimestamp = React.useRef(0);
  const [streamStatus, setStreamStatus] = useState('INIT');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const run = useCallback(() => {
    // Clear previous timer
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
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Reset state
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

// v0.8 command: Create loading indicator surface
const CreateLoadingIndicatorSurface: XAgentCommand_v0_8 = {
  surfaceUpdate: {
    surfaceId: 'loading-indicator',
    components: [
      {
        id: 'root',
        component: {
          LoadingIndicator: {
            progress: { literalString: '0' },
            total: { literalString: '8' },
            loading: { literalString: 'true' },
          },
        },
      },
    ],
  },
};

// v0.8 command: Begin rendering loading indicator
const BeginLoadingIndicator: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'loading-indicator',
    root: 'root',
  },
};

// v0.8 command: Update loading indicator
const UpdateLoadingIndicator = (
  progress: number,
  total: number,
  loading: boolean,
): XAgentCommand_v0_8 => ({
  surfaceUpdate: {
    surfaceId: 'loading-indicator',
    components: [
      {
        id: 'root',
        component: {
          LoadingIndicator: {
            progress: { literalString: String(progress) },
            total: { literalString: String(total) },
            loading: { literalString: String(loading) },
          },
        },
      },
    ],
  },
});

// v0.8 command: Delete loading indicator
const DeleteLoadingIndicator: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'loading-indicator',
  },
};

// v0.8 command: Create product display surface (progressive update)
const CreateProductSurface = (products: Product[]): XAgentCommand_v0_8 => {
  const productComponents = products.map((product, idx) => ({
    id: `product-${product.id}`,
    component: {
      ProductCard: {
        name: { literalString: product.name },
        price: { literalString: String(product.price) },
        category: { literalString: product.category },
        stock: { literalString: String(product.stock) },
        tag: product.tag ? { literalString: product.tag } : undefined,
        index: { literalString: String(idx) },
      },
    },
  }));

  return {
    surfaceUpdate: {
      surfaceId: 'progressive-demo',
      components: [
        ...productComponents,
        {
          id: 'root',
          component: {
            ProductContainer: {
              children: { explicitList: products.map((p) => `product-${p.id}`) },
            },
          },
        },
      ],
    },
  };
};

// v0.8 command: Begin rendering product display
const BeginProductSurface: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'progressive-demo',
    root: 'root',
  },
};

// v0.8 command: Delete product display
const DeleteProductSurface: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'progressive-demo',
  },
};

// ─── App Component ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  // Command queue: Append new commands each time, entire array reference change triggers Box/Card useEffect
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_8[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const batchCountRef = useRef(0);

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
    // Append to end of queue, ensuring each command is processed by Box/Card
    setCommandQueue((prev) => [...prev, command]);
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
      // v0.8 command sequence: surfaceUpdate → beginRendering
      // Command queue guarantees sequential processing, no setTimeout magic numbers needed
      onAgentCommand(CreateLoadingIndicatorSurface);
      onAgentCommand(BeginLoadingIndicator);
      // Create product surface (initially empty) and start rendering immediately
      onAgentCommand(CreateProductSurface([]));
      onAgentCommand(BeginProductSurface);
      // Start progressive loading
      startProgressiveLoading();
    }
  }, [streamStatusHeader, sessionKey]);

  const startProgressiveLoading = useCallback(() => {
    batchCountRef.current = 0;

    // Accumulated loaded products
    const loadedProducts: Product[] = [];

    const loadNextBatch = () => {
      if (batchCountRef.current >= allProducts.length) {
        // Loading complete, update loading indicator state
        onAgentCommand(UpdateLoadingIndicator(8, 8, false));
        setTimeout(() => runFooter(), 500);
        return;
      }

      const currentProducts = allProducts[batchCountRef.current];
      // Accumulate products
      loadedProducts.push(...currentProducts);

      const progress = (batchCountRef.current + 1) * 2;
      onAgentCommand(UpdateLoadingIndicator(progress, 8, true));

      setTimeout(() => {
        // v0.8: Use surfaceUpdate to update entire product list
        onAgentCommand(CreateProductSurface([...loadedProducts]));
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

    // Drive Surface cleanup via deleteSurface command, no longer directly manipulating setCard/setCommands
    onAgentCommand(DeleteLoadingIndicator);
    onAgentCommand(DeleteProductSurface);

    // Reset command queue to avoid old command replay after key change
    setCommandQueue([]);
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
          Reload
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
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
