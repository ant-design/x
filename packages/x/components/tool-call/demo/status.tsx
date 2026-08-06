import { HourglassOutlined, PauseCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { ToolCallItem, ToolCallStatus } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import React from 'react';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    pending: '等待执行资源',
    streaming: '正在接收结构化参数',
    running: '正在调用物流服务',
    completed: '订单 #20260803001',
    failed: '服务商请求失败',
    cancelled: '用户已取消',
    error: '物流服务商未响应。',
  },
  en: {
    pending: 'Waiting for an execution slot',
    streaming: 'Receiving structured arguments',
    running: 'Calling logistics providers',
    completed: 'Order #20260803001',
    failed: 'Provider request failed',
    cancelled: 'Cancelled by the user',
    error: 'The shipping provider did not respond.',
  },
};

const statuses: Array<{ status: ToolCallStatus; name: string }> = [
  { status: 'pending', name: 'reserveInventory' },
  { status: 'streaming', name: 'searchCatalog' },
  { status: 'running', name: 'calculateShipping' },
  { status: 'completed', name: 'queryOrder' },
  { status: 'failed', name: 'createShipment' },
  { status: 'cancelled', name: 'sendNotification' },
];

const demoStartedAt = Date.now() - 3200;
const statusIcons = {
  pending: <HourglassOutlined />,
  cancelled: <PauseCircleOutlined />,
};

const makeItem = (
  { status, name }: (typeof statuses)[number],
  description: string,
  errorMessage: string,
): ToolCallItem => ({
  id: status,
  name,
  icon: <ShoppingCartOutlined />,
  description,
  arguments: { region: 'CN-East', priority: 'normal' },
  result: status === 'completed' ? { status: 'paid', total: 369 } : undefined,
  error:
    status === 'failed'
      ? {
          code: 'PROVIDER_TIMEOUT',
          message: errorMessage,
          retryable: true,
        }
      : undefined,
  status,
  startedAt: status === 'running' ? demoStartedAt : undefined,
});

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const [retrying, setRetrying] = React.useState(false);

  return (
    <div className="tool-call-status-grid">
      {statuses.map((entry) => (
        <ToolCall
          key={entry.status}
          item={makeItem(entry, locale[entry.status], locale.error)}
          statusIcons={statusIcons}
          retrying={entry.status === 'failed' && retrying}
          onRetry={() => {
            setRetrying(true);
            window.setTimeout(() => setRetrying(false), 1200);
          }}
        />
      ))}
      <style>{`
        .tool-call-status-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        @media (max-width: 720px) { .tool-call-status-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default App;
