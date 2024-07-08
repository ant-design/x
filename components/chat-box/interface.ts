import type React from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  prefixCls?: string;
  rootClassName?: string;
  vertical?: boolean;
  wrap?: boolean | React.CSSProperties['flexWrap'];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  flex?: React.CSSProperties['flex'];
  gap?: React.CSSProperties['gap'];
  children: React.ReactNode;
}
