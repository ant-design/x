import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import { Typography } from 'antd';
import XMarkdown from '@ant-design/x-markdown';

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const renderMarkdown: BubbleProps['messageRender'] = (content) => {
  return (
    <Typography>
      <XMarkdown content={content} />
    </Typography>
  );
};

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
        messageRender={renderMarkdown}
        avatar={{ icon: <UserOutlined /> }}
      />
    </div>
  );
};

export default App;
