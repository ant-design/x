import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import React from 'react';

const App = () => {
  const onDownload = () => {
    const blob = new Blob(['123'], { type: 'text/plain' });
    const a = document.createElement('a');
    const href = URL.createObjectURL(blob);
    a.href = href;
    a.download = 'txt-file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  };

  return (
      <FileCard
        name="txt-file.txt"
        byte={1024}
        mask={
          <VerticalAlignBottomOutlined
            style={{ fontSize: 20 }}
            onClick={() => onDownload()}
          />
        }
      />
  );
};

export default App;
