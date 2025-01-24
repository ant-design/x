import { UserOutlined } from '@ant-design/icons';
import { Bubble, type BubbleProps } from '@ant-design/x';
import { Button, Divider, Flex } from 'antd';
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
  const [count, setCount] = React.useState(6);
  const [markedIndex, setMarkedIndex] = React.useState<number | null>(null);
  const listRef = React.useRef<React.ElementRef<typeof Bubble.List>>(null);

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

  const roles = (bubbleData: Bubble.BubbleDataType, index: number) => {
    const commonProps = {
      avatar: customizationProps.avatar,
      footer: <span># {index}</span>,
      header: bubbleData.role,
      styles: {
        content: {
          cursor: 'pointer',
          background: markedIndex === index ? '#e6f4ff' : undefined,
        },
      },
      onClick: () => setMarkedIndex((current) => (current === index ? null : index)),
    };
    switch (bubbleData.role) {
      case 'ai':
        return {
          placement: 'start',
          avatar: customizationProps.avatar,
          typing: { step: 5, interval: 20 },
          style: {
            maxWidth: 600,
          },
          ...commonProps,
        };
      case 'user':
        return {
          placement: 'end',
          avatar: customizationProps.avatar,
          ...commonProps,
        };
    }
  };

  return (
    <div className={styles.container}>
      <Divider>Basic</Divider>
      <Bubble {...bubbleDict.string} />
      <Bubble {...bubbleDict.longString} />
      <Bubble {...bubbleDict.block} />
      <Bubble {...bubbleDict.fixedWidthBlock} />
      <Divider>Basic placement: end</Divider>
      <Bubble {...bubbleDict.string} placement="end" />
      <Bubble {...bubbleDict.longString} placement="end" />
      <Bubble {...bubbleDict.block} placement="end" />
      <Bubble {...bubbleDict.fixedWidthBlock} placement="end" />
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
      <Divider>List with roles</Divider>
      <Flex gap="small" style={{ alignSelf: 'flex-end' }}>
        <Button
          onClick={() => {
            setCount((i) => i + 1);
          }}
        >
          Add Bubble
        </Button>

        <Button
          onClick={() => {
            listRef.current?.scrollTo({ key: 0, block: 'nearest' });
          }}
        >
          Scroll To First
        </Button>

        <Button
          disabled={markedIndex === null}
          onClick={() =>
            markedIndex !== null &&
            listRef.current?.scrollTo({ key: markedIndex, block: 'nearest' })
          }
        >
          Scroll To Marked index: {markedIndex}
        </Button>
      </Flex>
      <Bubble.List
        ref={listRef}
        style={{ maxHeight: 300 }}
        roles={roles}
        items={Array.from({ length: count }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI ? bubbleDict.longString.content : bubbleDict.block.content;
          const variant = isAI ? bubbleDict.longString.variant : bubbleDict.block.variant;

          return {
            key: i,
            role: isAI ? 'ai' : 'user',
            content,
            variant,
          };
        })}
      />
    </div>
  );
};

export default App;
