import { DeleteOutlined, ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import {
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  InputNumber,
  List,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 导入本地 catalog schema
import localCatalog from './catalog-cart.json';

// 注册本地 catalog
registerCatalog(localCatalog as unknown as Catalog);

const contentHeader =
  'Welcome to our online store! Browse our products and add them to your cart. Your shopping cart and order summary will update in real-time across all cards.';
const orderConfirmation =
  'Thank you for your order! Your items will be shipped soon. Have a great day!';

// ─── 类型定义 ───────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tag?: string;
  stock?: number;
}

interface CartItem extends Product {
  quantity: number;
}

// ─── Role 定义 ──────────────────────────────────────────────────────────────────
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
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'success' | 'price' | 'discount' | string;
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
    price: {
      fontSize: 18,
      fontWeight: 700,
      color: '#f5222d',
      margin: 0,
    },
    discount: {
      fontSize: 14,
      color: '#52c41a',
      fontWeight: 600,
    },
  };
  const style = styleMap[variant ?? 'body'] ?? styleMap.body;
  return <p style={style}>{content}</p>;
};

// ─── CardContainer 组件 ────────────────────────────────────────────────────────
interface CardContainerProps {
  children?: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
}

const CardContainer: React.FC<CardContainerProps> = ({ children, layout = 'horizontal' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: layout === 'horizontal' ? 'center' : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ─── ProductListCard 组件 ──────────────────────────────────────────────────────
interface ProductListCardProps {
  products?: Product[];
  cartItems?: CartItem[];
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
}

const ProductListCard: React.FC<ProductListCardProps> = ({
  products,
  cartItems = [],
  action,
  onAction,
}) => {
  const handleAddToCart = (product: Product) => {
    if (!action?.event?.name) return;

    const context: Record<string, any> = {};
    if (action.event.context) {
      Object.keys(action.event.context).forEach((key) => {
        context[key] = product;
      });
    }
    onAction?.(action.event.name, context);
  };

  const getCartQuantity = (productId: string | number) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find((item) => item.id === productId);
    return item?.quantity || 0;
  };

  return (
    <Card
      title={
        <Space>
          <span>Product List</span>
          <Badge count={cartItems.length} style={{ backgroundColor: '#1890ff' }} />
        </Space>
      }
      style={{ width: 380, borderRadius: 12 }}
      styles={{
        header: { borderBottom: '1px solid #f0f0f0' },
        body: { padding: 16, maxHeight: 400, overflow: 'auto' },
      }}
    >
      <List
        dataSource={products}
        renderItem={(item) => {
          const cartQty = getCartQuantity(item.id);
          return (
            <List.Item style={{ borderBottom: '1px solid #f5f5f5', padding: '12px 0' }}>
              <div style={{ display: 'flex', width: '100%', gap: 12 }}>
                {/* 产品图片占位 */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <span style={{ fontSize: 24 }}>📦</span>
                  )}
                </div>

                {/* 产品信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
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
                          margin: 0,
                        }}
                        color="orange"
                      >
                        {item.tag}
                      </Tag>
                    )}
                    {cartQty > 0 && (
                      <Tag
                        style={{
                          fontSize: 11,
                          padding: '0 6px',
                          lineHeight: '18px',
                          borderRadius: 8,
                          margin: 0,
                        }}
                        color="blue"
                      >
                        In Cart: {cartQty}
                      </Tag>
                    )}
                  </div>
                  {item.description && (
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, display: 'block', marginBottom: 4 }}
                      ellipsis
                    >
                      {item.description}
                    </Typography.Text>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography.Text style={{ fontSize: 16, fontWeight: 700, color: '#f5222d' }}>
                      ¥{item.price.toFixed(2)}
                    </Typography.Text>
                    <Button
                      type="primary"
                      size="small"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

// ─── CartCard 组件 ──────────────────────────────────────────────────────────────
interface CartCardProps {
  items?: CartItem[];
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
}

const CartCard: React.FC<CartCardProps> = ({ items = [], action, onAction }) => {
  const handleQuantityChange = (productId: string | number, quantity: number) => {
    if (!action?.event?.name) return;

    const context: Record<string, any> = {
      productId,
      quantity,
      actionType: 'update',
    };
    onAction?.(action.event.name, context);
  };

  const handleRemove = (productId: string | number) => {
    if (!action?.event?.name) return;

    const context: Record<string, any> = {
      productId,
      actionType: 'remove',
    };
    onAction?.(action.event.name, context);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Shopping Cart</span>
          <Badge count={totalItems} style={{ backgroundColor: '#52c41a' }} />
        </Space>
      }
      style={{ width: 380, borderRadius: 12 }}
      styles={{
        header: { borderBottom: '1px solid #f0f0f0' },
        body: { padding: 16, maxHeight: 400, overflow: 'auto' },
      }}
    >
      {items.length === 0 ? (
        <Empty description="Your cart is empty" style={{ padding: '20px 0' }} />
      ) : (
        <>
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item style={{ borderBottom: '1px solid #f5f5f5', padding: '12px 0' }}>
                <div style={{ display: 'flex', width: '100%', gap: 12, alignItems: 'center' }}>
                  {/* 产品图片占位 */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>📦</span>
                  </div>

                  {/* 产品信息 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text strong style={{ fontSize: 14, display: 'block' }}>
                      {item.name}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 13, color: '#f5222d' }}>
                      ¥{item.price.toFixed(2)} x {item.quantity} = ¥
                      {(item.price * item.quantity).toFixed(2)}
                    </Typography.Text>
                  </div>

                  {/* 数量控制 */}
                  <Space>
                    <InputNumber
                      min={1}
                      max={item.stock || 99}
                      value={item.quantity}
                      size="small"
                      onChange={(value) => handleQuantityChange(item.id, value || 1)}
                      style={{ width: 60 }}
                    />
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.id)}
                    />
                  </Space>
                </div>
              </List.Item>
            )}
          />
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Text type="secondary">Subtotal:</Typography.Text>
            <Typography.Text style={{ fontSize: 16, fontWeight: 700, color: '#f5222d' }}>
              ¥{subtotal.toFixed(2)}
            </Typography.Text>
          </div>
        </>
      )}
    </Card>
  );
};

