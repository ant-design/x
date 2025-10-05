import { Helmet } from 'dumi';
import type { PropsWithChildren } from 'react';
import React, { useContext, useState } from 'react';

import Footer from '../../slots/Footer';
import Context from './Context';
import Provider from './Provider';

interface IndexLayoutProps {
  title?: string;
  desc?: string;
}

const IndexLayout: React.FC<PropsWithChildren<IndexLayoutProps>> = (props) => {
  const { children, title, desc } = props;
  const { isOnAgent } = useContext(Context);
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>{children}</div>
      {isOnAgent ? null : <Footer />}
    </>
  );
};

export default IndexLayout;
