import type { ButtonProps, GetProps, InputProps, TooltipProps } from 'antd';
import type React from 'react';
import type { AllowSpeech } from './hooks/use-speech';
import type { SlotTextAreaRef } from './SlotTextArea';
import type { TextAreaRef } from './TextArea';

type TextareaProps = GetProps<typeof import('antd').Input.TextArea>;

export type SubmitType = 'enter' | 'shiftEnter' | false;

type SemanticType = 'root' | 'prefix' | 'input' | 'suffix' | 'footer' | 'switch' | 'content';

export type InsertPosition = 'start' | 'end' | 'cursor';
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
  type: 'text' | 'input' | 'select' | 'tag' | 'custom' | 'content' | 'skill';
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
export interface SkillType {
  title?: React.ReactNode;
  value: string;
  toolTip?: TooltipProps;
  closable?:
    | boolean
    | {
        closeIcon?: React.ReactNode;
        onClose?: React.MouseEventHandler<HTMLDivElement>;
        disabled?: boolean;
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
  onSubmit?: (message: string, slotConfig?: SlotConfigType[], skill?: SkillType) => void;
  onChange?: (
    value: string,
    event?: EventType,
    slotConfig?: SlotConfigType[],
    skill?: SkillType,
  ) => void;
  onCancel?: VoidFunction;
  onKeyDown?: (event: React.KeyboardEvent) => void | false;
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
  skill?: SkillType;
}

export type SenderRef = Omit<TextAreaRef, 'nativeElement'> &
  Omit<SlotTextAreaRef, 'nativeElement'> & {
    inputElement: TextAreaRef['nativeElement'] | SlotTextAreaRef['nativeElement'];
    nativeElement: HTMLDivElement;
  };
