import { AudioOutlined, CloseOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import { Button, Flex, message, Pagination } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { FeedbackValue } from '../ActionsFeedback';

const useStyles = createStyles(({ css }) => ({
  gridContainer: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
  `,
  tagItem: css`
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
  `,
  submitButton: css`
    width: 100px;
    border-radius: 12px;
  `,
}));

const Demo: React.FC = () => {
  const { styles } = useStyles();

  // pagination
  const [curPage, setCurPage] = useState(1);
  // feedback
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackValue>('');
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);
  // read
  const [isSpeaking, setIsSpeaking] = useState(false);

  const feedbackPopupRender = (
    <div style={{ border: '1px solid #eee', padding: 8, borderRadius: 8, marginTop: 12 }}>
      <Flex justify="space-between" align="center">
        <div>What are the main reasons you are satisfied? (Select all that apply)</div>
        <CloseOutlined onClick={() => setFeedbackPopupOpen(false)} />
      </Flex>

      <div className={styles.gridContainer}>
        {[
          'Matches my style',
          'Meets requirements',
          'Clear images',
          'Reasonable content',
          'Aesthetic images',
          'Others',
        ].map((text) => (
          <div key={text} className={styles.tagItem}>
            {text}
          </div>
        ))}
      </div>
      <Button variant="solid" color="purple" className={styles.submitButton}>
        Submit
      </Button>
    </div>
  );

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
      onChange={(val: FeedbackValue) => {
        setFeedbackStatus(val);
        setFeedbackPopupOpen(val === 'LIKE');
        message.success(`Feedback: ${val}`);
      }}
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

  return (
    <Actions items={items} popupRender={feedbackPopupOpen ? feedbackPopupRender : undefined} />
  );
};

export default Demo;
