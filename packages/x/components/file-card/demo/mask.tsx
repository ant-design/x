import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { FileCard } from '@ant-design/x';
import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <FileCard
        name="example-document.pdf"
        byte={1024000}
        description="这是一个PDF文档"
        mask={
          <div style={{ display: 'flex', gap: 8 }}>
            <EyeOutlined />
            <DownloadOutlined />
          </div>
        }
      />

      <FileCard
        name="image.jpg"
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        type="image"
        mask={
          <div style={{ display: 'flex', gap: 8, color: '#fff' }}>
            <span>预览</span>
            <span>下载</span>
          </div>
        }
      />

      <FileCard
        name="video.mp4"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        type="video"
        mask={(info) => (
          <div>
            <div>播放视频</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{info.name}</div>
          </div>
        )}
      />
    </div>
  );
};

export default App;
