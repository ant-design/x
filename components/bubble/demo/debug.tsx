import { Bubble, type BubbleProps } from '@ant-design/x';
import { Divider } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

const useStyle = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: ${token.padding}px;
  `,
  content: css`
    background-color: ${token.colorPrimaryBg};
  `,
  footer: css`
    background-color: ${token.colorBgTextHover};
  `,
  header: css`
    background-color: ${token.colorBgTextHover};
  `,
  avatar: css`
    background-color: ${token.colorBgTextHover};
  `,
  block: css`
    background-color: ${token.colorBgTextHover};
  `,
  fixedWidthBlock: css`
    width: 1000px;
    background-color: ${token.colorBgTextHover};
  `,
}));

const App = () => {
  const { styles } = useStyle();

  const customizationProps: BubbleProps = {
    header: 'header',
    footer: <div>footer</div>,
    avatar: {
      src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp',
    },
    classNames: {
      content: styles.content,
      footer: styles.footer,
      header: styles.header,
      avatar: styles.avatar,
    },
  };

  const bubbleDict: Record<'string' | 'longString' | 'block' | 'fixedWidthBlock', BubbleProps> = {
    string: {
      content: 'string bubble',
      variant: 'filled',
      shape: 'corner',
    },
    longString: {
      content:
        'longgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
      variant: 'borderless',
    },
    block: {
      content: (
        <div className={styles.block}>
          block block block block block block block block block block block block block block block
          block block block block block block block block block block
        </div>
      ),
      variant: 'outlined',
      shape: 'round',
    },
    fixedWidthBlock: {
      content: <div className={styles.fixedWidthBlock}>fixed width content</div>,
      variant: 'shadow',
    },
  };

  return (
    <div className={styles.container}>
      <Divider>Basic</Divider>
      <Bubble {...bubbleDict.string} />
      <Bubble {...bubbleDict.longString} />
      <Bubble {...bubbleDict.block} />
      <Bubble {...bubbleDict.fixedWidthBlock} />
      <Divider>Basic placement: end</Divider>
      <Divider>Custom</Divider>
      <Bubble {...customizationProps} {...bubbleDict.string} />
      <Bubble {...customizationProps} {...bubbleDict.longString} />
      <Bubble {...customizationProps} {...bubbleDict.block} />
      <Bubble {...customizationProps} {...bubbleDict.fixedWidthBlock} />
      <Divider>Custom placement: end</Divider>
      <Bubble {...customizationProps} {...bubbleDict.string} placement="end" />
      <Bubble {...customizationProps} {...bubbleDict.longString} placement="end" />
      <Bubble {...customizationProps} {...bubbleDict.block} placement="end" />
      <Bubble {...customizationProps} {...bubbleDict.fixedWidthBlock} placement="end" />
      <Divider>List</Divider>
      <Bubble.List
        items={[
          {
            ...bubbleDict.string,
            ...customizationProps,
          },
          {
            ...bubbleDict.longString,
            ...customizationProps,
            placement: 'end',
          },
          {
            ...bubbleDict.block,
            ...customizationProps,
          },
          {
            ...bubbleDict.fixedWidthBlock,
            ...customizationProps,
            placement: 'end',
          },
        ]}
      />
    </div>
  );
};

export default App;
