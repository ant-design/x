---
category: Components
group:
  title: Feedback
  order: 4
title: Folder
subtitle: File Tree
description: File tree component for displaying hierarchical file structure.
cover: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/uWJQS7CnYE0AAAAAQCAAAAgADtFMAQFr/original
coverDark: https://mdn.alipayobjects.com/huamei_lkxviz/afts/img/iUnnR43iHu8AAAAAQCAAAAgADtFMAQFr/original
tag: 2.4.0
---

## When to use

- Display hierarchical file/folder structure
- File selection and expand/collapse features needed

## Code examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic Usage</code>
<code src="./demo/custom-service.tsx">Custom File Service</code>
<code src="./demo/file-controlled.tsx">Controlled File Selection</code>
<code src="./demo/fully-controlled.tsx">Fully Controlled Mode</code>
<code src="./demo/searchable.tsx">Searchable File Tree</code>
<code src="./demo/custom-icons.tsx">Custom Icons</code>
<code src="./demo/context-menu.tsx">Context Menu</code>

## API

Common props ref: [Common props](/docs/react/common-props)

### FolderProps

<!-- prettier-ignore -->
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| treeData | File tree data | [FolderTreeData](#foldertreenode)[] | `[]` | - |
| selectable | Whether to enable selection functionality | boolean | `true` | - |
| selectedFile | Selected file paths (controlled) | string[] | - | - |
| defaultSelectedFile | Default selected file paths | string[] | `[]` | - |
| onSelectedFileChange | Callback when file selection changes | (file: { path: string[]; name?: string; content?: string }) => void | - | - |
| directoryTreeWith | Directory tree width | number \| string | `278` | - |
| emptyRender | Content to display when empty, set to `false` to hide | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewRender | Custom file preview content | React.ReactNode \| ((file: { content?: string; path: string[]; title?: React.ReactNode; language: string }, info: { originNode: React.ReactNode }) => React.ReactNode) | - | - |
| expandedPaths | Array of expanded node paths (controlled) | string[] | - | - |
| defaultExpandedPaths | Array of default expanded node paths | string[] | - | - |
| defaultExpandAll | Whether to expand all nodes by default | boolean | `true` | - |
| onExpandedPathsChange | Callback when expand/collapse changes | (paths: string[]) => void | - | - |
| fileContentService | File content service | [FileContentService](#filecontentservice) | - | - |
| onFileClick | File click event | (filePath: string, content?: string) => void | - | - |
| onFolderClick | Folder click event | (folderPath: string) => void | - | - |
| directoryTitle | Directory tree title, set to `false` to hide | false \| React.ReactNode \| (() => React.ReactNode) | - | - |
| previewTitle | File preview title | string \| (({ title, path, content }: { title: string; path: string[]; content: string }) => React.ReactNode) | - | - |
| directoryIcons | Custom icon configuration, set to `false` to hide icons | false \| Record<'directory' \| string, React.ReactNode \| (() => React.ReactNode)> | - | - |
| contextMenu | Context menu items for right-click, supports global configuration and function form (dynamically returns menu items based on node). Function form receives node data and full path key. Can be overridden by `contextMenu` in `FolderTreeData` | MenuProps['items'] \| ((node: [FolderTreeData](#foldertreenode), key: string) => MenuProps['items']) | - | - |
| onRightClick | Callback when right-clicking a node | function({event, node}) | - | - |

### FolderTreeData

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Display name | string | - | - |
| path | File path | string | - | - |
| content | File content (optional) | string | - | - |
| children | Sub-items (valid only for folder type) | [FolderTreeData](#foldertreenode)[] | - | - |
| contextMenu | Right-click context menu items, set to `false` to disable context menu for this node. Takes priority over global `contextMenu`. Function form receives full path key | MenuProps['items'] \| false \| ((key: string) => MenuProps['items']) | - | - |

### FileContentService

File content service interface, used for dynamically loading file content.

```typescript
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

### Ref Methods

Access component instance methods via `ref`.

```tsx
const folderRef = useRef<FolderRef>(null);

// Get a node
const node = folderRef.current?.getNode(['src', 'App.tsx']);

// Rename: immutable update, returns new treeData
const newData = folderRef.current?.updateNode(['src', 'App.tsx'], {
  title: 'Main.tsx',
  path: 'Main.tsx',
});

// Delete a node
const newData = folderRef.current?.deleteNode(['src', 'unused.ts']);

// Add a child node
const newData = folderRef.current?.addNode(['src'], {
  title: 'new.ts',
  path: 'new.ts',
  content: '',
});
```

| Method | Description | Type |
| --- | --- | --- |
| getNode | Get node data by path | (path: string[]) => FolderTreeData \| undefined |
| updateNode | Immutable update: merge partial fields into the target node, returns new treeData | (path: string[], data: Partial\<FolderTreeData\>) => FolderTreeData[] |
| deleteNode | Immutable update: delete the target node, returns new treeData | (path: string[]) => FolderTreeData[] |
| addNode | Immutable update: add a child node under the target folder, returns new treeData | (parentPath: string[], node: FolderTreeData) => FolderTreeData[] |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Folder"></ComponentTokenTable>
