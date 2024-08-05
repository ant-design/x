import React from 'react';
import classnames from 'classnames';
import { Button, Typography, Flex } from 'antd';

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
    flex = {},
    rootClassName,
    styles,
    classNames,
    style,
    ...htmlProps
  } = props;

  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('prompts', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    className,
    rootClassName,
    prefixCls,
    hashId,
    cssVarCls,
  );

  return wrapCSSVar(
    <div
      {...htmlProps}
      className={mergedCls}
      style={style}
    >
      {title && (
        <Typography.Title
          level={5}
          className={classnames(`${prefixCls}-title`, classNames?.title)}
          style={styles?.title}
        >
          {title}
        </Typography.Title>
      )}
      <Flex
        wrap={false}
        gap={12}
        {...flex}
        component="ul"
      >
        {
          data?.map(i => (
            <li key={i.key}>
              <Button
                type={i.disabled ? 'default' : 'text'}
                style={styles?.item}
                disabled={i.disabled}
                className={classnames(`${prefixCls}-item`, classNames?.item)}
                onClick={(e) => onClick?.({ item: i, domEvent: e })}
              >
                {i.icon && (
                  <div
                    className={classnames(`${prefixCls}-icon`, classNames?.icon)}
                    style={styles?.icon}
                  >
                    {i.icon}
                  </div>
                )}
                <Flex vertical align="flex-start" gap={8}>
                  {i.label && <Typography.Text
                    strong
                    ellipsis
                    className={classnames(`${prefixCls}-label`, classNames?.label)}
                    style={styles?.label}
                    disabled={i.disabled}
                  >
                    {i.label}
                  </Typography.Text>}
                  {i.description && <Typography.Text
                    className={classnames(`${prefixCls}-desc`, classNames?.desc)}
                    style={styles?.desc}
                    
                    type="secondary"
                    disabled={i.disabled}
                  >
                    {i.description}
                  </Typography.Text>}
                </Flex>
              </Button>
            </li>
          ))
        }
      </Flex>
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