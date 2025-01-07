import classNames from 'classnames';
import * as React from 'react';

import { Button, Flex, Input } from 'antd';
import type { TextAreaRef } from 'antd/lib/input/TextArea';
import type { EditConfig } from './interface';
import useStyle from './style';

const { TextArea } = Input;

interface EditableProps extends EditConfig {
  prefixCls: string;
  value: string;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  editorTextAreaConfig?: EditConfig['textarea'];
  editorButtonsConfig?: EditConfig['buttons'];
}

const Editor: React.FC<EditableProps> = (props) => {
  const {
    prefixCls,
    className,
    style,
    value,
    onChange,
    onCancel,
    onEnd,
    editorTextAreaConfig,
    editorButtonsConfig,
  } = props;
  const textAreaRef = React.useRef<TextAreaRef>(null);

  const [current, setCurrent] = React.useState(value);

  React.useEffect(() => {
    setCurrent(value);
  }, [value]);

  React.useEffect(() => {
    if (textAreaRef.current?.resizableTextArea) {
      const { textArea } = textAreaRef.current.resizableTextArea;
      textArea.focus();
      const { length } = textArea.value;
      textArea.setSelectionRange(length, length);
    }
  }, []);

  const onTextAreaChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target }) => {
    setCurrent(target.value.replace(/[\n\r]/g, ''));
    onChange?.(target.value.replace(/[\n\r]/g, ''));
  };

  const confirmEnd = () => {
    onEnd?.(current.trim());
  };

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const editorClassName = classNames(
    prefixCls,
    `${prefixCls}-editor`,
    className,
    hashId,
    cssVarCls,
  );

  const EditorButtons: React.FC<EditConfig['buttons']> = (editorButtonsConfig) => {
    const defaultButtonsConfig = [
      { type: 'cancel', text: 'Cancel', option: {} },
      { type: 'save', text: 'Save', option: {} },
    ];

    const buttonsConfig =
      editorButtonsConfig && editorButtonsConfig.length > 0
        ? editorButtonsConfig
        : defaultButtonsConfig;

    return buttonsConfig.map((config, index) => {
      const { type, text, option } = config;
      const handlers = {
        cancel: onCancel,
        save: confirmEnd,
      };
      return (
        <Button
          size="small"
          key={index}
          type={type === 'save' ? 'primary' : undefined}
          {...option}
          onClick={handlers[type as keyof typeof handlers]}
        >
          {text || type}
        </Button>
      );
    });
  };

  return wrapCSSVar(
    <div className={editorClassName} style={style}>
      <Flex gap="small" vertical flex="auto">
        <TextArea
          variant="borderless"
          ref={textAreaRef}
          value={current}
          onChange={onTextAreaChange}
          autoSize={{ minRows: 2, maxRows: 3 }}
          {...editorTextAreaConfig}
        />
        <Flex gap="small" justify="end">
          {EditorButtons(editorButtonsConfig)}
        </Flex>
      </Flex>
    </div>,
  );
};

export default Editor;
