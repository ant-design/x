import { DeleteOutlined, ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  InputNumber,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const { Title, Text } = Typography;

// ─── Type Definitions ───────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  tag?: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Product Data ─────────────────────────────────────────────────────────────────
const allProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'A17 Pro chip, 48MP camera system',
    price: 7999,
    category: 'Electronics',
    tag: 'Hot',
    stock: 50,
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    description: 'M3 chip, 15-inch Liquid Retina display',
    price: 10999,
    category: 'Electronics',
    tag: 'New',
    stock: 30,
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    description: 'Active Noise Cancellation, Adaptive Audio',
    price: 1899,
    category: 'Accessories',
    tag: 'Popular',
    stock: 100,
  },
  {
    id: 4,
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged Apple Watch, titanium case',
    price: 6499,
    category: 'Wearable',
    stock: 25,
  },
  {
    id: 5,
    name: 'iPad Pro M2',
    description: 'M2 chip, 12.9-inch Liquid Retina XDR display',
    price: 9299,
    category: 'Electronics',
    tag: 'Recommended',
    stock: 40,
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    description: 'Wireless, rechargeable, with Touch ID',
    price: 1999,
    category: 'Accessories',
    stock: 80,
  },
];

const contentHeader =
  'Welcome to Smart Shopping Cart! 🛒\n\nBrowse products, add them to your cart, and see real-time price calculations. Experience the power of multi-surface collaboration!';

// ─── Role Definition ──────────────────────────────────────────────────────────────────
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

// ─── ColWrapper Component (for column layout within Row) ────────────────────────────────────
interface ColWrapperProps {
  span?: number | string;
  children?: React.ReactNode;
}

const ColWrapper: React.FC<ColWrapperProps> = ({ span = 8, children }) => {
  const numSpan = typeof span === 'string' ? parseInt(span, 10) : span;
  return <Col span={numSpan}>{children}</Col>;
};

