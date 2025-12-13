import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import React from 'react';
import type { LinkProps } from './Link';
import Link from './Link';

type LinkButtonProps = LinkProps &
  Readonly<React.PropsWithChildren<Pick<ButtonProps, 'type' | 'size'>>>;

const LinkButton: React.FC<LinkButtonProps> = (props) => <Link component={Button} {...props} />;

export default LinkButton;
