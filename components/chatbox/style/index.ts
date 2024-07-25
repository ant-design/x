import { Keyframes, unit } from '@ant-design/cssinjs';
import type { CSSInterpolation } from '@ant-design/cssinjs';
import { genStyleUtils, mergeToken } from '@ant-design/cssinjs-utils';
import type { GetDefaultToken, FullToken } from '@ant-design/cssinjs-utils';
import { ConfigContext } from 'antd/lib/config-provider';
import useAntdToken from 'antd/lib/theme/useToken';
import React from 'react';
import type { AnyObject } from '../../_util/type';
import type { ComponentTokenMap } from '../../theme/components';

const loadingMove = new Keyframes('loadingMove', {
  '0%': {
    transform: 'translateY(0)',
  },
  '10%': {
    transform: 'translateY(4px)',
  },
  '20%': {
    transform: 'translateY(0)',
  },
  '30%': {
    transform: 'translateY(-4px)',
  },
  '40%': {
    transform: 'translateY(0)',
  },
});

const cursorBlink = new Keyframes('cursorBlink', {
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export interface ComponentToken {
  //
}

interface ChatboxToken extends FullToken<AnyObject, AnyObject, 'Chatbox'> {
  chatboxContentMaxWidth: number | string;
}

export type GenerateStyle<
  C extends Record<PropertyKey, any> = Record<PropertyKey, any>,
  ReturnType = CSSInterpolation,
> = (token: C) => ReturnType;

const genChatboxStyle: GenerateStyle<ChatboxToken> = (token) => {
  const {
    componentCls,
    fontSize,
    lineHeight,
    paddingSM,
    padding,
    paddingXS,
    colorText,
    calc,
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      columnGap: paddingXS,
      maxWidth: '100%',
      [`&${componentCls}-end`]: {
        justifyContent: 'end',
        flexDirection: 'row-reverse',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${componentCls}-typing ${componentCls}-content:last-child::after`]: {
        content: '"|"',
        fontWeight: 900,
        userSelect: 'none',
        opacity: 1,
        marginInlineStart: '0.1em',
        animationName: cursorBlink,
        animationDuration: '0.8s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      },
      [`& ${componentCls}-avatar`]: {
        display: 'inline-flex',
        justifyContent: 'center',
      },
      [`& ${componentCls}-content`]: {
        position: 'relative',
        padding: `${unit(paddingSM)} ${unit(padding)}`,
        color: colorText,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        minHeight: calc(paddingSM)
          .mul(2)
          .add(calc(lineHeight).mul(fontSize))
          .equal(),
        maxWidth: token.chatboxContentMaxWidth,
        backgroundColor: token.colorInfoBg,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
        [`& ${componentCls}-dot`]: {
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          columnGap: token.marginXS,
          padding: `0 ${unit(token.paddingXXS)}`,
          '&-item': {
            backgroundColor: token.colorPrimary,
            borderRadius: '100%',
            width: 4,
            height: 4,
            animationName: loadingMove,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            '&:nth-child(1)': {
              animationDelay: '0s',
            },
            '&:nth-child(2)': {
              animationDelay: '0.2s',
            },
            '&:nth-child(3)': {
              animationDelay: '0.4s',
            },
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<any, any, any> = () => ({
  //
});

const { genStyleHooks } = genStyleUtils<
  ComponentTokenMap,
  AnyObject,
  AnyObject
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = React.useContext(ConfigContext);
    return {
      iconPrefixCls,
      rootPrefixCls: getPrefixCls(),
    };
  },
  useToken: () => {
    const [, token] = useAntdToken();
    return { token };
  },
  useCSP: () => {
    const { csp } = React.useContext(ConfigContext);
    return csp ?? {};
  },
});

export default genStyleHooks<'Chatbox'>(
  'Chatbox',
  (token) => {
    const { paddingXS, calc } = token;
    const chatBoxToken = mergeToken<ChatboxToken>(token, {
      chatboxContentMaxWidth: `calc(100% - ${calc(paddingXS).add(32).equal()})`,
    });
    return genChatboxStyle(chatBoxToken);
  },
  prepareComponentToken,
);
