import React from 'react';
import { Divider, Typography } from 'antd';
import type { ConfigProviderProps, GetProp } from 'antd';

export interface GroupTitleProps {
  children?: React.ReactNode;
}

// User should not care about internal state.
// Which should pass by context instead.
export const GroupTitleContext = React.createContext<{
  direction?: GetProp<ConfigProviderProps, 'direction'>;
}>(null!);

const GroupTitle: React.FC<GroupTitleProps> = ({ children }) => {
  const { direction } = React.useContext(GroupTitleContext);

  return (
    <Divider orientation={direction === 'rtl' ? 'right' : 'left'} plain>
      {children && <Typography.Text type="secondary">{children}</Typography.Text>}
      {'111111111111111122222222222223333333111111111111111122222222222223333333111111111111111122222222222223333333111111111111111122222222222223333333'}
    </Divider>
  );
};

export default GroupTitle;
