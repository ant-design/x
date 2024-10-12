import { AudioOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import * as React from 'react';
import ActionButton from '../ActionButton';

function SpeechButton(props: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  return <ActionButton icon={<AudioOutlined />} {...props} action="onSpeech" ref={ref} />;
}

export default React.forwardRef(SpeechButton);
