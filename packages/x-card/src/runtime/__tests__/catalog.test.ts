import {
  CatalogRegistryError,
  createSurfaceCatalogRegistry,
  type SurfaceCatalog,
} from '../catalog';

const catalog: SurfaceCatalog = {
  $id: 'local://basic',
  components: {
    Text: {
      type: 'object',
      required: ['text'],
      properties: { text: {} },
      additionalProperties: false,
    },
  },
};

describe('SurfaceCatalogRegistry', () => {
  it('registers and resolves a local catalog', async () => {
    const registry = createSurfaceCatalogRegistry({ catalogs: [catalog] });

    await expect(registry.resolve('local://basic')).resolves.toBe(catalog);
    expect(registry.get('local://basic')).toBe(catalog);
  });

  it('requires a catalog id', () => {
    const registry = createSurfaceCatalogRegistry();

    expect(() => registry.register({ components: {} })).toThrow(CatalogRegistryError);
  });

  it('rejects missing catalogs without a loader', async () => {
    const registry = createSurfaceCatalogRegistry();

    await expect(registry.resolve('local://missing')).rejects.toMatchObject({
      code: 'catalog_not_found',
    });
  });

  it('deduplicates concurrent catalog loads and caches the result', async () => {
    const loader = jest.fn(async () => catalog);
    const registry = createSurfaceCatalogRegistry({ loader });

    const [first, second] = await Promise.all([
      registry.resolve('local://basic'),
      registry.resolve('local://basic'),
    ]);

    expect(first).toBe(catalog);
    expect(second).toBe(catalog);
    expect(loader).toHaveBeenCalledTimes(1);
    await registry.resolve('local://basic');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('rejects a loaded catalog with a mismatched id and permits retry', async () => {
    const loader = jest
      .fn<Promise<SurfaceCatalog>, [string]>()
      .mockResolvedValueOnce({ $id: 'local://other', components: {} })
      .mockResolvedValueOnce(catalog);
    const registry = createSurfaceCatalogRegistry({ loader });

    await expect(registry.resolve('local://basic')).rejects.toMatchObject({
      code: 'catalog_id_mismatch',
    });
    await expect(registry.resolve('local://basic')).resolves.toBe(catalog);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('strictly validates component names, required props, and extra props', () => {
    const registry = createSurfaceCatalogRegistry({ catalogs: [catalog] });

    expect(
      registry.validateNode('local://basic', {
        id: 'text',
        type: 'Text',
        props: { text: 'Hello' },
      }),
    ).toEqual({ valid: true, errors: [] });
    expect(
      registry.validateNode('local://basic', { id: 'text', type: 'Text', props: {} }),
    ).toMatchObject({ valid: false });
    expect(
      registry.validateNode('local://basic', {
        id: 'text',
        type: 'Text',
        props: { text: 'Hello', unsafe: true },
      }),
    ).toMatchObject({ valid: false });
    expect(
      registry.validateNode('local://basic', { id: 'unknown', type: 'Unknown' }),
    ).toMatchObject({ valid: false });
    expect(registry.validateNode('local://missing', { id: 'text', type: 'Text' })).toMatchObject({
      valid: false,
    });
  });

  it('clears registered catalogs', async () => {
    const registry = createSurfaceCatalogRegistry({ catalogs: [catalog] });

    registry.clear();

    expect(registry.get('local://basic')).toBeUndefined();
    await expect(registry.resolve('local://basic')).rejects.toMatchObject({
      code: 'catalog_not_found',
    });
  });
});
