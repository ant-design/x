import { CopyOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble } from '@ant-design/x';
import { Avatar, Flex, Tooltip } from 'antd';
import React from 'react';

const App = () => (
  <Flex vertical gap="small">
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="左对齐"
          components={{
            avatar: (
              <Tooltip title="主侧">
                <Avatar icon={<UserOutlined />} />
              </Tooltip>
            ),
            extra: () => (
              <Tooltip title="扩展侧">
                <CopyOutlined />
              </Tooltip>
            ),
          }}
        />
      </div>
    </Flex>
    <Flex gap="small" wrap>
      <div style={{ width: '100%' }}>
        <Bubble
          content="右对齐"
          placement="end"
          components={{
            avatar: (
              <Tooltip title="主侧">
                <Avatar icon={<UserOutlined />} />
              </Tooltip>
            ),
            extra: () => (
              <Tooltip title="扩展侧">
                <CopyOutlined />
              </Tooltip>
            ),
          }}
        />
      </div>
    </Flex>
  </Flex>
);

export default App;
