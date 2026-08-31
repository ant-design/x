import {
  CheckCircleFilled,
  CloseCircleFilled,
  CodeOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { experimentalRuntime } from '@ant-design/x-card';
import { Button, Tooltip } from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

const SURFACE_ID = 'ops-control-room';
const CATALOG_ID = 'catalog://runtime-control-room';

const catalog = experimentalRuntime.createSurfaceCatalogRegistry({
  catalogs: [
    {
      $id: CATALOG_ID,
      components: {
        Stack: {
          type: 'object',
          properties: { eyebrow: {}, title: {} },
          required: ['title'],
          additionalProperties: false,
        },
        Metric: {
          type: 'object',
          properties: { label: {}, value: {}, unit: {}, trend: {}, tone: {} },
          required: ['label', 'value', 'tone'],
          additionalProperties: false,
        },
        Signal: {
          type: 'object',
          properties: { label: {}, value: {}, detail: {}, tone: {} },
          required: ['label', 'value', 'tone'],
          additionalProperties: false,
        },
        Incident: {
          type: 'object',
          properties: { title: {}, status: {}, detail: {}, owner: {} },
          required: ['title', 'status', 'detail'],
          additionalProperties: false,
        },
      },
    },
  ],
});

const createRuntime = () =>
  experimentalRuntime.createSurfaceRuntime({
    catalogs: catalog,
    adapters: [experimentalRuntime.createA2UIV08Adapter({ catalogId: CATALOG_ID })],
    limits: { historyLimit: 16, maxNodesPerSurface: 64 },
  });

const initializedRuntimes = new WeakSet<object>();

const command = (payload: unknown): experimentalRuntime.SurfaceInput => ({
  protocol: 'a2ui',
  version: 'v0.8',
  payload,
});

const toValueMap = (values: Readonly<Record<string, string | number>>) =>
  Object.entries(values).map(([key, value]) => ({ key, valueString: String(value) }));

const initialFrame = {
  throughput: 1842,
  throughputTrend: '+12.4%',
  latency: 86,
  latencyTrend: '-8 ms',
  confidence: 98.6,
  confidenceTrend: '+0.7%',
  policy: 'ENFORCED',
  policyDetail: 'Catalog allowlist · schema strict',
  incidentTitle: 'Checkout latency anomaly',
  incidentStatus: 'MITIGATING',
  incidentDetail: 'Traffic shifted to healthy inference pool',
  owner: 'AGENT / ROUTER-02',
} as const;

const bootstrapCommands = [
  command({
    surfaceUpdate: {
      surfaceId: SURFACE_ID,
      components: [
        {
          id: 'root',
          component: {
            Stack: {
              eyebrow: { literalString: 'A2UI v0.8 / COMPAT-7' },
              title: { literalString: 'Production Compatibility Surface' },
              children: {
                explicitList: ['throughput', 'latency', 'confidence', 'signal', 'incident'],
              },
            },
          },
        },
        {
          id: 'throughput',
          component: {
            Metric: {
              label: { literalString: 'TOKEN THROUGHPUT' },
              value: { path: '/live/throughput' },
              unit: { literalString: 'tok/s' },
              trend: { path: '/live/throughputTrend' },
              tone: { literalString: 'lime' },
            },
          },
        },
        {
          id: 'latency',
          component: {
            Metric: {
              label: { literalString: 'P95 LATENCY' },
              value: { path: '/live/latency' },
              unit: { literalString: 'ms' },
              trend: { path: '/live/latencyTrend' },
              tone: { literalString: 'cyan' },
            },
          },
        },
        {
          id: 'confidence',
          component: {
            Metric: {
              label: { literalString: 'MODEL CONFIDENCE' },
              value: { path: '/live/confidence' },
              unit: { literalString: '%' },
              trend: { path: '/live/confidenceTrend' },
              tone: { literalString: 'amber' },
            },
          },
        },
        {
          id: 'signal',
          component: {
            Signal: {
              label: { literalString: 'COMPATIBILITY GATE' },
              value: { path: '/live/policy' },
              detail: { path: '/live/policyDetail' },
              tone: { literalString: 'lime' },
            },
          },
        },
        {
          id: 'incident',
          component: {
            Incident: {
              title: { path: '/live/incidentTitle' },
              status: { path: '/live/incidentStatus' },
              detail: { path: '/live/incidentDetail' },
              owner: { path: '/live/owner' },
            },
          },
        },
      ],
    },
  }),
  command({
    dataModelUpdate: {
      surfaceId: SURFACE_ID,
      contents: [{ key: 'live', valueMap: toValueMap(initialFrame) }],
    },
  }),
  command({
    beginRendering: { surfaceId: SURFACE_ID, root: 'root' },
  }),
] as const;

type TimelineTone = 'accepted' | 'rejected' | 'system';

interface TimelineItem {
  id: number;
  title: string;
  detail: string;
  tone: TimelineTone;
  revision?: number;
}

const streamFrames = [
  {
    throughput: 2074,
    throughputTrend: '+18.1%',
    latency: 81,
    latencyTrend: '-13 ms',
    confidence: 98.9,
    confidenceTrend: '+1.0%',
    policy: 'ENFORCED',
    policyDetail: 'Catalog allowlist · schema strict',
    incidentTitle: 'Checkout latency anomaly',
    incidentStatus: 'MITIGATING',
    incidentDetail: 'Draining two degraded replicas',
    owner: 'AGENT / ROUTER-02',
  },
  {
    throughput: 2388,
    throughputTrend: '+26.7%',
    latency: 74,
    latencyTrend: '-20 ms',
    confidence: 99.2,
    confidenceTrend: '+1.3%',
    policy: 'ENFORCED',
    policyDetail: '0 unsafe nodes admitted',
    incidentTitle: 'Checkout latency anomaly',
    incidentStatus: 'STABILIZING',
    incidentDetail: 'Error budget recovered to 99.97%',
    owner: 'AGENT / ROUTER-02',
  },
  {
    throughput: 2614,
    throughputTrend: '+31.9%',
    latency: 68,
    latencyTrend: '-26 ms',
    confidence: 99.4,
    confidenceTrend: '+1.5%',
    policy: 'ENFORCED',
    policyDetail: 'All transactions verified',
    incidentTitle: 'Checkout latency anomaly',
    incidentStatus: 'RESOLVED',
    incidentDetail: 'Healthy capacity restored across all zones',
    owner: 'AGENT / ROUTER-02',
  },
] as const;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const readPointer = (source: Readonly<Record<string, unknown>>, pointer: string): unknown => {
  if (pointer === '') return source;
  return pointer
    .slice(1)
    .split('/')
    .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'))
    .reduce<unknown>((current, part) => {
      if (!current || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[part];
    }, source);
};

const resolveValue = (value: unknown, dataModel: Readonly<Record<string, unknown>>): unknown => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (typeof (value as { path?: unknown }).path === 'string') {
      return readPointer(dataModel, (value as { path: string }).path);
    }
    if (typeof (value as { literalString?: unknown }).literalString === 'string') {
      return (value as { literalString: string }).literalString;
    }
  }
  return value;
};

