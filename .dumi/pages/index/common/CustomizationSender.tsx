import { Sender, type SenderProps } from '@ant-design/x';
import { Button } from 'antd';
import React from 'react';

const CustomizationSender: React.FC<SenderProps> = (props) => {
  return (
    <Sender
      actions={() => {
        return (
          <Button
            type="text"
            onClick={() => props?.onSubmit?.(props.value!)}
            icon={
              <img
                alt="send"
                loading="lazy"
                src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4e5sTY9lU3sAAAAAAAAAAAAADgCCAQ/original"
              />
            }
          />
        );
      }}
      {...props}
    />
  );
};

export default CustomizationSender;
