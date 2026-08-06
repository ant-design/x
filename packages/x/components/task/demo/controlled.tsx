import { Task } from '@ant-design/x';
import { Switch } from 'antd';
import React from 'react';

const App = () => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Task
      item={{
        id: 'controlled-task',
        title: 'Build component package',
        description: 'Output ES modules and type declarations',
        status: 'completed',
        result: { files: 42, duration: '3.4s' },
      }}
      expanded={expanded}
      onExpandedChange={setExpanded}
      actions={
        <Switch
          size="small"
          checked={expanded}
          aria-label="Toggle task details"
          onChange={setExpanded}
        />
      }
    />
  );
};

export default App;
