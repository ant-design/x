import { OpenAIOutlined, SyncOutlined } from '@ant-design/icons';
import { Think } from '@ant-design/x';
import { css, Global } from '@emotion/react';
import { Button } from 'antd';
import React from 'react';

const App = () => {
  const [title, setTitle] = React.useState('Complete thinking');
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setTitle('deep thinking');

    setTimeout(() => {
      setLoading(false);
      setTitle('Complete thinking');
    }, 2000);
  };
  return (
    <>
      <div>
        <Button onClick={handleClick}>Run</Button>
      </div>
      <br />
      <Think title={title} blink loading={loading}>
        This is deep thinking content.
      </Think>
      <br />
      <Global
        styles={css`
        :root {
          @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
          }
        }
        `}
      />
      <Think
        title={title}
        loading={
          loading ? (
            <SyncOutlined style={{ fontSize: 12, animation: 'spin 1s linear infinite' }} />
          ) : (
            false
          )
        }
        icon={<OpenAIOutlined />}
      >
        Customize status icon.
      </Think>
    </>
  );
};

export default App;
