import React, { useEffect, useState } from 'react';
import { Conversations } from '@ant-design/x';
import { Avatar, Divider, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RedoOutlined } from '@ant-design/icons';

import type { ConversationProps } from '@ant-design/x';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConversationProps[]>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then((res) => res.json())
      .then((body) => {

        const formmatedData = body.results.map((i: any, index: number) => ({
          key: i.email,
          label: `${i.name.title} ${i.name.first} ${i.name.last}`,
          timestamp: 794620800 + index,
          icon: <Avatar  src={i.picture.thumbnail} />,
          group: i.nat,
        }))

        setData([
          ...data,
          ...formmatedData
        ]);
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
    <div
      id="scrollableDiv"
      style={{
        height: 600,
        width: 268,
        overflow: 'auto',
        padding: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<div style={{ textAlign: 'center' }}><Spin indicator={<RedoOutlined spin />} size="small" /></div>}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <Conversations data={data} defaultActiveKey="demo1" groupable />
      </InfiniteScroll>
    </div>
  );
};

export default App;
