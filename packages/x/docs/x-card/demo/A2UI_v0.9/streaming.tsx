import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, List, Progress, Rate, Spin, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 导入本地 catalog schema
import localCatalog from './catalog-streaming.json';

// 注册本地 catalog
registerCatalog(localCatalog as unknown as Catalog);

// ─── 类型定义 ────────────────────────────────────────────────────────────────────
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

// ─── 餐厅数据 ────────────────────────────────────────────────────────────────────
interface RestaurantItem {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  tags: string[];
  description: string;
  image?: string;
}

const RESTAURANT_DATA: RestaurantItem[] = [
  {
    id: 'r1',
    name: '江南小馆',
    cuisine: '江浙菜',
    rating: 4.8,
    priceRange: '¥80-150',
    distance: '500m',
    tags: ['本帮菜', '环境优雅'],
    description: '正宗江浙风味，精选本地食材，传统工艺烹制。招牌菜：红烧肉、清蒸鲈鱼。',
  },
  {
    id: 'r2',
    name: '川味居',
    cuisine: '川菜',
    rating: 4.6,
    priceRange: '¥60-120',
    distance: '800m',
    tags: ['麻辣鲜香', '性价比高'],
    description: '地道川味，麻辣鲜香。推荐：水煮鱼、麻婆豆腐、回锅肉。',
  },
  {
    id: 'r3',
    name: '樱花日料',
    cuisine: '日本料理',
    rating: 4.9,
    priceRange: '¥150-300',
    distance: '1.2km',
    tags: ['精致料理', '约会首选'],
    description: '新鲜刺身、精致寿司，日式传统与现代融合。主厨来自东京银座。',
  },
  {
    id: 'r4',
    name: '意式花园',
    cuisine: '西餐',
    rating: 4.5,
    priceRange: '¥120-250',
    distance: '900m',
    tags: ['浪漫氛围', '手工意面'],
    description: '正宗意大利风味，手工制作意面，进口食材。招牌：奶油蘑菇意面、提拉米苏。',
  },
];

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
  const finalStyle = status === 'success' ? styleMap.success : style;

  return <p style={finalStyle}>{content}</p>;
};

// ─── LoadingProgress 组件 ──────────────────────────────────────────────────────
interface LoadingProgressProps {
  percent?: number;
  status?: 'active' | 'success' | 'normal';
  text?: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  percent = 0,
  status = 'active',
  text,
}) => {
  return (
    <div
      style={{
        padding: '16px 20px',
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        marginBottom: 16,
        minWidth: 320,
        maxWidth: 480,
      }}
    >
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {text || '正在加载推荐结果...'}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 13, fontWeight: 500 }}>
          {Math.round(percent)}%
        </Typography.Text>
      </div>
      <Progress
        percent={percent}
        status={status}
        showInfo={false}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
    </div>
  );
};