// ─── OrderSummaryCard 组件 ──────────────────────────────────────────────────────
interface OrderSummaryCardProps {
  items?: CartItem[];
  discount?: number;
  shipping?: number;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items = [],
  discount = 0,
  shipping = 0,
  action,
  onAction,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount + shipping;

  const handleCheckout = () => {
    if (!action?.event?.name) return;

    const context: Record<string, any> = {
      items,
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      itemCount: totalItems,
    };
    onAction?.(action.event.name, context);
  };

  return (
    <Card
      title="Order Summary"
      style={{ width: 380, borderRadius: 12 }}
      styles={{
        header: { borderBottom: '1px solid #f0f0f0' },
        body: { padding: 16 },
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={12}>
        {/* 商品数量 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">Items ({totalItems}):</Typography.Text>
          <Typography.Text>¥{subtotal.toFixed(2)}</Typography.Text>
        </div>

        {/* 优惠 */}
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography.Text type="secondary">Discount ({discount}%):</Typography.Text>
            <Typography.Text style={{ color: '#52c41a' }}>
              -¥{discountAmount.toFixed(2)}
            </Typography.Text>
          </div>
        )}

        {/* 运费 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">Shipping:</Typography.Text>
          <Typography.Text>{shipping === 0 ? 'Free' : `¥${shipping.toFixed(2)}`}</Typography.Text>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* 总计 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography.Text strong style={{ fontSize: 16 }}>
            Total:
          </Typography.Text>
          <Typography.Text style={{ fontSize: 20, fontWeight: 700, color: '#f5222d' }}>
            ¥{total.toFixed(2)}
          </Typography.Text>
        </div>

        {/* 结算按钮 */}
        <Button
          type="primary"
          block
          size="large"
          disabled={items.length === 0}
          onClick={handleCheckout}
          style={{ marginTop: 8, borderRadius: 8 }}
        >
          Checkout
        </Button>

        {items.length > 0 && (
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, textAlign: 'center', display: 'block' }}
          >
            Estimated delivery: 3-5 business days
          </Typography.Text>
        )}
      </Space>
    </Card>
  );
};

// ─── SuccessResult 组件 ────────────────────────────────────────────────────────
interface SuccessResultProps {
  orderNumber?: string;
  total?: number;
  itemCount?: number;
}

