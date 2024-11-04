import { EllipsisOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Welcome } from '@ant-design/x';
import { Button, Space } from 'antd';
import React from 'react';

const Demo = () => {
  return (
    <Welcome
      variant="borderless"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*7iaeT54QpcQAAAAAAAAAAAAADgCCAQ/original"
      title="Hello, I'm Ant Design X"
      description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
      extra={
        <Space>
          <Button icon={<ShareAltOutlined />} />
          <Button icon={<EllipsisOutlined />} />
        </Space>
      }
    />
  );
};

export default Demo;
