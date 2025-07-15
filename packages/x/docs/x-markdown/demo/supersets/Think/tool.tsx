import { Bubble } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import { Button, Card, Flex } from 'antd';
import React from 'react';
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain } from '@ant-design/x';

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

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
};

const Thought = (props: { items: ThoughtChainItem[] }) => {
  const [items, setItems] = React.useState<ThoughtChainItem[]>(props.items);
  const [loading, setLoading] = React.useState<boolean>(false);

  function addChainItem(): ThoughtChainItem {
    return {
      title: `Thought Chain Item - ${items.length + 1}`,
      status: 'loading',
      icon: getStatusIcon('loading'),
      description: 'status: loading',
    };
  }

  async function updateChainItem(status: ThoughtChainItem['status']) {
    await delay(800);
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const lastItem = { ...newItems[newItems.length - 1] };

      lastItem.status = status;
      lastItem.icon = getStatusIcon(status);
      lastItem.description = `status: ${status}`;

      newItems[newItems.length - 1] = lastItem;
      return newItems;
    });
  }

  const mockStatusChange = async () => {
    await updateChainItem('error');
    await updateChainItem('loading');
    await updateChainItem('success');
  };

  const onClick = async () => {
    setLoading(true);
    const item = addChainItem();
    setItems([...items, item]);
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

const text = `<div><thought>[{"title":"Thought Chain Item - 1","status":"success","description":"status: success"},{"title":"Thought Chain Item - 2","status":"error","description":"status: error"}]</thought></div>
`;

const App = () => {
  return (
    <Flex vertical gap="small">
      <Bubble
        typing={{ step: 50, interval: 150 }}
        content={text}
        messageRender={(content) => (
          <XMarkdown
            components={{
              thought: (props: { children: string }) => {
                if (props.children.endsWith('}]')) {
                  const data = JSON.parse(props.children) as ThoughtChainItem[];
                  return <Thought items={data} />;
                }
              },
            }}
          >
            {content}
          </XMarkdown>
        )}
        avatar={{
          src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp',
        }}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
