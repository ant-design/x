import { Think } from '@ant-design/x';
import { Button, Space, Switch } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const [destroyOnHidden, setDestroyOnHidden] = useState(true);

  return (
    <Space direction="vertical" size={16}>
      <Space>
        <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand'}</Button>
        <Switch
          checked={destroyOnHidden}
          onChange={setDestroyOnHidden}
          checkedChildren="destroyOnHidden"
          unCheckedChildren="keep"
        />
      </Space>
      <Think
        title="Deep Thinking"
        expanded={expanded}
        onExpand={setExpanded}
        destroyOnHidden={destroyOnHidden}
      >
        This content will be removed from DOM when collapsed and destroyOnHidden is true.
      </Think>
    </Space>
  );
};

export default App;
