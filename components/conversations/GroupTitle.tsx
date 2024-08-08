import React from 'react';
import { Divider, Typography } from 'antd';

import type { DirectionType } from 'antd/es/config-provider';
import type { ConversationProps } from './interface';

interface GroupTitleProps {
  group?: ConversationProps['group'];
  direction?: DirectionType;
};

const GroupTitle: React.FC<GroupTitleProps> = (props) => (
  <Divider
    orientation={props?.direction === 'ltr' ? 'left' : 'right'}
    plain
  >
    {props?.group && <Typography.Text type="secondary">{props.group}</Typography.Text>}
  </Divider>
);

export default GroupTitle;