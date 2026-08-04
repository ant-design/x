import type { ToolCallItem } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import { Segmented, Space, Switch, Typography } from 'antd';
import React from 'react';

const item: ToolCallItem = {
  id: 'analytics-1',
  name: 'runSalesAnalysis',
  description: 'Quarterly revenue by product line',
  arguments: {
    period: { from: '2026-04-01', to: '2026-06-30' },
    dimensions: ['productLine', 'region'],
  },
  result: { rows: 128, currency: 'CNY', generatedAt: '2026-08-04T10:20:00Z' },
  status: 'completed',
};

const App: React.FC = () => {
  const [mode, setMode] = React.useState<'compact' | 'inspect'>('inspect');
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => setExpanded(mode === 'inspect'), [mode]);

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Segmented
          value={mode}
          options={[
            { label: 'Compact', value: 'compact' },
            { label: 'Inspect', value: 'inspect' },
          ]}
          onChange={setMode}
        />
        <Space>
          <Typography.Text type="secondary">Details</Typography.Text>
          <Switch checked={expanded} onChange={setExpanded} />
        </Space>
      </div>
      <ToolCall item={item} expanded={expanded} onExpandedChange={setExpanded} />
    </Space>
  );
};

export default App;
