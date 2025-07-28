import { SearchOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Flex } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const [value, setValue] = React.useState<boolean>(false);

  return (
    <Flex vertical gap="middle">
      <Sender.Switch icon={<SearchOutlined />}>Deep Search</Sender.Switch>
      <Sender.Switch
        checkedChildren={'Deep Search: on'}
        unCheckedChildren={'Deep Search: off'}
        icon={<SearchOutlined />}
      />
      <Sender.Switch disabled icon={<SearchOutlined />}>
        Deep Search
      </Sender.Switch>
      <Sender.Switch loading icon={<SearchOutlined />}>
        Deep Search
      </Sender.Switch>
      <Sender.Switch
        icon={<SearchOutlined />}
        defaultValue={true}
        onChange={(checked) => {
          console.log('Switch toggled', checked);
        }}
      >
        Deep Search
      </Sender.Switch>
      <Sender.Switch icon={<SearchOutlined />} value={value} onChange={setValue}>
        Deep Search
      </Sender.Switch>
    </Flex>
  );
};

export default () => <App />;
