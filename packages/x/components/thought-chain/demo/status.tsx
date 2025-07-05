import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';
import { Button, Card } from 'antd';
import React from 'react';

function getStatusIcon(status: ThoughtChainItem['status']) {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'error':
      return <InfoCircleOutlined />;
    case 'loading':
      return <LoadingOutlined />;
    default:
      return undefined;
  }
}

const mockServerResponseData: ThoughtChainItem[] = [
  {
    title: 'Thought Chain Item - 1',
    status: 'success',
    description: 'status: success',
    icon: getStatusIcon('success'),
  },
  {
    title: 'Thought Chain Item - 2',
    status: 'error',
    description: 'status: error',
    icon: getStatusIcon('error'),
  },
];

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
};

function addChainItem() {
  mockServerResponseData.push({
    title: `Thought Chain Item - ${mockServerResponseData.length + 1}`,
    status: 'loading',
    icon: getStatusIcon('loading'),
    description: 'status: loading',
  });
}

async function updateChainItem(status: ThoughtChainItem['status']) {
  await delay(800);
  mockServerResponseData[mockServerResponseData.length - 1].status = status;
  mockServerResponseData[mockServerResponseData.length - 1].icon = getStatusIcon(status);
  mockServerResponseData[mockServerResponseData.length - 1].description = `status: ${status}`;
}

export default () => {
  const [items, setItems] = React.useState<ThoughtChainItem[]>(mockServerResponseData);
  const [loading, setLoading] = React.useState<boolean>(false);

  const mockStatusChange = async () => {
    await updateChainItem('error');
    setItems([...mockServerResponseData]);
    await updateChainItem('loading');
    setItems([...mockServerResponseData]);
    await updateChainItem('success');
    setItems([...mockServerResponseData]);
  };

  const onClick = async () => {
    setLoading(true);
    addChainItem();
    setItems([...mockServerResponseData]);
    await mockStatusChange();
    setLoading(false);
  };

  return (
    <Card style={{ width: 500 }}>
      <Button onClick={onClick} style={{ marginBottom: 16 }} loading={loading}>
        {loading ? 'Running' : 'Run Next'}
      </Button>
      <ThoughtChain items={items} />
    </Card>
  );
};
