import { XProvider } from '@ant-design/x';
import { createStyles } from 'antd-style';
import classnames from 'classnames';
import React from 'react';

export const useCustomizationBgStyle = createStyles(({ token, css }) => {
  return {
    background: css`
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%) !important;
      overflow: hidden;

      &::after {
        content: '';
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        padding: ${token.lineWidth}px;
        background: linear-gradient(180deg, #ffffff26 0%, #ffffff00 100%);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
      };
    `,
  };
});

const useStyle = createStyles(({ token, css }) => {
  const borderRadius = 20;

  return {
    welcome: css`
      display: flex;
      align-items: center;
      gap: ${token.paddingXS}px;
      position: relative;
      box-sizing: border-box;
      border-radius: ${borderRadius}px;

      .ant-welcome-title {
        font-size: ${token.fontSize}px;
        font-weight: 400;
      }

      .ant-welcome-description {
        font-size: ${token.fontSizeSM - 1}px;
        opacity: 0.65;        
      }
    `,
    prompts: css`
      border-radius: ${borderRadius}px !important;
      position: relative;

      .ant-prompts-desc {
        font-size: ${token.fontSizeSM}px !important;
        opacity: 0.9;
      }
      .ant-prompts-label {
        font-size: ${token.fontSize}px !important;
        font-weight: 400;
      }

      .ant-prompts-title {
        font-size: ${token.fontSize}px !important;
        padding-bottom: ${token.paddingXS}px;
      }
    `,
    sender: css`
      border-radius: ${borderRadius * 2}px;
    `,
    conversations: css`
      padding: ${token.padding}px;
      padding-top: 0;
      border-radius: ${borderRadius}px;
      position: relative;
    `,
    suggestion: css`
      border-radius: ${borderRadius}px;
      position: relative;
    `,
  };
});

const CustomizationProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { styles } = useStyle();
  const {
    styles: { background },
  } = useCustomizationBgStyle();

  return (
    <XProvider
      conversations={{
        className: classnames(styles.conversations, background),
      }}
      sender={{
        className: classnames(styles.sender, background),
      }}
      prompts={{
        className: classnames(styles.prompts),
      }}
      welcome={{
        className: classnames(styles.welcome),
      }}
      suggestion={{
        className: classnames(styles.suggestion),
      }}
    >
      {props.children}
    </XProvider>
  );
};

export default CustomizationProvider;
