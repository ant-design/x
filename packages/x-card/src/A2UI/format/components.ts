import type { ComponentWrapper_v0_8 } from '../types/command_v0.8';
import type { BaseComponent_v0_9 } from '../types/command_v0.9';

export interface ReactComponentTree {
  type: string;
  props: Record<string, any>; // 不含 id、component、children、child 等结构性字段；{ path } 绑定已提取为路径字符串
  children?: string[]; // 子节点 id 列表，由调用方去 componentMap 中查找对应节点
}

// ─── 内部解析辅助 ────────────────────────────────────────────────────────────

/** 判断一个值是否为 { path: string } 形式的路径对象 */
function isPathObject(val: any): val is { path: string } {
  return val !== null && typeof val === 'object' && typeof val.path === 'string';
}

/** 判断一个值是否为 { literalString: string } 形式的字面字符串对象（v0.8 特有） */
function isLiteralStringValue(val: any): val is { literalString: string } {
  return val !== null && typeof val === 'object' && typeof val.literalString === 'string';
}

/** 判断一个值是否为 { explicitList: string[] } 形式（v0.8 children 格式） */
function isExplicitList(val: any): val is { explicitList: string[] } {
  return val !== null && typeof val === 'object' && Array.isArray(val.explicitList);
}

function parseV08Node(comp: ComponentWrapper_v0_8): ReactComponentTree {
  const [type, config] = Object.entries(comp.component)[0];

  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(config)) {
    if (['child', 'children'].includes(key)) continue;
    // v0.8 中支持三种格式：
    // 1. { path: string } - 数据绑定路径
    // 2. { literalString: string } - 字面字符串
    // 3. 字面值直接使用
    if (isPathObject(val)) {
      props[key] = val.path;
    } else if (isLiteralStringValue(val)) {
      props[key] = val.literalString;
    } else {
      props[key] = val;
    }
  }

  // 解析 children 字段，支持 string[] 或 { explicitList: string[] }
  let childIds: string[] = [];
  if (config.children) {
    if (isExplicitList(config.children)) {
      childIds = config.children.explicitList;
    } else if (Array.isArray(config.children)) {
      childIds = config.children;
    }
  } else if (config.child) {
    childIds = [config.child];
  }

  return {
    type,
    props,
    ...(childIds.length > 0 && { children: childIds }),
  };
}

function parseV09Node(comp: BaseComponent_v0_9): ReactComponentTree {
  const type = comp.component;

  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(comp)) {
    // 跳过结构性内部字段，其余字段（包括 value）统一处理
    if (['id', 'component', 'child', 'children'].includes(key)) continue;
    // 字面值直接使用，{ path } 形式提取路径字符串供 resolveProps 解析
    props[key] = isPathObject(val) ? val.path : val;
  }

  const childIds: string[] = comp.children ?? (comp.child ? [comp.child] : []);

  return {
    type,
    props,
    ...(childIds.length > 0 && { children: childIds }),
  };
}

// ─── 工厂函数 ────────────────────────────────────────────────────────────────

export interface ComponentTransformer {
  /**
   * 将新增/更新的 components 合并进内部缓存，并返回以 root 节点为根的树。
   * 若缓存中尚无 id === 'root' 的节点则返回 null。
   */
  transform(
    components: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
    version?: 'v0.8' | 'v0.9',
  ): ReactComponentTree | null;

  /** 按 id 查找已缓存的节点，不存在时返回 undefined */
  getById(id: string): ReactComponentTree | undefined;

  /** 清空内部缓存 */
  reset(): void;
}

export function createComponentTransformer(): ComponentTransformer {
  // id → 解析后的节点（children 为子节点 id 列表）
  const componentMap = new Map<string, ReactComponentTree>();

  function transform(
    components: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
    version: 'v0.8' | 'v0.9' = 'v0.8',
  ): ReactComponentTree | null {
    if (!Array.isArray(components) || components.length === 0) {
      return componentMap.get('root') ?? null;
    }

    if (version === 'v0.8') {
      for (const comp of components as ComponentWrapper_v0_8[]) {
        componentMap.set(comp.id, parseV08Node(comp));
      }
    } else {
      for (const comp of components as BaseComponent_v0_9[]) {
        componentMap.set(comp.id, parseV09Node(comp));
      }
    }

    return componentMap.get('root') ?? null;
  }

  function getById(id: string): ReactComponentTree | undefined {
    return componentMap.get(id);
  }

  function reset(): void {
    componentMap.clear();
  }

  return { transform, getById, reset };
}

// ─── 向后兼容的默认导出 ───────────────────────────────────────────────────────

/** @deprecated 请使用 createComponentTransformer() 工厂函数 */
export default function transformToReactTree(
  componentsCommand: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
  version: 'v0.8' | 'v0.9' = 'v0.8',
): ReactComponentTree | null {
  const transformer = createComponentTransformer();
  return transformer.transform(componentsCommand, version);
}
