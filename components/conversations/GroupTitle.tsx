import React from 'react';
import { Divider, Typography } from 'antd';
import type { ConfigProviderProps, GetProp } from 'antd';

export interface GroupTitleProps {
  group?: string;
  direction?: GetProp<ConfigProviderProps, 'direction'>;
}

const GroupTitle: React.FC<GroupTitleProps> = (props) => (
  <Divider orientation={props?.direction === 'ltr' ? 'left' : 'right'} plain>
    {props?.group && <Typography.Text type="secondary">{props.group}</Typography.Text>}
  </Divider>
);

export default GroupTitle;
