export type AnyObject = Record<PropertyKey, any>;
type PrefixKeysInfo = [keyof KeyboardEvent, string, string];
export type PrefixKeysType = {
  Ctrl: PrefixKeysInfo;
  Alt: PrefixKeysInfo;
  Meta: PrefixKeysInfo;
  Shift: PrefixKeysInfo;
};
export type CodeKeyType = number | 'number' | keyof PrefixKeysType;
export type ShortcutKeys<CustomKey = number | 'number'> =
  | [keyof PrefixKeysType, keyof PrefixKeysType, CustomKey]
  | [keyof PrefixKeysType, CustomKey];
