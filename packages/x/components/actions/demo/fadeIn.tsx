import { RedoOutlined } from '@ant-design/icons';
import type { ActionsProps } from '@ant-design/x';
import { Actions } from '@ant-design/x';
import { Button, Flex, message, Pagination, Switch } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  // pagination
  const [curPage, setCurPage] = useState(1);
  const [key, setKey] = useState(0);
  const [fadeInLeft, setFadeInLeft] = useState(true);

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
      <Flex gap="middle" align="center">
        <Switch
          style={{ alignSelf: 'flex-end' }}
          checkedChildren="fadeInLeft"
          unCheckedChildren="fadeIn"
          value={fadeInLeft}
          onChange={setFadeInLeft}
        />
        <Button style={{ alignSelf: 'flex-end' }} onClick={() => setKey(key + 1)}>
          Re-Render
        </Button>
      </Flex>
      <Actions
        key={key}
        fadeIn={!fadeInLeft}
        fadeInLeft={fadeInLeft}
        items={actionItems}
        onClick={onClick}
        variant="borderless"
      />
    </Flex>
  );
};

export default App;
