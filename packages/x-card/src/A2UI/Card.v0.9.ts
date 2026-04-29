/**
 * Card v0.9 版本专用逻辑
 *
 * v0.9 命令格式：
 * - version: 'v0.9'
 * - updateComponents: { surfaceId, components }
 * - updateDataModel: { surfaceId, path, value }
 * - deleteSurface: { surfaceId }
 *
 * v0.9 action 格式：
 * - action.event.name: string
 * - action.event.context: { [key]: { path: string } | literal }
 */

import {
  getValueByPath,
  setValueByPath,
  isPathValue,
  isPathObject,
  validateComponentAgainstCatalog,
} from './utils';

/** v0.9 action.event.context 中单个值的类型 */
export type ActionContextValueV09 = { path: string } | unknown;

/** v0.9 action.event 类型 */
export interface ActionEventV09 {
  name?: string;
  /** 运行时可能收到非法值（数组、字符串、null），函数内部通过类型守卫防御 */
  context?: Record<string, unknown> | unknown;
  [key: string]: unknown;
}

/** v0.9 action 配置类型 */
export interface ActionConfigV09 {
  event?: ActionEventV09;
  [key: string]: unknown;
}

/** 将 props 中的路径值替换为 dataModel 中的真实值 */
export function resolvePropsV09(
  props: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (key === 'action') {
      // action.event.context 中的 { path } 是写入目标，需要精确处理，不能走通用路径解析
      resolved[key] = resolveActionPropV09(val, dataModel);
    } else {
      resolved[key] = resolveValueV09(val, dataModel);
    }
  }
  return resolved;
}

/**
 * 精确处理 action prop：
 * - action.event.name / 其他字段 → 正常解析路径引用
 * - action.event.context → 保留所有 { path } 结构（写入目标，不做读取替换）
 */
function resolveActionPropV09(action: any, dataModel: Record<string, any>): any {
  if (!action || typeof action !== 'object') return action;

  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(action)) {
    if (k === 'event') {
      result[k] = resolveActionEventV09(v, dataModel);
    } else {
      result[k] = resolveValueV09(v, dataModel);
    }
  }
  return result;
}

/**
 * 精确处理 action.event：
 * - event.context → 原样保留（{ path } 是写入目标）
 * - event 其他字段（如 name）→ 正常解析
 */
function resolveActionEventV09(event: any, dataModel: Record<string, any>): any {
  if (!event || typeof event !== 'object') return event;

  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(event)) {
    if (k === 'context') {
      // context 中的 { path } 是写入目标，原样保留，不做路径读取
      result[k] = v;
    } else {
      result[k] = resolveValueV09(v, dataModel);
    }
  }
  return result;
}

/**
 * 递归解析值中的路径引用（v0.9 版本）
 *
 * - { path: string } → 从 dataModel 读取值
 * - 字符串路径（/xxx）→ 从 dataModel 读取值（向后兼容）
 * - 数组 / 对象 → 递归处理
 * - 字面值 → 原样返回
 *
 * 注意：action.event.context 的特殊处理已在 resolvePropsV09 入口处分支，
 * 此函数无需感知 action 上下文，保持纯粹的递归解析逻辑。
 */
function resolveValueV09(val: any, dataModel: Record<string, any>): any {
  // 处理 { path: string } 形式的路径对象
  if (isPathObject(val)) {
    return getValueByPath(dataModel, val.path);
  }
  // 处理字符串路径（向后兼容）
  if (isPathValue(val)) {
    return getValueByPath(dataModel, val);
  }
  // 数组递归处理
  if (Array.isArray(val)) {
    return val.map((item) => resolveValueV09(item, dataModel));
  }
  // 对象递归处理
  if (val && typeof val === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      result[k] = resolveValueV09(v, dataModel);
    }
    return result;
  }
  // 字面值直接使用
  return val;
}

/**
 * 解析 action.event.context 中的路径绑定，从 dataModel 中提取实际值
 * v0.9 格式: action.event.context 是对象 { key: { path: string } | literal }
 */
export function resolveActionContextV09(
  action: ActionConfigV09 | undefined,
  dataModel: Record<string, any>,
): Record<string, any> | undefined {
  const context = action?.event?.context;
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return undefined;
  }

  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(context)) {
    // 处理 { path: string } 形式的路径绑定
    if (isPathObject(val)) {
      resolved[key] = getValueByPath(dataModel, (val as { path: string }).path);
    }
    // 字面值直接使用
    else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/**
 * 根据 action.event.context 中的路径配置，将组件传递的值写入 dataModel
 * v0.9 格式: action.event.context 是对象 { key: { path: string } }
 * @param action action 配置对象
 * @param componentContext 组件传递的上下文数据
 * @returns 需要更新的数据路径和值的数组
 */
export function extractDataUpdatesV09(
  action: ActionConfigV09 | undefined,
  componentContext: Record<string, any>,
): Array<{ path: string; value: any }> {
  const context = action?.event?.context;
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return [];
  }

  const updates: Array<{ path: string; value: any }> = [];
  for (const [key, val] of Object.entries(context)) {
    // 只处理 { path: string } 形式的路径绑定
    if (isPathObject(val)) {
      // 从组件传递的 context 中查找对应 key 的值
      const componentValue = componentContext[key];
      if (componentValue !== undefined) {
        updates.push({ path: (val as { path: string }).path, value: componentValue });
      }
    }
  }
  return updates;
}

/**
 * 处理 v0.9 的 updateDataModel 命令
 * 将路径值写入 dataModel
 */
export function applyDataModelUpdateV09(
  prevDataModel: Record<string, any>,
  path: string,
  value: any,
): Record<string, any> {
  return setValueByPath(prevDataModel, path, value);
}

export {
  getValueByPath,
  setValueByPath,
  isPathValue,
  isPathObject,
  validateComponentAgainstCatalog,
};
