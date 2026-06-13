/**
 * format/components.ts 测试用例
 * 覆盖 createComponentTransformer, parseV08Node, parseV09Node, transformToReactTree
 */
import { createComponentTransformer } from '../format/components';
import type { ComponentWrapper_v0_8 } from '../types/command_v0.8';
import type { BaseComponent_v0_9 } from '../types/command_v0.9';

describe('createComponentTransformer', () => {
  describe('v0.8', () => {
    it('should transform simple v0.8 component', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              children: ['child1'],
            },
          },
        },
        {
          id: 'child1',
          component: {
            Text: {
              text: 'Hello',
            },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      expect(result!.children).toContain('child1');

      const child = transformer.getById('child1');
      expect(child).toBeDefined();
      expect(child!.type).toBe('Text');
      expect(child!.props.text).toBe('Hello');
    });

    it('should parse { path: string } binding in v0.8', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Text: {
              text: { path: '/user/name' },
            },
          },
        },
      ];

      transformer.transform(components, 'v0.8');
      const node = transformer.getById('root');
      expect(node!.props.text).toBe('/user/name');
    });

    it('should parse { literalString: string } in v0.8', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Text: {
              text: { literalString: 'Hello World' },
            },
          },
        },
      ];

      transformer.transform(components, 'v0.8');
      const node = transformer.getById('root');
      expect(node!.props.text).toBe('Hello World');
    });

    it('should parse children array in v0.8', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              children: ['child1', 'child2'],
            },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result!.children).toEqual(['child1', 'child2']);
    });

    it('should parse { explicitList: string[] } children in v0.8', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              children: { explicitList: ['child1', 'child2'] },
            },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result!.children).toEqual(['child1', 'child2']);
    });

    it('should parse child (singular) in v0.8', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              child: 'singleChild',
            },
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result!.children).toEqual(['singleChild']);
    });

    it('should skip child/children in props', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {
              child: 'singleChild',
              children: ['other'],
            },
          },
        },
      ];

      transformer.transform(components, 'v0.8');
      const node = transformer.getById('root');
      expect(node!.props.child).toBeUndefined();
      expect(node!.props.children).toBeUndefined();
    });

    it('should return null when no root component', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'notRoot',
          component: {
            Text: {},
          },
        },
      ];

      const result = transformer.transform(components, 'v0.8');
      expect(result).toBeNull();
    });

    it('should return cached root when called with empty array', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {},
          },
        },
      ];

      transformer.transform(components, 'v0.8');
      const result = transformer.transform([], 'v0.8');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
    });

    it('should handle mixed literal and binding values', () => {
      const transformer = createComponentTransformer();
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Input: {
              placeholder: { literalString: 'Enter name' },
              value: { path: '/form/name' },
              disabled: false,
            },
          },
        },
      ];

      transformer.transform(components, 'v0.8');
      const node = transformer.getById('root');
      expect(node!.props.placeholder).toBe('Enter name');
      expect(node!.props.value).toBe('/form/name');
      expect(node!.props.disabled).toBe(false);
    });
  });

  describe('v0.9', () => {
    it('should transform simple v0.9 component', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
          children: ['child1'],
        },
        {
          id: 'child1',
          component: 'Text',
          text: 'Hello',
        },
      ];

      const result = transformer.transform(components, 'v0.9');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
      expect(result!.children).toContain('child1');

      const child = transformer.getById('child1');
      expect(child).toBeDefined();
      expect(child!.type).toBe('Text');
      expect(child!.props.text).toBe('Hello');
    });

    it('should parse { path: string } binding in v0.9', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Text',
          text: { path: '/user/name' },
        },
      ];

      transformer.transform(components, 'v0.9');
      const node = transformer.getById('root');
      expect(node!.props.text).toBe('/user/name');
    });

    it('should parse children array in v0.9', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
          children: ['child1', 'child2'],
        },
      ];

      const result = transformer.transform(components, 'v0.9');
      expect(result!.children).toEqual(['child1', 'child2']);
    });

    it('should parse child (singular) in v0.9', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
          child: 'singleChild',
        },
      ];

      const result = transformer.transform(components, 'v0.9');
      expect(result!.children).toEqual(['singleChild']);
    });

    it('should skip id, component, child, children in props', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
          child: 'singleChild',
          extraProp: 'value',
        },
      ];

      transformer.transform(components, 'v0.9');
      const node = transformer.getById('root');
      expect(node!.props.id).toBeUndefined();
      expect(node!.props.component).toBeUndefined();
      expect(node!.props.child).toBeUndefined();
      expect(node!.props.extraProp).toBe('value');
    });

    it('should return null when no root component in v0.9', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'notRoot',
          component: 'Text',
        },
      ];

      const result = transformer.transform(components, 'v0.9');
      expect(result).toBeNull();
    });

    it('should not have children when no children or child defined', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Text',
          text: 'Hello',
        },
      ];

      const result = transformer.transform(components, 'v0.9');
      expect(result!.children).toBeUndefined();
    });
  });

  describe('getById', () => {
    it('should return undefined for non-existent id', () => {
      const transformer = createComponentTransformer();
      const result = transformer.getById('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should return correct node after transform', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'myNode',
          component: 'Text',
          text: 'Hello',
        },
      ];

      transformer.transform(components, 'v0.9');
      const node = transformer.getById('myNode');
      expect(node).toBeDefined();
      expect(node!.type).toBe('Text');
    });
  });

  describe('reset', () => {
    it('should clear all cached components', () => {
      const transformer = createComponentTransformer();
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
        },
      ];

      transformer.transform(components, 'v0.9');
      expect(transformer.getById('root')).toBeDefined();

      transformer.reset();
      expect(transformer.getById('root')).toBeUndefined();
    });
  });

  describe('transformToReactTree (deprecated)', () => {
    it('should work as factory function result', () => {
      const components: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
        },
      ];

      // transformToReactTree 是默认导出
      const transformerModule = require('../format/components');
      const result = transformerModule.default(components, 'v0.9');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
    });

    it('should default to v0.8 version', () => {
      const components: ComponentWrapper_v0_8[] = [
        {
          id: 'root',
          component: {
            Container: {},
          },
        },
      ];

      const transformerModule = require('../format/components');
      const result = transformerModule.default(components);
      expect(result).not.toBeNull();
      expect(result!.type).toBe('Container');
    });
  });

  describe('incremental transform', () => {
    it('should merge new components with existing', () => {
      const transformer = createComponentTransformer();
      const components1: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Container',
          children: ['child1'],
        },
      ];

      transformer.transform(components1, 'v0.9');
      expect(transformer.getById('root')).toBeDefined();

      const components2: BaseComponent_v0_9[] = [
        {
          id: 'child1',
          component: 'Text',
          text: 'Hello',
        },
      ];

      transformer.transform(components2, 'v0.9');
      expect(transformer.getById('child1')).toBeDefined();
      expect(transformer.getById('root')).toBeDefined();
    });

    it('should update existing component', () => {
      const transformer = createComponentTransformer();
      const components1: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Text',
          text: 'Hello',
        },
      ];

      transformer.transform(components1, 'v0.9');
      const node1 = transformer.getById('root');
      expect(node1!.props.text).toBe('Hello');

      const components2: BaseComponent_v0_9[] = [
        {
          id: 'root',
          component: 'Text',
          text: 'Updated',
        },
      ];

      transformer.transform(components2, 'v0.9');
      const node2 = transformer.getById('root');
      expect(node2!.props.text).toBe('Updated');
    });
  });
});
