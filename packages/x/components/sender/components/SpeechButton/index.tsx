import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import * as React from 'react';
import ActionButton, { ActionButtonContext } from '../ActionButton';
import RecordingIcon from './RecordingIcon';

function SpeechButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const {
    speechRecording,
    disabled: rootDisabled,
    onSpeechDisabled,
    prefixCls,
  } = React.useContext(ActionButtonContext);
  const mergedDisabled = props.disabled ?? rootDisabled ?? onSpeechDisabled;
  let icon: React.ReactNode = null;
  if (speechRecording) {
    icon = <RecordingIcon className={`${prefixCls}-recording-icon`} />;
  } else if (mergedDisabled) {
    icon = <AudioMutedOutlined />;
  } else {
    icon = <AudioOutlined />;
  }

  return (
    <ActionButton
      icon={icon}
      variant="text"
      color="primary"
      {...props}
      action="onSpeech"
      ref={ref}
    />
  );
}

export default React.forwardRef(SpeechButton);
