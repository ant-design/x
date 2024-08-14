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
    <Divider orientation={direction === 'ltr' ? 'left' : 'right'} plain>
      {children && <Typography.Text type="secondary">{children}</Typography.Text>}
    </Divider>
  );
};

export default GroupTitle;
