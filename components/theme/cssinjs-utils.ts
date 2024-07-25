import type {
  GlobalToken as GlobalTokenTypeUtil,
  OverrideTokenMap as OverrideTokenTypeUtil,
  FullToken as FullTokenTypeUtil,
  GetDefaultToken as GetDefaultTokenTypeUtil,
  GenStyleFn as GenStyleFnTypeUtil,
  TokenMapKey,
} from '@ant-design/cssinjs-utils';

import type { ComponentTokenMap } from './components';
import type { AnyObject } from '../_util/type';
import type { CSSInterpolation } from '@ant-design/cssinjs';

/** Final token which contains the components level override */
export type GlobalToken = GlobalTokenTypeUtil<ComponentTokenMap, AnyObject>;

export type OverrideToken = OverrideTokenTypeUtil<ComponentTokenMap, AnyObject>;

export type OverrideComponent = TokenMapKey<ComponentTokenMap>;

export type FullToken<C extends TokenMapKey<ComponentTokenMap>> =
  FullTokenTypeUtil<ComponentTokenMap, AnyObject, C>;

export type GetDefaultToken<C extends TokenMapKey<ComponentTokenMap>> =
  GetDefaultTokenTypeUtil<ComponentTokenMap, AnyObject, C>;

export type GenStyleFn<C extends TokenMapKey<ComponentTokenMap>> =
  GenStyleFnTypeUtil<ComponentTokenMap, AnyObject, C>;

export type GenerateStyle<
  ComponentToken extends AnyObject = AnyObject,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
