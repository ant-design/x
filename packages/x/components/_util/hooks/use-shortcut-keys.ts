import KeyCode from 'rc-util/lib/KeyCode';
import { useEffect, useState } from 'react';
import type { XComponentsConfig } from '../../x-provider/context';
import type { PrefixKeysType, ShortcutKeys } from '../type';
import warning from '../warning';
import useXComponentConfig from './use-x-component-config';

export const NumberKeyCode: number[] = Array.from({ length: 9 }, (_, i) => KeyCode.ONE + i);

type ActionShortcutInfo = {
  actionShortcutKey: ShortcutKeys<number>;
  actionKeyCode: number;
  name: string;
  timeStamp: number;
  actionKeyCodeNumber: number | false;
  index?: number;
};

const PrefixKeys: PrefixKeysType = {
  Alt: 'altKey',
  Ctrl: 'ctrlKey',
  Meta: 'metaKey',
  Shift: 'shiftKey',
};

type FlattenShortcutKeys = {
  name: string;
  shortcutKey: ShortcutKeys<number>;
  index?: number;
}[];

// ======================== Determine if the shortcut key has been hit, And return the corresponding data ========================
const getActionShortcutInfo = (
  shortcutKey: ShortcutKeys<number>,
  event: KeyboardEvent,
): false | Omit<ActionShortcutInfo, 'name' | 'index'> => {
  const copyShortcutKey = [...shortcutKey];
  const keyCode = copyShortcutKey.pop();
  const signKeys = copyShortcutKey as (keyof PrefixKeysType)[];

  const hitKey = signKeys.reduce((value, signKey) => {
    if (!value) return value;
    return (event[PrefixKeys[signKey]] as boolean) || false;
  }, keyCode === event.keyCode);

  if (hitKey)
    return {
      actionShortcutKey: shortcutKey,
      actionKeyCodeNumber:
        NumberKeyCode.indexOf(event.keyCode) > -1 ? NumberKeyCode.indexOf(event.keyCode) : false,
      actionKeyCode: event.keyCode,
      timeStamp: event.timeStamp,
    };
  return false;
};

// ======================== Get the decomposed shortcut keys ========================
const getDecomposedShortcutKeys = (
  shortcutKeys: ShortcutKeys,
): { prefixKeys: (keyof PrefixKeysType)[]; keyCodeDict: number[] } => {
  const copyShortcutKey = [...shortcutKeys];
  const keyCode = copyShortcutKey.pop() as number | 'number';
  const prefixKeys = copyShortcutKey as (keyof PrefixKeysType)[];
  const keyCodeDict = keyCode === 'number' ? NumberKeyCode : [keyCode];
  return {
    keyCodeDict,
    prefixKeys,
  };
};

// ======================== Use shortcut keys with the same configuration to waring ========================
const waringConfig = (
  flattenShortcutKeys: FlattenShortcutKeys,
  shortcutKey: ShortcutKeys<number>,
  component: keyof XComponentsConfig,
) => {
  const sameShortcutKeys = !!flattenShortcutKeys.find(
    ({ shortcutKey: oriShortcutKey }) => oriShortcutKey.toString() === shortcutKey.toString(),
  );

  warning(!sameShortcutKeys, component, `Same shortcutKey ${shortcutKey.toString()}`);
};

// ======================== Flatten shortcut key data ========================
const getFlattenShortcutKeys = (
  component: keyof XComponentsConfig,
  contextShortcutKeys: Record<string, ShortcutKeys | ShortcutKeys[]>,
  componentShortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
): FlattenShortcutKeys => {
  const mergeShortcutKeys = Object.assign({}, contextShortcutKeys || {}, componentShortcutKeys);
  return Object.keys(mergeShortcutKeys).reduce((flattenShortcutKeys, subName) => {
    const subShortcutKeys = mergeShortcutKeys[subName];
    if (!Array.isArray(subShortcutKeys)) {
      return flattenShortcutKeys;
    }
    if (subShortcutKeys.every((item) => Array.isArray(item))) {
      subShortcutKeys.forEach((shortcutKey, index) => {
        waringConfig(flattenShortcutKeys, shortcutKey as ShortcutKeys<number>, component);
        flattenShortcutKeys.push({
          name: subName,
          shortcutKey: shortcutKey as ShortcutKeys<number>,
          index,
        });
      });
    } else {
      const { keyCodeDict, prefixKeys } = getDecomposedShortcutKeys(
        subShortcutKeys as ShortcutKeys,
      );
      keyCodeDict.forEach((keyCode) => {
        waringConfig(
          flattenShortcutKeys,
          [...prefixKeys, keyCode] as ShortcutKeys<number>,
          component,
        );
        flattenShortcutKeys.push({
          name: subName,
          shortcutKey: [...prefixKeys, keyCode] as ShortcutKeys<number>,
        });
      });
    }
    return flattenShortcutKeys;
  }, [] as FlattenShortcutKeys);
};

// ================== Monitor shortcut key triggering ======================
const useShortcutKeys = <C extends keyof XComponentsConfig>(
  component: C,
  shortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
): [ActionShortcutInfo?] => {
  const contextConfig = useXComponentConfig(component);
  const flattenShortcutKeys = getFlattenShortcutKeys(
    component,
    contextConfig.shortcutKeys,
    shortcutKeys,
  );
  const [actionShortcutInfo, setActionShortcutInfo] = useState<ActionShortcutInfo>();

  useEffect(() => {
    if (flattenShortcutKeys.length === 0) return;
    const onKeydown = (event: KeyboardEvent) => {
      for (const shortcutKeyInfo of flattenShortcutKeys) {
        const activeKeyInfo = getActionShortcutInfo(shortcutKeyInfo.shortcutKey, event);
        if (activeKeyInfo) {
          setActionShortcutInfo({
            ...activeKeyInfo,
            name: shortcutKeyInfo.name,
            index: shortcutKeyInfo?.index,
          });
        }
      }
    };
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, [flattenShortcutKeys.length]);
  return [actionShortcutInfo];
};

export default useShortcutKeys;
