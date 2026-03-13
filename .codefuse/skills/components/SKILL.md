# Ant Design X 组件开发规范指南

基于 antd 组件库最佳实践的完整开发规范，涵盖命名、架构、样式、测试等各个方面。

## 1. 项目架构规范

### 1.1 目录结构

```
components/[组件名]/
├── index.tsx           # 组件入口文件
├── [组件名].tsx        # 主组件实现
├── [子组件].tsx        # 子组件实现
├── style/
│   ├── index.ts        # 样式入口
│   ├── token.ts        # Token 定义
│   └── [其他样式文件].ts
├── demo/               # 示例代码
│   ├── basic.tsx       # 基础示例
│   └── [其他示例].tsx
├── __tests__/          # 测试文件
│   └── index.test.tsx  # 单元测试
└── index.zh-CN.md      # 中文文档
```

### 1.2 文件命名规范

- 组件文件：PascalCase（如 `Button.tsx`）
- 样式文件：camelCase（如 `buttonStyle.ts`）
- 测试文件：`index.test.tsx` 或 `[组件名].test.tsx`
- 示例文件：kebab-case（如 `basic.tsx`、`custom-filter.tsx`）

## 2. 命名规范与语义化

### 2.1 组件命名

- **完整名称**：使用完整单词，避免缩写
- **PascalCase**：组件名使用大驼峰命名
- **语义化**：名称应准确描述组件功能

```typescript
// ✅ 正确
interface ButtonProps {}
interface TypographyTextProps {}

// ❌ 错误
interface BtnProps {} // 缩写
interface TxtProps {} // 缩写
interface MyComponentProps {} // 语义不清
```

### 2.2 Props 命名规范

#### 基础属性

- **类型属性**：`type`（如 `type="primary"`）
- **状态属性**：`disabled`、`loading`、`open`
- **尺寸属性**：`size`（`large` | `middle` | `small`）
- **默认值**：`default` + 属性名（如 `defaultValue`）

#### 功能属性

- **可编辑**：`editable`（布尔或配置对象）
- **可复制**：`copyable`（布尔或配置对象）
- **可展开**：`expandable`（布尔或配置对象）

#### 事件属性

- **触发事件**：`on` + 事件名（如 `onClick`、`onChange`）
- **子组件事件**：`on` + 子组件名 + 事件名（如 `onPanelClick`）
- **前置事件**：`before` + 事件名（如 `beforeUpload`）
- **后置事件**：`after` + 事件名（如 `afterClose`）

### 2.3 CSS 类名规范

```typescript
// 组件前缀
const prefixCls = getPrefixCls('button', customizePrefixCls);

// 状态类名
`${prefixCls}-${type}` // 类型类名
`${prefixCls}-disabled` // 禁用状态
`${prefixCls}-loading` // 加载状态
`${prefixCls}-${sizeCls}` // 尺寸类名
// 组合类名
`${prefixCls}-icon-only` // 仅图标按钮
`${prefixCls}-two-chinese-chars`; // 中文字符间距
```

## 3. TypeScript 类型设计

### 3.1 Props 接口定义

```typescript
// 基础 Props 接口
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // 类型定义
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: 'large' | 'middle' | 'small';

  // 状态控制
  loading?: boolean | { delay?: number };
  disabled?: boolean;

  // 内容相关
  icon?: React.ReactNode;
  children?: React.ReactNode;

  // 样式相关
  className?: string;
  style?: React.CSSProperties;

  // 事件处理
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 配置对象类型
export interface CopyConfig {
  text?: string | (() => string | Promise<string>);
  onCopy?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  tooltips?: React.ReactNode;
  format?: 'text/plain' | 'text/html';
}
```

### 3.2 泛型组件设计

```typescript
// 泛型组件支持不同元素类型
export interface BlockProps<
  C extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> extends TypographyProps<C> {
  component?: C;
  // 其他属性...
}

// 使用示例
const Base = React.forwardRef<HTMLElement, BlockProps>((props, ref) => {
  const { component = 'div' as C, ...rest } = props;
  return React.createElement(component, rest);
});
```

### 3.3 类型安全实践

```typescript
// 使用联合类型而非 enum
type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';

// 使用 as const 定义常量
const BUTTON_TYPES = ['primary', 'default', 'dashed', 'text', 'link'] as const;

// 精确的类型定义
interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | 'collapsible';
  suffix?: string;
  symbol?: React.ReactNode | ((expanded: boolean) => React.ReactNode);
}
```

