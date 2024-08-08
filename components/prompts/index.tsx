import React from 'react';
import classnames from 'classnames';
import { Button, Typography } from 'antd';

import useConfigContext from '../config-provider/useConfigContext';

import useStyle from './style';

import type { PromptsProps, PromptProps } from './interface';

const Prompts: React.FC<PromptsProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    className,
    data,
    onClick,
    vertical,
    wrap,
    rootClassName,
    styles,
    classNames,
    style,
    ...htmlProps
  } = props;

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useConfigContext();

  const prefixCls = getPrefixCls('prompts', customizePrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
    { [`${prefixCls}-rtl`]: direction === 'rtl' },
  );

  const mergedListCls = classnames(
    `${prefixCls}-list`,
    classNames?.list,
    { [`${prefixCls}-list-wrap`]: wrap },
    { [`${prefixCls}-list-vertical`]: vertical },
  );

  // ============================ Render ============================
  return wrapCSSVar(
    <div
      {...htmlProps}
      className={mergedCls}
      style={style}
    >
      {/* Title */}
      {title && (
        <Typography.Title
          level={5}
          className={classnames(`${prefixCls}-title`, classNames?.title)}
          style={styles?.title}
        >
          {title}
        </Typography.Title>
      )}
      {/* Prompt List */}
      <ul className={mergedListCls} style={styles?.list}>
        {
          data?.map((info, index) => (
            <li key={info.key || `key_${index}`}>
              {/* Prompt Item */}
              <Button
                type={info.disabled ? 'default' : 'text'}
                style={styles?.item}
                disabled={info.disabled}
                className={classnames(`${prefixCls}-item`, classNames?.item)}
                onClick={(event) => onClick?.(event, { data: info })}
              >
                {/* Icon */}
                {info.icon && (
                  <div className={`${prefixCls}-icon`}>
                    {info.icon}
                  </div>
                )}
                {/* Content */}
                <div
                  className={classnames(`${prefixCls}-content`, classNames?.content)}
                  style={styles?.content}
                >
                  {/* Label */}
                  {info.label && (
                    <Typography.Text
                      strong
                      ellipsis
                      className={`${prefixCls}-label`}
                      disabled={info.disabled}
                    >
                      {info.label}
                    </Typography.Text>
                  )}
                  {/* Description */}
                  {info.description && (
                    <Typography.Text
                      className={`${prefixCls}-desc`}
                      type="secondary"
                      disabled={info.disabled}
                    >
                      {info.description}
                    </Typography.Text>
                  )}
                </div>
              </Button>
            </li>
          ))
        }
      </ul>
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  Prompts.displayName = 'Prompts';
}

export type {
  PromptsProps,
  PromptProps,
};

export default Prompts;