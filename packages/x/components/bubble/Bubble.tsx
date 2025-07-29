import classnames from 'classnames';
import React from 'react';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import {
  BubbleAnimationOption,
  BubbleContentType,
  BubbleProps,
  BubbleRef,
  BubbleSlot,
  BubbleSlotType,
} from './interface';
import Loading from './loading';
import useBubbleStyle from './style';
import { TypingContent } from './TypingContent';

const Bubble: React.ForwardRefRenderFunction<BubbleRef, BubbleProps> = (
  {
    prefixCls: customizePrefixCls,
    rootClassName,
    rootStyle,
    style,
    className,
    styles = {},
    classNames = {},
    placement = 'start',
    content,
    contentRender,
    typing,
    streaming = false,
    variant = 'filled',
    shape = 'default',
    components,
    footerPlacement = 'outer-start',
    loading,
    loadingRender,
    onTyping,
    onTypingComplete,
    ...restProps
  },
  ref,
) => {
  // ======================== Ref ==========================
  const rootDiv = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootDiv.current!,
  }));

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('bubble');

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ============================ Styles ============================
  const [hashId, cssVarCls] = useBubbleStyle(prefixCls);

  const rootMergedStyle = {
    ...contextConfig.style,
    ...contextConfig.styles.root,
    ...styles.root,
    ...rootStyle,
    ...style,
  };

  const rootMergedCls = classnames(
    prefixCls,
    contextConfig.className,
    contextConfig.classNames.root,
    classNames.root,
    rootClassName,
    className,
    hashId,
    cssVarCls,
    `${prefixCls}-${placement}`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
  );

  // ============================= process content ==============================
  const memoedContent = React.useMemo(
    () => (contentRender ? contentRender(content) : content),
    [content, contentRender],
  );

  const usingInnerAnimation = typing && typeof memoedContent === 'string';

  /**
   * 1、启用内置动画的情况下，由 TypingContent 来负责通知。
   * 2、不启用内置动画的情况下，也应当有一个回调来反映 content 的变化。
   *    没有动画，则 content 的变化、渲染是全量的，等同于动画是瞬时完成的，合该用 onTypingComplete 来通知变化。
   * 3、流式输入 content 的场景下，应当在流式结束时（streaming === false）才执行 onTypingComplete，
   *    保证一次流式传输归属于一个动画周期。
   **/
  React.useEffect(() => {
    if (usingInnerAnimation) return;
    if (streaming) return;
    content && onTypingComplete?.(content);
  }, [memoedContent, usingInnerAnimation, streaming]);
  // ============================= render ==============================

  const renderContent = () => {
    if (loading) return loadingRender ? loadingRender() : <Loading prefixCls={prefixCls} />;
    const _content = (
      <>
        {usingInnerAnimation ? (
          <TypingContent
            prefixCls={prefixCls}
            streaming={streaming}
            typing={typing}
            content={memoedContent as string}
            onTyping={onTyping}
            onTypingComplete={onTypingComplete}
          />
        ) : (
          memoedContent
        )}
        {!usingInnerAnimation && (typing as BubbleAnimationOption)?.suffix
          ? (typing as BubbleAnimationOption).suffix
          : null}
      </>
    );
    const isFooterIn = footerPlacement.includes('inner');
    return (
      <div className={getSlotClassName('body')} style={getSlotStyle('body')}>
        {renderHeader()}
        <div
          style={{
            ...contextConfig.styles.content,
            ...styles.content,
          }}
          className={classnames(
            `${prefixCls}-content`,
            `${prefixCls}-content-${variant}`,
            variant !== 'borderless' && `${prefixCls}-content-${shape}`,
            contextConfig.classNames.content,
            classNames.content,
          )}
        >
          {isFooterIn ? (
            <div className={classnames(`${prefixCls}-content-with-footer`)}>{_content}</div>
          ) : (
            _content
          )}
          {isFooterIn && renderFooter()}
        </div>
        {!isFooterIn && renderFooter()}
      </div>
    );
  };

  const getSlotClassName = (slotType: BubbleSlotType) =>
    classnames(
      `${prefixCls}-${slotType}`,
      contextConfig.classNames[slotType],
      classNames[slotType],
    );

  const getSlotStyle = (slotType: BubbleSlotType) => ({
    ...contextConfig.styles[slotType],
    ...styles[slotType],
  });

  const renderSlot = (slot: BubbleSlot<typeof content>) =>
    typeof slot === 'function' ? slot(content) : slot;

  const renderAvatar = () => {
    if (!components?.avatar) return null;
    return (
      <div className={getSlotClassName('avatar')} style={getSlotStyle('avatar')}>
        {renderSlot(components.avatar)}
      </div>
    );
  };

  const renderExtra = () => {
    if (!components?.extra) return null;
    return (
      <div className={getSlotClassName('extra')} style={getSlotStyle('extra')}>
        {renderSlot(components.extra)}
      </div>
    );
  };

  const renderHeader = () => {
    if (!components?.['header']) return null;
    return (
      <div className={getSlotClassName('header')} style={getSlotStyle('header')}>
        {renderSlot(components.header)}
      </div>
    );
  };

  const renderFooter = () => {
    if (!components?.footer) return null;
    const cls = classnames(getSlotClassName('footer'), {
      [`${prefixCls}-footer-start`]: footerPlacement.includes('start'),
      [`${prefixCls}-footer-end`]: footerPlacement.includes('end'),
    });
    return (
      <div className={cls} style={getSlotStyle('footer')}>
        {renderSlot(components.footer)}
      </div>
    );
  };

  return (
    <div className={rootMergedCls} style={rootMergedStyle} {...restProps} ref={rootDiv}>
      {renderAvatar()}
      {renderContent()}
      {renderExtra()}
    </div>
  );
};

type ForwardBubbleType = <T extends BubbleContentType = string>(
  props: BubbleProps<T> & { ref?: React.Ref<BubbleRef> },
) => React.ReactElement;

const ForwardBubble = React.forwardRef(Bubble);

if (process.env.NODE_ENV !== 'production') {
  ForwardBubble.displayName = 'Bubble';
}

export default ForwardBubble as ForwardBubbleType;

export { BubbleProps };
