/**
 * Card shared utility functions
 * Utility functions shared by v0.8 and v0.9 versions
 */

/** Get value from nested object by path, path format like /booking/date */
export function getValueByPath(obj: Record<string, any>, path: string): any {
  const parts = path.replace(/^\//, '').split('/');
  return parts.reduce((cur, key) => (cur != null ? cur[key] : undefined), obj as any);
}

/** Write value to nested object by path (immutable), path format like /booking/selectedCoffee */
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

/** Check if string is a data binding path (starts with /) */
export function isPathValue(val: any): val is string {
  return typeof val === 'string' && val.startsWith('/');
}

/** Check if a value is a path object in { path: string } format */
export function isPathObject(val: any): val is { path: string } {
  return val !== null && typeof val === 'object' && typeof val.path === 'string';
}

/**
 * Validate if component conforms to catalog definition
 * @param catalog catalog definition
 * @param componentName component name
 * @param componentProps component properties
 * @returns { valid: boolean, errors: string[] }
 */
export function validateComponentAgainstCatalog(
  catalog: any,
  componentName: string,
  componentProps: Record<string, any>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // If no catalog, pass by default
  if (!catalog || !catalog.components) {
    return { valid: true, errors: [] };
  }

  // Check if component is defined in catalog
  const componentDef = catalog.components[componentName];
  if (!componentDef) {
    errors.push(`Component "${componentName}" is not defined in catalog`);
    return { valid: false, errors };
  }

  // Check required fields
  const requiredFields = componentDef.required || [];
  for (const field of requiredFields) {
    if (!(field in componentProps)) {
      errors.push(`Missing required field "${field}" for component "${componentName}"`);
    }
  }

  // Check if properties are defined in schema (warning level, does not block rendering)
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
