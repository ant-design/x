import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Rate,
  Row,
  Slider,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Import local catalog schema
import localCatalog from './catalog-filter.json';

// Register local catalog
registerCatalog(localCatalog as unknown as Catalog);

const { Title, Text } = Typography;

const contentHeader =
  'Welcome to Product Search! 🔍\n\nFind the perfect product by filtering by category, price, and rating. Results will update in real-time as you adjust filters.';

// ─── Product Data ─────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  tags: string[];
  image?: string;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Earphones',
    category: 'Electronics',
    price: 299,
    rating: 4.5,
    stock: 156,
    tags: ['Hot', 'Wireless'],
  },
  {
    id: 2,
    name: 'Mechanical Keyboard RGB',
    category: 'Electronics',
    price: 459,
    rating: 4.8,
    stock: 89,
    tags: ['Gaming'],
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    category: 'Wearable',
    price: 1299,
    rating: 4.7,
    stock: 45,
    tags: ['New', 'Smart'],
  },
  {
    id: 4,
    name: 'Portable Power Bank',
    category: 'Accessories',
    price: 99,
    rating: 4.2,
    stock: 234,
    tags: ['Portable'],
  },
  {
    id: 5,
    name: 'Noise Cancelling Headphones',
    category: 'Electronics',
    price: 899,
    rating: 4.9,
    stock: 67,
    tags: ['Premium', 'Hot'],
  },
  {
    id: 6,
    name: 'Wireless Charger Pad',
    category: 'Accessories',
    price: 149,
    rating: 4.3,
    stock: 178,
    tags: ['Wireless'],
  },
  {
    id: 7,
    name: 'Smart Speaker Mini',
    category: 'Home',
    price: 399,
    rating: 4.4,
    stock: 112,
    tags: ['Smart Home'],
  },
  {
    id: 8,
    name: 'Fitness Tracker Band',
    category: 'Wearable',
    price: 199,
    rating: 4.1,
    stock: 256,
    tags: ['Fitness'],
  },
  {
    id: 9,
    name: 'USB-C Hub Multiport',
    category: 'Accessories',
    price: 249,
    rating: 4.6,
    stock: 143,
    tags: ['Hot'],
  },
  {
    id: 10,
    name: 'Gaming Mouse Pro',
    category: 'Electronics',
    price: 399,
    rating: 4.7,
    stock: 98,
    tags: ['Gaming', 'RGB'],
  },
];

// ─── Type Definitions ────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

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

