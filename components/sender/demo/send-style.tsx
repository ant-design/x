import { SendOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { App, type ButtonProps, Flex, Tooltip } from 'antd';
import React from 'react';

const Demo: React.FC = () => {
  const [value, setValue] = React.useState('Ask something?');
  const [loading, setLoading] = React.useState(false);

  const { message } = App.useApp();

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  const renderSend = (
    props: ButtonProps & { ignoreLoading?: boolean; placeholder?: string } = {},
  ) => {
    const { ignoreLoading, placeholder, ...btnProps } = props;

    return (
      <Sender
        value={value}
        onChange={setValue}
        loading={loading}
        onSubmit={(msg) => {
          message.success(`Send: ${msg}`);
          setValue('');
          setLoading(true);
        }}
        placeholder={placeholder}
        onCancel={() => {
          setLoading(false);
        }}
        actions={(_, info) => {
          const { SendButton, LoadingButton } = info.components;

          if (!ignoreLoading && loading) {
            return (
              <Tooltip title="Click to cancel">
                <LoadingButton />
              </Tooltip>
            );
          }

          let node = <SendButton {...btnProps} />;

          if (!ignoreLoading) {
            node = (
              <Tooltip title={value ? 'Send \u21B5' : 'Please type something'}>{node}</Tooltip>
            );
          }

          return node;
        }}
      />
    );
  };

  return (
    <Flex vertical gap="middle">
      {renderSend({
        shape: 'default',
        placeholder: 'Change button border radius',
        style: { borderRadius: 12 },
      })}
      {renderSend({
        variant: 'text',
        placeholder: 'Change button icon',
        color: 'primary',
        icon: <SendOutlined />,
        shape: 'default',
      })}
      {renderSend({ ignoreLoading: true, placeholder: 'Loading not change button' })}
    </Flex>
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
