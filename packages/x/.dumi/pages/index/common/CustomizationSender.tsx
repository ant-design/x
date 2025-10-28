import { Sender, type SenderProps } from '@ant-design/x';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react';

export const useStyle = createStyles(({ css, token }) => {
  return {
    sender: css`
      margin-inline: ${token.paddingSM * 2}px;
      background: linear-gradient(135deg, #ffffff26 14%, #ffffff0d 59%);
      position: relative;
      border: none;
      cursor: pointer;
      :hover {
        opacity: 0.85;
      }
    `,
  };
});

const CustomizationSender: React.FC<SenderProps> = (props) => {
  const { styles } = useStyle();
  return (
    <Sender
      className={styles.sender}
      style={{
        width: `calc(100% - ${12 * 4}px)`,
      }}
      suffix={() => {
        return (
          <Button
            type="text"
            style={{ padding: 0 }}
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
