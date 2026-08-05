import { ReloadOutlined, RocketOutlined } from '@ant-design/icons';
import type { ToolCallApprovalStatus, ToolCallItem } from '@ant-design/x';
import { ToolCall } from '@ant-design/x';
import { Button, Tag } from 'antd';
import React from 'react';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    title: '发布控制台',
    subtitle: '生产环境部署',
    reset: '重置流程',
    approvalTitle: '需要生产环境权限',
    approvalDescription: '此操作将调整线上流量，已启用健康检查和自动回滚。',
    approve: '批准部署',
    waiting: '等待有权限的操作人审批',
    running: '审批已记录 · 正在发布',
    completed: '部署完成 · 审计事件已记录',
    stopped: '执行已停止 · 无待生效的生产变更',
  },
  en: {
    title: 'Release control',
    subtitle: 'Production deployment',
    reset: 'Reset workflow',
    approvalTitle: 'Production access required',
    approvalDescription:
      'This action changes live traffic. Health checks and automatic rollback are enabled.',
    approve: 'Approve deployment',
    waiting: 'Waiting for an authorized operator',
    running: 'Approval recorded · rollout in progress',
    completed: 'Deployment completed · audit event recorded',
    stopped: 'Execution stopped · no production changes pending',
  },
};

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const initialItem = React.useMemo<ToolCallItem>(
    () => ({
      id: 'deploy-production',
      name: 'deployProduction',
      description: 'checkout-api · v2.18.0 · cn-hangzhou',
      arguments: {
        service: 'checkout-api',
        version: 'v2.18.0',
        strategy: 'canary',
        traffic: '10% → 50% → 100%',
        rollbackOnError: true,
      },
      status: 'pending',
    }),
    [],
  );
  const [item, setItem] = React.useState<ToolCallItem>(initialItem);
  const [approvalStatus, setApprovalStatus] = React.useState<ToolCallApprovalStatus>('pending');
  const completionTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(completionTimer.current), []);

  const reset = () => {
    window.clearTimeout(completionTimer.current);
    setApprovalStatus('pending');
    setItem(initialItem);
  };

  const handleApprovalChange = (status: ToolCallApprovalStatus) => {
    setApprovalStatus(status);
    if (status === 'approved') {
      const startedAt = Date.now();
      setItem({ ...initialItem, status: 'running', startedAt });
      completionTimer.current = window.setTimeout(() => {
        setItem({
          ...initialItem,
          status: 'completed',
          startedAt,
          completedAt: Date.now(),
          result: {
            release: 'v2.18.0',
            instances: 24,
            health: 'healthy',
            rollback: 'ready',
          },
        });
      }, 4200);
    } else if (status === 'rejected') {
      setItem({ ...initialItem, status: 'cancelled' });
    }
  };

  const cancel = async () => {
    await wait(450);
    window.clearTimeout(completionTimer.current);
    setItem((current) => ({ ...current, status: 'cancelled', completedAt: Date.now() }));
  };

  return (
    <div className="tool-call-approval-demo">
      <div className="approval-demo-toolbar">
        <div className="approval-demo-title">
          <span className="approval-demo-icon">
            <RocketOutlined />
          </span>
          <div>
            <strong>{locale.title}</strong>
            <span>{locale.subtitle}</span>
          </div>
        </div>
        <div className="approval-demo-meta">
          <Tag color="red">PROD</Tag>
          <Button type="text" icon={<ReloadOutlined />} aria-label={locale.reset} onClick={reset} />
        </div>
      </div>

      <ToolCall
        item={item}
        duration={{ refreshInterval: 100 }}
        onCancel={cancel}
        approval={{
          status: approvalStatus,
          title: locale.approvalTitle,
          description: locale.approvalDescription,
          risk: 'high',
          approveText: locale.approve,
          onApprove: () => wait(650),
          onReject: () => wait(350),
          onStatusChange: handleApprovalChange,
        }}
      />

      <div className="approval-demo-audit" aria-live="polite">
        <span className={`approval-demo-dot approval-demo-dot-${item.status}`} />
        <span>
          {approvalStatus === 'pending'
            ? locale.waiting
            : item.status === 'running'
              ? locale.running
              : item.status === 'completed'
                ? locale.completed
                : locale.stopped}
        </span>
      </div>

      <style>{`
        .tool-call-approval-demo { max-width: 820px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; box-shadow: 0 12px 36px rgba(17, 24, 39, 0.07); }
        .approval-demo-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
        .approval-demo-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .approval-demo-icon { display: grid; flex: none; place-items: center; width: 34px; height: 34px; color: #fff; background: #111827; border-radius: 7px; }
        .approval-demo-title strong, .approval-demo-title span { display: block; }
        .approval-demo-title strong { color: #111827; font-size: 14px; }
        .approval-demo-title span { margin-top: 1px; color: #6b7280; font-size: 12px; }
        .approval-demo-meta { display: flex; align-items: center; gap: 4px; }
        .approval-demo-audit { display: flex; align-items: center; gap: 8px; min-height: 20px; margin-top: 14px; color: #6b7280; font-size: 12px; }
        .approval-demo-dot { width: 7px; height: 7px; background: #d1d5db; border-radius: 50%; }
        .approval-demo-dot-running { background: #1677ff; box-shadow: 0 0 0 4px #e6f4ff; }
        .approval-demo-dot-completed { background: #22a06b; }
        .approval-demo-dot-cancelled { background: #9ca3af; }
        @media (max-width: 480px) { .tool-call-approval-demo { padding: 12px; } .approval-demo-toolbar { align-items: flex-start; } }
      `}</style>
    </div>
  );
};

export default App;
