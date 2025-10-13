import { Bubble } from '@ant-design/x';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: 'Bubble 根元素',
    'divider.root': 'Divider 根元素，包含边框顶部样式、分隔线样式等分割线容器的基础样式',
    'divider.content': 'Divider 内容元素，包含行内块显示、内边距等分割线文本内容的样式',
    'divider.rail': 'Divider 背景条元素，包含边框顶部样式等分割线连接条的样式',
  },
  en: {
    root: 'Root element of Bubble',
    'divider.root':
      'Root element of Divider with border-top style, divider styling and other basic divider container styles',
    'divider.content':
      'Content element of Divider with inline-block display, padding and other divider text content styles',
    'divider.rail':
      'Background rail element of Divider with border-top style and other divider connection line styles',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName="Bubble"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'divider.root', desc: locale['divider.root'] },
        { name: 'divider.content', desc: locale['divider.content'] },
        { name: 'divider.rail', desc: locale['divider.rail'] },
      ]}
    >
      <Bubble.Divider content="Feel free to use Ant Design !" />
    </SemanticPreview>
  );
};

export default App;
