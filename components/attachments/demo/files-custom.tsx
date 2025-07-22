import {
  AudioFilled,
  CopyFilled,
  FileImageFilled,
  RobotOutlined,
  VideoCameraFilled,
} from '@ant-design/icons';
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
      icon: <RobotOutlined style={{ color: 'rgb(250, 183, 20)' }} />,
      type: 'file',
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 333333,
      icon: <FileImageFilled style={{ color: 'rgb(22, 119, 255)' }} />,
      type: 'file',
    },
    {
      uid: '3',
      name: 'pdf-file.pdf',
      size: 444444,
      icon: <CopyFilled style={{ color: 'rgb(140, 140, 140)' }} />,
      type: 'file',
    },
    {
      uid: '4',
      name: 'video-file.mp4',
      size: 666666,
      icon: <VideoCameraFilled style={{ color: 'rgb(255, 77, 79)' }} />,
      type: 'file',
    },
    {
      uid: '5',
      name: 'audio-file.mp3',
      size: 777777,
      icon: <AudioFilled style={{ color: 'rgb(255, 110, 49)' }} />,
      type: 'file',
    },
    {
      uid: '6',
      name: 'image name without file ext',
      size: 888888,
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      type: 'image',
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
