/**
 * Catalog 管理模块
 * 用于加载和管理远程/本地组件定义
 */

/** Catalog 组件定义 */
export interface CatalogComponent {
  type: 'object';
  allOf?: any[];
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

/** Catalog 定义 */
export interface Catalog {
  $schema?: string;
  $id?: string;
  title?: string;
  description?: string;
  catalogId?: string;
  components?: Record<string, CatalogComponent>;
  functions?: Record<string, any>;
  $defs?: Record<string, any>;
}

/** Catalog 缓存 */
const catalogCache = new Map<string, Catalog>();

/**
 * 注册本地 catalog
 * @param catalog catalog 定义
 */
export function registerCatalog(catalog: Catalog): void {
  const catalogId = catalog.$id || catalog.catalogId;
  if (catalogId) {
    catalogCache.set(catalogId, catalog);
  }
}

/**
 * 加载 catalog（支持远程 URL 或本地注册的 schema）
 * @param catalogId catalog 的 URL 或本地 ID
 * @returns catalog 定义
 */
export async function loadCatalog(catalogId: string): Promise<Catalog> {
  // 检查缓存
  if (catalogCache.has(catalogId)) {
    return catalogCache.get(catalogId)!;
  }

  // 检查是否是本地 schema
  if (catalogId.startsWith('local://')) {
    console.warn(
      `Local catalog "${catalogId}" not registered. Use registerCatalog() to register it.`,
    );
    // 返回空 catalog
    return {
      $id: catalogId,
      components: {},
    };
  }

  // 从远程加载
  try {
    const response = await fetch(catalogId);
    if (!response.ok) {
      throw new Error(`Failed to load catalog from ${catalogId}: ${response.statusText}`);
    }

    const catalog: Catalog = await response.json();
    catalogCache.set(catalogId, catalog);
    return catalog;
  } catch (error) {
    console.error('Error loading catalog:', error);
    throw error;
  }
}

/**
 * 验证组件是否符合 catalog 定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @param componentProps 组件属性
 * @returns 是否有效
 */
export function validateComponent(
  catalog: Catalog,
  componentName: string,
  componentProps: Record<string, any>,
): boolean {
  const componentDef = catalog.components?.[componentName];
  if (!componentDef) {
    console.warn(`Component "${componentName}" not found in catalog`);
    return false;
  }

  // 简单的必填字段验证
  if (componentDef.required) {
    for (const field of componentDef.required) {
      if (!(field in componentProps)) {
        console.warn(`Missing required field "${field}" for component "${componentName}"`);
        return false;
      }
    }
  }

  return true;
}

/**
 * 获取组件的属性定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @returns 属性定义
 */
export function getComponentPropsSchema(
  catalog: Catalog,
  componentName: string,
): Record<string, any> | undefined {
  return catalog.components?.[componentName]?.properties;
}

/**
 * 清除 catalog 缓存
 */
export function clearCatalogCache(): void {
  catalogCache.clear();
}
