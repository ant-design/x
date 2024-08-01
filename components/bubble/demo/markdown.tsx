/* eslint-disable react/no-danger */
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import markdownit from 'markdown-it';
import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Typography } from 'antd';

const md = markdownit({ html: true, breaks: true });

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const contentRender: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const App = () => {
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    const id = setTimeout(
      () => {
        setRenderKey((prev) => prev + 1);
      },
      text.length * 100 + 2000,
    );

    return () => {
      clearTimeout(id);
    };
  }, [renderKey]);

  return (
    <div style={{ height: 100 }} key={renderKey}>
      <Bubble
        typing
        content={text}
        messageRender={contentRender}
        avatar={{ icon: <UserOutlined /> }}
      />
    </div>
  );
};

export default App;
