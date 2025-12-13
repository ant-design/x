import { Sender } from '@ant-design/x';
import { App } from 'antd';
import React from 'react';

const Demo: React.FC = () => {
  const { message } = App.useApp();
  const [recording, setRecording] = React.useState(false);

  return (
    <Sender
      onSubmit={() => {
        message.success('Send message successfully!');
      }}
      allowSpeech={{
        // When setting `recording`, the built-in speech recognition feature will be disabled
        recording,
        onRecordingChange: (nextRecording) => {
          message.info(`Mock Customize Recording: ${nextRecording}`);
          setRecording(nextRecording);
        },
      }}
    />
  );
};

export default () => (
  <App>
    <Demo />
  </App>
);
