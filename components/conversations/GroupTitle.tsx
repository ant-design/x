import React from 'react';
import { Divider, Typography } from 'antd';
import { isValidGroupTitle } from './hooks/useGroupable';

import type { ConversationProps } from './interface';
import useConfigContext from '../config-provider/useConfigContext';

interface GroupTitleProps {
  group?: ConversationProps['group'];
};

const GroupTitle: React.FC<GroupTitleProps> = (props) => {
  const { direction } = useConfigContext();

  return (
    <li>
      <Divider
        orientation={direction === 'ltr' ? 'right' : 'left'}
        plain
      >
        {isValidGroupTitle(props.group) && <Typography.Text type="secondary">{props.group}</Typography.Text>}
      </Divider>
    </li>
  );
};

export default GroupTitle;