## zh-CN

使用 `previewRender` 属性自定义文件预览内容。

`previewRender` 支持两种形式：

- ReactNode：直接渲染自定义内容
- 函数形式：`(file, info) => ReactNode`，其中：
  - `file`: 包含文件信息的对象 `{ content, path, title, language }`
  - `info`: 包含原始预览节点的对象 `{ originNode }`

## en-US

Customize file preview content using the `previewRender` prop.

`previewRender` supports two forms:

- ReactNode: Directly render custom content
- Function form: `(file, info) => ReactNode`, where:
  - `file`: Object containing file info `{ content, path, title, language }`
  - `info`: Object containing original preview node `{ originNode }`
