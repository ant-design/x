import { MutedOutlined, SyncOutlined } from '@ant-design/icons';
import { Think } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';

const App = () => {
  const [statusText, setStatusText] = React.useState('Complete thinking');
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    setStatusText('deep thinking');

    setTimeout(() => {
      setLoading(false);
      setStatusText('Complete thinking');
    }, 2000);
  };
  return (
    <>
      <div>
        <Button onClick={handleClick}>Run</Button>
      </div>
      <br />
      <Think statusText={statusText} loading={loading}>
        This is deep thinking content.
      </Think>
      <br />
      <Think
        statusText={statusText}
        loading={loading ? <SyncOutlined /> : false}
        statusIcon={<MutedOutlined />}
      >
        Customize status icon.
      </Think>
    </>
  );
};

export default App;
