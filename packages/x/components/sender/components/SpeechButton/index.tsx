import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import ActionButton, { ActionButtonContext } from '../ActionButton';
import RecordingIcon from './RecordingIcon';

function SpeechButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const { speechRecording, onSpeechDisabled, prefixCls } = React.useContext(ActionButtonContext);
  const { className, ...restProps } = props;

  let icon: React.ReactNode = null;
  if (speechRecording) {
    icon = <RecordingIcon className={`${prefixCls}-recording-icon`} />;
  } else if (onSpeechDisabled) {
    icon = <AudioMutedOutlined />;
  } else {
    icon = <AudioOutlined />;
  }

  return (
    <ActionButton
      icon={icon}
      color="primary"
      variant="text"
      {...restProps}
      className={classNames(className, {
        [`${prefixCls}-actions-btn-speech-disabled`]: onSpeechDisabled,
      })}
      disabled={onSpeechDisabled || restProps.disabled}
      action="onSpeech"
      ref={ref}
    />
  );
}

export default React.forwardRef(SpeechButton);
