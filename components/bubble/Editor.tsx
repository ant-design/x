import classNames from 'classnames';
import * as React from 'react';

import { Button, Flex, Input } from 'antd';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import { EditConfig } from './interface';
import useStyle from './style';

const { TextArea } = Input;

interface EditableProps {
  prefixCls: string;
  value: string;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: (value: string) => void;
  editorClassName?: string;
  editorStyle?: React.CSSProperties;
  editorTextAreaConfig?: EditConfig['editorTextAreaConfig'];
  editorButtonConfig?: EditConfig['editorButtonConfig'];
}

const Editor: React.FC<EditableProps> = (props) => {
  const {
    prefixCls,
    editorClassName: className,
    editorStyle,
    value,
    onChange,
    onCancel,
    onEnd,
    editorTextAreaConfig,
    editorButtonConfig,
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

  const CancelButton = () =>
    editorButtonConfig ? (
      editorButtonConfig
        .filter((config) => config.type === 'cancel')
        .map((config, index) => (
          <Button key={index} size="small" {...config.option} onClick={onCancel}>
            {config.text || 'Cancel'}
          </Button>
        ))
    ) : (
      <Button size="small" onClick={onCancel}>
        Cancel
      </Button>
    );
  const SaveButton = () =>
    editorButtonConfig ? (
      editorButtonConfig
        .filter((config) => config.type === 'save')
        .map((config, index) => (
          <Button key={index} type="primary" size="small" {...config.option} onClick={confirmEnd}>
            {config.text || 'Save'}
          </Button>
        ))
    ) : (
      <Button type="primary" size="small" onClick={confirmEnd}>
        Save
      </Button>
    );

  return wrapCSSVar(
    <div className={editorClassName} style={editorStyle}>
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
          <CancelButton />
          <SaveButton />
        </Flex>
      </Flex>
    </div>,
  );
};

export default Editor;
