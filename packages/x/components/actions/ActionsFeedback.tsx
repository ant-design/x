import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

export type FeedbackValue = 'LIKE' | 'DISLIKE' | '';

interface ActionsFeedbackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 反馈状态值
   * @descEN Feedback status value
   */
  value?: FeedbackValue;
  /**
   * @desc 反馈状态变化回调
   * @descEN Feedback status change callback
   */
  onChange?: (value: FeedbackValue) => void;

  /**
   * @desc 自定义样式前缀
   * @descEN Customize the component's prefixCls
   */
  prefixCls?: string;
  /**
   * @desc 根节点样式类
   * @descEN Root node style class.
   */
  rootClassName?: string;
}

const ActionsFeedback: React.FC<ActionsFeedbackProps> = (props) => {
  const {
    value,
    onChange,
    className,
    style,

    prefixCls: customizePrefixCls,
    rootClassName,
    ...otherHtmlProps
  } = props;

  const domProps = pickAttrs(otherHtmlProps, {
    attr: true,
    aria: true,
    data: true,
  });

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const feedbackCls = `${prefixCls}-feedback`;

  const useStyles = createStyles(({ token }) => ({
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
    [`${feedbackCls}-rtl`]: {
      direction: 'rtl',
    },
  }));

  const { styles } = useStyles();

  const mergedCls = classnames(feedbackCls, hashId, cssVarCls, rootClassName, className, {
    [`${feedbackCls}-rtl`]: direction === 'rtl',
  });

  return (
    <Space {...domProps} className={mergedCls} style={style}>
      {(value === '' || value === 'LIKE') && (
        <span
          onClick={() => onChange?.(value === 'LIKE' ? '' : 'LIKE')}
          className={styles.feedbackItem}
          data-testid="feedback-like"
        >
          {value === 'LIKE' ? <LikeFilled /> : <LikeOutlined />}
        </span>
      )}

      {(value === '' || value === 'DISLIKE') && (
        <span
          onClick={() => onChange?.(value === 'DISLIKE' ? '' : 'DISLIKE')}
          className={styles.feedbackItem}
          data-testid="feedback-dislike"
        >
          {value === 'DISLIKE' ? <DislikeFilled /> : <DislikeOutlined />}
        </span>
      )}
    </Space>
  );
};

export default ActionsFeedback;
