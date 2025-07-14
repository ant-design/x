import classnames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import ActionsFeedback from './ActionsFeedback';
import { ActionsContext } from './context';
import Item from './Item';
import type { ActionsProps } from './interface';

import useStyle from './style';

const ForwardActions: React.FC<ActionsProps> = (props) => {
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

  const { getPrefixCls, direction } = useXProviderContext();
  const prefixCls = getPrefixCls('actions', customizePrefixCls);
  const contextConfig = useXComponentConfig('actions');
  const [hashId, cssVarCls] = useStyle(prefixCls);

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

  return (
    <div {...domProps} className={mergedCls} style={mergedStyle}>
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
        <div className={classnames(`${prefixCls}-list`, variant)}>
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
};

type CompoundedActions = typeof ForwardActions & {
  Feedback: typeof ActionsFeedback;
};

const Actions = ForwardActions as CompoundedActions;

if (process.env.NODE_ENV !== 'production') {
  Actions.displayName = 'Actions';
}

Actions.Feedback = ActionsFeedback;

export default Actions;
