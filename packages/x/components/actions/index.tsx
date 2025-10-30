import classnames from 'classnames';
import CSSMotion from 'rc-motion';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { composeRef } from 'rc-util/lib/ref';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsAudio from './ActionsAudio';
import ActionsCopy from './ActionsCopy';
import ActionsFeedback from './ActionsFeedback';
import ActionsItem from './ActionsItem';
import { ActionsContext } from './context';
import Item from './Item';
import type { ActionsProps } from './interface';
import useStyle from './style';

type ActionsRef = {
  nativeElement: HTMLDivElement;
};
const ForwardActions = React.forwardRef<ActionsRef, ActionsProps>((props, ref) => {
  const {
    items = [],
    onClick,
    dropdownProps = {},
    fadeIn,
    variant = 'borderless',
    prefixCls: customizePrefixCls,
    classNames = {},
    rootClassName = '',
    className = '',
    styles = {},
    style = {},
    ...otherHtmlProps
  } = props;

  const domProps = pickAttrs(otherHtmlProps, {
    attr: true,
    aria: true,
    data: true,
  });

  // ============================ PrefixCls ============================
  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const contextConfig = useXComponentConfig('actions');
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const rootPrefixCls = getPrefixCls();
  // ============================= Class =============================
  const mergedCls = classnames(
    prefixCls,
    contextConfig.className,
    contextConfig.classNames.root,
    rootClassName,
    className,
    classNames.root,
    cssVarCls,
    hashId,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );
  const mergedStyle = {
    ...contextConfig.style,
    ...styles.root,
    ...style,
  };

  // ============================= Refs =============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  useProxyImperativeHandle(ref, () => {
    return {
      nativeElement: containerRef.current!,
    };
  });

  // ============================= Render =============================
  return (
    <CSSMotion motionName={fadeIn ? `${rootPrefixCls}-x-fade-left` : ''}>
      {({ className: motionClassName }, ref) => {
        return (
          <div
            ref={composeRef(containerRef, ref)}
            {...domProps}
            className={mergedCls}
            style={mergedStyle}
          >
            <ActionsContext.Provider
              value={{
                prefixCls,
                classNames: {
                  item: classnames(contextConfig.classNames.item, classNames.item),
                  itemDropdown: classnames(
                    contextConfig.classNames.itemDropdown,
                    classNames.itemDropdown,
                  ),
                },
                styles: {
                  item: { ...contextConfig.styles.item, ...styles.item },
                  itemDropdown: { ...contextConfig.styles.itemDropdown, ...styles.itemDropdown },
                },
              }}
            >
              <div
                className={classnames(
                  `${prefixCls}-list`,
                  `${prefixCls}-variant-${variant}`,
                  motionClassName,
                )}
              >
                {items.map((item, idx) => {
                  return (
                    <Item item={item} onClick={onClick} dropdownProps={dropdownProps} key={idx} />
                  );
                })}
              </div>
            </ActionsContext.Provider>
          </div>
        );
      }}
    </CSSMotion>
  );
});

type CompoundedActions = typeof ForwardActions & {
  Feedback: typeof ActionsFeedback;
  Copy: typeof ActionsCopy;
  Item: typeof ActionsItem;
  Audio: typeof ActionsAudio;
};

const Actions = ForwardActions as CompoundedActions;

if (process.env.NODE_ENV !== 'production') {
  Actions.displayName = 'Actions';
}

Actions.Feedback = ActionsFeedback;
Actions.Copy = ActionsCopy;
Actions.Item = ActionsItem;
Actions.Audio = ActionsAudio;

export default Actions;
