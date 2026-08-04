import { createA2UIV08Adapter } from '../adapters/a2uiV08';
import { a2uiV09Adapter } from '../adapters/a2uiV09';
import { createSurfaceCatalogRegistry, type SurfaceCatalog } from '../catalog';
import { type CreateSurfaceRuntimeOptions, createSurfaceRuntime } from '../createSurfaceRuntime';
import type { SurfaceInput, SurfaceProtocolAdapter, SurfaceTransaction } from '../types';

const catalog: SurfaceCatalog = {
  $id: 'local://basic',
  components: {
    Column: { type: 'object', properties: {}, additionalProperties: false },
    Text: {
      type: 'object',
      required: ['text'],
      properties: { text: {} },
      additionalProperties: false,
    },
  },
};

const v09 = (eventId: string, payload: Record<string, unknown>): SurfaceInput => ({
  protocol: 'a2ui',
  version: '0.9',
  eventId,
  payload: { version: 'v0.9', ...payload },
});

const internalAdapter: SurfaceProtocolAdapter = {
  protocol: 'surface-internal',
  versions: ['1'],
  normalize(input) {
    return input.payload as SurfaceTransaction;
  },
};

const transaction = (
  transactionId: string,
  surfaceId: string,
  operations: SurfaceTransaction['operations'],
  expectedRevision?: number,
): SurfaceTransaction => ({
  transactionId,
  surfaceId,
  expectedRevision,
  source: { protocol: 'surface-internal', version: '1', eventId: transactionId },
  operations,
});

const internalInput = (payload: SurfaceTransaction): SurfaceInput => ({
  protocol: 'surface-internal',
  version: '1',
  eventId: payload.transactionId,
  payload,
});

const createRuntime = ({
  catalogs = createSurfaceCatalogRegistry({ catalogs: [catalog] }),
  adapters = [
    a2uiV09Adapter,
    createA2UIV08Adapter({ catalogId: 'local://basic' }),
    internalAdapter,
  ],
  ...options
}: Partial<CreateSurfaceRuntimeOptions> = {}) =>
  createSurfaceRuntime({ catalogs, adapters, ...options });

const createV09Surface = async (
  runtime: ReturnType<typeof createRuntime>,
  surfaceId = 'booking',
) => {
  await runtime.dispatch(
    v09(`create-${surfaceId}`, {
      createSurface: { surfaceId, catalogId: 'local://basic' },
    }),
  );
};

