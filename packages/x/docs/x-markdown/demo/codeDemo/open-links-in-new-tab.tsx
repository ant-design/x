import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const markdownContent = `
### 新标签页打开链接

这是一个包含多个链接的示例：

- [Ant Design 官网](https://ant.design)
- [GitHub](https://github.com)

### 引用式链接

这是一个[引用式链接][1]，点击它也会在新标签页打开。

[1]: https://ant.design/components/x-markdown

#### 内联代码中的链接

访问我们的[文档站点](https://ant.design/x)获取更多信息。
`;

export default () => {
  const [className] = useMarkdownTheme();

  return (
    <div>
      <h3>启用新标签页打开链接</h3>
      <XMarkdown className={className} openLinksInNewTab content={markdownContent} />

      <h3 style={{ marginTop: 32 }}>禁用新标签页打开链接（默认）</h3>
      <XMarkdown className={className} content={markdownContent} />
    </div>
  );
};
