import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import useProxyImperativeHandle from '../_util/hooks/use-proxy-imperative-handle';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsFeedback from './ActionsFeedback';
import { ActionsContext } from './context';
import Item from './Item';
import type { ActionsProps } from './interface';
import useStyle from './style';

type ActionsRef = {asdasds
  nativeElement: HTMLDivElement;
};

const ForwardActions = React.forwardRef<ActionsRef, ActionsProps>((props, ref) => {
  const {
    items = [],
    onClick,
    footer,
    dropdownProps = {},
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
    <div ref={containerRef} {...domProps} className={mergedCls} style={mergedStyle}>
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
        <div className={classnames(`${prefixCls}-list`, `${prefixCls}-variant-${variant}`)}>
          {items.map((item, idx) => {
            return <Item item={item} onClick={onClick} dropdownProps={dropdownProps} key={idx} />;
          })}
        </div>

        {footer && (
          <div className={classNames.footer} style={styles.footer}>
            {footer}
          </div>
        )}
      </ActionsContext.Provider>
    </div>
  );
});

type CompoundedActions = typeof ForwardActions & {
  Feedback: typeof ActionsFeedback;
};

const Actions = ForwardActions as CompoundedActions;

if (process.env.NODE_ENV !== 'production') {
  Actions.displayName = 'Actions';
}

Actions.Feedback = ActionsFeedback;

export default Actions;
