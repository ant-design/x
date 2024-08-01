import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';

const text = 'Ant Design X love you!';

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
    <Bubble
      key={renderKey}
      content={text}
      typing={{ step: 2, interval: 100 }}
      avatar={{ icon: <UserOutlined /> }}
    />
  );
};

export default App;
