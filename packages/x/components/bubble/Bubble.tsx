import classnames from 'classnames';
import React from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { EditableContent } from './EditableContent';
import type {
  BubbleAnimationOption,
  BubbleContentType,
  BubbleProps,
  BubbleRef,
  BubbleSlot,
  BubbleSlotType,
  EditableBubbleOption,
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
    editable = false,
    typing,
    streaming = false,
    variant = 'filled',
    shape = 'default',
    components,
    footerPlacement,
    loading,
    loadingRender,
    onTyping,
    onTypingComplete,
    onEditConfirm,
    onEditCancel,
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

    const domProps = pickAttrs(restProps, {
      attr: true,
      aria: true,
      data: true,
    });

  // ============================= process content ==============================
  const memoedContent = React.useMemo(
    () => (contentRender ? contentRender(content) : content),
    [content, contentRender],
  );

  const usingInnerAnimation = !!typing && typeof memoedContent === 'string';

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
  const _footerPlacement: BubbleProps['footerPlacement'] =
    footerPlacement || (placement === 'start' ? 'outer-start' : 'outer-end');

  const isEditing = typeof editable === 'boolean' ? editable : editable.editing;

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
        {!usingInnerAnimation &&
          (typing as BubbleAnimationOption)?.effect === 'typing' &&
          (typing as BubbleAnimationOption)?.suffix
          ? (typing as BubbleAnimationOption).suffix
          : null}
      </>
    );
    const isFooterIn = _footerPlacement.includes('inner');
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
            {
              [`${prefixCls}-content-editing`]: isEditing,
            },
          )}
        >
          {isEditing ? (
            <EditableContent
              prefixCls={prefixCls}
              content={content}
              okText={(editable as EditableBubbleOption)?.okText}
              cancelText={(editable as EditableBubbleOption)?.cancelText}
              onEditConfirm={onEditConfirm}
              onEditCancel={onEditCancel}
            />
          ) : (
            <>
              {isFooterIn ? (
                <div className={classnames(`${prefixCls}-content-with-footer`)}>{_content}</div>
              ) : (
                _content
              )}
              {isFooterIn && renderFooter()}
            </>
          )}
        </div>
        {!isEditing && !isFooterIn && renderFooter()}
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
    if (!components?.header) return null;
    return (
      <div className={getSlotClassName('header')} style={getSlotStyle('header')}>
        {renderSlot(components.header)}
      </div>
    );
  };

  const renderFooter = () => {
    if (!components?.footer) return null;
    const cls = classnames(getSlotClassName('footer'), {
      [`${prefixCls}-footer-start`]: _footerPlacement.includes('start'),
      [`${prefixCls}-footer-end`]: _footerPlacement.includes('end'),
    });
    return (
      <div className={cls} style={getSlotStyle('footer')}>
        {renderSlot(components.footer)}
      </div>
    );
  };

  return (
    <div className={rootMergedCls} style={rootMergedStyle} {...restProps} {...domProps} ref={rootDiv}>
      {renderAvatar()}
      {renderContent()}
      {!isEditing && !loading && renderExtra()}
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
