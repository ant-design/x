import { Helmet } from 'dumi';
import * as React from 'react';

const WrapHelmet: React.FC<React.PropsWithChildren<Helmet['props']>> = (props) => (
  <Helmet {...props} />
);

export default WrapHelmet;
