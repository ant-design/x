import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import type { ConversationsProps } from '@ant-design/x';
import { Conversations } from '@ant-design/x';
import type { GetProp } from 'antd';
import { Flex, Switch, theme } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [deepSearchChecked, setDeepSearchChecked] = useState(false);
  // Customize the style of the container
  const style = {
    width: 256,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
  };

  const items: GetProp<ConversationsProps, 'items'> = [
    {
      key: 'write',
      label: 'Help Me Write',
      icon: <SignatureOutlined />,
    },
    {
      key: 'coding',
      label: 'AI Coding',
      icon: <CodeOutlined />,
    },
    {
      key: 'createImage',
      label: 'Create Image',
      icon: <FileImageOutlined />,
    },
    {
      key: 'deepSearch',
      disabled: !deepSearchChecked,
      label: (
        <Flex gap="small" align="center">
          Deep Search
          <Switch size="small" checked={deepSearchChecked} onChange={setDeepSearchChecked} />
        </Flex>
      ),
      icon: <FileSearchOutlined />,
    },
  ];

  return <Conversations items={items} defaultActiveKey="write" style={style} />;
};

export default App;