const SuccessResult: React.FC<SuccessResultProps> = ({ orderNumber, total, itemCount }) => {
  return (
    <Card
      style={{
        width: 380,
        borderRadius: 12,
        background: 'linear-gradient(145deg, #f6ffed 0%, #ffffff 100%)',
        border: '1px solid #b7eb8f',
      }}
      styles={{
        body: { padding: 24, textAlign: 'center' },
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <Typography.Title level={4} style={{ margin: '0 0 8px', color: '#52c41a' }}>
        Order Placed Successfully!
      </Typography.Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Thank you for your purchase
      </Typography.Text>

      <Divider style={{ margin: '16px 0' }} />

      <Space direction="vertical" style={{ width: '100%' }} size={8}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">Order Number:</Typography.Text>
          <Typography.Text strong>{orderNumber}</Typography.Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">Items:</Typography.Text>
          <Typography.Text>{itemCount}</Typography.Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">Total Paid:</Typography.Text>
          <Typography.Text style={{ fontSize: 16, fontWeight: 700, color: '#f5222d' }}>
            ¥{total?.toFixed(2)}
          </Typography.Text>
        </div>
      </Space>
    </Card>
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

// 创建三个 Surface 的命令
const CreateProductListCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'productList',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

const CreateCartCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'cart',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

const CreateOrderSummaryCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'orderSummary',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

// 更新商品列表卡片
const UpdateProductListCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'productList',
    components: [
      {
        id: 'product-list',
        component: 'ProductListCard',
        products: { path: '/store/products' },
        cartItems: { path: '/store/cart' },
        action: {
          event: {
            name: 'add_to_cart',
            context: {
              product: {},
            },
          },
        },
      },
      {
        id: 'root',
        component: 'CardContainer',
        layout: 'vertical',
        children: ['product-list'],
      },
    ],
  },
};

// 更新购物车卡片
const UpdateCartCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'cart',
    components: [
      {
        id: 'cart-card',
        component: 'CartCard',
        items: { path: '/store/cart' },
        action: {
          event: {
            name: 'update_cart',
            context: {
              productId: {},
              quantity: {},
              actionType: {},
            },
          },
        },
      },
      {
        id: 'root',
        component: 'CardContainer',
        layout: 'vertical',
        children: ['cart-card'],
      },
    ],
  },
};

// 更新订单摘要卡片
const UpdateOrderSummaryCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'orderSummary',
    components: [
      {
        id: 'order-summary',
        component: 'OrderSummaryCard',
        items: { path: '/store/cart' },
        discount: { path: '/store/discount' },
        shipping: { path: '/store/shipping' },
        action: {
          event: {
            name: 'checkout',
            context: {
              items: {},
              subtotal: {},
              discount: {},
              shipping: {},
              total: {},
              itemCount: {},
            },
          },
        },
      },
      {
        id: 'root',
        component: 'CardContainer',
        layout: 'vertical',
        children: ['order-summary'],
      },
    ],
  },
};

// 初始化数据模型
const InitDataModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'productList',
    path: '/store',
    value: {
      products: [
        {
          id: 1,
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium sound quality with active noise cancellation',
          price: 299,
          tag: 'Best Seller',
          stock: 50,
        },
        {
          id: 2,
          name: 'Smart Watch Pro',
          description: 'Health monitoring, GPS, and 7-day battery life',
          price: 599,
          tag: 'New',
          stock: 30,
        },
        {
          id: 3,
          name: 'Mechanical Keyboard',
          description: 'RGB backlight, hot-swappable switches',
          price: 399,
          stock: 100,
        },
        {
          id: 4,
          name: 'USB-C Hub 7-in-1',
          description: 'HDMI, USB 3.0, SD card reader, PD charging',
          price: 159,
          tag: 'Hot',
          stock: 200,
        },
        {
          id: 5,
          name: 'Portable Power Bank',
          description: '20000mAh, 65W fast charging, compact design',
          price: 199,
          stock: 150,
        },
      ],
      cart: [],
      discount: 10, // 10% discount
      shipping: 0, // Free shipping
    },
  },
};

// 创建成功结果卡片
const CreateSuccessResult: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'successResult',
    catalogId: 'local://cart_demo_catalog.json',
  },
};