## 4. 组件架构模式

### 4.1 复合组件模式

```typescript
// 主组件
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // 实现...
});

// 子组件
Button.Group = ButtonGroup;
Button.__ANT_BUTTON = true;

// 使用
<Button.Group>
  <Button>按钮1</Button>
  <Button>按钮2</Button>
</Button.Group>
```

### 4.2 配置合并模式

```typescript
// 使用 useMergedConfig 合并布尔值和配置对象
const [enableEdit, editConfig] = useMergedConfig<EditConfig>(editable);

// 实现 useMergedConfig
function useMergedConfig<T>(config: boolean | T): [boolean, T] {
  const enable = Boolean(config);
  const mergedConfig = React.useMemo(() => {
    if (config === true) return {} as T;
    if (config === false) return {} as T;
    return config || ({} as T);
  }, [config]);
  return [enable, mergedConfig];
}
```

### 4.3 受控与非受控模式

```typescript
// 使用 useControlledState 处理受控/非受控状态
const [editing, setEditing] = useControlledState(false, editConfig.editing);

// useControlledState 实现
function useControlledState<T>(defaultValue: T, controlledValue?: T): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = React.useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
    },
    [isControlled],
  );

  return [value, setValue];
}
```

## 5. 样式系统规范

### 5.1 CSS-in-JS 架构

```typescript
// Token 定义
export interface ComponentToken {
  // 颜色相关
  colorPrimary?: string;
  colorBgContainer?: string;

  // 尺寸相关
  controlHeight?: number;
  controlHeightSM?: number;
  controlHeightLG?: number;

  // 间距相关
  padding?: number;
  paddingSM?: number;
  paddingLG?: number;
}

// 样式生成函数
const genButtonStyle = (token: ButtonToken): CSSInterpolation => {
  return [
    // 基础样式
    genSharedButtonStyle(token),
    // 尺寸样式
    genSizeBaseButtonStyle(token),
    genSizeSmallButtonStyle(token),
    genSizeLargeButtonStyle(token),
    // 变体样式
    genVariantStyle(token),
  ];
};

// 样式导出
export default genStyleHooks('Button', genButtonStyle, prepareComponentToken, {
  unitless: { fontWeight: true },
});
```

### 5.2 响应式设计

```typescript
// 使用 CSS 逻辑属性支持 RTL
const styles = {
  marginInlineStart: token.marginXS, // 替代 marginLeft
  marginInlineEnd: token.marginXS, // 替代 marginRight
  paddingBlock: token.paddingSM, // 替代 paddingTop/paddingBottom
  paddingInline: token.paddingSM, // 替代 paddingLeft/paddingRight
};

// 响应式断点
const responsiveStyles = {
  [token.screenXS]: {
    fontSize: token.fontSizeSM,
  },
  [token.screenMD]: {
    fontSize: token.fontSize,
  },
  [token.screenLG]: {
    fontSize: token.fontSizeLG,
  },
};
```

### 5.3 主题定制支持

```typescript
// 支持 ConfigProvider 主题定制
const { getPrefixCls, direction } = React.useContext(ConfigContext);
const prefixCls = getPrefixCls('button', customizePrefixCls);

// 支持语义化 className 和 style
export interface ButtonSemanticClassNames {
  root?: string;
  icon?: string;
  content?: string;
}

export interface ButtonSemanticStyles {
  root?: React.CSSProperties;
  icon?: React.CSSProperties;
  content?: React.CSSProperties;
}
```

## 6. 可访问性规范

### 6.1 ARIA 属性

```typescript
// 正确的 ARIA 属性使用
<button
  aria-label={ariaLabel}
  aria-disabled={mergedDisabled}
  aria-expanded={expanded}
  aria-busy={innerLoading}
  tabIndex={mergedDisabled ? -1 : 0}
>
  {children}
</button>

// 键盘导航支持
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      handleClick();
      break;
    case 'Escape':
      handleCancel();
      break;
  }
};
```

### 6.2 焦点管理

```typescript
// 焦点状态样式
const focusStyles = {
  '&:focus-visible': {
    outline: `${token.lineWidthFocus}px solid ${token.colorPrimaryBorder}`,
    outlineOffset: 1,
  },
};

// 程序化焦点管理
const buttonRef = React.useRef<HTMLButtonElement>(null);
React.useEffect(() => {
  if (autoFocus && buttonRef.current) {
    buttonRef.current.focus();
  }
}, [autoFocus]);
```

