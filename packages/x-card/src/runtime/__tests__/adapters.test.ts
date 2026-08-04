import { createA2UIV08Adapter } from '../adapters/a2uiV08';
import { a2uiV09Adapter } from '../adapters/a2uiV09';

const input = (version: string, payload: unknown) => ({
  protocol: 'a2ui',
  version,
  payload,
  eventId: `event-${version}`,
  sequence: 1,
});

describe('A2UI v0.9 adapter', () => {
  it('normalizes create, component, data, and delete commands', () => {
    expect(
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          createSurface: { surfaceId: 'booking', catalogId: 'local://basic' },
        }),
      ),
    ).toMatchObject({
      surfaceId: 'booking',
      operations: [{ type: 'surface.create', catalogId: 'local://basic' }],
    });

    expect(
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'booking',
            components: [
              { id: 'root', component: 'Column', children: ['text'] },
              { id: 'text', component: 'Text', text: 'Hello' },
            ],
          },
        }),
      ),
    ).toMatchObject({
      operations: [
        {
          type: 'node.upsert',
          nodes: [
            { id: 'root', type: 'Column', props: {}, children: ['text'] },
            { id: 'text', type: 'Text', props: { text: 'Hello' }, children: [] },
          ],
        },
        { type: 'render.begin', rootId: 'root' },
      ],
    });

    expect(
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          updateDataModel: { surfaceId: 'booking', path: '/form/name', value: 'Ada' },
        }),
      ),
    ).toMatchObject({
      operations: [{ type: 'data.set', path: '/form/name', value: 'Ada' }],
    });

    expect(
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          deleteSurface: { surfaceId: 'booking' },
        }),
      ),
    ).toMatchObject({ operations: [{ type: 'surface.delete' }] });
  });

  it('rejects malformed or unsupported commands', () => {
    expect(() => a2uiV09Adapter.normalize(input('0.9', null))).toThrow('must be an object');
    expect(() => a2uiV09Adapter.normalize(input('0.9', { version: 'v0.8' }))).toThrow(
      'must declare version',
    );
    expect(() =>
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          updateComponents: { surfaceId: 'surface', components: {} },
        }),
      ),
    ).toThrow('must be an array');
    expect(() =>
      a2uiV09Adapter.normalize(
        input('0.9', {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'surface',
            components: [{ id: 'root', component: 'Column', children: [''] }],
          },
        }),
      ),
    ).toThrow('array of non-empty strings');
    expect(() => a2uiV09Adapter.normalize(input('0.9', { version: 'v0.9', unknown: {} }))).toThrow(
      'Unsupported',
    );
  });

  it('normalizes a single child without starting a new render', () => {
    const result = a2uiV09Adapter.normalize({
      protocol: 'a2ui',
      version: 'v0.9',
      sequence: 8,
      payload: {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'surface',
          components: [{ id: 'row', component: 'Column', child: 'text' }],
        },
      },
    });

    expect(result).toMatchObject({
      transactionId: 'a2ui:v0.9:8',
      operations: [{ type: 'node.upsert', nodes: [{ id: 'row', children: ['text'] }] }],
    });
  });
});

describe('A2UI v0.8 adapter', () => {
  it('normalizes implicit creation and explicitList children', () => {
    const adapter = createA2UIV08Adapter({ catalogId: 'local://basic' });

    expect(
      adapter.normalize(
        input('0.8', {
          surfaceUpdate: {
            surfaceId: 'booking',
            components: [
              {
                id: 'root',
                component: { Column: { children: { explicitList: ['text'] } } },
              },
              {
                id: 'text',
                component: { Text: { text: { literalString: 'Hello' } } },
              },
            ],
          },
        }),
      ),
    ).toMatchObject({
      operations: [
        { type: 'surface.create', catalogId: 'local://basic', ifAbsent: true },
        {
          type: 'node.upsert',
          nodes: [
            { id: 'root', type: 'Column', children: ['text'] },
            { id: 'text', type: 'Text', props: { text: { literalString: 'Hello' } } },
          ],
        },
      ],
    });
  });

  it('normalizes data maps, beginRendering, and deleteSurface', () => {
    const adapter = createA2UIV08Adapter({ catalogId: 'local://basic' });

    expect(
      adapter.normalize(
        input('0.8', {
          dataModelUpdate: {
            surfaceId: 'booking',
            contents: [
              { key: 'name', valueString: 'Ada' },
              { key: 'meta/data', valueMap: [{ key: 'role', valueString: 'admin' }] },
            ],
          },
        }),
      ),
    ).toMatchObject({
      operations: [
        { type: 'data.set', path: '/name', value: 'Ada' },
        { type: 'data.set', path: '/meta~1data', value: { role: 'admin' } },
      ],
    });
    expect(
      adapter.normalize(input('0.8', { beginRendering: { surfaceId: 'booking', root: 'root' } })),
    ).toMatchObject({ operations: [{ type: 'render.begin', rootId: 'root' }] });
    expect(
      adapter.normalize(input('0.8', { deleteSurface: { surfaceId: 'booking' } })),
    ).toMatchObject({ operations: [{ type: 'surface.delete' }] });
  });

  it('requires a catalog and a single component type', () => {
    expect(() => createA2UIV08Adapter({ catalogId: '' })).toThrow('requires a catalogId');
    const adapter = createA2UIV08Adapter({ catalogId: 'local://basic' });
    expect(() =>
      adapter.normalize(
        input('0.8', {
          surfaceUpdate: {
            surfaceId: 'booking',
            components: [{ id: 'root', component: { Column: {}, Row: {} } }],
          },
        }),
      ),
    ).toThrow('exactly one type');
  });

  it('rejects malformed data and unknown commands', () => {
    const adapter = createA2UIV08Adapter({ catalogId: 'local://basic' });

    expect(() =>
      adapter.normalize(
        input('0.8', {
          surfaceUpdate: { surfaceId: 'surface', components: {} },
        }),
      ),
    ).toThrow('must be an array');
    expect(() =>
      adapter.normalize(
        input('0.8', {
          dataModelUpdate: { surfaceId: 'surface', contents: {} },
        }),
      ),
    ).toThrow('must be an array');
    expect(() =>
      adapter.normalize(
        input('0.8', {
          dataModelUpdate: { surfaceId: 'surface', contents: [{ key: 'empty' }] },
        }),
      ),
    ).toThrow('must declare valueString or valueMap');
    expect(() => adapter.normalize(input('0.8', { unknown: {} }))).toThrow('Unsupported');
  });
});
