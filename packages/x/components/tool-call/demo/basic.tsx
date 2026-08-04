import { ThunderboltOutlined } from '@ant-design/icons';
import type { ToolCallItem } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';

const completedItem: ToolCallItem = {
  id: 'weather-1',
  name: 'getWeatherForecast',
  description: 'Hangzhou · next 3 days',
  arguments: { city: 'Hangzhou', days: 3, unit: 'celsius' },
  result: {
    current: '27°C',
    condition: 'Partly cloudy',
    forecast: ['28 / 22°C', '30 / 23°C', '29 / 21°C'],
  },
  status: 'completed',
  startedAt: 1785772800000,
  completedAt: 1785772801280,
};

const App: React.FC = () => {
  const [item, setItem] = React.useState<ToolCallItem>(completedItem);
  const [expanded, setExpanded] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const run = () => {
    timers.current.forEach(window.clearTimeout);
    setExpanded(true);
    setItem({
      ...completedItem,
      arguments: undefined,
      argumentsText: '{\n  "city": "Hangzhou",\n  "days":',
      result: undefined,
      startedAt: undefined,
      completedAt: undefined,
      status: 'streaming',
    });
    let startedAt = 0;
    timers.current = [
      window.setTimeout(() => {
        startedAt = Date.now();
        setItem({
          ...completedItem,
          result: undefined,
          completedAt: undefined,
          startedAt,
          status: 'running',
        });
      }, 900),
      window.setTimeout(() => {
        setItem({ ...completedItem, startedAt, completedAt: Date.now() });
        setExpanded(false);
      }, 2100),
    ];
  };

  return (
    <div className="tool-call-basic-demo">
      <div className="demo-command-bar">
        <div>
          <strong>Travel assistant</strong>
          <span>Connected · tools ready</span>
        </div>
        <Button type="primary" icon={<ThunderboltOutlined />} onClick={run}>
          Run again
        </Button>
      </div>
      <div className="demo-agent-message">
        <span className="demo-agent-mark">AI</span>
        <div className="demo-agent-content">
          <p>I’ll check the local forecast before planning the itinerary.</p>
          <ToolCall item={item} expanded={expanded} onExpandedChange={setExpanded} />
          {item.status === 'completed' && (
            <p className="demo-answer">The next three days are warm with light cloud cover.</p>
          )}
        </div>
      </div>
      <style>{`
        .tool-call-basic-demo { max-width: 760px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
        .demo-command-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
        .demo-command-bar strong { display: block; color: #111827; font-size: 15px; }
        .demo-command-bar span { display: block; margin-top: 2px; color: #22a06b; font-size: 12px; }
        .demo-agent-message { display: flex; align-items: flex-start; gap: 12px; }
        .demo-agent-mark { display: grid; flex: none; place-items: center; width: 32px; height: 32px; color: #fff; font-size: 11px; font-weight: 700; background: #1677ff; border-radius: 7px; }
        .demo-agent-content { min-width: 0; flex: 1; }
        .demo-agent-content p { margin: 5px 0 14px; color: #4b5563; line-height: 1.6; }
        .demo-agent-content .demo-answer { margin: 14px 0 0; color: #111827; }
        @media (max-width: 480px) { .tool-call-basic-demo { padding: 12px; } .demo-command-bar { align-items: flex-start; } .demo-command-bar span { max-width: 140px; } }
      `}</style>
    </div>
  );
};

export default App;