## 7. 性能优化规范

### 7.1 React 优化

```typescript
// 使用 React.memo 避免不必要的重渲染
const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    // 组件实现
  }),
);

// 使用 useMemo 缓存计算结果
const classes = React.useMemo(() => {
  return clsx(prefixCls, `${prefixCls}-${type}`, `${prefixCls}-${size}`, className);
}, [prefixCls, type, size, className]);

// 使用 useCallback 缓存函数
const handleClick = React.useCallback(
  (event: React.MouseEvent) => {
    if (!disabled && !loading) {
      onClick?.(event);
    }
  },
  [disabled, loading, onClick],
);
```

### 7.2 样式优化

```typescript
// 避免不必要的样式重计算
const useStyle = genStyleHooks(
  'Button',
  (token) => {
    // 样式计算逻辑
  },
  prepareComponentToken,
);

// 使用 CSS containment
const containerStyles = {
  contain: 'layout style paint',
  contentVisibility: 'auto',
};
```

## 8. 测试规范

### 8.1 测试文件结构

```typescript
// __tests__/index.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../index';

describe('Button', () => {
  it('should render correctly', () => {
    const { container } = render(<Button>Test</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

### 8.2 测试覆盖率要求

- 单元测试覆盖率：100%
- 集成测试：主要使用场景
- 可访问性测试：键盘导航、屏幕阅读器
- 视觉回归测试：UI 变化检测

## 9. 文档规范

### 9.1 API 文档格式

```markdown
| 参数     | 说明             | 类型                                                   | 默认值    |
| -------- | ---------------- | ------------------------------------------------------ | --------- |
| type     | 设置按钮类型     | `primary` \| `default` \| `dashed` \| `text` \| `link` | `default` |
| size     | 设置按钮大小     | `large` \| `middle` \| `small`                         | `middle`  |
| disabled | 按钮失效状态     | boolean                                                | false     |
| loading  | 设置按钮载入状态 | boolean \| { delay: number }                           | false     |
| onClick  | 点击按钮时的回调 | (event) => void                                        | -         |
```

### 9.2 示例代码规范

```typescript
// demo/basic.tsx
import React from 'react';
import { Button } from 'antd';

const App: React.FC = () => (
  <>
    <Button type="primary">Primary Button</Button>
    <Button>Default Button</Button>
    <Button type="dashed">Dashed Button</Button>
    <Button type="text">Text Button</Button>
    <Button type="link">Link Button</Button>
  </>
);

export default App;
```

## 10. 国际化规范

### 10.1 本地化配置

```typescript
// locale/zh_CN.ts
export default {
  Text: {
    edit: '编辑',
    copy: '复制',
    copied: '复制成功',
    expand: '展开',
    collapse: '收起',
  },
};

// 使用 useLocale 获取本地化
const [textLocale] = useLocale('Text', enUS.Text);
```

### 10.2 动态文本处理

```typescript
// 支持模板变量的本地化
const messages = {
  selected: '已选择 ${count} 项',
};

// 使用
const message = messages.selected.replace('${count}', count.toString());
```

## 11. 版本兼容规范

### 11.1 向下兼容

- 避免破坏性变更
- 提供迁移指南
- 保持 API 稳定性
- 使用废弃警告

```typescript
// 废弃警告
if (process.env.NODE_ENV !== 'production') {
  const warning = devUseWarning('Button');
  warning.deprecated(!iconPosition, 'iconPosition', 'iconPlacement');
}
```

### 11.2 浏览器兼容

- 支持 Chrome 80+
- 支持服务端渲染
- 支持 TypeScript 4.0+
- 支持 React 18 ~ 19

## 12. 发布规范

### 12.1 版本管理

- 遵循语义化版本（SemVer）
- 主版本：破坏性变更
- 次版本：新功能
- 修订版本：Bug 修复

### 12.2 变更日志

```markdown
## 5.0.0

### 重大变更

- 移除废弃的 `icon` 字符串用法
- 重构样式系统，使用 CSS-in-JS

### 新功能

- 新增 `variant` 属性支持多种按钮变体
- 新增语义化 className 和 style 支持

### Bug 修复

- 修复按钮在 disabled 状态下仍可点击的问题
```

---

这套规范基于 antd 组件库的最佳实践，涵盖了从项目结构到发布流程的完整开发规范。遵循这些规范可以确保组件的一致性、可维护性和高质量。
