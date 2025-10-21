import { GithubOutlined, TwitterOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Sources } from '@ant-design/x';
import React from 'react';

const App = () => {
  const items = [
    {
      title: 'Data source from twitter',
      url: 'https://x.ant.design/components/overview',
      icon: <TwitterOutlined />,
    },
    {
      title: 'Data source from youtube',
      url: 'https://x.ant.design/components/overview',
      icon: <YoutubeOutlined />,
    },
    {
      title: 'Data source from github',
      url: 'https://x.ant.design/components/overview',
      icon: <GithubOutlined />,
    },
  ];

  return (
    <>
      <Sources title={'Used 3 sources'} items={items} expandIconPosition={'end'} />
    </>
  );
};

export default App;
