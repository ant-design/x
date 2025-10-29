import { RedoOutlined } from '@ant-design/icons';
import { Conversations, type ConversationsProps } from '@ant-design/x';
import type { GetProp } from 'antd';
import { Avatar, Divider, Spin, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetProp<ConversationsProps, 'items'>>([]);

  const { token } = theme.useToken();

  // Customize the style of the container
  const style = {
    width: 280,
    height: 600,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    overflow: 'auto',
  };

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
    <div id="scrollableDiv" style={style}>
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
        style={{ overflow: 'hidden' }}
      >
        <Conversations items={data} defaultActiveKey="demo1" groupable />
      </InfiniteScroll>
    </div>
  );
};

export default App;
