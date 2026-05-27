import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, XAgentCommand_v0_8 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, List, Progress, Rate, Spin, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// ─── Type Definitions ────────────────────────────────────────────────────────────────────
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

// ─── Restaurant Data ────────────────────────────────────────────────────────────────────
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
    name: 'Jiangnan Bistro',
    cuisine: 'Jiangsu-Zhejiang',
    rating: 4.8,
    priceRange: '¥80-150',
    distance: '500m',
    tags: ['Local Cuisine', 'Elegant Atmosphere'],
    description:
      'Authentic Jiangsu-Zhejiang flavors, locally sourced ingredients, traditional cooking. Signature dishes: Braised Pork, Steamed Sea Bass.',
  },
  {
    id: 'r2',
    name: 'Sichuan House',
    cuisine: 'Sichuan',
    rating: 4.6,
    priceRange: '¥60-120',
    distance: '800m',
    tags: ['Spicy & Flavorful', 'Great Value'],
    description:
      'Authentic Sichuan cuisine, spicy and aromatic. Recommended: Sliced Fish in Hot Chili Oil, Mapo Tofu, Twice-Cooked Pork.',
  },
  {
    id: 'r3',
    name: 'Sakura Japanese',
    cuisine: 'Japanese',
    rating: 4.9,
    priceRange: '¥150-300',
    distance: '1.2km',
    tags: ['Exquisite Cuisine', 'Date Night'],
    description:
      'Fresh sashimi, exquisite sushi, fusion of traditional and modern Japanese. Chef from Tokyo Ginza.',
  },
  {
    id: 'r4',
    name: 'Italian Garden',
    cuisine: 'Western',
    rating: 4.5,
    priceRange: '¥120-250',
    distance: '900m',
    tags: ['Romantic Atmosphere', 'Handmade Pasta'],
    description:
      'Authentic Italian flavors, handmade pasta, imported ingredients. Signature: Creamy Mushroom Pasta, Tiramisu.',
  },
];

// ─── Text Component ────────────────────────────────────────────────────────────────
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

// ─── LoadingProgress Component ──────────────────────────────────────────────────────
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
  // dataModel stores values as strings, needs to be converted to numbers
  const numericPercent = typeof percent === 'string' ? parseFloat(percent as string) : percent;
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
          {text || 'Loading recommendations...'}
        </Typography.Text>
        <Typography.Text style={{ fontSize: 13, fontWeight: 500 }}>
          {Math.round(numericPercent)}%
        </Typography.Text>
      </div>
      <Progress
        percent={numericPercent}
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