// ─── ProductListCard Component ─────────────────────────────────────────────────────
interface ProductListCardProps {
  products?: Product[];
  cart?: CartItem[];
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const ProductListCard: React.FC<ProductListCardProps> = ({
  products = allProducts,
  cart = [],
  onAction,
  action,
}) => {
  const handleAddToCart = (product: Product) => {
    if (!action?.event?.name) return;

    const context: Record<string, any> = { product };
    onAction?.(action.event.name, context);
  };

  const getCartQuantity = (productId: number) => {
    const item = cart.find((c) => c.product.id === productId);
    return item?.quantity || 0;
  };

  return (
    <Card
      title={
        <Space>
          <span style={{ fontSize: 18 }}>📦</span>
          <span>Product List</span>
          <Tag color="blue">{products.length} items</Tag>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: '100%',
      }}
      styles={{
        body: { maxHeight: 450, overflow: 'auto' },
      }}
    >
      <List
        dataSource={products}
        renderItem={(product) => {
          const inCart = getCartQuantity(product.id);
          return (
            <List.Item style={{ padding: '12px 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 24 }}>
                    {product.category === 'Electronics'
                      ? '📱'
                      : product.category === 'Accessories'
                        ? '🎧'
                        : product.category === 'Wearable'
                          ? '⌚'
                          : '📦'}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 14 }} ellipsis>
                      {product.name}
                    </Text>
                    {product.tag && (
                      <Tag
                        style={{
                          fontSize: 11,
                          padding: '0 6px',
                          lineHeight: '18px',
                          borderRadius: 6,
                          margin: 0,
                        }}
                        color="orange"
                      >
                        {product.tag}
                      </Tag>
                    )}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                    {product.description}
                  </Text>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Text strong style={{ fontSize: 15, color: '#1890ff', display: 'block' }}>
                    ¥{product.price.toLocaleString()}
                  </Text>
                  <Button
                    type={inCart > 0 ? 'default' : 'primary'}
                    size="small"
                    onClick={() => handleAddToCart(product)}
                    style={{ marginTop: 4, minWidth: 80 }}
                    icon={
                      inCart > 0 ? (
                        <Badge count={inCart} size="small" offset={[6, -2]}>
                          <ShoppingCartOutlined />
                        </Badge>
                      ) : (
                        <ShoppingCartOutlined />
                      )
                    }
                  >
                    {inCart > 0 ? 'Add More' : 'Add'}
                  </Button>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

// ─── CartCard Component ─────────────────────────────────────────────────────────────
interface CartCardProps {
  cart?: CartItem[];
  onAction?: (name: string, context: Record<string, any>) => void;
  updateAction?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  removeAction?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const CartCard: React.FC<CartCardProps> = ({ cart = [], onAction, updateAction, removeAction }) => {
  const handleQuantityChange = (productId: number, quantity: number) => {
    if (!updateAction?.event?.name) return;
    onAction?.(updateAction.event.name, { productId, quantity });
  };

  const handleRemove = (productId: number) => {
    if (!removeAction?.event?.name) return;
    onAction?.(removeAction.event.name, { productId });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Card
      title={
        <Space>
          <Badge count={totalItems} size="small" offset={[4, -2]}>
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
          </Badge>
          <span>Shopping Cart</span>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: '100%',
      }}
      styles={{
        body: { maxHeight: 380, overflow: 'auto' },
      }}
    >
      {cart.length === 0 ? (
        <Empty
          description="Cart is empty"
          style={{ padding: '40px 0' }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          <List
            dataSource={cart}
            renderItem={(item) => (
              <List.Item style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>
                      {item.product.category === 'Electronics'
                        ? '📱'
                        : item.product.category === 'Accessories'
                          ? '🎧'
                          : item.product.category === 'Wearable'
                            ? '⌚'
                            : '📦'}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: 13 }} ellipsis>
                      {item.product.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                      ¥{item.product.price.toLocaleString()} x {item.quantity}
                    </Text>
                  </div>

                  <Space.Compact size="small">
                    <InputNumber
                      min={1}
                      max={item.product.stock}
                      value={item.quantity}
                      onChange={(val) => handleQuantityChange(item.product.id, val || 1)}
                      style={{ width: 60 }}
                      controls={{ upIcon: null, downIcon: null }}
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.product.id)}
                    />
                  </Space.Compact>
                </div>
              </List.Item>
            )}
          />

          <Divider style={{ margin: '12px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Subtotal:</Text>
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              ¥{subtotal.toLocaleString()}
            </Text>
          </div>
        </>
      )}
    </Card>
  );
};

// ─── OrderSummaryCard Component ─────────────────────────────────────────────────────
interface OrderSummaryCardProps {
  cart?: CartItem[];
  onAction?: (name: string, context: Record<string, any>) => void;
  checkoutAction?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  cart = [],
  onAction,
  checkoutAction,
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount
  const discount = subtotal >= 10000 ? subtotal * 0.1 : subtotal >= 5000 ? subtotal * 0.05 : 0;
  const discountRate = subtotal >= 10000 ? '10%' : subtotal >= 5000 ? '5%' : '0%';

  // Shipping fee
  const shipping = subtotal >= 1000 ? 0 : 15;

  // Final total
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    if (!checkoutAction?.event?.name) return;

    onAction?.(checkoutAction.event.name, {
      cart,
      subtotal,
      discount,
      shipping,
      total,
      itemCount: totalItems,
    });
  };

  return (
    <Card
      title={
        <Space>
          <span style={{ fontSize: 18 }}>📋</span>
          <span>Order Summary</span>
        </Space>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        height: '100%',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {/* Item count */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Items:</Text>
          <Text>{totalItems} items</Text>
        </div>

        {/* Subtotal */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Subtotal:</Text>
          <Text>¥{subtotal.toLocaleString()}</Text>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Discount */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Text type="secondary">Discount:</Text>
            {discount > 0 && (
              <Tag color="green" style={{ margin: 0 }}>
                {discountRate} off
              </Tag>
            )}
          </Space>
          <Text type="success">-¥{discount.toLocaleString()}</Text>
        </div>

        {/* Shipping */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Shipping:</Text>
          {shipping === 0 ? <Text type="success">Free</Text> : <Text>¥{shipping}</Text>}
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Total price */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Total:
          </Title>
          <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
            ¥{total.toLocaleString()}
          </Title>
        </div>

        {/* Discount tip */}
        {subtotal < 5000 && (
          <div
            style={{
              padding: '8px 12px',
              background: '#fff7e6',
              borderRadius: 8,
              border: '1px solid #ffd591',
            }}
          >
            <Text style={{ fontSize: 12, color: '#d46b08' }}>
              💡 Spend ¥{(5000 - subtotal).toLocaleString()} more for 5% off!
            </Text>
          </div>
        )}
        {subtotal >= 5000 && subtotal < 10000 && (
          <div
            style={{
              padding: '8px 12px',
              background: '#fff7e6',
              borderRadius: 8,
              border: '1px solid #ffd591',
            }}
          >
            <Text style={{ fontSize: 12, color: '#d46b08' }}>
              💡 Spend ¥{(10000 - subtotal).toLocaleString()} more for 10% off!
            </Text>
          </div>
        )}
        {subtotal >= 10000 && (
          <div
            style={{
              padding: '8px 12px',
              background: '#f6ffed',
              borderRadius: 8,
              border: '1px solid #b7eb8f',
            }}
          >
            <Text style={{ fontSize: 12, color: '#52c41a' }}>
              🎉 You've got the maximum discount!
            </Text>
          </div>
        )}

        {/* Checkout button */}
        <Button
          type="primary"
          size="large"
          block
          disabled={cart.length === 0}
          onClick={handleCheckout}
          style={{ marginTop: 8, height: 48, borderRadius: 8 }}
        >
          Checkout (¥{total.toLocaleString()})
        </Button>
      </Space>
    </Card>
  );
};

// ─── MultiCardContainer Component (three-column horizontal layout container) ──────────────────────────────
interface MultiCardContainerProps {
  children?: React.ReactNode;
}

const MultiCardContainer: React.FC<MultiCardContainerProps> = ({ children }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '24px',
        background: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <Row gutter={16} align="stretch">
        {children}
      </Row>
    </div>
  );
};

// ─── CheckoutSuccessCard Component ──────────────────────────────────────────────────
interface CheckoutSuccessCardProps {
  total?: number;
  itemCount?: number;
  orderNumber?: string;
}

const CheckoutSuccessCard: React.FC<CheckoutSuccessCardProps> = ({
  total = 0,
  itemCount = 0,
  orderNumber,
}) => {
  return (
    <Card
      style={{
        borderRadius: 16,
        background: 'linear-gradient(145deg, #52c41a 0%, #73d13d 100%)',
        border: 'none',
        boxShadow: '0 8px 24px rgba(82,196,26,0.35)',
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <span style={{ fontSize: 40 }}>✅</span>
        </div>

        <Title level={3} style={{ color: '#fff', margin: '0 0 8px' }}>
          Order Placed!
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 24 }}>
          Thank you for your purchase!
        </Text>

        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Order Number:</Text>
            <Text strong style={{ color: '#fff' }}>
              {orderNumber}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Items:</Text>
            <Text style={{ color: '#fff' }}>{itemCount} items</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Total:</Text>
            <Text strong style={{ color: '#fff', fontSize: 18 }}>
              ¥{total.toLocaleString()}
            </Text>
          </div>
        </div>

        <Button
          ghost
          size="large"
          style={{ borderRadius: 8 }}
          onClick={() => window.location.reload()}
        >
          Continue Shopping
        </Button>
      </div>
    </Card>
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
// v0.9 Agent Command Definition
// Three cards merged in one Surface, implementing three-column layout via MultiCardContainer + ColWrapper
// ═══════════════════════════════════════════════════════════════════════════════

// Create shopping Surface
const CreateShopSurface: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'shop',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

// Update shopping Surface components (three-column layout)
const UpdateShopComponents: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'shop',
    components: [
      // Product list card
      {
        id: 'product-list-card',
        component: 'ProductListCard',
        products: { path: '/products' },
        cart: { path: '/cart' },
        action: {
          event: {
            name: 'add_to_cart',
            context: { product: {} },
          },
        },
      },
      // Shopping cart card
      {
        id: 'cart-card',
        component: 'CartCard',
        cart: { path: '/cart' },
        updateAction: {
          event: {
            name: 'update_quantity',
            context: { productId: {}, quantity: {} },
          },
        },
        removeAction: {
          event: {
            name: 'remove_from_cart',
            context: { productId: {} },
          },
        },
      },
      // Order summary card
      {
        id: 'order-summary-card',
        component: 'OrderSummaryCard',
        cart: { path: '/cart' },
        checkoutAction: {
          event: {
            name: 'checkout',
            context: { orderData: {} },
          },
        },
      },
      // Wrap each card with ColWrapper to implement equal-width three columns
      {
        id: 'col-products',
        component: 'ColWrapper',
        span: 8,
        children: ['product-list-card'],
      },
      {
        id: 'col-cart',
        component: 'ColWrapper',
        span: 8,
        children: ['cart-card'],
      },
      {
        id: 'col-summary',
        component: 'ColWrapper',
        span: 8,
        children: ['order-summary-card'],
      },
      // Root container: MultiCardContainer contains three columns
      {
        id: 'root',
        component: 'MultiCardContainer',
        children: ['col-products', 'col-cart', 'col-summary'],
      },
    ],
  },
};

// Initialize data model
const InitDataModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'shop',
    path: '/',
    value: {
      products: allProducts,
      cart: [],
    },
  },
};

// Create success card after checkout
const CreateCheckoutSuccessSurface: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'checkout-success',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

const UpdateCheckoutSuccessComponents = (
  total: number,
  itemCount: number,
  orderNumber: string,
): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'checkout-success',
    components: [
      {
        id: 'root',
        component: 'CheckoutSuccessCard',
        total,
        itemCount,
        orderNumber,
      },
    ],
  },
});

// ─── App Component ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [card, setCard] = useState<CardNode[]>([]);
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_9[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  // Cart state (for cross-component data sharing)
  const [cart, setCart] = useState<CartItem[]>([]);

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

  // Handle cart operations
  const handleAction = (payload: ActionPayload) => {
    const { name, context } = payload;

    switch (name) {
      case 'add_to_cart': {
        const product = context?.product as Product;
        if (!product) return;

        setCart((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
        break;
      }

      case 'update_quantity': {
        const { productId, quantity } = context || {};
        if (!productId || !quantity) return;

        setCart((prev) =>
          prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        );
        break;
      }

      case 'remove_from_cart': {
        const { productId } = context || {};
        if (!productId) return;

        setCart((prev) => prev.filter((item) => item.product.id !== productId));
        break;
      }

      case 'checkout': {
        const { total, itemCount } = context || {};
        const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

        // Delete shopping Surface
        onAgentCommand({ version: 'v0.9', deleteSurface: { surfaceId: 'shop' } });

        // Create checkout success card
        setTimeout(() => {
          onAgentCommand(CreateCheckoutSuccessSurface);
          onAgentCommand(UpdateCheckoutSuccessComponents(total, itemCount, orderNumber));
        }, 100);

        // Clear cart
        setCart([]);
        break;
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
      onAgentCommand(CreateShopSurface);
      onAgentCommand(UpdateShopComponents);
      onAgentCommand(InitDataModel);
    }
  }, [streamStatusHeader, sessionKey]);

  // Update Surface data model when cart changes
  useEffect(() => {
    if (card.some((c) => c.id === 'shop')) {
      onAgentCommand({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'shop',
          path: '/cart',
          value: cart,
        },
      });
    }
  }, [cart]);

  const handleReload = useCallback(() => {
    resetHeader();
    const deleteCommands: XAgentCommand_v0_9[] = [
      { version: 'v0.9', deleteSurface: { surfaceId: 'shop' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'checkout-success' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCard([]);
    setCart([]);
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
          ProductListCard,
          CartCard,
          OrderSummaryCard,
          CheckoutSuccessCard,
          MultiCardContainer,
          ColWrapper,
        }}
      >
        <Bubble.List items={items} style={{ height: 700 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
