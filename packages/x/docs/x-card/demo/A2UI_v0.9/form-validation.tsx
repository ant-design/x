import { ReloadOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Form, Input, message, Select, Space, Steps, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// 导入本地 catalog schema
import localCatalog from './catalog-form.json';

// 注册本地 catalog
registerCatalog(localCatalog as unknown as Catalog);

const { Title, Text } = Typography;
const { Option } = Select;

const contentHeader =
  'Welcome to register! 🎉\n\nPlease fill in your information to create an account. We will verify your information step by step.';

// ─── 类型定义 ────────────────────────────────────────────────────────────────
type TextNode = { text: string; timestamp: number };
type CardNode = { timestamp: number; id: string };
type ContentType = {
  texts: TextNode[];
  card: CardNode[];
};

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

// ─── RegistrationForm 组件 ─────────────────────────────────────────────────────
interface RegistrationFormProps {
  step?: number;
  status?: 'error' | 'success' | 'loading';
  errorMessage?: string;
  onAction?: (name: string, context: Record<string, any>) => void;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  step = 0,
  status,
  errorMessage,
  onAction,
  action,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(step);
  const [formStatus, setFormStatus] = useState<'error' | 'success' | 'loading' | null>(null);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  useEffect(() => {
    setFormStatus(status ?? null);
  }, [status]);

  const handleNext = async () => {
    try {
      const fieldsToValidate =
        currentStep === 0 ? ['username', 'email'] : ['password', 'confirmPassword'];

      await form.validateFields(fieldsToValidate);
      const values = form.getFieldsValue();

      if (action?.event?.name) {
        const context: Record<string, any> = {};
        if (action.event.context) {
          Object.keys(action.event.context).forEach((key) => {
            context[key] = {
              step: currentStep + 1,
              values,
            };
          });
        }
        onAction?.(action.event.name, context);
      }

      if (currentStep === 1) {
        handleSubmit(values);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (values: any) => {
    if (action?.event?.name) {
      const context: Record<string, any> = {};
      if (action.event.context) {
        Object.keys(action.event.context).forEach((key) => {
          context[key] = {
            step: 2,
            values,
            submit: true,
          };
        });
      }
      onAction?.(action.event.name, context);
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      description: 'Username & Email',
    },
    {
      title: 'Security',
      description: 'Password',
    },
    {
      title: 'Complete',
      description: 'Account Created',
    },
  ];

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #e8e8e8',
        padding: '24px',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        minWidth: 480,
        maxWidth: 600,
      }}
    >
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

      {formStatus === 'error' && errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: 16,
            borderRadius: 8,
            background: '#fff2f0',
            border: '1px solid #ffccc7',
          }}
        >
          <Text type="danger">{errorMessage}</Text>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      >
        {/* Step 0: Basic Info */}
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscores!' },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="Enter username" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            validateTrigger="onBlur"
          >
            <Input placeholder="Enter email" size="large" />
          </Form.Item>
        </div>

        {/* Step 1: Security */}
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Must contain uppercase, lowercase and number!',
              },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password placeholder="Confirm password" size="large" />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[{ required: true, message: 'Please select account type!' }]}
            initialValue="personal"
          >
            <Select size="large">
              <Option value="personal">Personal</Option>
              <Option value="business">Business</Option>
              <Option value="developer">Developer</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Step 2: Complete */}
        {currentStep === 2 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#f6ffed',
              borderRadius: 12,
              border: '1px solid #b7eb8f',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <Title level={3} style={{ marginBottom: 8, color: '#52c41a' }}>
              Registration Successful!
            </Title>
            <Text type="secondary">Your account has been created successfully.</Text>
          </div>
        )}
      </Form>

      {/* Action Buttons */}
      {currentStep < 2 && (
        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 24 }}>
          <Button size="large" disabled={currentStep === 0} onClick={handlePrev}>
            Previous
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleNext}
            loading={formStatus === 'loading'}
          >
            {currentStep === 1 ? 'Submit' : 'Next'}
          </Button>
        </Space>
      )}
    </div>
  );
};

// ─── SuccessCard 组件 ──────────────────────────────────────────────────────────
interface SuccessCardProps {
  username?: string;
  email?: string;
  accountType?: string;
}

const SuccessCard: React.FC<SuccessCardProps> = ({ username, email, accountType }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1.5px solid #52c41a',
        padding: '24px',
        background: 'linear-gradient(135deg, #f6ffed 0%, #fff 100%)',
        boxShadow: '0 2px 12px rgba(82,196,26,0.15)',
        minWidth: 400,
        maxWidth: 500,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <Title level={2} style={{ marginBottom: 8, color: '#52c41a' }}>
          Welcome, {username}!
        </Title>
        <Text type="secondary">Your account has been created successfully.</Text>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 16,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Email:</Text>
            <Text strong>{email}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text type="secondary">Account Type:</Text>
            <Text strong style={{ textTransform: 'capitalize' }}>
              {accountType}
            </Text>
          </div>
        </Space>
      </div>

      <Button type="primary" size="large" block>
        Start Exploring
      </Button>
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
    surfaceId: 'registration',
    catalogId: 'local://form_validation_catalog.json',
  },
};

const UpdateCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'registration',
    components: [
      {
        id: 'registration-form',
        component: 'RegistrationForm',
        step: 0,
        status: { path: '/registration/status' },
        errorMessage: { path: '/registration/errorMessage' },
        action: {
          event: {
            name: 'submit_step',
            context: {
              formData: {
                path: '/registration/formData',
              },
            },
          },
        },
      },
    ],
  },
};

const UpdateModel: XAgentCommand_v0_9 = {
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'registration',
    path: '/registration',
    value: {
      status: '',
      errorMessage: '',
    },
  },
};

// ─── 结果卡片配置 ─────────────────────────────────────────────────────────────
const CreateResultCard: XAgentCommand_v0_9 = {
  version: 'v0.9',
  createSurface: {
    surfaceId: 'result',
    catalogId: 'local://form_validation_catalog.json',
  },
};

const UpdateResultCard = (formData: any): XAgentCommand_v0_9 => {
  return {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'result',
      components: [
        {
          id: 'success-card',
          component: 'SuccessCard',
          username: formData?.username,
          email: formData?.email,
          accountType: formData?.accountType ?? 'personal',
        },
      ],
    },
  };
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

  /** Handle Card internal action events */
  const handleAction = (payload: ActionPayload) => {
    if (payload.name === 'submit_step') {
      const { formData } = payload.context || {};

      if (formData?.submit) {
        message.success('Registration successful!');

        onAgentCommand({
          version: 'v0.9',
          deleteSurface: {
            surfaceId: 'registration',
          },
        });

        setTimeout(() => {
          onAgentCommand(CreateResultCard);
          onAgentCommand(UpdateResultCard(formData.values));
        }, 300);
      } else {
        message.info(`Step ${formData.step} completed`);
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
      { version: 'v0.9', deleteSurface: { surfaceId: 'registration' } },
      { version: 'v0.9', deleteSurface: { surfaceId: 'result' } },
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
          RegistrationForm,
          SuccessCard,
        }}
      >
        <Bubble.List items={items} style={{ height: 620 }} role={role} />
      </XCard.Box>
    </div>
  );
};

export default App;