// ─── RestaurantCard Component ────────────────────────────────────────────────────────
interface RestaurantCardProps {
  restaurant?: RestaurantItem;
  index?: number;
  isLoading?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, index = 0, isLoading }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && restaurant) {
      // Progressive loading animation delay
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
          <Spin tip="Loading..." />
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
        {/* Left icon */}
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

        {/* Right content */}
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

// ─── RestaurantList Component ────────────────────────────────────────────────────────
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
  // dataModel stores values as JSON strings, needs to be parsed
  const parsedRestaurants: RestaurantItem[] = (() => {
    if (typeof restaurants === 'string') {
      try {
        return JSON.parse(restaurants);
      } catch {
        return [];
      }
    }
    return Array.isArray(restaurants) ? restaurants : [];
  })();

  // dataModel stores values as strings, needs to be converted to numbers
  const numericProgress =
    typeof loadingProgress === 'string' ? parseFloat(loadingProgress) : loadingProgress;

  // dataModel stores values as strings 'true'/'false', needs to be converted to booleans
  const boolStreaming = typeof isStreaming === 'string' ? isStreaming === 'true' : isStreaming;

  const visibleRestaurants = boolStreaming
    ? parsedRestaurants.slice(0, Math.ceil((numericProgress / 100) * parsedRestaurants.length))
    : parsedRestaurants;

  return (
    <div
      style={{
        minWidth: 320,
        maxWidth: 480,
      }}
    >
      {/* Progress bar */}
      {boolStreaming && numericProgress < 100 && (
        <LoadingProgress
          percent={numericProgress}
          text="AI is filtering recommendations for you..."
        />
      )}

      {/* Restaurant list */}
      <List
        dataSource={visibleRestaurants}
        renderItem={(item, index) => (
          <RestaurantCard restaurant={item} index={index} isLoading={false} />
        )}
      />

      {/* Loading complete message */}
      {!boolStreaming && parsedRestaurants.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0',
            opacity: 0.8,
          }}
        >
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ✅ Recommended {parsedRestaurants.length} restaurants for you
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

// ─── Container Component ────────────────────────────────────────────────────────────
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

// ─── Progress Hook ────────────────────────────────────────────────────────────────
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
        // Simulate real loading: uneven speed
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
// Streaming Recommendation Text Content
// ═══════════════════════════════════════════════════════════════════════════════

const INTRO_TEXT = `Hello! I'm your food recommendation assistant 🍽️

Based on your location and preferences, I'm filtering the best restaurants nearby...

Here are my recommendation criteria:

1. **Distance First**: Prioritize restaurants within 15 minutes walking distance
2. **Quality Guaranteed**: Select top-rated restaurants with 4.5+ ratings
3. **Diverse Flavors**: Covering Chinese, Japanese, Western and more cuisines

Generating personalized recommendations for you...`;

// ═══════════════════════════════════════════════════════════════════════════════
// v0.8 Agent Command Definition
// ═══════════════════════════════════════════════════════════════════════════════

// Create progress bar command
const createProgressCommand = (percent: number): XAgentCommand_v0_8 => ({
  dataModelUpdate: {
    surfaceId: 'recommendation',
    contents: [
      {
        key: 'progress',
        valueString: String(percent),
      },
    ],
  },
});

// Create restaurant card command (incremental update)
const createRestaurantCommand = (restaurants: RestaurantItem[]): XAgentCommand_v0_8 => ({
  dataModelUpdate: {
    surfaceId: 'recommendation',
    contents: [
      {
        key: 'restaurants',
        valueString: JSON.stringify(
          restaurants.map((r) => ({
            id: r.id,
            name: r.name,
            cuisine: r.cuisine,
            rating: r.rating,
            priceRange: r.priceRange,
            distance: r.distance,
            description: r.description,
            tags: r.tags,
          })),
        ),
      },
    ],
  },
});

// Surface Update command
const SurfaceUpdateCommand: XAgentCommand_v0_8 = {
  surfaceUpdate: {
    surfaceId: 'recommendation',
    components: [
      {
        id: 'title',
        component: {
          Text: {
            text: { literalString: 'AI Food Recommendations' },
            variant: { literalString: 'h1' },
          },
        },
      },
      {
        id: 'progress',
        component: {
          LoadingProgress: {
            percent: { path: '/progress' },
            status: { literalString: 'active' },
          },
        },
      },
      {
        id: 'restaurant-list',
        component: {
          RestaurantList: {
            restaurants: { path: '/restaurants' },
            loadingProgress: { path: '/progress' },
            isStreaming: { path: '/isStreaming' },
          },
        },
      },
      {
        id: 'root',
        component: {
          Container: {
            children: {
              explicitList: ['title', 'progress', 'restaurant-list'],
            },
          },
        },
      },
    ],
  },
};

// Begin Rendering command
const BeginRenderingCommand: XAgentCommand_v0_8 = {
  beginRendering: {
    surfaceId: 'recommendation',
    root: 'root',
  },
};

// ─── App Component ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_8[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  // Streaming text state
  const {
    text: streamText,
    streamStatus,
    timestamp: textTimestamp,
    run: runStream,
    reset: resetStream,
  } = useStreamText(INTRO_TEXT);

  // Progress state
  const { progress, progressStatus, start: startProgress, reset: resetProgress } = useProgress();

  // Loaded restaurants
  const [loadedRestaurants, setLoadedRestaurants] = useState<RestaurantItem[]>([]);

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
    setCommandQueue((prev) => [...prev, command]);
  };

  // Handle action
  const handleAction = (payload: ActionPayload) => {
    console.log('Action:', payload);
  };

  // Reset entire flow
  const handleReload = useCallback(() => {
    resetStream();
    resetProgress();
    setLoadedRestaurants([]);

    const deleteCommands: XAgentCommand_v0_8[] = [
      { deleteSurface: { surfaceId: 'recommendation' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);

    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 50);
  }, [resetStream, resetProgress]);

  // Start streaming text
  useEffect(() => {
    runStream();
  }, [sessionKey, runStream]);

  // After text streaming is complete, start loading components
  useEffect(() => {
    if (streamStatus === 'FINISHED') {
      // Send Surface Update and Begin Rendering
      onAgentCommand(SurfaceUpdateCommand);

      // Initialize data model: set isStreaming to true
      onAgentCommand({
        dataModelUpdate: {
          surfaceId: 'recommendation',
          contents: [
            { key: 'isStreaming', valueString: 'true' },
            { key: 'restaurants', valueString: '[]' },
          ],
        },
      });

      onAgentCommand(BeginRenderingCommand);

      // Start progress animation
      startProgress();
    }
  }, [streamStatus, sessionKey, startProgress]);

  // When progress updates, incrementally add restaurant cards
  useEffect(() => {
    if (progress > 0 && progressStatus === 'active') {
      // Update progress
      onAgentCommand(createProgressCommand(progress));

      // Calculate how many restaurants to show based on progress
      const visibleCount = Math.ceil((progress / 100) * RESTAURANT_DATA.length);
      const newRestaurants = RESTAURANT_DATA.slice(0, visibleCount);

      // Incrementally update restaurant list
      if (newRestaurants.length !== loadedRestaurants.length) {
        setLoadedRestaurants(newRestaurants);
        onAgentCommand(createRestaurantCommand(newRestaurants));
      }
    }
  }, [progress, progressStatus]);

  // Progress complete
  useEffect(() => {
    if (progressStatus === 'success' && loadedRestaurants.length === RESTAURANT_DATA.length) {
      // Set isStreaming to false
      onAgentCommand({
        dataModelUpdate: {
          surfaceId: 'recommendation',
          contents: [{ key: 'isStreaming', valueString: 'false' }],
        },
      });
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
          Refresh Recommendations
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
        onAction={handleAction}
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
