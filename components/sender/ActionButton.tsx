import { Button, type ButtonProps } from 'antd';
import * as React from 'react';

export interface ActionButtonProps extends ButtonProps {}

export default function ActionButton(props: ActionButtonProps) {
  return <Button {...props} type="text" />;
}
