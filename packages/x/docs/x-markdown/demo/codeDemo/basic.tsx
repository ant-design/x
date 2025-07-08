import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';

const content = `
### Hello World!

### 欢迎使用 XMarkdown！
`;

const App = () => <XMarkdown content={content} />;

export default App;
