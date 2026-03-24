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

/** 将 props 中的路径值替换为 dataModel 中的真实值 */
export function resolvePropsV09(
  props: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    resolved[key] = resolveValueV09(val, dataModel);
  }
  return resolved;
}

/**
 * 递归解析值中的路径引用（v0.9 版本）
 *
 * 特殊处理：
 * - { path: string } → 从 dataModel 读取值
 * - action.event.context 中的 { key: { path } } → 保留 { path } 结构（写入目标）
 */
function resolveValueV09(
  val: any,
  dataModel: Record<string, any>,
  isActionEventContext = false,
): any {
  // 处理 { path: string } 形式的路径对象
  // 但在 action.event.context 中，{ path } 是写入目标，需要保留
  if (isPathObject(val)) {
    if (isActionEventContext) {
      // 在 action.event.context 中，保留 { path } 结构
      return val;
    }
    return getValueByPath(dataModel, val.path);
  }
  // 处理字符串路径（向后兼容）
  if (isPathValue(val)) {
    return getValueByPath(dataModel, val);
  }
  // 数组递归处理
  if (Array.isArray(val)) {
    return val.map((item) => resolveValueV09(item, dataModel, false));
  }
  // 对象递归处理
  if (val && typeof val === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      // 特殊处理：action.event.context 中的 { path } 是写入目标，应该保留
      if (k === 'context' && 'name' in val) {
        // 这个对象有 name 和 context，可能是 action.event
        result[k] = resolveValueV09(v, dataModel, true);
      } else {
        result[k] = resolveValueV09(v, dataModel, isActionEventContext);
      }
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
  action: any,
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
  action: any,
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