// ─── RestaurantCard 组件 ────────────────────────────────────────────────────────
interface RestaurantCardProps {
  restaurant?: RestaurantItem;
  index?: number;
  isLoading?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, index = 0, isLoading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && restaurant) {
      // 逐个加载动画延迟
      const timer = setTimeout(() => {
        setVisible(true);
      }, index * 200);
      return () => clearTimeout(timer);
    }
  }, [isLoading, restaurant, index]);

  if (isLoading) {
    return (
      <Card
        style={{
          width: '100%',
          borderRadius: 12,
          opacity: 0.6,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
          <Spin tip="加载中..." />
        </div>
      </Card>
    );
  }

  if (!restaurant) return null;

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.4s ease-out',
        marginBottom: 12,
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div style={{ display: 'flex', gap: 16 }}>
        {/* 左侧图标 */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 28,
          }}
        >
          🍽️
        </div>

        {/* 右侧内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Typography.Text strong style={{ fontSize: 16 }}>
              {restaurant.name}
            </Typography.Text>
            <Tag color="blue" style={{ margin: 0 }}>
              {restaurant.cuisine}
            </Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <Rate disabled defaultValue={restaurant.rating} style={{ fontSize: 12 }} />
            <Typography.Text style={{ fontSize: 13, color: '#faad14' }}>
              {restaurant.rating}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              | {restaurant.distance}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 13, color: '#52c41a' }}>
              {restaurant.priceRange}
            </Typography.Text>
          </div>

          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, display: 'block', marginBottom: 8 }}
            ellipsis
          >
            {restaurant.description}
          </Typography.Text>

          <div style={{ display: 'flex', gap: 6 }}>
            {restaurant.tags.map((tag, i) => (
              <Tag
                key={i}
                style={{
                  fontSize: 11,
                  borderRadius: 6,
                  background: '#f5f5f5',
                  border: 'none',
                  margin: 0,
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ─── RestaurantList 组件 ────────────────────────────────────────────────────────
interface RestaurantListProps {
  restaurants?: RestaurantItem[];
  loadingProgress?: number;
  isStreaming?: boolean;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants = [],
  loadingProgress = 0,
  isStreaming = false,
}) => {
  const safeRestaurants = Array.isArray(restaurants) ? restaurants : [];
  const visibleRestaurants = isStreaming
    ? safeRestaurants.slice(0, Math.ceil((loadingProgress / 100) * safeRestaurants.length))
    : safeRestaurants;

  return (
    <div
      style={{
        minWidth: 320,
        maxWidth: 480,
      }}
    >
      {/* 进度条 */}
      {isStreaming && loadingProgress < 100 && (
        <LoadingProgress percent={loadingProgress} text="AI 正在为您筛选推荐..." />
      )}

      {/* 餐厅列表 */}
      <List
        dataSource={visibleRestaurants}
        renderItem={(item, index) => (
          <RestaurantCard restaurant={item} index={index} isLoading={false} />
        )}
      />

      {/* 加载完成提示 */}
      {!isStreaming && safeRestaurants.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
            opacity: 0.8,
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ✅ 已为您推荐 {safeRestaurants.length} 家餐厅
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

// ─── Container 组件 ────────────────────────────────────────────────────────────
interface ContainerProps {
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '20px 20px 16px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBlock: 16,
        minWidth: 320,
        maxWidth: 520,
      }}
    >
      {children}
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
    }, 80);
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

// ─── 进度 Hook ────────────────────────────────────────────────────────────────
const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState<'active' | 'success'>('active');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setProgress(0);
    setProgressStatus('active');

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setProgressStatus('success');
          return 100;
        }
        // 模拟真实加载：速度不均匀
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
    setProgressStatus('active');
  }, []);

  return { progress, progressStatus, start, reset };
};

// ═══════════════════════════════════════════════════════════════════════════════
// 流式推荐文本内容
// ═══════════════════════════════════════════════════════════════════════════════

const INTRO_TEXT = `您好！我是您的美食推荐助手 🍽️

根据您的位置和偏好，我正在为您筛选附近最优质的餐厅...

以下是我的推荐理由：

1. **距离优先**：优先推荐步行15分钟内可达的餐厅
2. **品质保障**：筛选评分4.5以上的优质商家
3. **口味多样**：涵盖中餐、日料、西餐等多种风味

正在为您生成个性化推荐...`;

// ═══════════════════════════════════════════════════════════════════════════════
// v0.9 Agent 命令定义
// ═══════════════════════════════════════════════════════════════════════════════

// 创建 Surface 命令
const CreateSurfaceCommand: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'recommendation',
    catalogId: 'local://restaurant_streaming_catalog.json',
  },
};

