/* eslint-disable react/no-danger */
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import markdownit from 'markdown-it';
import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';

const sentences = [
  '# Title \n An enterprise-class UI design language and React UI library. \n ...丨',
  '# 标题 \n 企业级产品设计体系，创造高效愉悦的工作体验。\n ...丨',
];

const md = markdownit({ html: true, breaks: true });

const useLoopSentence = () => {
  const [index, setIndex] = React.useState<number>(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => {
    timerRef.current = setTimeout(
      () => setIndex((prevState) => (prevState ? 0 : 1)),
      sentences[index].length * 100 + 1000,
    );
    return () => clearTimeout(timerRef.current);
  }, [index]);
  return sentences[index];
};

const contentRender: BubbleProps['contentRender'] = (content) => {
  if (!content) {
    return null;
  }
  return <span dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
};

const App = () => {
  const content = useLoopSentence();
  return (
    <Bubble
      typing
      content={content}
      contentRender={contentRender}
      avatar={{ icon: <UserOutlined /> }}
    />
  );
};

export default App;
