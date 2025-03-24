import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Flex, theme } from 'antd';
import React from 'react';

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex style={{ height: 350 }} align="end">
      <Sender
        prefix={
          <Button
            type="text"
            icon={<LinkOutlined />}
            onClick={() => {
              setOpen(!open);
            }}
          />
        }
        placeholder="← Click to open"
        onSubmit={() => {
          console.log('Send message successfully!');
        }}
      />
    </Flex>
  );
};

export default <App />;
