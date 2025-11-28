import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import clsx from 'clsx';
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

export type SemanticType = 'like' | 'liked' | 'dislike' | 'disliked' | 'root';
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
  /**
   * @desc 语义化结构 className
   * @descEN Semantic structure class names
   */
  classNames?: Partial<Record<SemanticType, string>>;
  /**
   * @desc 语义化结构 style
   * @descEN Semantic structure styles
   */
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
}

const ActionsFeedback: React.FC<ActionsFeedbackProps> = (props) => {
  const {
    value = 'default',
    onChange,
    className,
    style,
    classNames = {},
    styles = {},
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

  // ============================ Prefix ============================

  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const feedbackCls = `${prefixCls}-feedback`;

  // ============================ Classname ============================
  const mergedCls = clsx(
    feedbackCls,
    hashId,
    cssVarCls,
    rootClassName,
    classNames.root,
    `${prefixCls}-list`,
    className,
    {
      [`${feedbackCls}-rtl`]: direction === 'rtl',
    },
  );

  const onFeedBacKClick = () =>
    onChange?.(value === FEEDBACK_VALUE.dislike ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.dislike);
  return (
    <div {...domProps} className={mergedCls} style={{ ...style, ...styles.root }}>
      {[FEEDBACK_VALUE.default, FEEDBACK_VALUE.like].includes(value as FEEDBACK_VALUE) && (
        <Tooltip title={contextLocale.feedbackLike}>
          <span
            onClick={() =>
              onChange?.(
                value === FEEDBACK_VALUE.like ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.like,
              )
            }
            style={{ ...styles.like, ...(value === 'like' ? styles.liked : {}) }}
            className={clsx(
              `${feedbackCls}-item`,
              `${prefixCls}-item`,
              `${feedbackCls}-item-like`,
              classNames.like,
              {
                [`${classNames.liked}`]: classNames.liked && value === 'like',
                [`${feedbackCls}-item-like-active`]: value === 'like',
              },
            )}
          >
            {value === FEEDBACK_VALUE.like ? <LikeFilled /> : <LikeOutlined />}
          </span>
        </Tooltip>
      )}

      {[FEEDBACK_VALUE.default, FEEDBACK_VALUE.dislike].includes(value as FEEDBACK_VALUE) && (
        <Tooltip title={contextLocale.feedbackDislike}>
          <span
            onClick={onFeedBacKClick}
            style={{ ...styles.dislike, ...(value === 'dislike' ? styles.disliked : {}) }}
            className={clsx(
              `${feedbackCls}-item`,
              `${prefixCls}-item`,
              `${feedbackCls}-item-dislike`,
              classNames.dislike,
              {
                [`${classNames.disliked}`]: classNames.disliked && value === 'like',
                [`${feedbackCls}-item-dislike-active`]: value === 'dislike',
              },
            )}
          >
            {value === FEEDBACK_VALUE.dislike ? <DislikeFilled /> : <DislikeOutlined />}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default ActionsFeedback;
