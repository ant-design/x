import { CloudOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { ToolCallItem } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    title: '旅行助手',
    connection: '已连接 · 工具就绪',
    runAgain: '重新运行',
    intro: '我会先查询当地天气，再规划行程。',
    answer: '未来三天气温较高，以多云天气为主。',
    description: '杭州 · 未来 3 天',
    condition: '多云',
  },
  en: {
    title: 'Travel assistant',
    connection: 'Connected · tools ready',
    runAgain: 'Run again',
    intro: 'I’ll check the local forecast before planning the itinerary.',
    answer: 'The next three days are warm with light cloud cover.',
    description: 'Hangzhou · next 3 days',
    condition: 'Partly cloudy',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const completedItem = React.useMemo<ToolCallItem>(
    () => ({
      id: 'weather-1',
      name: 'getWeatherForecast',
      icon: <CloudOutlined />,
      description: locale.description,
      arguments: { city: 'Hangzhou', days: 3, unit: 'celsius' },
      result: {
        current: '27°C',
        condition: locale.condition,
        forecast: ['28 / 22°C', '30 / 23°C', '29 / 21°C'],
      },
      status: 'completed',
      startedAt: 1785772800000,
      completedAt: 1785772801280,
    }),
    [locale],
  );
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
          <strong>{locale.title}</strong>
          <span className="demo-connection-status">{locale.connection}</span>
        </div>
        <Button type="primary" icon={<ThunderboltOutlined />} onClick={run}>
          {locale.runAgain}
        </Button>
      </div>
      <div className="demo-agent-message">
        <span className="demo-agent-mark">AI</span>
        <div className="demo-agent-content">
          <p>{locale.intro}</p>
          <ToolCall item={item} expanded={expanded} onExpandedChange={setExpanded} />
          {item.status === 'completed' && <p className="demo-answer">{locale.answer}</p>}
        </div>
      </div>
      <style>{`
        .tool-call-basic-demo { max-width: 760px; margin: 0 auto; }
        .demo-command-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; }
        .demo-command-bar strong { display: block; color: #111827; font-size: 15px; }
        .demo-connection-status { display: block; margin-top: 2px; color: #22a06b; font-size: 12px; }
        .demo-agent-message { display: flex; align-items: flex-start; gap: 12px; }
        .demo-agent-mark { display: grid; flex: none; place-items: center; width: 32px; height: 32px; color: #fff; font-size: 11px; font-weight: 700; background: #1677ff; border-radius: 7px; }
        .demo-agent-content { min-width: 0; flex: 1; }
        .demo-agent-content p { margin: 5px 0 14px; color: #4b5563; line-height: 1.6; }
        .demo-agent-content .demo-answer { margin: 14px 0 0; color: #111827; }
        @media (max-width: 480px) { .demo-command-bar { align-items: flex-start; } .demo-connection-status { max-width: 140px; } }
      `}</style>
    </div>
  );
};

export default App;
