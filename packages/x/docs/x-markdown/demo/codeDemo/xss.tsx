import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';

const content = `
<iframe src=\"javascript:alert('xss')\"></iframe>

<script>alert('This is a reflection XSS');</script>

<img src="invalid.jpg" onerror="alert('XSS via onerror');" />

<a href="http://your-vulnerable-site.com/?param=<script>alert('XSS');</script>">Click here</a>

<svg onload="alert('XSS via SVG!')"></svg>
`;

const App = () => <XMarkdown content={content} />;

export default App;