// ─── FilterPanel Component ─────────────────────────────────────────────────────────
interface FilterPanelProps {
  categories?: string[];
  selectedCategories?: string[];
  priceRange?: [number, number];
  minRating?: number;
  searchKeyword?: string;
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  categories = ['Electronics', 'Wearable', 'Accessories', 'Home'],
  selectedCategories = [],
  priceRange = [0, 1500],
  minRating = 0,
  searchKeyword = '',
  onAction,
  action,
}) => {
  const [filters, setFilters] = useState({
    categories: selectedCategories,
    priceRange,
    minRating,
    searchKeyword,
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (action?.event?.name) {
      const context: Record<string, any> = {};
      if (action.event.context) {
        Object.keys(action.event.context).forEach((key) => {
          context[key] = updatedFilters;
        });
      }
      onAction?.(action.event.name, context);
    }
  };

  return (
    <Card
      title={
        <Space>
          <SearchOutlined />
          <span>Filters</span>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={20}>
        {/* Search Input */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Search
          </Text>
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={filters.searchKeyword}
            onChange={(e) => handleFilterChange({ searchKeyword: e.target.value })}
            allowClear
          />
        </div>

        {/* Category Filter */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Category
          </Text>
          <Checkbox.Group
            value={filters.categories}
            onChange={(checked) => handleFilterChange({ categories: checked as string[] })}
          >
            <Row>
              {categories.map((cat) => (
                <Col span={12} key={cat} style={{ marginBottom: 8 }}>
                  <Checkbox value={cat}>{cat}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>

        {/* Price Range Filter */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Price Range: ¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}
          </Text>
          <Slider
            range
            min={0}
            max={1500}
            value={filters.priceRange}
            onChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
            marks={{ 0: '¥0', 500: '¥500', 1000: '¥1000', 1500: '¥1500' }}
          />
        </div>

        {/* Rating Filter */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Minimum Rating
          </Text>
          <Rate
            value={filters.minRating}
            onChange={(value) => handleFilterChange({ minRating: value })}
          />
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {filters.minRating > 0 ? `${filters.minRating}+ stars` : 'All ratings'}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

// ─── ProductList Component ──────────────────────────────────────────────────────────
interface ProductListProps {
  products?: Product[];
  filters?: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
    searchKeyword: string;
  };
}

const ProductList: React.FC<ProductListProps> = ({ products = allProducts, filters }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      let result = products;

      if (filters?.searchKeyword) {
        const keyword = filters.searchKeyword.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(keyword) ||
            p.category.toLowerCase().includes(keyword) ||
            p.tags.some((t) => t.toLowerCase().includes(keyword)),
        );
      }

      if (filters?.categories && filters.categories.length > 0) {
        result = result.filter((p) => filters.categories.includes(p.category));
      }

      if (filters?.priceRange) {
        result = result.filter(
          (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
        );
      }

      if (filters?.minRating && filters.minRating > 0) {
        result = result.filter((p) => p.rating >= filters.minRating);
      }

      setFilteredProducts(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [products, filters]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Text strong>Results:</Text>
          <Tag color="blue">{filteredProducts.length} products</Tag>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} key={product.id}>
            <Card
              hoverable
              style={{ borderRadius: 12 }}
              cover={
                <div
                  style={{
                    height: 120,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 48 }}>📦</span>
                </div>
              }
            >
              <Card.Meta
                title={
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text strong ellipsis style={{ fontSize: 14 }}>
                      {product.name}
                    </Text>
                    <Space wrap size={4}>
                      {product.tags.map((tag) => (
                        <Tag key={tag} style={{ fontSize: 11, margin: 0 }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={8} style={{ width: '100%', marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                        ¥{product.price}
                      </Text>
                      <Rate disabled value={product.rating} style={{ fontSize: 12 }} />
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Stock: {product.stock}
                    </Text>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProducts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <Title level={4} type="secondary">
            No products found
          </Title>
          <Text type="secondary">Try adjusting your filters</Text>
        </div>
      )}
    </div>
  );
};

// ─── FilterContainer Component ──────────────────────────────────────────────────────
interface FilterContainerProps {
  children?: React.ReactNode;
}

const FilterContainer: React.FC<FilterContainerProps> = ({ children }) => {
  // Convert children to array, first child component (FilterPanel) takes 8 columns, second (ProductList) takes 16 columns
  const childArray = React.Children.toArray(children);
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '20px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        minWidth: 600,
      }}
    >
      <Row gutter={24}>
        {childArray.map((child, index) => (
          <Col key={index} span={index === 0 ? 8 : 16}>
            {child}
          </Col>
        ))}
      </Row>
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
    surfaceId: 'filter',
    catalogId: 'local://filter_search_catalog.json',
  },
};

const UpdateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'filter',
    components: [
      {
        id: 'filter-panel',
        component: 'FilterPanel',
        selectedCategories: { path: '/filter/filters/categories' },
        priceRange: { path: '/filter/filters/priceRange' },
        minRating: { path: '/filter/filters/minRating' },
        searchKeyword: { path: '/filter/filters/searchKeyword' },
        action: {
          event: {
            name: 'update_filters',
            context: {
              filters: {
                path: '/filter/filters',
              },
            },
          },
        },
      },
      {
        id: 'product-list',
        component: 'ProductList',
        filters: { path: '/filter/filters' },
      },
      {
        id: 'root',
        component: 'FilterContainer',
        children: ['filter-panel', 'product-list'],
      },
    ],
  },
};

const UpdateModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'filter',
    path: '/filter',
    value: {
      filters: {
        categories: [],
        priceRange: [0, 1500],
        minRating: 0,
        searchKeyword: '',
      },
    },
  },
};

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
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
    setCommandQueue((prev) => [...prev, command]);
  };

  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'update_filters') {
      const { filters } = payload.context || {};
      if (filters) {
        onAgentCommand({
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'filter',
            path: '/filter/filters',
            value: filters,
          },
        });
      }
    }
  };

  const {
    text: textHeader,
    streamStatus: streamStatusHeader,
    run: runHeader,
    reset: resetHeader,
  } = useStreamText(contentHeader);

  useEffect(() => {
    runHeader();
  }, [sessionKey, runHeader]);

  useEffect(() => {
    if (streamStatusHeader === 'FINISHED') {
      onAgentCommand(CreateCard);
      onAgentCommand(UpdateCard);
      onAgentCommand(UpdateModel);
    }
  }, [streamStatusHeader, sessionKey]);

  const handleReload = useCallback(() => {
    resetHeader();
    const deleteCommands: XAgentCommand_v0_9[] = [
      { version: 'v0.9', deleteSurface: { surfaceId: 'filter' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);
    setTimeout(() => {
      setSessionKey((prev) => prev + 1);
    }, 50);
  }, [resetHeader]);

  const items = [
    {
      content: {
        texts: [
          { text: textHeader, timestamp: streamStatusHeader === 'RUNNING' ? Date.now() : 0 },
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
          FilterPanel,
          ProductList,
          FilterContainer,
        }}
      >
        <Bubble.List items={items} style={{ height: 700 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
