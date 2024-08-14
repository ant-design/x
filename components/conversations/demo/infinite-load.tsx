import React, { useEffect, useState } from 'react';
import { Conversations, type ConversationsProps } from '@ant-design/x';
import { Avatar, Divider, Spin, Card, type GetProp } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RedoOutlined } from '@ant-design/icons';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetProp<ConversationsProps, 'data'>>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then((res) => res.json())
      .then((body) => {
        const formmatedData = body.results.map((i: any) => ({
          key: i.email,
          label: `${i.name.title} ${i.name.first} ${i.name.last}`,
          icon: <Avatar src={i.picture.thumbnail} />,
          group: i.nat,
        }));

        setData([...data, ...formmatedData]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <Card
      id="scrollableDiv"
      style={{
        height: 600,
        width: 320,
        overflow: 'auto',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={
          <div style={{ textAlign: 'center' }}>
            <Spin indicator={<RedoOutlined spin />} size="small" />
          </div>
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
        style={{ width: 270 }}
      >
        <Conversations data={data} defaultActiveKey="demo1" groupable />
      </InfiniteScroll>
    </Card>
  );
};

export default App;
