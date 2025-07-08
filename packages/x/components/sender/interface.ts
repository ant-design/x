import type { ButtonProps, GetProps, InputProps } from 'antd';
import type React from 'react';
import type { SlotTextAreaRef } from './SlotTextArea';
import type { TextAreaRef } from './TextArea';
import type { AllowSpeech } from './useSpeech';

type TextareaProps = GetProps<typeof import('antd').Input.TextArea>;

export type SubmitType = 'enter' | 'shiftEnter' | false;

export interface SenderComponents {
  input?: React.ComponentType<TextareaProps>;
}

export type ActionsComponents = {
  SendButton: React.ComponentType<ButtonProps>;
  ClearButton: React.ComponentType<ButtonProps>;
  LoadingButton: React.ComponentType<ButtonProps>;
  SpeechButton: React.ComponentType<ButtonProps>;
};

export type ActionsRender = (
  ori: React.ReactNode,
  info: {
    components: ActionsComponents;
  },
) => React.ReactNode;

export type FooterRender = (info: { components: ActionsComponents }) => React.ReactNode;

interface SlotConfigBaseType {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom';
  formatResult?: (value: any) => string;
}

interface SlotConfigTextType extends SlotConfigBaseType {
  type: 'text';
  text?: string;
  key?: string;
}

interface SlotConfigInputType extends SlotConfigBaseType {
  type: 'input';
  key: string;
  props?: {
    defaultValue?: InputProps['defaultValue'];
    placeholder?: string | undefined;
  };
}

interface SlotConfigSelectType extends SlotConfigBaseType {
  type: 'select';
  key: string;
  props?: {
    defaultValue?: string;
    options: string[];
    placeholder?: string | undefined;
  };
}

interface SlotConfigTagType extends SlotConfigBaseType {
  type: 'tag';
  key: string;
  props?: {
    label: React.ReactNode;
    value?: string;
  };
}

interface SlotConfigCustomType extends SlotConfigBaseType {
  type: 'custom';
  key: string;
  props?: {
    defaultValue?: any;
    [key: string]: any;
  };
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    item: SlotConfigType,
  ) => React.ReactNode;
}

export type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType;

export interface SenderProps
  extends Pick<TextareaProps, 'placeholder' | 'onKeyUp' | 'onFocus' | 'onBlur'> {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  readOnly?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  slotConfig?: SlotConfigType[];
  onSubmit?: (message: string, slotConfig?: SlotConfigType[]) => void;
  onChange?: (
    value: string,
    event?: React.FormEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLTextAreaElement>,
    slotConfig?: SlotConfigType[],
  ) => void;
  onCancel?: VoidFunction;
  onKeyDown?: React.KeyboardEventHandler<any>;
  onPaste?: React.ClipboardEventHandler<HTMLElement>;
  onPasteFile?: (firstFile: File, files: FileList) => void;
  components?: SenderComponents;
  styles?: {
    prefix?: React.CSSProperties;
    input?: React.CSSProperties;
    actions?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
  rootClassName?: string;
  classNames?: {
    prefix?: string;
    input?: string;
    actions?: string;
    footer?: string;
  };
  style?: React.CSSProperties;
  className?: string;
  actions?: React.ReactNode | ActionsRender;
  allowSpeech?: AllowSpeech;
  prefix?: React.ReactNode;
  footer?: React.ReactNode | FooterRender;
  header?: React.ReactNode;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export type SenderRef = TextAreaRef | SlotTextAreaRef;
