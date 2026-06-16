import { Bubble } from '@ant-design/x';
import type { ActionPayload, Catalog, XAgentCommand_v0_9 } from '@ant-design/x-card';
import { registerCatalog, XCard } from '@ant-design/x-card';
import { Button, Input, List, message, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { TextArea } = Input;

// ─── 简单表单组件 ────────────────────────────────────────────────────────────────
interface FormInputProps {
  label?: string;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, any>;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, action, onAction }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (action?.event?.name && action.event.context) {
      const context: Record<string, any> = {};
      Object.keys(action.event.context).forEach((key) => {
        context[key] = newValue;
      });
      onAction?.(action.event.name, context);
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <Typography.Text strong style={{ display: 'block', marginBottom: 4 }}>
        {label}
      </Typography.Text>
      <TextArea
        value={inputValue}
        onChange={handleChange}
        placeholder={`请输入${label}`}
        rows={2}
        style={{ width: '100%' }}
      />
    </div>
  );
};

// ─── 提交按钮组件 ────────────────────────────────────────────────────────────────
interface SubmitButtonProps {
  text?: string;
  action?: {
    event?: {
      name?: string;
    };
  };
  onAction?: (name: string, context: Record<string, any>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, action, onAction }) => {
  const handleClick = () => {
    if (!action?.event?.name || !onAction) return;
    // 传递空上下文，X-Card 会从 dataModel 中解析 action 配置里的 path 引用
    onAction(action.event.name, {});
  };

  return (
    <Button type="primary" onClick={handleClick} block>
      {text || '提交'}
    </Button>
  );
};

// ─── FormCard 容器组件 ──────────────────────────────────────────────────────────
const FormCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: 16,
      borderRadius: 8,
      border: '1px solid #e8e8e8',
      background: '#fff',
      minWidth: 280,
      maxWidth: 360,
    }}
  >
    {children}
  </div>
);

// ─── Title 组件 ─────────────────────────────────────────────────────────────────
interface TitleProps {
  text?: string;
  variant?: string;
}

const Title: React.FC<TitleProps> = ({ text, variant }) => {
  if (variant === 'h2')
    return (
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        {text}
      </Typography.Title>
    );
  return <Typography.Text>{text}</Typography.Text>;
};

// ─── Catalog 定义 ────────────────────────────────────────────────────────────────
const catalog = {
  catalogId: 'action_resolve_catalog',
  components: {
    FormCard: { type: 'object', properties: {} },
    Title: {
      type: 'object',
      properties: { text: { type: 'string' }, variant: { type: 'string' } },
    },
    FormInput: {
      type: 'object',
      properties: { label: { type: 'string' }, action: { type: 'object' } },
    },
    SubmitButton: {
      type: 'object',
      properties: { text: { type: 'string' }, action: { type: 'object' } },
    },
  },
};

registerCatalog(catalog as unknown as Catalog);

// ─── Agent Commands ───────────────────────────────────────────────────────────────
const initialCommands: XAgentCommand_v0_9[] = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'form',
      catalogId: 'action_resolve_catalog',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'title', component: 'Title', text: '用户注册表单', variant: 'h2' },
        {
          id: 'username-input',
          component: 'FormInput',
          label: '用户名',
          // action.event.context 中的 { path } 是写入目标
          // X-Card 在触发 onAction 时会自动从 dataModel 读取实际值
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                username: { path: '/form/username', label: '用户名' },
              },
            },
          },
        },
        {
          id: 'email-input',
          component: 'FormInput',
          label: '邮箱',
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                email: { path: '/form/email', label: '邮箱' },
              },
            },
          },
        },
        {
          id: 'submit-btn',
          component: 'SubmitButton',
          text: '提交表单',
          // 提交时一次性发送所有字段，X-Card 会解析所有 path 引用
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                username: { path: '/form/username', label: '用户名' },
                email: { path: '/form/email', label: '邮箱' },
              },
            },
          },
        },
        {
          id: 'root',
          component: 'FormCard',
          children: ['title', 'username-input', 'email-input', 'submit-btn'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'form',
      path: '/form',
      value: { username: '', email: '' },
    },
  },
];

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  const [commandQueue, setCommandQueue] = useState<XAgentCommand_v0_9[]>([]);
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    setCommandQueue(initialCommands);
  }, [sessionKey]);

  const handleAction = (payload: ActionPayload) => {
    const { name, context } = payload;
    const log = `[${name}]\n${JSON.stringify(context, null, 2)}`;
    setActionLogs((prev) => [log, ...prev.slice(0, 3)]);

    if (name === 'agent:send_context_text') {
      const hasResolved = Object.values(context).some(
        (v: any) => v && typeof v === 'object' && 'value' in v,
      );
      if (hasResolved) {
        message.success('Path 引用已自动解析为实际值');
      }
    }
  };

  const handleReset = () => {
    setCommandQueue([]);
    setActionLogs([]);
    setSessionKey((k) => k + 1);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={handleReset}>重置</Button>
        <Typography.Text type="secondary">
          填写表单后点击提交，观察 onAction 回调中 context 的变化
        </Typography.Text>
      </Space>

      <XCard.Box
        key={sessionKey}
        commands={commandQueue}
        onAction={handleAction}
        components={{ FormCard, Title, FormInput, SubmitButton }}
      >
        <Bubble.List
          items={[{ content: <XCard.Card id="form" />, role: 'assistant', key: 'form' }]}
          style={{ height: 420 }}
        />
      </XCard.Box>

      <div style={{ marginTop: 16 }}>
        <Typography.Text strong>onAction 回调日志（path 引用已解析）：</Typography.Text>
        <List
          size="small"
          bordered
          dataSource={actionLogs}
          locale={{ emptyText: '暂无日志，请填写表单后提交' }}
          renderItem={(item) => (
            <List.Item>
              <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{item}</pre>
            </List.Item>
          )}
          style={{ marginTop: 8, maxHeight: 220, overflow: 'auto' }}
        />
      </div>
    </div>
  );
};

export default App;
