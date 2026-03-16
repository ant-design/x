import { Bubble, Think } from '@ant-design/x';
import XMarkdown, { type ComponentProps } from '@ant-design/x-markdown';
import React, { useCallback, useEffect, useState } from 'react';
import '@ant-design/x-markdown/themes/light.css';
import {
  DeleteOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  message,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';

const { Option } = Select;

// 模拟业务数据
interface OrderData {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  region: string;
}

interface SalesData {
  name: string;
  value: number;
  color: string;
}

// 自定义业务组件 - 从模型数据获取的销售仪表板
const Salesdashboard = React.memo(({ children, streamStatus }: ComponentProps) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);

  useEffect(() => {
    if (children) {
      // 从模型返回的数据中解析销售信息
      try {
        const parsedData = typeof children === 'string' ? JSON.parse(children) : children;

        if (parsedData.sales) {
          setSalesData(parsedData.sales);
        }
        if (parsedData.totalSales) {
          setTotalSales(parsedData.totalSales);
        }
        if (parsedData.totalOrders) {
          setTotalOrders(parsedData.totalOrders);
        }
        if (parsedData.newCustomers) {
          setNewCustomers(parsedData.newCustomers);
        }
      } catch (_error) {
        // 如果解析失败，使用默认数据
        const defaultData = [
          { name: '电子产品', value: 45000, color: '#3b82f6' },
          { name: '服装', value: 32000, color: '#8b5cf6' },
          { name: '家居用品', value: 28000, color: '#10b981' },
        ];
        setSalesData(defaultData);
        setTotalSales(115000);
        setTotalOrders(342);
        setNewCustomers(67);
      }
    } else {
      // 默认数据
      const defaultData = [
        { name: '电子产品', value: 45000, color: '#3b82f6' },
        { name: '服装', value: 32000, color: '#8b5cf6' },
        { name: '家居用品', value: 28000, color: '#10b981' },
      ];
      setSalesData(defaultData);
      setTotalSales(115000);
      setTotalOrders(342);
      setNewCustomers(67);
    }
  }, [children]);

  if (streamStatus === 'loading') return;
  return (
    <div style={{ padding: '20px' }}>
      <Flex vertical gap="large">
        <Flex justify="space-between" align="center">
          销售仪表板 (从模型数据获取)
          <Tag color="blue">实时数据</Tag>
        </Flex>

        <Flex gap="middle" wrap>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <Statistic
              title="总销售额"
              value={totalSales}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <Statistic
              title="订单总数"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
          <Card style={{ flex: 1, minWidth: 200 }}>
            <Statistic
              title="新增客户"
              value={newCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Flex>

        <Flex gap="large" wrap>
          <Card title="销售分布" style={{ flex: 1, minWidth: 300 }}>
            <div style={{ padding: '20px' }}>
              {salesData.map((item, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <Flex justify="space-between" align="center">
                    <span>{item.name}</span>
                    <Tag color={item.color}>¥{item.value.toLocaleString()}</Tag>
                  </Flex>
                </div>
              ))}
            </div>
          </Card>

          <Card title="数据说明" style={{ flex: 1, minWidth: 300 }}>
            <div style={{ padding: '20px' }}>
              <p>🤖 以上数据由AI模型实时生成</p>
              <p>📊 数据格式: JSON格式，包含sales、totalSales、totalOrders、newCustomers字段</p>
              <p>💡 示例格式: sales数组包含name和value字段</p>
            </div>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
});

// 自定义业务组件 - 订单管理表格
const OrderManager = React.memo(() => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [form] = Form.useForm();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockOrders: OrderData[] = [
        {
          id: 'ORD001',
          customer: '张三',
          product: 'iPhone 15',
          amount: 8999,
          status: 'completed',
          date: '2024-01-15',
          region: '北京',
        },
        {
          id: 'ORD002',
          customer: '李四',
          product: 'MacBook Pro',
          amount: 15999,
          status: 'processing',
          date: '2024-01-16',
          region: '上海',
        },
        {
          id: 'ORD003',
          customer: '王五',
          product: 'AirPods Pro',
          amount: 1999,
          status: 'pending',
          date: '2024-01-17',
          region: '广州',
        },
        {
          id: 'ORD004',
          customer: '赵六',
          product: 'iPad Air',
          amount: 4799,
          status: 'completed',
          date: '2024-01-18',
          region: '深圳',
        },
      ];

      setOrders(mockOrders);
    } catch (_error) {
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (id: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrders((prev) => prev.filter((order) => order.id !== id));
      message.success('订单已删除');
    } catch (_error) {
      message.error('删除失败');
    }
  };

  const handleEdit = (order: OrderData) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    setModalVisible(true);
  };

  const handleSubmit = async (values: Partial<OrderData>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingOrder) {
        setOrders((prev) =>
          prev.map((order) => (order.id === editingOrder.id ? { ...order, ...values } : order)),
        );
        message.success('订单已更新');
      } else {
        const newOrder: OrderData = {
          id: `ORD${String(Date.now()).slice(-3)}`,
          customer: values.customer || '',
          product: values.product || '',
          amount: values.amount || 0,
          status: values.status || 'pending',
          date: new Date().toISOString().split('T')[0],
          region: values.region || '',
        };
        setOrders((prev) => [...prev, newOrder]);
        message.success('订单已创建');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingOrder(null);
    } catch (_error) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'id', key: 'id' },
    { title: '客户', dataIndex: 'customer', key: 'customer' },
    { title: '产品', dataIndex: 'product', key: 'product' },
    { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount}` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          completed: 'green',
          cancelled: 'red',
        };
        const labels = {
          pending: '待处理',
          processing: '处理中',
          completed: '已完成',
          cancelled: '已取消',
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '地区', dataIndex: 'region', key: 'region' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: OrderData) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Flex vertical gap="middle">
        <Flex justify="space-between" align="center">
          <h2>订单管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建订单
          </Button>
        </Flex>

        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title={editingOrder ? '编辑订单' : '新建订单'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingOrder(null);
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="customer" label="客户名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="product" label="产品名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="pending">待处理</Option>
                <Option value="processing">处理中</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
            <Form.Item name="region" label="地区" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Flex>
    </div>
  );
});

// 思考组件
const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState('正在分析业务数据...');
  const [loading, setLoading] = React.useState(true);
  const [expand, setExpand] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === 'done') {
      setTitle('业务分析完成');
      setLoading(false);
      setExpand(false);
    }
  }, [props.streamStatus]);

  return (
    <div style={{ padding: '12px 0' }}>
      <Think title={title} loading={loading} expanded={expand} onClick={() => setExpand(!expand)}>
        {props.children}
      </Think>
    </div>
  );
});

const text = `
<think>
基于用户提供的业务需求，我们需要创建一个完整的销售管理系统示例，该系统需要展示如何从AI模型返回的数据中动态获取和展示信息。这个示例将展示XMarkdown如何：
1. 从模型返回的JSON数据中解析业务信息
2. 使用小写组件标签（如salesdashboard）
3. 处理动态数据渲染
4. 实现复杂的业务场景和交互需求
通过这种方式，用户可以清楚地看到XMarkdown不仅支持简单的文本渲染，还能处理动态数据驱动的复杂业务场景。
</think>

