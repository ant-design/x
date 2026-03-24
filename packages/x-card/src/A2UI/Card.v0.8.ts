/**
 * Card v0.8 版本专用逻辑
 *
 * v0.8 命令格式：
 * - surfaceUpdate: { surfaceId, components }
 * - dataModelUpdate: { surfaceId, contents: [{ key, valueMap: [{ key, valueString }] }] }
 * - beginRendering: { surfaceId, root }
 *
 * v0.8 action 格式：
 * - action.name: string
 * - action.context: [{ key: string, value: { path: string } }]
 *
 * v0.8 特殊处理：
 * - props 中的 { literalString: string } 需要解析为字符串
 * - action.context 中的 { path } 是写入目标，不应被 resolveProps 解析
 */

import {
  getValueByPath,
  setValueByPath,
  isPathValue,
  isPathObject,
  validateComponentAgainstCatalog,
} from './utils';

/** 判断一个值是否为 { literalString: string } 形式的字面字符串对象 */
export function isLiteralStringObject(val: any): val is { literalString: string } {
  return val !== null && typeof val === 'object' && typeof val.literalString === 'string';
}

/** 将 props 中的路径值替换为 dataModel 中的真实值（v0.8 版本） */
export function resolvePropsV08(
  props: Record<string, any>,
  dataModel: Record<string, any>,
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    resolved[key] = resolveValueV08(val, dataModel);
  }
  return resolved;
}

/**
 * 递归解析值中的路径引用（v0.8 版本）
 *
 * 特殊处理：
 * - { literalString: string } → 解析为字符串
 * - { path: string } → 从 dataModel 读取值
 * - action.context 中的 { key, value: { path } } → 保留 { path } 结构（写入目标）
 */
function resolveValueV08(val: any, dataModel: Record<string, any>, isActionContext = false): any {
  // 处理 { literalString: string } 形式的字面字符串
  if (isLiteralStringObject(val)) {
    return val.literalString;
  }
  // 处理 { path: string } 形式的路径对象
  // 但在 action.context 中，value 字段的 { path } 是写入目标，需要保留
  if (isPathObject(val)) {
    if (isActionContext) {
      // 在 action.context 中，保留 { path } 结构
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
    return val.map((item) => resolveValueV08(item, dataModel, false));
  }
  // 对象递归处理
  if (val && typeof val === 'object') {
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      // 特殊处理：如果当前在 action.context 的 item 中（有 key 和 value 字段），
      // 则 value 字段应该保留 { path } 结构
      if (k === 'value' && 'key' in val) {
        result[k] = resolveValueV08(v, dataModel, true);
      } else {
        result[k] = resolveValueV08(v, dataModel, false);
      }
    }
    return result;
  }
  // 字面值直接使用
  return val;
}

/**
 * 解析 action.context 中的路径绑定，从 dataModel 中提取实际值
 * v0.8 格式: action.context 是数组 [{ key, value: { path: string } | literal }]
 */
export function resolveActionContextV08(
  action: any,
  dataModel: Record<string, any>,
): Record<string, any> | undefined {
  const context = action?.context;
  if (!Array.isArray(context)) {
    return undefined;
  }

  const resolved: Record<string, any> = {};
  for (const item of context) {
    if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
      const pathObj = item.value;
      // 处理 { path: string } 形式的路径绑定
      if (isPathObject(pathObj)) {
        resolved[item.key] = getValueByPath(dataModel, pathObj.path);
      }
      // 处理 { literalString: string } 形式的字面字符串
      else if (isLiteralStringObject(pathObj)) {
        resolved[item.key] = pathObj.literalString;
      }
      // 字面值直接使用
      else {
        resolved[item.key] = item.value;
      }
    }
  }
  return Object.keys(resolved).length > 0 ? resolved : undefined;
}

/**
 * 根据 action.context 中的路径配置，将组件传递的值写入 dataModel
 * v0.8 格式: action.context 是数组 [{ key, value: { path: string } }]
 *
 * 注意：v0.8 的 action.context 中的 { path } 是写入目标路径
 *
 * @param action action 配置对象
 * @param componentContext 组件传递的上下文数据
 * @returns 需要更新的数据路径和值的数组
 */
export function extractDataUpdatesV08(
  action: any,
  componentContext: Record<string, any>,
): Array<{ path: string; value: any }> {
  const context = action?.context;
  if (!Array.isArray(context)) {
    return [];
  }

  const updates: Array<{ path: string; value: any }> = [];
  for (const item of context) {
    if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
      const pathObj = item.value;
      // 只处理 { path: string } 形式的路径绑定
      if (isPathObject(pathObj)) {
        // 从组件传递的 context 中查找对应 key 的值
        const componentValue = componentContext[item.key];
        if (componentValue !== undefined) {
          updates.push({ path: pathObj.path, value: componentValue });
        }
      }
    }
  }
  return updates;
}

/**
 * 处理 v0.8 的 dataModelUpdate 命令
 * v0.8 格式: contents 是 [{ key, valueMap: [{ key, valueString }] }]
 *
 * 示例输入:
 * contents: [{ key: 'res', valueMap: [{ key: 'time', valueString: '...' }] }]
 *
 * 输出 dataModel:
 * { res: { time: '...' } }
 */
export function applyDataModelUpdateV08(
  prevDataModel: Record<string, any>,
  contents: Array<{
    key: string;
    valueMap: Array<{ key: string; valueString: string }>;
  }>,
): Record<string, any> {
  const next = { ...prevDataModel };
  for (const item of contents) {
    // item.key 作为顶层 key，item.valueMap 转换为对象
    const valueObj: Record<string, any> = {};
    for (const { key, valueString } of item.valueMap) {
      valueObj[key] = valueString;
    }
    next[item.key] = valueObj;
  }
  return next;
}

export {
  getValueByPath,
  setValueByPath,
  isPathValue,
  isPathObject,
  validateComponentAgainstCatalog,
};
