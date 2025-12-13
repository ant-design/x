import { SearchOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const [value, setValue] = React.useState<boolean>(false);

  return (
    <Flex vertical gap="middle">
      <Flex align="center" gap="small">
        Default: <Sender.Switch icon={<SearchOutlined />}>Deep Search</Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Custom checked/unchecked content:
        <Sender.Switch
          checkedChildren={'Deep Search: on'}
          unCheckedChildren={'Deep Search: off'}
          icon={<SearchOutlined />}
        />
      </Flex>
      <Flex align="center" gap="small">
        Disabled:
        <Sender.Switch disabled icon={<SearchOutlined />}>
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Loading:
        <Sender.Switch loading icon={<SearchOutlined />}>
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        DefaultValue:
        <Sender.Switch
          icon={<SearchOutlined />}
          defaultValue={true}
          onChange={(checked) => {
            console.log('Switch toggled', checked);
          }}
        >
          Deep Search
        </Sender.Switch>
      </Flex>
      <Flex align="center" gap="small">
        Controlled mode:
        <Sender.Switch icon={<SearchOutlined />} value={value} onChange={setValue}>
          Deep Search
        </Sender.Switch>
      </Flex>
    </Flex>
  );
};

export default () => <App />;
