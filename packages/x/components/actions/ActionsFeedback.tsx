import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { useLocale } from '../locale';
import enUS from '../locale/en_US';
import { useXProviderContext } from '../x-provider';

import useStyle from './style';

enum FEEDBACK_VALUE {
  like = 'like',
  dislike = 'dislike',
  default = 'default',
}

export interface ActionsFeedbackProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * @desc 反馈状态值
   * @descEN Feedback status value
   */
  value?: `${FEEDBACK_VALUE}`;
  /**
   * @desc 反馈状态变化回调
   * @descEN Feedback status change callback
   */
  onChange?: (value: `${FEEDBACK_VALUE}`) => void;

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
    value = 'default',
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

  const [contextLocale] = useLocale('Actions', enUS.Actions);

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
      {[FEEDBACK_VALUE.default, FEEDBACK_VALUE.like].includes(value as FEEDBACK_VALUE) && (
        <Tooltip title={contextLocale.feedbackLike}>
          <span
            onClick={() =>
              onChange?.(
                value === FEEDBACK_VALUE.like ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.like,
              )
            }
            className={styles.feedbackItem}
            data-testid="feedback-like"
          >
            {value === FEEDBACK_VALUE.like ? <LikeFilled /> : <LikeOutlined />}
          </span>
        </Tooltip>
      )}

      {[FEEDBACK_VALUE.default, FEEDBACK_VALUE.dislike].includes(value as FEEDBACK_VALUE) && (
        <Tooltip title={contextLocale.feedbackDislike}>
          <span
            onClick={() =>
              onChange?.(
                value === FEEDBACK_VALUE.dislike ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.dislike,
              )
            }
            className={styles.feedbackItem}
            data-testid="feedback-dislike"
          >
            {value === FEEDBACK_VALUE.dislike ? <DislikeFilled /> : <DislikeOutlined />}
          </span>
        </Tooltip>
      )}
    </Space>
  );
};

export default ActionsFeedback;
