import { AudioFilled, CopyFilled, FileImageFilled, VideoCameraFilled } from '@ant-design/icons';
import { Attachments } from '@ant-design/x';
import { App, Flex } from 'antd';
import React from 'react';

const Demo = () => {
  const filesList: {
    uid: string;
    name: string;
    size: number;
    description?: string;
    thumbUrl?: string;
    url?: string;
    icon?: React.ReactNode;
    type?: 'file' | 'image';
  }[] = [
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
      icon: <CopyFilled />,
      type: 'file',
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 333333,
      icon: <FileImageFilled />,
      type: 'file',
    },
    {
      uid: '3',
      name: 'pdf-file.pdf',
      size: 444444,
      icon: <CopyFilled />,
      type: 'file',
    },
    {
      uid: '4',
      name: 'video-file.mp4',
      size: 666666,
      icon: <VideoCameraFilled />,
      type: 'file',
    },
    {
      uid: '5',
      name: 'audio-file.mp3',
      size: 777777,
      icon: <AudioFilled />,
      type: 'file',
    },
  ];

  return (
    <Flex vertical gap="middle">
      {filesList.map((file) => (
        <Attachments.FileCard key={file.uid} item={file} icon={file.icon} type={file.type} />
      ))}
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
