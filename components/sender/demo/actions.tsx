import React from 'react';
import { Sender } from '@ant-design/x';
import { App, Space, Spin, Typography } from 'antd';
import { OpenAIOutlined } from '@ant-design/icons';

const Demo: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState<string>('');

  const { message } = App.useApp();

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setValue('');
        message.success('Send message successfully!');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);

  return (
    <Sender
      submitType="shiftEnter"
      value={value}
      loading={loading}
      onChange={setValue}
      onSubmit={() => {
        setLoading(true);
      }}
      onCancel={() => {
        setLoading(false);
      }}
      actions={(_, info) => {
        const { SendButton, LoadingButton } = info.components;

        return (
          <Space size="small">
            <Typography.Text type="secondary">
              <small>`Shift + Enter` to submit</small>
            </Typography.Text>
            {loading ? (
              <LoadingButton type="default" icon={<Spin size="small" />} disabled />
            ) : (
              <SendButton type="primary" icon={<OpenAIOutlined />} disabled={false} />
            )}
          </Space>
        );
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