### 📊 动态销售仪表板

<salesdashboard>{"sales":[{"name":"电子产品","value":52000,"color":"#3b82f6"},{"name":"服装","value":38000,"color":"#8b5cf6"}],"totalSales":141000,"totalOrders":487,"newCustomers":94}</salesdashboard>

### 📋 订单管理系统

<ordermanager />
`;

const App = () => {
  const [index, setIndex] = React.useState(0);
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (index >= text.length) return;

    timer.current = setTimeout(() => {
      setIndex(Math.min(index + 5, text.length));
    }, 20);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [index]);

  React.useEffect(() => {
    if (contentRef.current && index > 0 && index < text.length) {
      const { scrollHeight, clientHeight } = contentRef.current;
      if (scrollHeight > clientHeight) {
        contentRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [index]);

  return (
    <Flex vertical gap="small" style={{ height: 600, overflow: 'auto' }} ref={contentRef}>
      <Flex justify="flex-end">
        <Button onClick={() => setIndex(0)}>Re-Render</Button>
      </Flex>

      <Bubble
        content={text.slice(0, index)}
        contentRender={(content) => (
          <XMarkdown
            components={{
              think: ThinkComponent,
              salesdashboard: Salesdashboard,
              ordermanager: OrderManager,
            }}
            paragraphTag="div"
            streaming={{
              hasNextChunk: index < text.length,
              parsingGuards: {
                customTags: true,
              },
            }}
          >
            {content}
          </XMarkdown>
        )}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
