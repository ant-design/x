import React from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainItem } from '@ant-design/x';
import { Card, Button } from 'antd';

const mockServerResponseData: ThoughtChainItem[] = [
  { title: 'Thought Chain Item - 1', status: 'success', description: 'status: success' },
  { title: 'Thought Chain Item - 1', status: 'error', description: 'status: error' },
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
    status: 'pending',
    description: 'status: pending',
  });
}

async function updateChainItem(status: ThoughtChainItem['status']) {
  await delay(800);
  mockServerResponseData[mockServerResponseData.length - 1].status = status;
  mockServerResponseData[mockServerResponseData.length - 1].description = `status: ${status}`;
}

export default () => {
  const [items, setItems] = React.useState<ThoughtChainItem[]>(mockServerResponseData);
  const [loading, setLoading] = React.useState<boolean>(false);

  const mockStatusChange = async () => {
    await updateChainItem('error');
    setItems([...mockServerResponseData]);
    await updateChainItem('pending');
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
