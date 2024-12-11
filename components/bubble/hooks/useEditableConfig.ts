import * as React from 'react';
import type { BubbleProps } from '../interface';

function useEditableConfig(editable: BubbleProps['editable']) {
  if (!editable) {
    return {
      enableEdit: false,
      isEditing: false,
      onEditorChange: () => {},
      onEditorCancel: () => {},
      onEditorEnd: () => {},
      editorTextAreaConfig: undefined,
      editorButtonsConfig: [],
    };
  }

  const editConfig = React.useMemo(() => editable, [editable]);
  const [isEditing, setIsEditing] = React.useState(editable.editing || false);

  React.useEffect(() => {
    setIsEditing(editConfig.editing || false);
  }, [editConfig.editing]);

  const handlers = {
    onEditorChange: (value: string) => {
      editConfig.onChange?.(value);
    },
    onEditorCancel: () => {
      editConfig.onCancel?.();
      setIsEditing(false);
    },
    onEditorEnd: (value: string) => {
      editConfig.onEnd?.(value);
      setIsEditing(false);
    },
  };

  return {
    enableEdit: true,
    isEditing,
    ...handlers,
    editorTextAreaConfig: editConfig.textarea,
    editorButtonsConfig: editConfig.buttons,
  };
}

export default useEditableConfig;
