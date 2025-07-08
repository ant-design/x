import { Flex, Typography } from 'antd';
import classnames from 'classnames';
import React from 'react';

import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';

import useStyle from './style';

export type SemanticType = 'title' | 'description' | 'icon' | 'extra';

export interface WelcomeProps {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'filled' | 'borderless';

  // Semantic
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;

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

    // Semantic
    classNames = {},
    styles = {},

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
  const contextConfig = useXComponentConfig('welcome');

  // ============================ Styles ============================
  const [hashId, cssVarCls] = useStyle(prefixCls);

  // ============================= Icon =============================
  const iconNode = React.useMemo(() => {
    if (!icon) {
      return null;
    }

    let iconEle = icon;
    if (typeof icon === 'string' && icon.startsWith('http')) {
      iconEle = <img src={icon} alt="icon" />;
    }
    return (
      <div
        className={classnames(`${prefixCls}-icon`, contextConfig.classNames.icon, classNames.icon)}
        style={styles.icon}
      >
        {iconEle}
      </div>
    );
  }, [icon]);

  const titleNode = React.useMemo(() => {
    if (!title) {
      return null;
    }

    return (
      <Typography.Title
        level={4}
        className={classnames(
          `${prefixCls}-title`,
          contextConfig.classNames.title,
          classNames.title,
        )}
        style={styles.title}
      >
        {title}
      </Typography.Title>
    );
  }, [title]);

  const extraNode = React.useMemo(() => {
    if (!extra) {
      return null;
    }

    return (
      <div
        className={classnames(
          `${prefixCls}-extra`,
          contextConfig.classNames.extra,
          classNames.extra,
        )}
        style={styles.extra}
      >
        {extra}
      </div>
    );
  }, [extra]);

  // ============================ Render ============================
  return (
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
        {extra ? (
          <Flex align="flex-start" className={`${prefixCls}-title-wrapper`}>
            {titleNode}
            {extraNode}
          </Flex>
        ) : (
          titleNode
        )}

        {/* Description */}
        {description && (
          <Typography.Text
            className={classnames(
              `${prefixCls}-description`,
              contextConfig.classNames.description,
              classNames.description,
            )}
            style={styles.description}
          >
            {description}
          </Typography.Text>
        )}
      </Flex>
    </Flex>
  );
}

const ForwardWelcome = React.forwardRef(Welcome);

if (process.env.NODE_ENV !== 'production') {
  ForwardWelcome.displayName = 'Welcome';
}

export default ForwardWelcome;
