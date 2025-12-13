import { CopyOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Flex, Tooltip } from 'antd';
import React from 'react';

const App = () => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="align left"
          avatar={
            <Tooltip title="main side">
              <Avatar icon={<UserOutlined />} />
            </Tooltip>
          }
          extra={
            <Tooltip title="extra side">
              <CopyOutlined />
            </Tooltip>
          }
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="align right"
          placement="end"
          avatar={
            <Tooltip title="main side">
              <Avatar icon={<UserOutlined />} />
            </Tooltip>
          }
          extra={
            <Tooltip title="extra side">
              <CopyOutlined />
            </Tooltip>
          }
        />
      </div>
    </Flex>
  </Flex>
);

export default App;
