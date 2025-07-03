import React from 'react';
import { Space, message } from 'antd';
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ token }) => ({
  feedbackItem: {
    padding: token.paddingXXS,
    borderRadius: token.borderRadius,
    height: token.controlHeightSM,
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: token.colorBgTextHover,
    },
  },
}));

export type FeedbackValue = 'LIKE' | 'DISLIKE' | '';

interface Props {
  value?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
}

const ActionsFeedback = (props: Props) => {
  const { value, onChange } = props;
  const { styles } = useStyle();

  return (
    <Space>
      {(value === '' || value === 'LIKE') && (
        <span
          onClick={() => {
            message.success('Like successful');
            onChange?.(value === 'LIKE' ? '' : 'LIKE');
          }}
          className={styles.feedbackItem}
        >
          {value === 'LIKE' ? <LikeFilled /> : <LikeOutlined />}
        </span>
      )}

      {(value === '' || value === 'DISLIKE') && (
        <span
          onClick={() => {
            message.success('Dislike successful');
            onChange?.(value === 'DISLIKE' ? '' : 'DISLIKE');
          }}
          className={styles.feedbackItem}
        >
          {value === 'DISLIKE' ? <DislikeFilled /> : <DislikeOutlined />}
        </span>
      )}
    </Space>
  );
};

export default ActionsFeedback;
