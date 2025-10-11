import { Divider, DividerProps } from 'antd';
import React from 'react';
import { useXProviderContext } from '../x-provider';
import Bubble, { BubbleProps } from '.';
import { BubbleContentType } from './interface';

interface DividerBubbleProps<ContentType extends BubbleContentType = string>
  extends Omit<DividerProps, 'children'> {
  prefixCls?: string;
  content?: ContentType;
}

const DividerBubble: React.FC<DividerBubbleProps> = ({
  prefixCls: customizePrefixCls,
  content = '',
  ...dividerProps
}) => {
  // ============================ Prefix ============================
  const { getPrefixCls } = useXProviderContext();

  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  const dividerContentRender: BubbleProps['contentRender'] = (content) => {
    return (
      <Divider prefixCls={customizePrefixCls} {...dividerProps}>
        {content}
      </Divider>
    );
  };

  return (
    <Bubble
      prefixCls={customizePrefixCls}
      className={`${prefixCls}-divider`}
      variant="borderless"
      content={content}
      contentRender={dividerContentRender}
    />
  );
};

export default DividerBubble;
