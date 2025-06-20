import { MutedOutlined, SyncOutlined } from '@ant-design/icons';
import { Think } from '@ant-design/x';
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
      <Think title={title} loading={loading}>
        This is deep thinking content.
      </Think>
      <br />
      <Think title={title} loading={loading ? <SyncOutlined /> : false} icon={<MutedOutlined />}>
        Customize status icon.
      </Think>
    </>
  );
};

export default App;
