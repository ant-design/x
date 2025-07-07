import { AudioFilled, CopyFilled, FileImageFilled, VideoCameraFilled } from '@ant-design/icons';
import { Attachments } from '@ant-design/x';
import { App, Flex } from 'antd';
import React from 'react';

const fileIcons = [
  {
    icon: <CopyFilled />,
    color: '#8c8c8c',
    ext: [
      'xlsx',
      'xls',
      'md',
      'mdx',
      'pdf',
      'ppt',
      'pptx',
      'doc',
      'docx',
      'zip',
      'rar',
      '7z',
      'tar',
      'gz',
    ],
  },
  {
    icon: <FileImageFilled />,
    color: '#8c8c8c',
    ext: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'],
  },
  {
    icon: <VideoCameraFilled />,
    color: '#8c8c8c',
    ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
  },
  {
    icon: <AudioFilled />,
    color: '#8c8c8c',
    ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
  },
];

const Demo = () => {
  const filesList = [
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 333333,
    },
    {
      uid: '3',
      name: 'pdf-file.pdf',
      size: 444444,
    },
    {
      uid: '4',
      name: 'video-file.mp4',
      size: 666666,
    },
    {
      uid: '5',
      name: 'audio-file.mp3',
      size: 777777,
    },
    {
      uid: '6',
      name: 'markdown-file.md',
      size: 999999,
      description: 'Custom description here',
    },
  ];

  return (
    <Flex vertical gap="middle">
      {filesList.map((file, index) => (
        <Attachments.FileCard fileIcons={fileIcons} key={index} item={file} />
      ))}
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
