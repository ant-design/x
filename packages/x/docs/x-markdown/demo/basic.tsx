import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import './index.css';

const content = `
<div align="center"><img height="180" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"><h3>X-Markdown</h3><p>Streaming Markdown Renderer.</p>

[![CI status](https://github.com/ant-design/x/actions/workflows/main.yml/badge.svg)]()  [![NPM version](https://img.shields.io/npm/v/@ant-design/x.svg?style=flat-square)]()

</div>

### ✨ Features

- 🌈 **safe by default**, render react element instead of using \`dangerouslySetInnerHTML\`
- 🧩 **streaming friendly**: Hide Markdown formatting during streaming rendering.
- 🎨 **Components**: Override the original component rendering through components.
- 🔄 **plugins**: Supports marked extension for rendering jsx format.

### 📦 Installation

\`\`\`bash
npm install @ant-design/x-markdown save
\`\`\`

\`\`\`bash
yarn add @ant-design/x-markdown
\`\`\`

\`\`\`bash
pnpm add @ant-design/x-markdown
\`\`\`

`;

const App = () => <XMarkdown content={content} className="xmarkdown-body" allowHtml={true} />;

export default App;
