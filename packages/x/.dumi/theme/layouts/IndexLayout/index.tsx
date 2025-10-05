import { Helmet } from 'dumi';
import type { PropsWithChildren } from 'react';
import React, { useState } from 'react';

import Footer from '../../slots/Footer';
import Provider from './Provider';

interface IndexLayoutProps {
  title?: string;
  desc?: string;
}

const IndexLayout: React.FC<PropsWithChildren<IndexLayoutProps>> = (props) => {
  const { children, title, desc } = props;
  const [isOnAgent, setIsOnAgent] = useState<boolean>(false);
  return (
    <Provider
      agentInfo={{
        setIsOnAgent,
        isOnAgent,
      }}
    >
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>{children}</div>
      {isOnAgent ? null : <Footer />}
    </Provider>
  );
};

export default IndexLayout;