const display = (value: unknown) => (value === undefined || value === null ? '—' : String(value));

interface SurfaceRendererProps {
  surface?: experimentalRuntime.SurfaceSnapshot;
}

const SurfaceRenderer: React.FC<SurfaceRendererProps> = ({ surface }) => {
  if (!surface?.rootId) {
    return <div className="runtime-demo__empty">WAITING FOR SURFACE</div>;
  }

  const renderNode = (nodeId: string): React.ReactNode => {
    const node = surface.nodes.get(nodeId);
    if (!node) return null;
    const get = (key: string) => resolveValue(node.props[key], surface.dataModel);

    if (node.type === 'Stack') {
      const children = node.children.map(renderNode);
      return (
        <div className="runtime-demo__surface" key={node.id}>
          <div className="runtime-demo__surface-heading">
            <span>{display(get('eyebrow'))}</span>
            <h3>{display(get('title'))}</h3>
          </div>
          <div className="runtime-demo__metric-grid">{children.slice(0, 3)}</div>
          <div className="runtime-demo__signal-row">{children.slice(3)}</div>
        </div>
      );
    }

    if (node.type === 'Metric') {
      const tone = display(get('tone'));
      const numericValue = Number(get('value')) || 0;
      const barHeights = [0.42, 0.6, 0.48, 0.76, 0.64, 0.92, 0.72];
      return (
        <div className={`runtime-demo__metric runtime-demo__metric--${tone}`} key={node.id}>
          <div className="runtime-demo__metric-label">{display(get('label'))}</div>
          <div className="runtime-demo__metric-value">
            <strong>{numericValue.toLocaleString()}</strong>
            <span>{display(get('unit'))}</span>
          </div>
          <div className="runtime-demo__metric-foot">
            <div className="runtime-demo__bars" aria-hidden="true">
              {barHeights.map((height, index) => (
                <i
                  key={`${node.id}-${index}`}
                  style={{ height: `${Math.min(100, height * 100 + (surface.revision % 3) * 4)}%` }}
                />
              ))}
            </div>
            <span>{display(get('trend'))}</span>
          </div>
        </div>
      );
    }

    if (node.type === 'Signal') {
      return (
        <div className="runtime-demo__signal" key={node.id}>
          <div className="runtime-demo__signal-icon">
            <SafetyCertificateOutlined />
          </div>
          <div>
            <span>{display(get('label'))}</span>
            <strong>{display(get('value'))}</strong>
          </div>
          <code>{display(get('detail'))}</code>
        </div>
      );
    }

    if (node.type === 'Incident') {
      const status = display(get('status'));
      return (
        <div className="runtime-demo__incident" key={node.id}>
          <div className={`runtime-demo__incident-mark runtime-demo__incident-mark--${status}`} />
          <div className="runtime-demo__incident-copy">
            <span>ACTIVE RESPONSE</span>
            <strong>{display(get('title'))}</strong>
            <small>{display(get('detail'))}</small>
          </div>
          <div className="runtime-demo__incident-owner">
            <b>{status}</b>
            <span>{display(get('owner'))}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return <>{renderNode(surface.rootId)}</>;
};

const RuntimeProductionDemo: React.FC = () => {
  const [runtime, setRuntime] = useState(createRuntime);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [running, setRunning] = useState(false);
  const [canRollback, setCanRollback] = useState(false);
  const timelineId = useRef(0);
  const runId = useRef(0);

  const snapshot = useSyncExternalStore(
    runtime.subscribe,
    runtime.getSnapshot,
    runtime.getSnapshot,
  );
  const surface = snapshot.surfaces.get(SURFACE_ID);

  const appendTimeline = useCallback(
    (title: string, detail: string, tone: TimelineTone, revision?: number) => {
      timelineId.current += 1;
      const item = { id: timelineId.current, title, detail, tone, revision };
      setTimeline((current) => [item, ...current].slice(0, 8));
    },
    [],
  );

  useEffect(() => {
    if (initializedRuntimes.has(runtime)) return;
    initializedRuntimes.add(runtime);
    void runtime.dispatchBatch(bootstrapCommands).then((result) => {
      const revision = result.snapshot.surfaces.get(SURFACE_ID)?.revision;
      appendTimeline(
        'V0.8 SURFACE COMMITTED',
        `${bootstrapCommands.length} legacy commands applied atomically`,
        result.accepted ? 'accepted' : 'rejected',
        revision,
      );
    });
  }, [appendTimeline, runtime]);

  const runStream = async () => {
    const currentRun = runId.current + 1;
    runId.current = currentRun;
    setRunning(true);
    appendTimeline('STREAM CONNECTED', 'Receiving v0.8 valueMap updates', 'system');

    for (const [index, frame] of streamFrames.entries()) {
      await wait(460);
      if (runId.current !== currentRun) return;
      const result = await runtime.dispatch(
        command({
          dataModelUpdate: {
            surfaceId: SURFACE_ID,
            contents: [{ key: 'live', valueMap: toValueMap(frame) }],
          },
        }),
      );
      if (result.accepted) setCanRollback(true);
      appendTimeline(
        `PATCH ${String(index + 1).padStart(2, '0')} ACCEPTED`,
        `${Object.keys(frame).length} bound values refreshed`,
        result.accepted ? 'accepted' : 'rejected',
        result.snapshot.surfaces.get(SURFACE_ID)?.revision,
      );
    }

    if (runId.current === currentRun) {
      setRunning(false);
      appendTimeline('STREAM SETTLED', 'Surface reached a stable render state', 'system');
    }
  };

  const injectUnsafeNode = async () => {
    const beforeRevision = runtime.getSurface(SURFACE_ID)?.revision;
    const result = await runtime.dispatch(
      command({
        surfaceUpdate: {
          surfaceId: SURFACE_ID,
          components: [
            {
              id: 'remote-script',
              component: {
                UnsafeScript: {
                  source: { literalString: 'https://untrusted.example/payload.js' },
                },
              },
            },
          ],
        },
      }),
    );
    const afterRevision = result.snapshot.surfaces.get(SURFACE_ID)?.revision;
    appendTimeline(
      'CATALOG GATE REJECTED',
      `${result.issue?.code ?? 'unknown'} · revision ${beforeRevision} preserved`,
      'rejected',
      afterRevision,
    );
  };

  const rollback = () => {
    const result = runtime.rollback(SURFACE_ID);
    appendTimeline(
      result.accepted ? 'ROLLBACK COMMITTED' : 'ROLLBACK UNAVAILABLE',
      result.accepted ? 'Previous immutable snapshot restored' : (result.issue?.message ?? ''),
      result.accepted ? 'accepted' : 'rejected',
      result.snapshot.surfaces.get(SURFACE_ID)?.revision,
    );
  };

  const reset = () => {
    runId.current += 1;
    setRunning(false);
    setCanRollback(false);
    setTimeline([]);
    setRuntime((current) => {
      current.dispose();
      return createRuntime();
    });
  };

  const latestRejection = useMemo(
    () => timeline.find((item) => item.tone === 'rejected'),
    [timeline],
  );

  return (
    <div className="runtime-demo">
      <style>{styles}</style>
      <header className="runtime-demo__header">
        <div className="runtime-demo__brand">
          <div className="runtime-demo__brand-mark">
            <ThunderboltOutlined />
          </div>
          <div>
            <span>SURFACE RUNTIME</span>
            <h2>Control Room</h2>
          </div>
        </div>
        <div className="runtime-demo__connection">
          <i />
          <span>EDGE LINK ACTIVE</span>
          <code>A2UI v0.8</code>
        </div>
      </header>

      <div className="runtime-demo__toolbar">
        <div className="runtime-demo__actions">
          <Button
            className="runtime-demo__run"
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={running}
            disabled={!surface}
            onClick={() => void runStream()}
          >
            Run stream
          </Button>
          <Button
            className="runtime-demo__danger"
            icon={<SafetyCertificateOutlined />}
            disabled={!surface || running}
            onClick={() => void injectUnsafeNode()}
          >
            Test guard
          </Button>
          <Tooltip title="Restore the previous immutable Surface snapshot">
            <Button icon={<UndoOutlined />} disabled={!canRollback || running} onClick={rollback}>
              Roll back
            </Button>
          </Tooltip>
          <Tooltip title="Create a fresh Runtime instance">
            <Button aria-label="Reset runtime" icon={<ReloadOutlined />} onClick={reset} />
          </Tooltip>
        </div>
        <div className="runtime-demo__runtime-stats">
          <span>
            STATUS <b>{surface?.status.toUpperCase() ?? 'BOOTING'}</b>
          </span>
          <span>
            REV <b>{String(surface?.revision ?? 0).padStart(2, '0')}</b>
          </span>
          <span>
            NODES <b>{String(surface?.nodes.size ?? 0).padStart(2, '0')}</b>
          </span>
        </div>
      </div>

      <main className="runtime-demo__workspace">
        <section className="runtime-demo__viewport" aria-label="Live Surface snapshot">
          <div className="runtime-demo__section-bar">
            <span>
              <CodeOutlined /> RENDERED SNAPSHOT
            </span>
            <code>{SURFACE_ID}</code>
          </div>
          <SurfaceRenderer surface={surface} />
          <div
            className={`runtime-demo__security ${latestRejection ? 'runtime-demo__security--blocked' : ''}`}
          >
            <SafetyCertificateOutlined />
            <div>
              <strong>
                {latestRejection ? 'UNTRUSTED UPDATE BLOCKED' : 'TRANSACTION GATE ARMED'}
              </strong>
              <span>
                {latestRejection
                  ? 'Last known-good Snapshot remains active'
                  : 'v0.8 adapter + Catalog validation before commit'}
              </span>
            </div>
            <code>{latestRejection ? 'STATE PRESERVED' : 'STRICT MODE'}</code>
          </div>
        </section>

        <aside className="runtime-demo__timeline" aria-live="polite">
          <div className="runtime-demo__section-bar">
            <span>TRANSACTION TRACE</span>
            <i>{timeline.length}</i>
          </div>
          <div className="runtime-demo__timeline-list">
            {timeline.map((item) => (
              <div
                className={`runtime-demo__event runtime-demo__event--${item.tone}`}
                key={item.id}
              >
                <div className="runtime-demo__event-icon">
                  {item.tone === 'accepted' ? (
                    <CheckCircleFilled />
                  ) : item.tone === 'rejected' ? (
                    <CloseCircleFilled />
                  ) : (
                    <ThunderboltOutlined />
                  )}
                </div>
                <div className="runtime-demo__event-copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                {item.revision !== undefined && <code>R{item.revision}</code>}
              </div>
            ))}
          </div>
          <div className="runtime-demo__trace-footer">
            <i />
            <span>Listening for protocol events</span>
          </div>
        </aside>
      </main>
    </div>
  );
};

const styles = `
.runtime-demo {
  --rt-bg: #080b0a;
  --rt-panel: #0f1311;
  --rt-panel-2: #131815;
  --rt-line: #28302b;
  --rt-muted: #7e8982;
  --rt-text: #edf4ef;
  --rt-lime: #b9f227;
  --rt-cyan: #43d7e8;
  --rt-amber: #ffbf3f;
  --rt-red: #ff5d5d;
  position: relative;
  overflow: hidden;
  color: var(--rt-text);
  background: var(--rt-bg);
  border: 1px solid #1d2420;
  border-radius: 8px;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.26);
  container-name: runtime-demo;
  container-type: inline-size;
}
.runtime-demo *, .runtime-demo *::before, .runtime-demo *::after { box-sizing: border-box; }
.runtime-demo__header, .runtime-demo__toolbar, .runtime-demo__section-bar,
.runtime-demo__connection, .runtime-demo__runtime-stats, .runtime-demo__signal,
.runtime-demo__incident, .runtime-demo__security, .runtime-demo__event,
.runtime-demo__trace-footer { display: flex; align-items: center; }
.runtime-demo__header {
  min-height: 78px;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--rt-line);
}
.runtime-demo__brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.runtime-demo__brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: #080b0a;
  background: var(--rt-lime);
  border-radius: 6px;
  font-size: 19px;
  box-shadow: 0 0 24px rgba(185, 242, 39, 0.18);
}
.runtime-demo__brand span, .runtime-demo__surface-heading span, .runtime-demo__incident-copy > span {
  display: block;
  color: var(--rt-muted);
  font: 600 10px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0;
}
.runtime-demo__brand h2 {
  margin: 2px 0 0;
  color: var(--rt-text);
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: 0;
}
.runtime-demo__connection { gap: 9px; color: #9ca79f; font-size: 11px; }
.runtime-demo__connection i, .runtime-demo__trace-footer i {
  width: 7px;
  height: 7px;
  flex: none;
  background: var(--rt-lime);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(185, 242, 39, 0.1);
  animation: runtime-pulse 1.7s ease-in-out infinite;
}
.runtime-demo__connection code {
  margin-left: 6px;
  padding: 4px 7px;
  color: var(--rt-cyan);
  border: 1px solid #294247;
  border-radius: 4px;
  font-size: 10px;
}
.runtime-demo__toolbar {
  min-height: 64px;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 20px;
  background: #0c100e;
  border-bottom: 1px solid var(--rt-line);
}
.runtime-demo__actions { display: flex; flex-wrap: wrap; gap: 8px; }
.runtime-demo .ant-btn {
  height: 34px;
  color: #cbd5ce;
  background: #151b17;
  border-color: #354038;
  border-radius: 5px;
  box-shadow: none;
}
.runtime-demo .ant-btn:hover:not(:disabled) { color: #fff; border-color: #68746c; background: #1b231e; }
.runtime-demo .runtime-demo__run { color: #0b100c; background: var(--rt-lime); border-color: var(--rt-lime); font-weight: 650; }
.runtime-demo .runtime-demo__run:hover:not(:disabled) { color: #0b100c; background: #d0ff51; border-color: #d0ff51; }
.runtime-demo .runtime-demo__danger { color: #ff9a9a; border-color: #6a3535; }
.runtime-demo__runtime-stats { align-self: stretch; gap: 0; border: 1px solid var(--rt-line); border-radius: 5px; }
.runtime-demo__runtime-stats span {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 11px;
  color: var(--rt-muted);
  border-right: 1px solid var(--rt-line);
  font: 600 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap;
}
.runtime-demo__runtime-stats span:last-child { border-right: 0; }
.runtime-demo__runtime-stats b { color: var(--rt-lime); font-size: 11px; }
.runtime-demo__workspace { display: grid; grid-template-columns: minmax(0, 1fr) 330px; min-height: 520px; }
.runtime-demo__viewport { min-width: 0; padding: 0 20px 20px; border-right: 1px solid var(--rt-line); }
.runtime-demo__section-bar {
  height: 50px;
  justify-content: space-between;
  color: #a2ada6;
  border-bottom: 1px solid var(--rt-line);
  font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
}
.runtime-demo__section-bar span { display: flex; gap: 7px; align-items: center; }
.runtime-demo__section-bar code { max-width: 56%; overflow: hidden; color: #6e7972; text-overflow: ellipsis; }
.runtime-demo__section-bar i {
  min-width: 24px;
  padding: 4px;
  color: var(--rt-cyan);
  background: #102126;
  border-radius: 4px;
  font-style: normal;
  text-align: center;
}
.runtime-demo__surface { padding-top: 22px; }
.runtime-demo__surface-heading { margin-bottom: 17px; }
.runtime-demo__surface-heading span { color: var(--rt-lime); }
.runtime-demo__surface-heading h3 { margin: 5px 0 0; color: var(--rt-text); font-size: 17px; line-height: 1.3; letter-spacing: 0; }
.runtime-demo__metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.runtime-demo__metric {
  min-width: 0;
  height: 142px;
  padding: 15px;
  background: var(--rt-panel);
  border: 1px solid var(--rt-line);
  border-top: 2px solid currentColor;
  border-radius: 5px;
}
.runtime-demo__metric--lime { color: var(--rt-lime); }
.runtime-demo__metric--cyan { color: var(--rt-cyan); }
.runtime-demo__metric--amber { color: var(--rt-amber); }
.runtime-demo__metric-label { overflow: hidden; color: #77827b; font: 600 9px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.runtime-demo__metric-value { display: flex; align-items: baseline; gap: 5px; margin-top: 12px; }
.runtime-demo__metric-value strong { color: var(--rt-text); font: 650 25px/1 ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0; }
.runtime-demo__metric-value span { color: var(--rt-muted); font-size: 10px; }
.runtime-demo__metric-foot { display: flex; align-items: flex-end; justify-content: space-between; height: 45px; margin-top: 8px; font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__bars { display: flex; align-items: flex-end; gap: 3px; width: 62%; height: 28px; }
.runtime-demo__bars i { width: 100%; max-height: 100%; background: currentColor; opacity: 0.55; transition: height 320ms ease; }
.runtime-demo__signal-row { display: grid; grid-template-columns: minmax(230px, 0.8fr) minmax(0, 1.2fr); gap: 10px; margin-top: 10px; }
.runtime-demo__signal, .runtime-demo__incident { min-width: 0; min-height: 86px; padding: 14px; background: var(--rt-panel); border: 1px solid var(--rt-line); border-radius: 5px; }
.runtime-demo__signal { display: grid; grid-template-columns: 34px minmax(80px, auto) minmax(0, 1fr); gap: 10px; }
.runtime-demo__signal-icon { display: grid; width: 32px; height: 32px; place-items: center; color: var(--rt-lime); background: #192217; border: 1px solid #354425; border-radius: 5px; }
.runtime-demo__signal span { display: block; color: var(--rt-muted); font: 600 9px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__signal strong { display: block; margin-top: 5px; color: var(--rt-lime); font-size: 12px; }
.runtime-demo__signal code { overflow: hidden; color: #8c9890; font-size: 10px; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.runtime-demo__incident { gap: 12px; }
.runtime-demo__incident-mark { width: 3px; height: 42px; flex: none; background: var(--rt-amber); box-shadow: 0 0 14px rgba(255, 191, 63, 0.25); }
.runtime-demo__incident-mark--RESOLVED { background: var(--rt-lime); box-shadow: 0 0 14px rgba(185, 242, 39, 0.25); }
.runtime-demo__incident-copy { min-width: 0; flex: 1; }
.runtime-demo__incident-copy strong, .runtime-demo__incident-copy small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.runtime-demo__incident-copy strong { margin: 4px 0; color: #e8eee9; font-size: 12px; }
.runtime-demo__incident-copy small { color: var(--rt-muted); font-size: 10px; }
.runtime-demo__incident-owner { flex: none; text-align: right; }
.runtime-demo__incident-owner b, .runtime-demo__incident-owner span { display: block; font: 600 9px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__incident-owner b { color: var(--rt-amber); }
.runtime-demo__incident-owner span { color: #6d7770; }
.runtime-demo__security { gap: 11px; min-height: 58px; margin-top: 10px; padding: 11px 14px; color: var(--rt-cyan); background: #0d1718; border: 1px solid #20383b; border-radius: 5px; }
.runtime-demo__security--blocked { color: var(--rt-red); background: #190f0f; border-color: #4b2929; animation: runtime-alert 360ms ease both; }
.runtime-demo__security > span { font-size: 19px; }
.runtime-demo__security div { min-width: 0; flex: 1; }
.runtime-demo__security strong, .runtime-demo__security div span { display: block; }
.runtime-demo__security strong { font: 650 10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__security div span { overflow: hidden; margin-top: 2px; color: #808b84; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.runtime-demo__security code { color: currentColor; font-size: 9px; white-space: nowrap; }
.runtime-demo__timeline { display: flex; min-width: 0; flex-direction: column; padding: 0 16px; background: #0b0e0c; }
.runtime-demo__timeline > .runtime-demo__section-bar { width: 100%; flex: none; }
.runtime-demo__timeline-list { width: 100%; min-height: 0; flex: 1; overflow: hidden; }
.runtime-demo__event { position: relative; min-height: 66px; gap: 10px; padding: 12px 3px; border-bottom: 1px solid #202621; animation: runtime-enter 280ms ease both; }
.runtime-demo__event-icon { width: 22px; flex: none; color: var(--rt-lime); text-align: center; }
.runtime-demo__event--rejected .runtime-demo__event-icon { color: var(--rt-red); }
.runtime-demo__event--system .runtime-demo__event-icon { color: var(--rt-cyan); }
.runtime-demo__event-copy { min-width: 0; flex: 1; }
.runtime-demo__event-copy strong, .runtime-demo__event-copy span { display: block; }
.runtime-demo__event-copy strong { color: #cfd7d1; font: 600 9px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__event-copy span { overflow: hidden; margin-top: 3px; color: #707b74; font-size: 10px; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.runtime-demo__event > code { flex: none; color: #6d7871; font-size: 9px; }
.runtime-demo__trace-footer { width: 100%; flex: none; gap: 9px; height: 48px; color: #69736d; border-top: 1px solid var(--rt-line); font: 500 9px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
.runtime-demo__empty { display: grid; min-height: 365px; place-items: center; color: var(--rt-muted); font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
@keyframes runtime-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes runtime-enter { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
@keyframes runtime-alert { from { transform: translateX(-3px); } 50% { transform: translateX(3px); } to { transform: translateX(0); } }
@container runtime-demo (max-width: 900px) {
  .runtime-demo__workspace { grid-template-columns: 1fr; }
  .runtime-demo__viewport { border-right: 0; }
  .runtime-demo__timeline { min-height: 300px; border-top: 1px solid var(--rt-line); }
}
@container runtime-demo (max-width: 600px) {
  .runtime-demo__header, .runtime-demo__toolbar { align-items: flex-start; flex-direction: column; }
  .runtime-demo__connection { align-self: stretch; }
  .runtime-demo__toolbar { padding: 12px; }
  .runtime-demo__actions { width: 100%; }
  .runtime-demo__actions .ant-btn { flex: 1; }
  .runtime-demo__actions .ant-btn:last-child { flex: none; }
  .runtime-demo__runtime-stats { width: 100%; height: 36px; }
  .runtime-demo__runtime-stats span { flex: 1; justify-content: center; }
  .runtime-demo__viewport { padding: 0 12px 14px; border-right: 0; }
  .runtime-demo__timeline { min-height: 340px; }
  .runtime-demo__metric-grid { grid-template-columns: 1fr; }
  .runtime-demo__metric { height: 124px; }
  .runtime-demo__signal-row { grid-template-columns: 1fr; }
}
@container runtime-demo (max-width: 430px) {
  .runtime-demo__header { padding: 14px 12px; }
  .runtime-demo__connection code { margin-left: auto; }
  .runtime-demo__actions .ant-btn { min-width: 0; flex: 1 1 calc(50% - 4px); padding-inline: 6px; font-size: 12px; }
  .runtime-demo__actions .ant-btn:last-child { min-width: 34px; flex: 0 0 34px; }
  .runtime-demo__runtime-stats { height: 44px; }
  .runtime-demo__runtime-stats span { min-width: 0; flex-direction: column; gap: 3px; padding: 5px 3px; }
  .runtime-demo__signal { grid-template-columns: 34px minmax(0, 1fr); }
  .runtime-demo__signal > div, .runtime-demo__signal code { min-width: 0; }
  .runtime-demo__signal code { grid-column: 1 / -1; text-align: left; }
  .runtime-demo__incident { align-items: flex-start; }
  .runtime-demo__incident-owner { max-width: 84px; }
  .runtime-demo__security code { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .runtime-demo *, .runtime-demo *::before, .runtime-demo *::after { animation: none !important; transition: none !important; }
}
`;

export default RuntimeProductionDemo;
