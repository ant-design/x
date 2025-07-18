import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import { Modal } from 'antd';
import React from 'react';

const App = () => {
  return (
    <>
      <FileCard
        name="PDF文件名称.PDF"
        size={1024}
        mask={
          <VerticalAlignBottomOutlined
            style={{ fontSize: 20 }}
            onClick={() => {
              Modal.info({
                title: 'Modal',
                content: 'Click mask',
              });
            }}
          />
        }
      />
    </>
  );
};

export default App;
