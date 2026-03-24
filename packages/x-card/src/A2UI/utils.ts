/**
 * Card 共享工具函数
 * v0.8 和 v0.9 版本共用的工具函数
 */

/** 从嵌套对象中按路径取值，路径格式如 /booking/date */
export function getValueByPath(obj: Record<string, any>, path: string): any {
  const parts = path.replace(/^\//, '').split('/');
  return parts.reduce((cur, key) => (cur != null ? cur[key] : undefined), obj as any);
}

/** 按路径将值写入嵌套对象（immutable），路径格式如 /booking/selectedCoffee */
export function setValueByPath(
  obj: Record<string, any>,
  path: string,
  value: any,
): Record<string, any> {
  const parts = path.replace(/^\//, '').split('/');
  const next = { ...obj };
  let cur: Record<string, any> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ? { ...cur[parts[i]] } : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return next;
}

/** 判断字符串是否为数据绑定路径（以 / 开头） */
export function isPathValue(val: any): val is string {
  return typeof val === 'string' && val.startsWith('/');
}

/** 判断一个值是否为 { path: string } 形式的路径对象 */
export function isPathObject(val: any): val is { path: string } {
  return val !== null && typeof val === 'object' && typeof val.path === 'string';
}

/**
 * 验证组件是否符合 catalog 定义
 * @param catalog catalog 定义
 * @param componentName 组件名称
 * @param componentProps 组件属性
 * @returns { valid: boolean, errors: string[] }
 */
export function validateComponentAgainstCatalog(
  catalog: any,
  componentName: string,
  componentProps: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 如果没有 catalog，默认通过
  if (!catalog || !catalog.components) {
    return { valid: true, errors: [] };
  }

  // 检查组件是否在 catalog 中定义
  const componentDef = catalog.components[componentName];
  if (!componentDef) {
    errors.push(`Component "${componentName}" is not defined in catalog`);
    return { valid: false, errors };
  }

  // 检查必填字段
  const requiredFields = componentDef.required || [];
  for (const field of requiredFields) {
    if (!(field in componentProps)) {
      errors.push(`Missing required field "${field}" for component "${componentName}"`);
    }
  }

  // 检查属性是否在 schema 中定义（警告级别，不阻止渲染）
  if (componentDef.properties) {
    const definedProps = Object.keys(componentDef.properties);
    const actualProps = Object.keys(componentProps).filter(
      (key) => !['id', 'children', 'component'].includes(key),
    );

    for (const prop of actualProps) {
      if (!definedProps.includes(prop)) {
        errors.push(
          `Warning: Property "${prop}" is not defined in catalog for component "${componentName}"`,
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
