import type { ToolCallItem, ToolCallStatus } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import React from 'react';

const statusData: Array<{
  status: ToolCallStatus;
  name: string;
  description: string;
}> = [
  { status: 'pending', name: 'reserveInventory', description: 'Waiting for an execution slot' },
  { status: 'streaming', name: 'searchCatalog', description: 'Receiving structured arguments' },
  { status: 'running', name: 'calculateShipping', description: 'Calling logistics providers' },
  { status: 'completed', name: 'queryOrder', description: 'Order #20260803001' },
  { status: 'failed', name: 'createShipment', description: 'Provider request failed' },
  { status: 'cancelled', name: 'sendNotification', description: 'Cancelled by the user' },
];

const makeItem = ({ status, name, description }: (typeof statusData)[number]): ToolCallItem => ({
  id: status,
  name,
  description,
  arguments: { region: 'CN-East', priority: 'normal' },
  result: status === 'completed' ? { status: 'paid', total: 369 } : undefined,
  error:
    status === 'failed'
      ? {
          code: 'PROVIDER_TIMEOUT',
          message: 'The shipping provider did not respond.',
          retryable: true,
        }
      : undefined,
  status,
});

const App: React.FC = () => {
  const [retrying, setRetrying] = React.useState(false);

  return (
    <div className="tool-call-status-grid">
      {statusData.map((entry) => (
        <ToolCall
          key={entry.status}
          item={makeItem(entry)}
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
