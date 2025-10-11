import classnames from 'classnames';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble, { BubbleProps } from '.';
import { SystemBubbleProps } from './interface';

const SystemBubble: React.FC<SystemBubbleProps> = ({
  prefixCls: customizePrefixCls,
  content,
  variant = 'shadow',
  shape,
  style,
  className,
  styles,
  classNames,
  rootClassName,
  extra,
}) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const cls = `${prefixCls}-system`;

  const systemContentRender: BubbleProps['contentRender'] = (content) => {
    return (
      <>
        <div className={`${cls}-content`}>{content}</div>
        {extra && (
          <div className={`${cls}-extra`}>
            {typeof extra === 'function' ? extra(content) : extra}
          </div>
        )}
      </>
    );
  };

  return (
    <Bubble
      prefixCls={customizePrefixCls}
      style={style}
      className={classnames(className, cls)}
      styles={styles}
      classNames={classNames}
      rootClassName={rootClassName}
      variant={variant}
      shape={shape}
      content={content}
      contentRender={systemContentRender}
    />
  );
};

export default SystemBubble;
