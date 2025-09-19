import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import type { ThoughtChainItemType } from '@ant-design/x';
import { Bubble, ThoughtChain } from '@ant-design/x';
import XMarkdown, { ComponentProps } from '@ant-design/x-markdown';
import { Avatar, Button, Card, Flex, Spin } from 'antd';
import React from 'react';

function getStatusIcon(status: ThoughtChainItemType['status']) {
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

const Thought = (props: { items: ThoughtChainItemType[] }) => {
  const [items, setItems] = React.useState<ThoughtChainItemType[]>(props.items);
  const [loading, setLoading] = React.useState<boolean>(false);

  function addChainItem(): ThoughtChainItemType {
    return {
      title: `Thought Chain Item - ${items.length + 1}`,
      status: 'loading',
      icon: getStatusIcon('loading'),
      description: 'status: loading',
    };
  }

  async function updateChainItem(status: ThoughtChainItemType['status']) {
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

const ThoughtComponent = (props: ComponentProps) => {
  if (props.streamStatus === 'loading') {
    return <Spin />;
  }

  if (typeof props.children !== 'string') {
    return null;
  }

  const data = JSON.parse(props.children) as ThoughtChainItemType[];
  return <Thought items={data} />;
};

const App = () => {
  return (
    <Flex vertical gap="small">
      <Bubble
        typing={{ effect: 'typing', step: 50, interval: 150 }}
        content={text}
        contentRender={(content) => (
          <XMarkdown
            components={{
              thought: ThoughtComponent,
            }}
          >
            {content}
          </XMarkdown>
        )}
        components={{
          avatar: (
            <Avatar src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp" />
          ),
        }}
        variant="outlined"
      />
    </Flex>
  );
};

export default App;
