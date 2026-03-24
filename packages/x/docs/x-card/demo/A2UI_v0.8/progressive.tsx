import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Badge, Button, Card, Progress, Space, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
    { id: 1, name: '无线蓝牙耳机', price: 299, category: '数码', stock: 156, tag: '热销' },
    { id: 2, name: '机械键盘', price: 459, category: '数码', stock: 89 },
  ],
  [
    { id: 3, name: '智能手表', price: 1299, category: '穿戴', stock: 45, tag: '新品' },
    { id: 4, name: '便携充电宝', price: 99, category: '配件', stock: 234 },
  ],
  [
    { id: 5, name: '降噪耳机', price: 899, category: '数码', stock: 67, tag: '推荐' },
    { id: 6, name: '无线充电器', price: 149, category: '配件', stock: 178 },
  ],
  [
    { id: 7, name: '智能音箱', price: 399, category: '家居', stock: 112, tag: '热销' },
    { id: 8, name: '运动手环', price: 199, category: '穿戴', stock: 256 },
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
  price?: number | string;
  category?: string;
  stock?: number | string;
  tag?: string;
  index?: number | string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, category, stock, tag, index }) => {
  const [visible, setVisible] = useState(false);

  // v0.8 的值可能是字符串形式传入，需要转换
  const numPrice = typeof price === 'string' ? Number(price) : price;
  const numStock = typeof stock === 'string' ? Number(stock) : stock;
  const numIndex = typeof index === 'string' ? Number(index) : index;

  useEffect(() => {
    // 延迟显示，实现渐进动画
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
            ¥{numPrice}
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
            库存: {numStock}
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
  progress?: number | string;
  total?: number | string;
  loading?: boolean | string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  progress = 0,
  total = 100,
  loading,
}) => {
  // v0.8 的值可能是字符串形式传入，需要转换
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
        border: '1px solid #e8e8e8',
        minWidth: 320,
        maxWidth: 400,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Text style={{ fontSize: 14, fontWeight: 500 }}>
            {boolLoading ? '正在加载产品数据...' : '加载完成'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {numProgress}/{numTotal} 件产品
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

// ═══════════════════════════════════════════════════════════════════════════════
// v0.8 Agent 命令定义
// ═══════════════════════════════════════════════════════════════════════════════

// v0.8 命令: 创建加载指示器 surface
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

// v0.8 命令: 开始渲染加载指示器
const BeginLoadingIndicator: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'loading-indicator',
    root: 'root',
  },
};

// v0.8 命令: 更新加载指示器
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

// v0.8 命令: 删除加载指示器
const DeleteLoadingIndicator: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'loading-indicator',
  },
};

// v0.8 命令: 创建产品展示 surface（渐进式更新）
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

// v0.8 命令: 开始渲染产品展示
const BeginProductSurface: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'progressive-demo',
    root: 'root',
  },
};

// v0.8 命令: 删除产品展示
const DeleteProductSurface: XAgentCommand_v0_8 = {
  deleteSurface: {
    surfaceId: 'progressive-demo',
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commands, setCommands] = useState<XAgentCommand_v0_8>();
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
      setCommands(command);
    } else if ('deleteSurface' in command) {
      setCard((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
      setCommands(command);
    } else {
      setCommands(command);
    }
  };

  const welcomeText =
    '🎉 欢迎体验渐进式产品展示！\n\n产品数据将分批次加载，每次加载2件产品，您可以观察到组件如何逐渐展示。';
  const completeText = '✅ 所有产品加载完成！共加载 8 件产品。';

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
      // v0.8 命令序列:
      // 1. 创建并渲染加载指示器
      onAgentCommand(CreateLoadingIndicatorSurface);
      setTimeout(() => {
        onAgentCommand(BeginLoadingIndicator);
      }, 50);

      // 2. 创建产品 surface（初始为空）
      setTimeout(() => {
        onAgentCommand(CreateProductSurface([]));
      }, 100);

      // 3. 开始渲染产品 surface
      setTimeout(() => {
        onAgentCommand(BeginProductSurface);
      }, 150);

      // 4. 开始渐进式加载
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
        // 加载完成，更新加载指示器状态
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
        // v0.8: 使用 surfaceUpdate 更新整个产品列表
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
    setCard([]);

    // v0.8: 删除所有 surface
    onAgentCommand(DeleteLoadingIndicator);
    onAgentCommand(DeleteProductSurface);

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
