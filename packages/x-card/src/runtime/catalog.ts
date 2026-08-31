import type { SurfaceNodeInput } from './types';

export interface SurfaceComponentSchema {
  type?: 'object';
  required?: readonly string[];
  properties?: Readonly<Record<string, unknown>>;
  additionalProperties?: boolean;
}

export interface SurfaceCatalog {
  $id?: string;
  catalogId?: string;
  components?: Readonly<Record<string, SurfaceComponentSchema>>;
}

export type SurfaceCatalogLoader = (catalogId: string) => Promise<SurfaceCatalog>;

export interface CatalogValidationResult {
  valid: boolean;
  errors: readonly string[];
}

export interface SurfaceCatalogRegistry {
  register(catalog: SurfaceCatalog): void;
  get(catalogId: string): SurfaceCatalog | undefined;
  resolve(catalogId: string): Promise<SurfaceCatalog>;
  validateNode(catalogId: string, node: SurfaceNodeInput): CatalogValidationResult;
  clear(): void;
}

export type CatalogRegistryErrorCode = 'catalog_not_found' | 'catalog_id_mismatch';

export class CatalogRegistryError extends Error {
  code: CatalogRegistryErrorCode;

  constructor(code: CatalogRegistryErrorCode, message: string) {
    super(message);
    this.name = 'CatalogRegistryError';
    this.code = code;
  }
}

export interface CreateSurfaceCatalogRegistryOptions {
  catalogs?: readonly SurfaceCatalog[];
  loader?: SurfaceCatalogLoader;
}

const getCatalogId = (catalog: SurfaceCatalog) => catalog.$id ?? catalog.catalogId;

export function createSurfaceCatalogRegistry(
  options: CreateSurfaceCatalogRegistryOptions = {},
): SurfaceCatalogRegistry {
  const catalogs = new Map<string, SurfaceCatalog>();
  const pendingLoads = new Map<string, Promise<SurfaceCatalog>>();

  const register = (catalog: SurfaceCatalog) => {
    const catalogId = getCatalogId(catalog);
    if (!catalogId) {
      throw new CatalogRegistryError(
        'catalog_id_mismatch',
        'Catalog must declare either "$id" or "catalogId".',
      );
    }
    catalogs.set(catalogId, catalog);
  };

  options.catalogs?.forEach(register);

  return {
    register,
    get(catalogId) {
      return catalogs.get(catalogId);
    },
    async resolve(catalogId) {
      const registered = catalogs.get(catalogId);
      if (registered) return registered;

      if (!options.loader) {
        throw new CatalogRegistryError(
          'catalog_not_found',
          `Catalog "${catalogId}" is not registered.`,
        );
      }

      const pending = pendingLoads.get(catalogId);
      if (pending) return pending;

      const load = options
        .loader(catalogId)
        .then((catalog) => {
          const resolvedId = getCatalogId(catalog);
          if (resolvedId !== catalogId) {
            throw new CatalogRegistryError(
              'catalog_id_mismatch',
              `Loaded catalog "${resolvedId ?? '<missing>'}" does not match "${catalogId}".`,
            );
          }
          register(catalog);
          return catalog;
        })
        .finally(() => {
          pendingLoads.delete(catalogId);
        });

      pendingLoads.set(catalogId, load);
      return load;
    },
    validateNode(catalogId, node) {
      const catalog = catalogs.get(catalogId);
      if (!catalog) {
        return { valid: false, errors: [`Catalog "${catalogId}" is not registered.`] };
      }

      const component = catalog.components?.[node.type];
      if (!component) {
        return {
          valid: false,
          errors: [`Component "${node.type}" is not declared by catalog "${catalogId}".`],
        };
      }

      const props = node.props ?? {};
      const errors: string[] = [];
      for (const field of component.required ?? []) {
        if (!(field in props)) {
          errors.push(`Missing required property "${field}" on component "${node.type}".`);
        }
      }

      if (component.additionalProperties === false) {
        const allowed = new Set(Object.keys(component.properties ?? {}));
        for (const property of Object.keys(props)) {
          if (!allowed.has(property)) {
            errors.push(`Property "${property}" is not allowed on component "${node.type}".`);
          }
        }
      }

      return { valid: errors.length === 0, errors };
    },
    clear() {
      catalogs.clear();
      pendingLoads.clear();
    },
  };
}
