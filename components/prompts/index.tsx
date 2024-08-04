import React from 'react';
import classnames from 'classnames';

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
    rootClassName,
    ...htmlProps
  } = props;

  console.log(data, onClick);

  const { getPrefixCls } = useConfigContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

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
    >
      {title}
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