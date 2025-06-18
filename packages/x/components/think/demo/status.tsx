import { MutedOutlined, SyncOutlined } from '@ant-design/icons';
import { Think } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';

const App = () => {
  const [statusText, setStatusText] = React.useState('deep thinking');
  const [loading, setLoading] = React.useState(true);

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
      <Button onClick={handleClick}>Run</Button>
      <Think content={'This is deep thinking content.'} statusText={statusText} loading={loading} />
      <Think
        content={'Customize status icon.'}
        statusText={statusText}
        loading={loading}
        statusIcon={<MutedOutlined />}
        loadingIcon={<SyncOutlined />}
      />
    </>
  );
};

export default App;