const UpdateSuccessResult = (data: any): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'successResult',
    components: [
      {
        id: 'success-result',
        component: 'SuccessResult',
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
        total: data?.total,
        itemCount: data?.itemCount,
      },
      {
        id: 'root',
        component: 'CardContainer',
        layout: 'vertical',
        children: ['success-result'],
      },
    ],
  },
});

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [cards, setCards] = useState<CardNode[]>([]);
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_9[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  const onAgentCommand = (command: XAgentCommand_v0_9) => {
    if ('createSurface' in command) {
      const surfaceId = command.createSurface.surfaceId;
      setCards((prev) => {
        if (prev.some((c) => c.id === surfaceId)) return prev;
        return [...prev, { id: surfaceId, timestamp: Date.now() }];
      });
    } else if ('deleteSurface' in command) {
      setCards((prev) => prev.filter((c) => c.id !== command.deleteSurface.surfaceId));
    }
    setCommandQueue((prev) => [...prev, command]);
  };

  // 处理 Card 内部 action 事件
  const handleAction = (payload: ActionPayload) => {
    const { name, context } = payload;

    switch (name) {
      case 'add_to_cart': {
        // 添加商品到购物车
        const product = context?.product;
        if (product) {
          // 通过 updateDataModel 更新购物车数据
          onAgentCommand({
            version: 'v0.9',
            updateDataModel: {
              surfaceId: 'productList',
              path: '/store/cart',
              value: { __action: 'add', item: { ...product, quantity: 1 } },
            },
          });
        }
        break;
      }

      case 'update_cart': {
        // 更新购物车商品数量或移除商品
        const { productId, quantity, actionType } = context || {};
        if (actionType === 'remove') {
          onAgentCommand({
            version: 'v0.9',
            updateDataModel: {
              surfaceId: 'productList',
              path: '/store/cart',
              value: { __action: 'remove', productId },
            },
          });
        } else if (actionType === 'update') {
          onAgentCommand({
            version: 'v0.9',
            updateDataModel: {
              surfaceId: 'productList',
              path: '/store/cart',
              value: { __action: 'update', productId, quantity },
            },
          });
        }
        break;
      }

      case 'checkout': {
        // 结算流程
        runFooter();

        // 删除所有购物相关卡片
        onAgentCommand({ version: 'v0.9', deleteSurface: { surfaceId: 'productList' } });
        onAgentCommand({ version: 'v0.9', deleteSurface: { surfaceId: 'cart' } });
        onAgentCommand({ version: 'v0.9', deleteSurface: { surfaceId: 'orderSummary' } });

        // 创建并显示成功结果卡片
        onAgentCommand(CreateSuccessResult);
        onAgentCommand(UpdateSuccessResult(context));

        // 清空购物车数据
        onAgentCommand({
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'productList',
            path: '/store/cart',
            value: [],
          },
        });
        break;
      }

      default:
        console.log('Unknown action:', name, context);
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
      // 创建三个 Surface
      onAgentCommand(CreateProductListCard);
      onAgentCommand(CreateCartCard);
      onAgentCommand(CreateOrderSummaryCard);

      // 更新组件
      onAgentCommand(UpdateProductListCard);
      onAgentCommand(UpdateCartCard);
      onAgentCommand(UpdateOrderSummaryCard);

      // 初始化数据模型
      onAgentCommand(InitDataModel);
    }
  }, [streamStatusHeader, sessionKey]);

  // 重新加载
  const handleReload = useCallback(() => {
    resetHeader();
    resetFooter();

    // 删除所有 Surface
    const deleteCommands: XAgentCommand_v0_9[] = [
      { version: 'v0.9', deleteSurface: { surfaceId: 'productList' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'cart' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'orderSummary' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'successResult' } },
    ];
    setCommandQueue((prev) => [...prev, ...deleteCommands]);
    setCards([]);

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
        card: cards,
      } as ContentType,
      role: 'assistant',
      key: sessionKey,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={handleReload}>
          Reset Demo
        </Button>
      </div>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
        onAction={handleAction}
        components={{
          Text,
          CardContainer,
          ProductListCard,
          CartCard,
          OrderSummaryCard,
          SuccessResult,
        }}
      >
        <Bubble.List items={items} style={{ height: 720 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
