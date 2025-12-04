import { Actions } from '@ant-design/x';
import { Divider } from 'antd';
import React from 'react';
import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    like: '喜欢',
    liked: '已喜欢',
    dislike: '不喜欢',
    disliked: '已不喜欢',
  },
  en: {
    root: 'Root',
    like: 'Like',
    liked: 'Liked',
    dislike: 'Dislike',
    disliked: 'Disliked',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <>
      <SemanticPreview
        componentName="Actions"
        semantics={[
          { name: 'root', desc: locale.root },
          { name: 'like', desc: locale.like },
          { name: 'dislike', desc: locale.dislike },
        ]}
      >
        <Actions.Feedback />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview componentName="Actions" semantics={[{ name: 'liked', desc: locale.liked }]}>
        <Actions.Feedback value="like" />
      </SemanticPreview>
      <Divider style={{ margin: 0, padding: 0 }} />
      <SemanticPreview
        componentName="Actions"
        semantics={[{ name: 'dislike', desc: locale.dislike }]}
      >
        <Actions.Feedback value="dislike" />
      </SemanticPreview>
    </>
  );
};

export default App;
