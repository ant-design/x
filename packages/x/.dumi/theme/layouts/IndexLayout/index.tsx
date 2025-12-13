import { Helmet } from 'dumi';
import type { PropsWithChildren } from 'react';
import React from 'react';
import InViewSuspense from '../../slots/Content/InViewSuspense';

interface IndexLayoutProps {
  title?: string;
  desc?: string;
}

const IndexLayout: React.FC<PropsWithChildren<IndexLayoutProps>> = (props) => {
  const { children, title, desc } = props;
  const Footer = React.lazy(() => import('../../slots/Footer'));
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <InViewSuspense>
        <Footer />
      </InViewSuspense>
    </>
  );
};

export default IndexLayout;
