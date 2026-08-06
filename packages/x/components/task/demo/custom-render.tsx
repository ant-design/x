import { CloudSyncOutlined } from '@ant-design/icons';
import { Task } from '@ant-design/x';
import { Progress, Tag, Typography } from 'antd';
import React from 'react';

const App = () => (
  <Task
    item={{
      id: 'custom-task',
      title: 'Synchronize knowledge base',
      status: 'running',
      progress: 0.73,
      result: { indexed: 238 },
    }}
    statusRender={() => <CloudSyncOutlined />}
    progressRender={(progress) => (
      <Progress percent={progress * 100} size="small" strokeColor="#1677ff" />
    )}
    resultRender={(result) => (
      <Typography.Text>
        Indexed <Tag color="blue">{(result as { indexed: number }).indexed}</Tag> documents
      </Typography.Text>
    )}
    actions={<Tag bordered={false}>Workspace</Tag>}
  />
);

export default App;
