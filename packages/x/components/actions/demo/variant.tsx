import { RedoOutlined } from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { Flex, message, Pagination } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  // pagination
  const [curPage, setCurPage] = useState(1);

  const actionItems = [
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage}
          onChange={(page) => setCurPage(page)}
          total={5}
          pageSize={1}
        />
      ),
    },
    {
      key: 'retry',
      icon: <RedoOutlined />,
      label: 'Retry',
    },
    {
      key: 'copy',
      label: 'copy',
      actionRender: () => {
        return <Actions.Copy text="copy value" />;
      },
    },
  ];
  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    // Logic for handling click events
    message.success(`you clicked ${keyPath.join(',')}`);
  };
  return (
    <Flex gap="middle" vertical>
      <Actions items={actionItems} onClick={onClick} variant="outlined" />
      <Actions items={actionItems} onClick={onClick} variant="filled" />
      <Actions items={actionItems} onClick={onClick} variant="borderless" />
    </Flex>
  );
};

export default App;