describe('SurfaceRuntime', () => {
  it('creates and renders a strict v0.9 Surface', async () => {
    const runtime = createRuntime();

    await createV09Surface(runtime);
    const result = await runtime.dispatch(
      v09('nodes', {
        updateComponents: {
          surfaceId: 'booking',
          components: [
            { id: 'root', component: 'Column', children: ['text'] },
            { id: 'text', component: 'Text', text: 'Hello' },
          ],
        },
      }),
    );

    expect(result.accepted).toBe(true);
    expect(runtime.getSurface('booking')).toMatchObject({
      status: 'rendering',
      revision: 2,
      rootId: 'root',
      catalog: { id: 'local://basic' },
    });
    expect(runtime.getSurface('booking')?.nodes.get('text')).toMatchObject({
      type: 'Text',
      props: { text: 'Hello' },
    });
  });

  it('updates data immutably and blocks prototype pollution', async () => {
    const runtime = createRuntime();
    await createV09Surface(runtime);
    const before = runtime.getSurface('booking')?.dataModel;

    const accepted = await runtime.dispatch(
      v09('data', {
        updateDataModel: { surfaceId: 'booking', path: '/form/name', value: 'Ada' },
      }),
    );
    const rejected = await runtime.dispatch(
      v09('pollution', {
        updateDataModel: {
          surfaceId: 'booking',
          path: '/__proto__/polluted',
          value: true,
        },
      }),
    );
    const rootPath = await runtime.dispatch(
      v09('root-path', {
        updateDataModel: { surfaceId: 'booking', path: '/', value: true },
      }),
    );
    const invalidEscape = await runtime.dispatch(
      v09('invalid-escape', {
        updateDataModel: { surfaceId: 'booking', path: '/bad~2path', value: true },
      }),
    );

    expect(accepted.accepted).toBe(true);
    expect(runtime.getSurface('booking')?.dataModel).toEqual({ form: { name: 'Ada' } });
    expect(runtime.getSurface('booking')?.dataModel).not.toBe(before);
    expect(rejected).toMatchObject({
      accepted: false,
      issue: { code: 'schema_validation_failed' },
    });
    expect(rootPath.issue?.code).toBe('schema_validation_failed');
    expect(invalidEscape.issue?.code).toBe('schema_validation_failed');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('deduplicates event ids and emits one notification per commit', async () => {
    const runtime = createRuntime();
    const listener = jest.fn();
    runtime.subscribe(listener);
    const input = v09('create-once', {
      createSurface: { surfaceId: 'booking', catalogId: 'local://basic' },
    });

    const first = await runtime.dispatch(input);
    const second = await runtime.dispatch(input);

    expect(first.accepted).toBe(true);
    expect(second).toMatchObject({ accepted: true, duplicate: true });
    expect(second.snapshot).toBe(first.snapshot);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('rejects missing catalogs, components, and required properties by default', async () => {
    const onIssue = jest.fn();
    const runtime = createRuntime({ onIssue });

    const missingCatalog = await runtime.dispatch(
      v09('missing-catalog', {
        createSurface: { surfaceId: 'missing', catalogId: 'local://missing' },
      }),
    );
    await createV09Surface(runtime);
    const unknownComponent = await runtime.dispatch(
      v09('unknown-component', {
        updateComponents: {
          surfaceId: 'booking',
          components: [{ id: 'root', component: 'RemoteCode' }],
        },
      }),
    );
    const missingProp = await runtime.dispatch(
      v09('missing-prop', {
        updateComponents: {
          surfaceId: 'booking',
          components: [{ id: 'root', component: 'Text' }],
        },
      }),
    );

    expect(missingCatalog.issue?.code).toBe('catalog_not_found');
    expect(unknownComponent.issue?.code).toBe('component_not_allowed');
    expect(missingProp.issue?.code).toBe('schema_validation_failed');
    expect(runtime.getSurface('booking')?.revision).toBe(1);
    expect(onIssue).toHaveBeenCalledTimes(3);
  });

  it('atomically rejects an invalid batch', async () => {
    const runtime = createRuntime();

    const result = await runtime.dispatchBatch([
      v09('batch-create', {
        createSurface: { surfaceId: 'booking', catalogId: 'local://basic' },
      }),
      v09('batch-invalid', {
        updateComponents: {
          surfaceId: 'booking',
          components: [{ id: 'root', component: 'Unknown' }],
        },
      }),
    ]);

    expect(result.accepted).toBe(false);
    expect(runtime.getSurface('booking')).toBeUndefined();
  });

  it('rejects stale revisions without changing the committed snapshot', async () => {
    const runtime = createRuntime();
    const create = internalInput(
      transaction('internal-create', 'booking', [
        { type: 'surface.create', catalogId: 'local://basic' },
      ]),
    );
    await runtime.dispatch(create);
    const committed = runtime.getSnapshot();

    const result = await runtime.dispatch(
      internalInput(
        transaction(
          'stale-update',
          'booking',
          [{ type: 'data.set', path: '/name', value: 'Ada' }],
          0,
        ),
      ),
    );

    expect(result.issue?.code).toBe('revision_conflict');
    expect(runtime.getSnapshot()).toBe(committed);
  });

  it('rejects dangling references, cycles, depth, and node limits', async () => {
    const runtime = createRuntime({ limits: { maxNodesPerSurface: 2, maxDepth: 2 } });
    await createV09Surface(runtime);

    const dangling = await runtime.dispatch(
      v09('dangling', {
        updateComponents: {
          surfaceId: 'booking',
          components: [{ id: 'root', component: 'Column', children: ['missing'] }],
        },
      }),
    );
    const cycle = await runtime.dispatch(
      v09('cycle', {
        updateComponents: {
          surfaceId: 'booking',
          components: [{ id: 'root', component: 'Column', children: ['root'] }],
        },
      }),
    );
    const tooDeep = await runtime.dispatch(
      v09('deep', {
        updateComponents: {
          surfaceId: 'booking',
          components: [
            { id: 'root', component: 'Column', children: ['one'] },
            { id: 'one', component: 'Column', children: ['two'] },
            { id: 'two', component: 'Text', text: 'end' },
          ],
        },
      }),
    );

    expect(dangling.issue?.code).toBe('graph_invariant_failed');
    expect(cycle.issue?.code).toBe('graph_invariant_failed');
    expect(tooDeep.issue?.code).toBe('limit_exceeded');
    expect(runtime.getSurface('booking')?.revision).toBe(1);

    const depthRuntime = createRuntime({ limits: { maxNodesPerSurface: 5, maxDepth: 2 } });
    await createV09Surface(depthRuntime, 'deep');
    const depthResult = await depthRuntime.dispatch(
      v09('depth-only', {
        updateComponents: {
          surfaceId: 'deep',
          components: [
            { id: 'root', component: 'Column', children: ['one'] },
            { id: 'one', component: 'Column', children: ['two'] },
            { id: 'two', component: 'Text', text: 'end' },
          ],
        },
      }),
    );
    expect(depthResult.issue?.code).toBe('limit_exceeded');
  });

  it('validates internal operations and graph mutations', async () => {
    const runtime = createRuntime({ limits: { maxOperationsPerTransaction: 1 } });
    await createV09Surface(runtime);

    const empty = await runtime.dispatch(internalInput(transaction('empty', 'booking', [])));
    const tooMany = await runtime.dispatch(
      internalInput(
        transaction('too-many', 'booking', [
          { type: 'data.set', path: '/one', value: 1 },
          { type: 'data.set', path: '/two', value: 2 },
        ]),
      ),
    );
    const duplicateNodes = await runtime.dispatch(
      internalInput(
        transaction('duplicate-nodes', 'booking', [
          {
            type: 'node.upsert',
            nodes: [
              { id: 'root', type: 'Column' },
              { id: 'root', type: 'Column' },
            ],
          },
        ]),
      ),
    );
    const invalidNode = await runtime.dispatch(
      internalInput(
        transaction('invalid-node', 'booking', [
          { type: 'node.upsert', nodes: [{ id: '', type: 'Column' }] },
        ]),
      ),
    );
    const missingRoot = await runtime.dispatch(
      internalInput(
        transaction('missing-root', 'booking', [{ type: 'render.begin', rootId: 'missing' }]),
      ),
    );

    expect(empty.issue?.code).toBe('invalid_command');
    expect(tooMany.issue?.code).toBe('limit_exceeded');
    expect(duplicateNodes.issue?.code).toBe('schema_validation_failed');
    expect(invalidNode.issue?.code).toBe('schema_validation_failed');
    expect(missingRoot.issue?.code).toBe('graph_invariant_failed');
    expect(runtime.getSurface('booking')?.revision).toBe(1);
  });

  it('removes nodes transactionally and rejects updates after deletion', async () => {
    const runtime = createRuntime();
    await createV09Surface(runtime);
    await runtime.dispatch(
      v09('render-removable', {
        updateComponents: {
          surfaceId: 'booking',
          components: [
            { id: 'root', component: 'Column', children: ['text'] },
            { id: 'text', component: 'Text', text: 'Hello' },
          ],
        },
      }),
    );

    const removeReferenced = await runtime.dispatch(
      internalInput(
        transaction('remove-referenced', 'booking', [{ type: 'node.remove', nodeIds: ['text'] }]),
      ),
    );
    expect(removeReferenced.issue?.code).toBe('graph_invariant_failed');

    await runtime.dispatch(v09('delete-for-update', { deleteSurface: { surfaceId: 'booking' } }));
    const updateDeleted = await runtime.dispatch(
      internalInput(
        transaction('update-deleted', 'booking', [
          { type: 'data.set', path: '/name', value: 'Ada' },
        ]),
      ),
    );
    expect(updateDeleted.issue?.code).toBe('invalid_transition');
  });

  it('supports v0.8 implicit creation, repeated updates, data, and rendering', async () => {
    const runtime = createRuntime();
    const v08 = (eventId: string, payload: unknown): SurfaceInput => ({
      protocol: 'a2ui',
      version: '0.8',
      eventId,
      payload,
    });

    await runtime.dispatch(
      v08('v08-surface', {
        surfaceUpdate: {
          surfaceId: 'legacy',
          components: [{ id: 'root', component: { Text: { text: 'First' } } }],
        },
      }),
    );
    await runtime.dispatch(
      v08('v08-update', {
        surfaceUpdate: {
          surfaceId: 'legacy',
          components: [{ id: 'root', component: { Text: { text: 'Second' } } }],
        },
      }),
    );
    await runtime.dispatch(
      v08('v08-data', {
        dataModelUpdate: {
          surfaceId: 'legacy',
          contents: [{ key: 'name', valueString: 'Ada' }],
        },
      }),
    );
    const rendered = await runtime.dispatch(
      v08('v08-render', { beginRendering: { surfaceId: 'legacy', root: 'root' } }),
    );

    expect(rendered.accepted).toBe(true);
    expect(runtime.getSurface('legacy')).toMatchObject({
      status: 'rendering',
      revision: 4,
      dataModel: { name: 'Ada' },
    });
    expect(runtime.getSurface('legacy')?.nodes.get('root')?.props).toEqual({ text: 'Second' });
  });

  it('deletes and rolls back to a stable revision with a new revision number', async () => {
    const runtime = createRuntime();
    await createV09Surface(runtime);
    await runtime.dispatch(
      v09('data-before-delete', {
        updateDataModel: { surfaceId: 'booking', path: '/name', value: 'Ada' },
      }),
    );
    await runtime.dispatch(v09('delete', { deleteSurface: { surfaceId: 'booking' } }));

    expect(runtime.getSurface('booking')).toMatchObject({ status: 'deleted', revision: 3 });
    const rollback = runtime.rollback('booking', 2);

    expect(rollback.accepted).toBe(true);
    expect(runtime.getSurface('booking')).toMatchObject({
      status: 'ready',
      revision: 4,
      dataModel: { name: 'Ada' },
    });

    const previous = runtime.rollback('booking');
    expect(previous.accepted).toBe(true);
    expect(runtime.getSurface('booking')).toMatchObject({ status: 'deleted', revision: 5 });
  });

  it('reports unavailable rollback targets', () => {
    const runtime = createRuntime();

    expect(runtime.rollback('missing').issue?.code).toBe('missing_surface');
  });

  it('rejects unsupported input, missing surfaces, duplicate creates, and disposed runtimes', async () => {
    const runtime = createRuntime();
    const unsupported = await runtime.dispatch({ protocol: 'unknown', version: '1', payload: {} });
    const missing = await runtime.dispatch(
      v09('missing-update', {
        updateDataModel: { surfaceId: 'missing', path: '/name', value: 'Ada' },
      }),
    );
    await createV09Surface(runtime);
    const duplicate = await runtime.dispatch(
      v09('create-again', {
        createSurface: { surfaceId: 'booking', catalogId: 'local://basic' },
      }),
    );
    runtime.dispose();
    const disposed = await runtime.dispatch(
      v09('after-dispose', {
        updateDataModel: { surfaceId: 'booking', path: '/name', value: 'Grace' },
      }),
    );

    expect(unsupported.issue?.code).toBe('unsupported_protocol');
    expect(missing.issue?.code).toBe('missing_surface');
    expect(duplicate.issue?.code).toBe('duplicate_surface');
    expect(disposed.issue?.code).toBe('invalid_transition');
  });
});
