---
category: Components
group:
  title: 反馈
  order: 4
title: Folder
subtitle: 文件夹
description: 文件树组件，用于展示层级文件结构。
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/uWJQS7CnYE0AAAAAQCAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/iUnnR43iHu8AAAAAQCAAAAgADtFMAQFr/original
tag: 2.4.0
---

## 何时使用

- 展示文件/文件夹层级结构
- 需要文件选择、展开收起功能

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/custom-service.tsx">自定义文件服务</code>
<code src="./demo/file-controlled.tsx">受控文件选择</code>
<code src="./demo/fully-controlled.tsx">完全受控模式</code>
<code src="./demo/searchable.tsx">可搜索的文件树</code>
<code src="./demo/custom-icons.tsx">自定义图标</code>
<code src="./demo/context-menu.tsx">右键菜单</code>
<code src="./demo/preview-render.tsx">自定义预览内容</code>

## API

通用属性参考：[通用属性](/docs/react/common-props)

### FolderProps

<!-- prettier-ignore -->
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| treeData | 文件树数据 | [FolderTreeData](#foldertreenode)[] | `[]` | - |
| selectable | 是否开启选择功能 | boolean | `true` | - |
| selectedFile | 选中的文件路径（受控） | string[] | - | - |
| defaultSelectedFile | 默认选中的文件路径 | string[] | `[]` | - |
| onSelectedFileChange | 文件选择变化时的回调 | (file: { path: string[]; name?: string; content?: string }) => void | - | - |
| directoryTreeWith | 目录树宽度 | number \| string | `278` | - |
| emptyRender | 空状态时的展示内容，设为 `false` 时不展示 | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewRender | 自定义文件预览内容 | React.ReactNode \| ((file: { content?: string; path: string[]; title?: React.ReactNode; language: string }, info: { originNode: React.ReactNode }) => React.ReactNode) | - | - |
| expandedPaths | 展开的节点路径数组（受控） | string[] | - | - |
| defaultExpandedPaths | 默认展开的节点路径数组 | string[] | - | - |
| defaultExpandAll | 是否默认展开所有节点 | boolean | `true` | - |
| onExpandedPathsChange | 展开/收起变化时的回调 | (paths: string[]) => void | - | - |
| fileContentService | 文件内容服务 | [FileContentService](#filecontentservice) | - | - |
| onFileClick | 文件点击事件 | (filePath: string, content?: string) => void | - | - |
| onFolderClick | 文件夹点击事件 | (folderPath: string) => void | - | - |
| directoryTitle | 目录树标题，设为 `false` 时不展示 | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewTitle | 文件预览标题 | string \| (({ title, path, content }: { title: string; path: string[]; content: string }) => React.ReactNode) | - | - |
| directoryIcons | 自定义图标配置，设为 `false` 时不展示图标 | false \| Record<'directory' \| string, React.ReactNode \| (() => React.ReactNode)> | - | - |
| contextMenu | 右键菜单配置，支持全局配置和函数形式（根据节点动态返回菜单项）。函数形式接收节点数据和完整路径 key。可被 `FolderTreeData` 中的 `contextMenu` 覆盖 | MenuProps['items'] \| ((node: [FolderTreeData](#foldertreenode), key: string) => MenuProps['items']) | - | - |
| onRightClick | 右键点击节点时的回调 | function({event, node}) | - | - |

### FolderTreeData

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 显示名称 | string | - | - |
| path | 文件路径 | string | - | - |
| content | 文件内容（可选） | string | - | - |
| children | 子项（仅文件夹类型有效） | [FolderTreeData](#foldertreenode)[] | - | - |
| contextMenu | 右键菜单项，设为 `false` 时禁用该节点的右键菜单。优先级高于全局 `contextMenu`。函数形式接收完整路径 key | MenuProps['items'] \| false \| ((key: string) => MenuProps['items']) | - | - |

### FileContentService

文件内容服务接口，用于动态加载文件内容。

```typescript
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

### Ref 方法

通过 `ref` 可以访问组件实例方法。

```tsx
const folderRef = useRef<FolderRef>(null);

// 获取节点
const node = folderRef.current?.getNode(['src', 'App.tsx']);

// 重命名：不可变更新，返回新的 treeData
const newData = folderRef.current?.updateNode(['src', 'App.tsx'], {
  title: 'Main.tsx',
  path: 'Main.tsx',
});

// 删除节点
const newData = folderRef.current?.deleteNode(['src', 'unused.ts']);

// 新增子节点
const newData = folderRef.current?.addNode(['src'], {
  title: 'new.ts',
  path: 'new.ts',
  content: '',
});
```

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getNode | 根据路径获取节点数据 | (path: string[]) => FolderTreeData \| undefined |
| updateNode | 不可变更新：合并部分字段到目标节点，返回新的 treeData | (path: string[], data: Partial\<FolderTreeData\>) => FolderTreeData[] |
| deleteNode | 不可变更新：删除目标节点，返回新的 treeData | (path: string[]) => FolderTreeData[] |
| addNode | 不可变更新：在目标文件夹下新增子节点，返回新的 treeData | (parentPath: string[], node: FolderTreeData) => FolderTreeData[] |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## 主题变量（Design Token）

<ComponentTokenTable component="Folder"></ComponentTokenTable>
