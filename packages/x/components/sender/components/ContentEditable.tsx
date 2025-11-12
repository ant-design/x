import classnames from 'classnames';
import { useMergedState } from 'rc-util';
import React, { useEffect, useRef } from 'react';

interface ContentEditableProps {
  prefixCls?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ({ value }: { value: string }) => void;
}

const ContentEditable: React.FC<ContentEditableProps> = (props) => {
  const { prefixCls, className, placeholder, defaultValue, onChange } = props;

  const compCls = `${prefixCls}-content-editable`;

  const mergedCls = classnames(compCls, className);
  const contentRef = useRef<HTMLDivElement>(null);
  const initFlag = useRef(false);
  const setValue = (value?: string) => {
    if (value) {
      if (contentRef.current) {
        contentRef.current.innerHTML = value;
      }
    }
  };

  const [mergedValue, setMergedValue] = useMergedState<ContentEditableProps['value']>(
    defaultValue,
    {
      onChange: () => {
        onChange?.({
          value: getValue(),
        });
      },
    },
  );

  useEffect(() => {
    if (!initFlag.current) {
      initFlag.current = true;
      setValue(mergedValue);
    }
  }, [contentRef.current]);

  const getValue = (): string => {
    if (contentRef.current) {
      return contentRef.current.innerText?.trim?.();
    }
    return '';
  };

  const onInternalInput = () => {
    setMergedValue(getValue());
  };
  return (
    <div className={mergedCls}>
      <div
        className={classnames(`${compCls}-placeholder`, {
          [`${compCls}-placeholder-visible`]: !mergedValue,
        })}
        contentEditable={false}
      >
        {placeholder}
      </div>
      <div
        ref={contentRef}
        onInput={onInternalInput}
        contentEditable
        className={classnames(`${compCls}-edit`, {
          [`${compCls}-edit-empty-value`]: !mergedValue,
        })}
      />
    </div>
  );
};
export default ContentEditable;
