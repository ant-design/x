import { AudioOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import { message, Pagination } from 'antd';
import React, { useState } from 'react';

import { FeedbackValue } from '../ActionsFeedback';

const Demo: React.FC = () => {
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackValue>('LIKE');
  const [curPage, setCurPage] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const items = [
    <Pagination
      simple
      current={curPage}
      onChange={(page) => setCurPage(page)}
      total={5}
      pageSize={1}
      key="pagination"
    />,
    <Actions.Feedback
      value={feedbackStatus}
      onChange={(val: FeedbackValue) => setFeedbackStatus(val)}
      key="feedback"
    />,
    {
      key: 'copy',
      label: 'copy',
      icon: <CopyOutlined />,
      onItemClick: () => {
        navigator.clipboard
          .writeText('This is a text to be copied')
          .then(() => message.success('Copied successfully'))
          .catch(() => message.error('Copy failed'));
      },
    },
    {
      key: 'read',
      label: 'read',
      icon: isSpeaking ? <LoadingOutlined /> : <AudioOutlined />,
      onItemClick: () => {
        const utterance = new SpeechSynthesisUtterance('This is a text to be read');
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
        message.success('Text read aloud');
      },
    },
  ];

  return <Actions items={items} />;
};

export default Demo;
