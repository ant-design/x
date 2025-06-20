import KeyCode from 'rc-util/lib/KeyCode';
import { useEffect, useRef, useState } from 'react';
import type { XComponentsConfig } from '../../x-provider/context';
import type { CodeKeyType, PrefixKeysType, ShortcutKeys } from '../type';
import warning from '../warning';
import useXComponentConfig from './use-x-component-config';

export type ShortcutKeyActionType = {
  actionShortcutKey: ShortcutKeys<number>;
  actionKeyCode: number;
  name: string;
  timeStamp: number;
  actionKeyCodeNumber: number | false;
  index?: number;
};

export type ShortcutKeyInfoType = {
  shortcutKeys: ShortcutKeys | ShortcutKeys[];
  shortcutKeysIcon: string[] | string[][];
};

type ShortcutKeysInfo = Record<string, ShortcutKeyInfoType>;

type FlattenShortcutKeysType = {
  name: string;
  shortcutKey: ShortcutKeys<number>;
  index?: number;
}[];

type Observer = (ShortcutKeyAction: ShortcutKeyActionType) => void;
type Subscribe = (fn: Observer) => void;

const PrefixKeys: PrefixKeysType = {
  Alt: ['altKey', '⌥', 'Alt'],
  Ctrl: ['ctrlKey', '⌃', 'Ctrl'],
  Meta: ['metaKey', '⌘', 'Win'],
  Shift: ['shiftKey', '⇧', 'Shift'],
};

const NumberKeyCode: number[] = Array.from({ length: 9 }, (_, i) => KeyCode.ONE + i);

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

// ======================== Shortcut Keys Icon ========================

const getShortcutKeysIcon = (key: CodeKeyType): string => {
  if (key === 'number') {
    return key;
  }
  if (typeof key === 'string' && PrefixKeys?.[key]?.[isAppleDevice ? 1 : 2]) {
    return PrefixKeys[key][isAppleDevice ? 1 : 2];
  }
  return Object.entries(KeyCode || {})?.find(([_, v]) => v === key)?.[0] || '';
};

// ======================== Determine if the shortcut key has been hit, And return the corresponding data ========================
const getShortcutAction = (
  shortcutKey: ShortcutKeys<number>,
  event: KeyboardEvent,
): false | Omit<ShortcutKeyActionType, 'name' | 'index'> => {
  const copyShortcutKey = [...shortcutKey];
  const keyCode = copyShortcutKey.pop();
  const signKeys = copyShortcutKey as (keyof PrefixKeysType)[];

  const hitKey = signKeys.reduce((value, signKey) => {
    if (!value) return value;
    return (event[PrefixKeys?.[signKey]?.[0]] as boolean) || false;
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
  flattenShortcutKeys: FlattenShortcutKeysType,
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
): { flattenShortcutKeys: FlattenShortcutKeysType; shortcutKeysInfo: ShortcutKeysInfo } => {
  const mergeShortcutKeys = Object.assign({}, contextShortcutKeys || {}, componentShortcutKeys);
  return Object.keys(mergeShortcutKeys).reduce(
    ({ flattenShortcutKeys, shortcutKeysInfo }, subName) => {
      const subShortcutKeys = mergeShortcutKeys[subName];
      if (!Array.isArray(subShortcutKeys)) {
        return { flattenShortcutKeys, shortcutKeysInfo };
      }
      shortcutKeysInfo = {
        ...shortcutKeysInfo,
        [subName]: {
          shortcutKeys: subShortcutKeys,
          shortcutKeysIcon: [],
        },
      };

      if (subShortcutKeys.every((item) => Array.isArray(item))) {
        subShortcutKeys.forEach((shortcutKey, index) => {
          const shortcutKeyArr = shortcutKey as ShortcutKeys<number>;
          waringConfig(flattenShortcutKeys, shortcutKeyArr, component);
          flattenShortcutKeys.push({
            name: subName,
            shortcutKey: shortcutKeyArr,
            index,
          });
          (shortcutKeysInfo[subName].shortcutKeysIcon as string[][]).push(
            shortcutKeyArr?.map((key) => getShortcutKeysIcon(key)),
          );
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
        shortcutKeysInfo[subName].shortcutKeysIcon = subShortcutKeys.map((key) =>
          getShortcutKeysIcon(key as CodeKeyType),
        );
      }
      return { flattenShortcutKeys, shortcutKeysInfo };
    },
    {
      flattenShortcutKeys: [] as FlattenShortcutKeysType,
      shortcutKeysInfo: {} as ShortcutKeysInfo,
    },
  );
};

const useObservable = (): [React.RefObject<Observer | undefined>, Subscribe] => {
  const observer = useRef<Observer>(undefined);
  const subscribe = (fn: Observer) => {
    observer.current = fn;
  };
  return [observer, subscribe];
};

// ================== Monitor shortcut key triggering ======================
const useShortcutKeys = (
  component: keyof XComponentsConfig,
  shortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
): [ShortcutKeyActionType | null, ShortcutKeysInfo, Subscribe] => {
  const contextConfig = useXComponentConfig(component);
  const { flattenShortcutKeys, shortcutKeysInfo } = getFlattenShortcutKeys(
    component,
    contextConfig.shortcutKeys,
    shortcutKeys,
  );

  const [shortcutAction, setShortcutAction] = useState<ShortcutKeyActionType | null>(null);
  const [observer, subscribe] = useObservable();
  const keyLockRef = useRef(false);

  const onKeydown = (event: KeyboardEvent) => {
    for (const shortcutKeyInfo of flattenShortcutKeys) {
      const activeKeyInfo = getShortcutAction(shortcutKeyInfo.shortcutKey, event);
      if (activeKeyInfo) {
        const info = {
          ...activeKeyInfo,
          name: shortcutKeyInfo.name,
          index: shortcutKeyInfo?.index,
        };
        if (keyLockRef.current) {
          return;
        }
        keyLockRef.current = true;
        setShortcutAction(info);
        observer?.current?.(info);
      }
    }
  };

  const onKeyup = () => {
    keyLockRef.current = false;
  };

  useEffect(() => {
    if (flattenShortcutKeys.length === 0) return;
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);

    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.addEventListener('keyup', onKeyup);
    };
  }, [flattenShortcutKeys.length, observer]);
  return [shortcutAction, shortcutKeysInfo, subscribe];
};

export default useShortcutKeys;
