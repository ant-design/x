import type { ButtonProps, GetProps, InputProps } from 'antd';
import type React from 'react';
import type { SlotTextAreaRef } from './SlotTextArea';
import type { TextAreaRef } from './TextArea';
import type { AllowSpeech } from './useSpeech';

type TextareaProps = GetProps<typeof import('antd').Input.TextArea>;

export type SubmitType = 'enter' | 'shiftEnter' | false;

type SemanticType = 'root' | 'prefix' | 'input' | 'suffix' | 'footer' | 'switch' | 'content';

export type insertPosition = 'start' | 'end' | 'cursor';
export interface SenderComponents {
  input?: React.ComponentType<TextareaProps>;
}

export type ActionsComponents = {
  SendButton: React.ComponentType<ButtonProps>;
  ClearButton: React.ComponentType<ButtonProps>;
  LoadingButton: React.ComponentType<ButtonProps>;
  SpeechButton: React.ComponentType<ButtonProps>;
};

export type BaseNode = React.ReactNode | false;
export type NodeRender = (
  oriNode: React.ReactNode,
  info: {
    components: ActionsComponents;
  },
) => BaseNode;

interface SlotConfigBaseType {
  type: 'text' | 'input' | 'select' | 'tag' | 'custom' | 'content';
  formatResult?: (value: any) => string;
}

interface SlotConfigTextType extends SlotConfigBaseType {
  type: 'text';
  value?: string;
  editable?: boolean;
  placeholder?: string;
  key?: string;
}

interface SlotConfigContentType extends SlotConfigBaseType {
  type: 'content';
  key: string;
  props?: {
    defaultValue?: any;
    [key: string]: any;
  };
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
    props: {
      disabled?: boolean;
      readOnly?: boolean;
    },
    item: SlotConfigType,
  ) => React.ReactNode;
}

export type EditSlotConfigType = SlotConfigContentType;
export type SlotConfigType =
  | SlotConfigTextType
  | SlotConfigInputType
  | SlotConfigSelectType
  | SlotConfigTagType
  | SlotConfigCustomType
  | SlotConfigContentType;

export type EventType =
  | React.FormEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLTextAreaElement>;
export interface SenderProps
  extends Pick<TextareaProps, 'placeholder' | 'onKeyUp' | 'onFocus' | 'onBlur'> {
  prefixCls?: string;
  defaultValue?: string;
  value?: string;
  loading?: boolean;
  readOnly?: boolean;
  submitType?: SubmitType;
  disabled?: boolean;
  slotConfig?: Readonly<SlotConfigType[]>;
  onSubmit?: (message: string, slotConfig?: SlotConfigType[]) => void;
  onChange?: (value: string, event?: EventType, slotConfig?: SlotConfigType[]) => void;
  onCancel?: VoidFunction;
  onKeyDown?: React.KeyboardEventHandler<any>;
  onPaste?: React.ClipboardEventHandler<HTMLElement>;
  onPasteFile?: (files: FileList) => void;
  components?: SenderComponents;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  rootClassName?: string;
  style?: React.CSSProperties;
  className?: string;
  allowSpeech?: AllowSpeech;
  prefix?: BaseNode | NodeRender;
  footer?: BaseNode | NodeRender;
  suffix?: BaseNode | NodeRender;
  header?: BaseNode | NodeRender;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}

export type SenderRef = Omit<TextAreaRef, 'nativeElement'> &
  Omit<SlotTextAreaRef, 'nativeElement'> & {
    inputElement: TextAreaRef['nativeElement'] | SlotTextAreaRef['nativeElement'];
    nativeElement: HTMLDivElement;
  };
