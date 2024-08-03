import React from 'react';
import { Divider, Typography } from 'antd';

import type { GroupType } from './interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
export const __UNGROUPED = '__ungrouped';

interface DefaultGroupTitleProps {
  group?: GroupType;
};

const DefaultGroupTitle: React.FC<DefaultGroupTitleProps> = (props) => {

  const isValidGroupTitle = props.group !== undefined && props.group !== __UNGROUPED;

  return (
    <Divider orientation="left" plain>
      {isValidGroupTitle && <Typography.Text type="secondary">{props.group}</Typography.Text>}
    </Divider>
  );
};

export default DefaultGroupTitle;