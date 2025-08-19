import { CheckOutlined, CloseOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Actions } from '@ant-design/x';
import type { ActionsFeedbackProps, ActionsItemProps } from '@ant-design/x';
import { Button, Flex, message, Pagination } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const useStyles = createStyles(({ css, token }) => ({
  feedbackFooter: css`
    border: 1px solid ${token.colorBorderSecondary};
    padding: 8px;
    border-radius: 8px;
    margin-top: 12px;
  `,
  gridContainer: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 12px 0;
  `,
  tagItem: css`
    background: ${token.colorFillSecondary};
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

const App: React.FC = () => {
  const { styles } = useStyles();

  // pagination
  const [curPage, setCurPage] = useState(1);
  // feedback
  const [feedbackStatus, setFeedbackStatus] = useState<ActionsFeedbackProps['value']>('default');
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false);
  // audio
  const [audioStatus, setAudioStatus] = useState<ActionsItemProps['status']>('default');
  // share
  const [shareStatus, setShareStatus] = useState<ActionsItemProps['status']>('default');


  const onClick = (type: 'share' | 'audio') => {
    let timer: NodeJS.Timeout | null = null;
    const dispatchFN = type === 'share' ? setShareStatus : setAudioStatus
    switch (shareStatus) {
      case 'default':
        dispatchFN('loading')
        timer = setTimeout(() => {
          timer && clearTimeout(timer);
          dispatchFN('running');
        }, 1500);
        break;
      case 'running':
        dispatchFN('loading');
        timer = setTimeout(() => {
          timer && clearTimeout(timer);
          dispatchFN('default')
        }, 1500);
        break;
    }
  }

  const feedbackFooter = (
    <div className={styles.feedbackFooter}>
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
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage}
          onChange={(page) => setCurPage(page)}
          total={5}
          pageSize={1}
        />
      ),
    },
    {
      key: 'feedback',
      actionRender: () => (
        <Actions.Feedback
          value={feedbackStatus}
          onChange={(val) => {
            setFeedbackStatus(val);
            setFeedbackPopupOpen(val === 'like');
            message.success(`Change feedback value to: ${val}`);
          }}
          key="feedback"
        />
      ),
    },
    {
      key: 'copy',
      label: 'copy',
      actionRender: () => {
        return <Actions.Copy text='copy value' />
      }
    },
    {
      key: 'audio',
      label: 'audio',
      actionRender: () => {
        return <Actions.Audio onClick={() => onClick('audio')} status={audioStatus} />
      }
    },
    {
      key: 'share',
      label: 'share',
      actionRender: () => {
        return <Actions.Item onClick={() => onClick('share')} label={shareStatus} status={shareStatus} defaultIcon={<ShareAltOutlined />} runningIcon={<CheckOutlined />} />
      }
    },
  ];

  return <Actions items={items} footer={feedbackPopupOpen ? feedbackFooter : undefined} />;
};

export default App;
