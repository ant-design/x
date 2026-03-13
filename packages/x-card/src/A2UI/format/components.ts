import type { ComponentWrapper_v0_8 } from '../types/command_v0.8';
import type { BaseComponent_v0_9 } from '../types/command_v0.9';

interface ReactComponentTree {
  type: string;
  props: Record<string, any>;
  children?: ReactComponentTree[];
}

export default function transformToReactTree(
  componentsCommand: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
  version: 'v0.8' | 'v0.9' = 'v0.8',
): ReactComponentTree | null {
  if (!Array.isArray(componentsCommand) || componentsCommand.length === 0) {
    return null;
  }

  if (version === 'v0.8') {
    const components = componentsCommand as ComponentWrapper_v0_8[];
    const rootComponents = components.filter((comp) => comp.id === 'root');

    if (rootComponents.length === 0) return null;

    const rootComponent = rootComponents[0]; // 只取第一个root
    const [type, config] = Object.entries(rootComponent.component)[0];

    return {
      type: type,
      props: {
        id: rootComponent.id,
        ...Object.fromEntries(
          Object.entries(config).filter(([key]) => !['value', 'children', 'child'].includes(key)),
        ),
        ...(config.value && {
          value: 'path' in config.value ? config.value.path : config.value.literalString,
        }),
      },
      children: config.children?.map((childId) => ({
        type: 'placeholder',
        props: { id: childId },
      })),
    };
  }

  const components = componentsCommand as BaseComponent_v0_9[];
  const rootComponents = components.filter((comp) => comp.id === 'root');

  if (rootComponents.length === 0) return null;

  const rootComponent = rootComponents[0]; // 只取第一个root

  // 处理 children 和 child 的兼容
  const childIds = rootComponent.children || (rootComponent.child ? [rootComponent.child] : []);

  return {
    type: rootComponent.component,
    props: {
      id: rootComponent.id,
      ...Object.fromEntries(
        Object.entries(rootComponent).filter(
          ([key]) => !['id', 'component', 'value', 'child', 'children'].includes(key),
        ),
      ),
      ...(rootComponent.value && { value: rootComponent.value.path }),
    },
    ...(childIds.length > 0 && {
      children: childIds.map((childId) => ({ type: 'placeholder', props: { id: childId } })),
    }),
  };
}
