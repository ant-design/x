import classnames from 'classnames';
import React from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Modal, Popover } from 'antd';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import useTypedEffect from './hooks/useTypedEffect';
import useTypingConfig from './hooks/useTypingConfig';
import type { BubbleContentType, BubbleProps } from './interface';
import Loading from './loading';
import useStyle from './style';

export interface BubbleRef {
  nativeElement: HTMLElement;
}

export interface BubbleContextProps {
  onUpdate?: VoidFunction;
}

export const BubbleContext = React.createContext<BubbleContextProps>({});

const Bubble: React.ForwardRefRenderFunction<BubbleRef, BubbleProps> = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    classNames = {},
    styles = {},
    avatar,
    placement = 'start',
    loading = false,
    loadingRender,
    typing,
    content = '',
    messageRender,
    variant = 'filled',
    shape,
    onTypingComplete,
    header,
    footer,
    references,
    ...otherHtmlProps
  } = props;

  const { onUpdate } = React.useContext(BubbleContext);

  // ============================= Refs =============================
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    nativeElement: divRef.current!,
  }));

  // ============================ Prefix ============================
  const { direction, getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = useXComponentConfig('bubble');

  // ============================ Typing ============================
  const [typingEnabled, typingStep, typingInterval, customSuffix] = useTypingConfig(typing);

  const [typedContent, isTyping] = useTypedEffect(
    content,
    typingEnabled,
    typingStep,
    typingInterval,
  );

  React.useEffect(() => {
    onUpdate?.();
  }, [typedContent]);

  const triggerTypingCompleteRef = React.useRef(false);
  React.useEffect(() => {
    if (!isTyping && !loading) {
      // StrictMode will trigger this twice,
      // So we need a flag to avoid that
      if (!triggerTypingCompleteRef.current) {
        triggerTypingCompleteRef.current = true;
        onTypingComplete?.();
      }
    } else {
      triggerTypingCompleteRef.current = false;
    }
  }, [isTyping, loading]);

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const mergedCls = classnames(
    prefixCls,
    rootClassName,
    contextConfig.className,
    className,
    hashId,
    cssVarCls,
    `${prefixCls}-${placement}`,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-typing`]: isTyping && !loading && !messageRender && !customSuffix,
    },
  );

  // ============================ Avatar ============================
  const avatarNode = React.useMemo(
    () => (React.isValidElement(avatar) ? avatar : <Avatar {...avatar} />),
    [avatar],
  );

  // =========================== Content ============================
  const mergedContent = React.useMemo(
    () => (messageRender ? messageRender(typedContent as any) : typedContent),
    [typedContent, messageRender],
  );

  // ============================ Render ============================
  let contentNode: React.ReactNode;
  if (loading) {
    contentNode = loadingRender ? loadingRender() : <Loading prefixCls={prefixCls} />;
  } else {
    contentNode = (
      <>
        {mergedContent as React.ReactNode}
        {isTyping && customSuffix}
      </>
    );
  }

  let fullContent: React.ReactNode = (
    <div
      style={{
        ...contextConfig.styles.content,
        ...styles.content,
      }}
      className={classnames(
        `${prefixCls}-content`,
        `${prefixCls}-content-${variant}`,
        shape && `${prefixCls}-content-${shape}`,
        contextConfig.classNames.content,
        classNames.content,
      )}
    >
      {contentNode}
    </div>
  );

  // =========================== Reference ============================

  const referencesContent: React.ReactNode = React.useMemo(() => {
    const ReferencesOverlay = () => {
      const [isModalVisible, setIsModalVisible] = React.useState(false);
      if (!references || references.length === 0) {
        return null;
      }

      const count = references.length;

      const button = (
        <Button
          icon={<InfoCircleOutlined />}
          onClick={() => setIsModalVisible(true)}
          className={classnames(`${prefixCls}-references-toggle`)}
          style={{ cursor: 'pointer', color: '#1890ff', ...contextConfig.styles.references }}
        >
          {count} reference{count > 1 ? 's' : ''} used
        </Button>
      );

      return (
        <>
          <Popover content={button} trigger="hover" placement="bottom">
            <Button
              shape="circle"
              icon={<InfoCircleOutlined />}
              className={classnames(`${prefixCls}-references-toggle`)}
              style={{ cursor: 'pointer' }}
            />
          </Popover>
          <Modal
            title="References"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            destroyOnClose
            className={classnames(`${prefixCls}-references-modal`)}
          >
            <List
              dataSource={references}
              renderItem={(ref, index) => (
                <List.Item key={index} className={`${prefixCls}-reference-item`}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${prefixCls}-reference`}
                  >
                    <div>{ref.title}</div>
                    {ref.description && (
                      <span className={`${prefixCls}-reference-description`}>
                        {ref.description}
                      </span>
                    )}
                  </a>
                </List.Item>
              )}
              className={classnames(
                `${prefixCls}-references-list`,
                contextConfig.classNames.references,
              )}
              style={contextConfig.styles.references}
            />
          </Modal>
        </>
      );
    };

    return <ReferencesOverlay />;
  }, [references, prefixCls, contextConfig]);

  if (header || footer) {
    fullContent = (
      <div className={`${prefixCls}-content-wrapper`}>
        {header && (
          <div
            className={classnames(
              `${prefixCls}-header`,
              contextConfig.classNames.header,
              classNames.header,
            )}
            style={{
              ...contextConfig.styles.header,
              ...styles.header,
            }}
          >
            {header}
          </div>
        )}
        {fullContent}
        {footer && (
          <div
            className={classnames(
              `${prefixCls}-footer`,
              contextConfig.classNames.footer,
              classNames.footer,
            )}
            style={{
              ...contextConfig.styles.footer,
              ...styles.footer,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }

  return wrapCSSVar(
    <div>
      <div
        style={{
          ...contextConfig.style,
          ...style,
        }}
        className={mergedCls}
        {...otherHtmlProps}
        ref={divRef}
      >
        {/* Avatar */}
        {avatar && (
          <div
            style={{
              ...contextConfig.styles.avatar,
              ...styles.avatar,
            }}
            className={classnames(
              `${prefixCls}-avatar`,
              contextConfig.classNames.avatar,
              classNames.avatar,
            )}
          >
            {avatarNode}
          </div>
        )}

        {/* Content */}
        {fullContent}

        {/* Source */}
        {referencesContent}
      </div>
    </div>,
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
