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
| emptyRender | Content to display when empty | React.ReactNode \| (() => React.ReactNode) | - | - |
| previewRender | Custom file preview content | React.ReactNode \| ((file: { content?: string; path: string[]; title?: React.ReactNode; language: string }, info: { originNode: React.ReactNode }) => React.ReactNode) | - | - |
| expandedPaths | Array of expanded node paths (controlled) | string[] | - | - |
| defaultExpandedPaths | Array of default expanded node paths | string[] | - | - |
| defaultExpandAll | Whether to expand all nodes by default | boolean | `true` | - |
| onExpandedPathsChange | Callback when expand/collapse changes | (paths: string[]) => void | - | - |
| fileContentService | File content service | [FileContentService](#filecontentservice) | - | - |
| onFileClick | File click event | (filePath: string, content?: string) => void | - | - |
| onFolderClick | Folder click event | (folderPath: string) => void | - | - |
| directoryTitle | Directory tree title | React.ReactNode \| (() => React.ReactNode) | - | - |
| previewTitle | File preview title | string \| (({ title, path, content }: { title: string; path: string[]; content: string }) => React.ReactNode) | - | - |
| directoryIcons | Custom icon configuration | Record<'directory' \| string, React.ReactNode \| (() => React.ReactNode)> | - | - |

### FolderTreeData

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| title | Display name | string | - | - |
| path | File path | string | - | - |
| content | File content (optional) | string | - | - |
| children | Sub-items (valid only for folder type) | [FolderTreeData](#foldertreenode)[] | - | - |

### FileContentService

File content service interface, used for dynamically loading file content.

```typescript
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify="true"></code>

## Design Token

<ComponentTokenTable component="Folder"></ComponentTokenTable>
