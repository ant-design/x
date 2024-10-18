import classnames from 'classnames';
import React from 'react';
import { createPortal } from 'react-dom';

export interface DropUploaderProps {
  prefixCls: string;
  className: string;
  getDropContainer?: null | (() => HTMLElement | null | undefined);
  children?: React.ReactNode;
}

export default function DropArea(props: DropUploaderProps) {
  const { getDropContainer, className, prefixCls, children } = props;

  const [container, setContainer] = React.useState<HTMLElement | null | undefined>();
  const [showArea, setShowArea] = React.useState<boolean | null>(null);

  // ============================= MISC =============================

  // ========================== Container ===========================
  React.useEffect(() => {
    const nextContainer = getDropContainer?.();
    if (container !== nextContainer) {
      setContainer(nextContainer);
    }
  }, [getDropContainer]);

  // ============================= Drop =============================
  React.useEffect(() => {
    // Add global drop event
    if (container) {
      const onDragEnter = (e: DragEvent) => {
        setShowArea(true);
        console.log('enter');
      };

      // Should prevent default to make drop event work
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      };

      const onDragLeave = (e: DragEvent) => {
        if (!e.relatedTarget) {
          setShowArea(false);
          console.log('leave');
        }
      };
      const onDrop = (e: DragEvent) => {
        setShowArea(false);
        e.preventDefault();

        console.log('drop', e.defaultPrevented);
      };

      document.addEventListener('dragenter', onDragEnter);
      document.addEventListener('dragover', onDragOver);
      document.addEventListener('dragleave', onDragLeave);
      document.addEventListener('drop', onDrop);
      return () => {
        document.removeEventListener('dragenter', onDragEnter);
        document.removeEventListener('dragover', onDragOver);
        document.removeEventListener('dragleave', onDragLeave);
        document.removeEventListener('drop', onDrop);
      };
    }
  }, [!!container]);

  // ============================ Render ============================
  if (!getDropContainer || !container || showArea === null) {
    return null;
  }

  const areaCls = `${prefixCls}-drop-area`;

  return createPortal(
    <div
      className={classnames(areaCls, className, {
        [`${areaCls}-on-body`]: container.tagName === 'BODY',
      })}
      style={{
        display: showArea ? 'block' : 'none',
      }}
    >
      {children}
    </div>,
    container,
  );
}
