import { PlayCircleOutlined, RedoOutlined } from '@ant-design/icons';
import type { TaskItem } from '@ant-design/x';
import { Task } from '@ant-design/x';
import { Button, Flex, Typography } from 'antd';
import React from 'react';

const initialTask: TaskItem = {
  id: 'release-report',
  title: 'Generate release report',
  description: 'Collect changes, test results, and deployment notes',
  status: 'pending',
  progress: 0,
};

const App = () => {
  const [item, setItem] = React.useState(initialTask);

  const advance = () => {
    setItem((current) => {
      const progress = Math.min(1, (current.progress ?? 0) + 0.25);
      return {
        ...current,
        progress,
        status: progress === 1 ? 'completed' : 'running',
        result: progress === 1 ? { sections: 6, checks: 'passed' } : undefined,
      };
    });
  };

  return (
    <Flex vertical gap={12}>
      <Task item={item}>
        <Typography.Text type="secondary">
          Reading changelog entries and CI results from the current release branch.
        </Typography.Text>
      </Task>
      <Flex gap={8}>
        <Button
          icon={<PlayCircleOutlined />}
          disabled={item.status === 'completed'}
          onClick={advance}
        >
          Advance
        </Button>
        <Button icon={<RedoOutlined />} onClick={() => setItem(initialTask)}>
          Reset
        </Button>
      </Flex>
    </Flex>
  );
};

export default App;
