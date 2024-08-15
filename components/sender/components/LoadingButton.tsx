import * as React from 'react';
import ActionButton from './ActionButton';
import type { ButtonProps } from 'antd';
import StopLoadingIcon from '../StopLoading';

export default function LoadingButton(props: ButtonProps) {
  return <ActionButton icon={<StopLoadingIcon />} {...props} action="onCancel" />;
}
