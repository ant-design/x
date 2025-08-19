import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';

const content = `
<iframe src="javascript:alert('xss')"></iframe>\n\n<script>alert('This is a reflection XSS');</script>\n\n<img src="invalid.jpg" alt="图片测试" onerror="alert('XSS via onerror');" />\n\n<a href="http://your-vulnerable-site.com/?param=<script>alert('XSS');</script>">Click here</a>\n\n<svg onload="alert('XSS via SVG!')"></svg>
`;

const App = () => <XMarkdown content={content} />;

export default App;
