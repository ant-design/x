import { Helmet } from 'dumi';
import type { PropsWithChildren } from 'react';
import React from 'react';

import Footer from '../../slots/Footer';

interface IndexLayoutProps {
  title?: string;
  desc?: string;
}

const IndexLayout: React.FC<PropsWithChildren<IndexLayoutProps>> = (props) => {
  const { children, title, desc } = props;
  return (
    <>
      <Helmet>
        <title>
          {title} - {desc}
        </title>
        <meta property="og:title" content={title} />
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      {children}
      <Footer />
    </>
  );
};

export default IndexLayout;
