import { Sender, type SenderProps } from '@ant-design/x';
import { Flex, Typography } from 'antd';
import React from 'react';

type SlotConfig = SenderProps['slotConfig'];

// A simple slot config so pasting lands inside the editable slot area.
const slotConfig: SlotConfig = [
  { type: 'text', value: 'Paste a code snippet or structured text: ' },
];

const App: React.FC = () => {
  return (
    <Flex vertical gap={16}>
      <div>
        <Typography.Text type="secondary">
          默认情况下，slot 模式粘贴会移除换行。使用 <code>pasteFilter</code> 可保留原始排版。
        </Typography.Text>
      </div>
      <Sender
        slotConfig={slotConfig}
        autoSize={{ minRows: 3, maxRows: 6 }}
        placeholder="Paste multi-line text here"
        // Return the raw pasted text as-is so line breaks survive the paste.
        pasteFilter={(text) => text}
      />
    </Flex>
  );
};

export default () => <App />;
