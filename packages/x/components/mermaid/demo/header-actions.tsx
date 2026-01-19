import { EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Mermaid } from '@ant-design/x';
import { Checkbox, message, Space } from 'antd';
import React, { useState } from 'react';

const App: React.FC = () => {
  const [enableZoom, setEnableZoom] = useState(true);
  const [enableDownload, setEnableDownload] = useState(true);
  const [enableCopy, setEnableCopy] = useState(true);
  const [showCustom, setShowCustom] = useState(false);

  const customActions = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onItemClick: () => {
        message.info('Edit button clicked');
      },
    },
    {
      key: 'share',
      icon: <ShareAltOutlined />,
      label: 'Share',
      onItemClick: () => {
        message.success('Chart link copied to clipboard');
      },
    },
  ];

  const actions = {
    enableZoom,
    enableDownload,
    enableCopy,
    ...(showCustom && { customActions }),
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16, color: '#1a1a1a' }}>Header Actions Configuration</h2>
        <Space size="large" wrap>
          <Checkbox checked={enableZoom} onChange={(e) => setEnableZoom(e.target.checked)}>
            Enable Zoom
          </Checkbox>
          <Checkbox checked={enableDownload} onChange={(e) => setEnableDownload(e.target.checked)}>
            Enable Download
          </Checkbox>
          <Checkbox checked={enableCopy} onChange={(e) => setEnableCopy(e.target.checked)}>
            Enable Copy
          </Checkbox>
          <Checkbox checked={showCustom} onChange={(e) => setShowCustom(e.target.checked)}>
            Show Custom Actions
          </Checkbox>
        </Space>
      </div>

      <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
        <Mermaid actions={actions}>
          {`flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]`}
        </Mermaid>
      </div>
    </div>
  );
};

export default App;
