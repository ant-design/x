import { Button, Flex, Typography } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import useStyle from './style';

export interface WelcomeProps {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'filled' | 'borderless';

  // Layout
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  extra?: React.ReactNode;
}

function Welcome(props: WelcomeProps, ref: React.Ref<HTMLDivElement>) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    variant = 'filled',

    // Layout
    icon,
    title,
    description,
    extra,
  } = props;

  // ============================= MISC =============================
  const { direction, getPrefixCls } = useXProviderContext();
  const prefixCls = getPrefixCls('welcome', customizePrefixCls);

  // ======================= Component Config =======================
  const contextConfig = useXComponentConfig('sender');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ============================= Icon =============================
  const iconNode = React.useMemo(() => {
    if (!icon) {
      return null;
    }

    let iconEle = icon;
    if (typeof icon === 'string' && icon.startsWith('http')) {
      iconEle = <img src={icon} alt="icon" />;
    }
    return <div className={`${prefixCls}-icon`}>{iconEle}</div>;
  }, [icon]);

  // ============================ Render ============================
  return wrapCSSVar(
    <Flex
      ref={ref}
      className={classnames(
        prefixCls,
        contextConfig.className,
        className,
        rootClassName,
        hashId,
        cssVarCls,
        `${prefixCls}-${variant}`,
        {
          [`${prefixCls}-rtl`]: direction === 'rtl',
        },
      )}
      style={style}
    >
      {/* Icon */}
      {iconNode}

      {/* Content */}
      <Flex vertical className={`${prefixCls}-content-wrapper`}>
        {/* Title */}
        {title && (
          <Typography.Title level={4} className={`${prefixCls}-title`}>
            {title}
          </Typography.Title>
        )}

        {/* Description */}
        {description && (
          <Typography.Text className={`${prefixCls}-description`}>{description}</Typography.Text>
        )}
      </Flex>
    </Flex>,
  );
}

const ForwardWelcome = React.forwardRef(Welcome);

if (process.env.NODE_ENV !== 'production') {
  ForwardWelcome.displayName = 'Welcome';
}

export default ForwardWelcome;
