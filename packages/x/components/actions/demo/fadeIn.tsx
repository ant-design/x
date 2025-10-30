import { RedoOutlined } from '@ant-design/icons';
import { Actions, ActionsProps } from '@ant-design/x';
import { Button, Flex, message, Pagination } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

const LOCALE_MARKDOWN = {
  'en-US': {
    reRender: 'Re-Render',
  },
  'zh-CN': {
    reRender: '重新渲染',
  },
};

const App: React.FC = () => {
  const { locale } = useIntl();
  // pagination
  const [curPage, setCurPage] = useState(1);
  const [key, setKey] = useState(0);

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
      <Button style={{ alignSelf: 'flex-end' }} onClick={() => setKey(key + 1)}>
        {LOCALE_MARKDOWN[locale as keyof typeof LOCALE_MARKDOWN].reRender}
      </Button>

      <Actions key={key} fadeIn items={actionItems} onClick={onClick} variant="borderless" />
    </Flex>
  );
};

export default App;
