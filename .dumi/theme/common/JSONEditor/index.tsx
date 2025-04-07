import React, { useEffect, useRef } from 'react';
import type { JSONEditorPropsOptional, JsonEditor } from 'vanilla-jsoneditor';
import { Mode, createJSONEditor } from 'vanilla-jsoneditor';

const Editor: React.FC<JSONEditorPropsOptional> = (props) => {
  const editorRef = useRef<JsonEditor>();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      editorRef.current = createJSONEditor({
        target: container.current,
        props: {
          mode: Mode.text,
        },
      });
    }
    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    editorRef.current?.updateProps(props);
  }, [props.content]);

  return <div ref={container} className="vanilla-jsoneditor-react" />;
};

export default Editor;
