import React from 'react';
import { Divider, Typography } from 'antd';

import type { GroupType, ConversationsProps } from './interface';
import type { DirectionType } from 'antd/es/config-provider';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
export const __UNGROUPED = '__ungrouped';

interface GroupTitleProps {
  group?: GroupType;
  groupable?: ConversationsProps['groupable'];
  direction?: DirectionType;
};

const GroupTitle: React.FC<GroupTitleProps> = (props) => {
  const { groupable, group, direction } = props;

  const groupTitle = React.useMemo(() => {
    if (
      typeof groupable === 'object'
      && typeof groupable?.title === 'function'
      && group !== undefined
    ) {
      return groupable.title(group);
    }

    const isValidGroupTitle = group !== undefined && group !== __UNGROUPED;

    return (
      <Divider
        orientation={direction === 'ltr' ? 'right' : 'left'}
        plain
      >
        {isValidGroupTitle && <Typography.Text type="secondary">{group}</Typography.Text>}
      </Divider>
    )
  }, [groupable, group, direction]);

  return (
    <li id={group}>
      {groupTitle}
    </li>
  );
};

export default GroupTitle;