// 更新组件命令
const UpdateComponentsCommand: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'recommendation',
    components: [
      {
        id: 'title',
        component: 'Text',
        text: 'AI 美食推荐',
        variant: 'h1',
      },
      {
        id: 'progress',
        component: 'LoadingProgress',
        percent: { path: '/progress' },
        status: 'active',
      },
      {
        id: 'restaurant-list',
        component: 'RestaurantList',
        restaurants: { path: '/restaurants' },
        loadingProgress: { path: '/progress' },
        isStreaming: { path: '/isStreaming' },
      },
      {
        id: 'root',
        component: 'Container',
        children: ['title', 'progress', 'restaurant-list'],
      },
    ],
  },
};

// 创建进度更新命令
const createProgressUpdateCommand = (percent: number): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'recommendation',
    path: '/progress',
    value: percent,
  },
});

// 创建餐厅列表更新命令（增量更新）
const createRestaurantUpdateCommand = (restaurants: RestaurantItem[]): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'recommendation',
    path: '/restaurants',
    value: restaurants,
  },
});

// 创建流式状态更新命令
const createStreamingStatusCommand = (isStreaming: boolean): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'recommendation',
    path: '/isStreaming',
    value: isStreaming,
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_9[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  // 流式文本状态
  const {
    text: streamText,
    streamStatus,
    timestamp: textTimestamp,
    run: runStream,
    reset: resetStream,
  } = useStreamText(INTRO_TEXT);

  // 进度状态
  const { progress, progressStatus, start: startProgress, reset: resetProgress } = useProgress();

  // 已加载的餐厅
  const [loadedRestaurants, setLoadedRestaurants] = useState<RestaurantItem[]>([]);

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
    setCommandQueue((prev) => [...prev, command]);
  };

  // 重置整个流程
  const handleReload = useCallback(() => {
    resetStream();
    resetProgress();
    setLoadedRestaurants([]);

    const deleteCommands: XAgentCommand_v0_9[] = [
      { version: 'v0.9', deleteSurface: { surfaceId: 'recommendation' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);

    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 50);
  }, [resetStream, resetProgress]);

  // 流式文本开始
  useEffect(() => {
    runStream();
  }, [sessionKey, runStream]);

  // 文本流式完成后，开始加载组件
  useEffect(() => {
    if (streamStatus === 'FINISHED') {
      // 按照 A2UI v0.9 规范顺序发送命令
      // 1. 创建 Surface
      onAgentCommand(CreateSurfaceCommand);

      // 2. 更新组件配置
      onAgentCommand(UpdateComponentsCommand);

      // 3. 初始化数据模型
      onAgentCommand(createStreamingStatusCommand(true));
      onAgentCommand(createRestaurantUpdateCommand([]));

      // 4. 开始进度动画
      startProgress();
    }
  }, [streamStatus, sessionKey, startProgress]);

  // 进度更新时，增量添加餐厅卡片
  useEffect(() => {
    if (progress > 0 && progressStatus === 'active') {
      // 更新进度
      onAgentCommand(createProgressUpdateCommand(progress));

      // 根据进度计算应该显示几个餐厅
      const visibleCount = Math.ceil((progress / 100) * RESTAURANT_DATA.length);
      const newRestaurants = RESTAURANT_DATA.slice(0, visibleCount);

      // 增量更新餐厅列表
      if (newRestaurants.length !== loadedRestaurants.length) {
        setLoadedRestaurants(newRestaurants);
        onAgentCommand(createRestaurantUpdateCommand(newRestaurants));
      }
    }
  }, [progress, progressStatus]);

  // 进度完成
  useEffect(() => {
    if (progressStatus === 'success' && loadedRestaurants.length === RESTAURANT_DATA.length) {
      // 设置 isStreaming 为 false
      onAgentCommand(createStreamingStatusCommand(false));
    }
  }, [progressStatus, loadedRestaurants.length]);

  const items = [
    {
      content: {
        texts: [{ text: streamText, timestamp: textTimestamp }].filter(
          (item) => item.timestamp !== 0,
        ),
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
          重新推荐
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
        components={{
          Text,
          LoadingProgress,
          RestaurantCard,
          RestaurantList,
          Container,
        }}
      >
        <Bubble.List items={items} style={{ height: 800 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
