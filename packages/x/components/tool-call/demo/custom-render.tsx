import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import type { ToolCallItem } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import { Button, message, Progress, Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';

const item: ToolCallItem = {
  id: 'deploy-1',
  name: 'deployPreview',
  description: 'x-components · preview/4281',
  arguments: { branch: 'feature/tool-call', region: 'cn-hangzhou', checks: true },
  result: { url: 'https://preview.example.com/4281', health: 100, latency: 82 },
  status: 'completed',
  attempt: 2,
};

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <ToolCall
        item={item}
        defaultExpanded
        argumentsRender={(current) => (
          <Space wrap>
            {Object.entries(current.arguments as Record<string, unknown>).map(([key, value]) => (
              <Tag key={key} bordered={false} color="blue">
                {key}: {String(value)}
              </Tag>
            ))}
          </Space>
        )}
        resultRender={(value) => {
          const result = value as { url: string; health: number; latency: number };
          return (
            <div className="deploy-result">
              <div>
                <Typography.Text strong>Preview is healthy</Typography.Text>
                <Typography.Text type="secondary">
                  {result.latency} ms average latency
                </Typography.Text>
              </div>
              <Progress percent={result.health} size="small" status="success" />
            </div>
          );
        }}
        actions={() => (
          <Space size={2}>
            <Tooltip title="Copy preview URL">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                aria-label="Copy preview URL"
                onClick={() => messageApi.success('Preview URL copied')}
              />
            </Tooltip>
            <Tooltip title="Open preview">
              <Button
                type="text"
                size="small"
                icon={<ExportOutlined />}
                aria-label="Open preview"
              />
            </Tooltip>
          </Space>
        )}
      />
      <style>{`
        .deploy-result { display: grid; grid-template-columns: minmax(180px, 1fr) minmax(140px, 240px); align-items: center; gap: 24px; padding: 12px 16px; border: 1px solid #d9f7be; border-radius: 6px; background: #f6ffed; }
        .deploy-result > div:first-child { display: flex; flex-direction: column; gap: 3px; }
        @media (max-width: 540px) { .deploy-result { grid-template-columns: 1fr; gap: 8px; } }
      `}</style>
    </>
  );
};

export default App;
