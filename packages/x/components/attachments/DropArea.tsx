import clsx from 'clsx';
import React from 'react';
import { createPortal } from 'react-dom';
import { AttachmentContext } from './context';

export interface DropUploaderProps {
  prefixCls: string;
  className: string;
  style?: React.CSSProperties;
  getDropContainer?: null | (() => HTMLElement | null | undefined);
  children?: React.ReactNode;
}

export default function DropArea(props: DropUploaderProps) {
  const { getDropContainer, className, prefixCls, children, style } = props;
  const { disabled } = React.useContext(AttachmentContext);

  const [container, setContainer] = React.useState<HTMLElement | null | undefined>();
  const [showArea, setShowArea] = React.useState<boolean | null>(null);

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
      const onDragEnter = () => {
        setShowArea(true);
      };

      // Should prevent default to make drop event work
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      };

      const onDragLeave = (e: DragEvent) => {
        if (!e.relatedTarget) {
          setShowArea(false);
        }
      };
      const onDrop = (e: DragEvent) => {
        setShowArea(false);
        e.preventDefault();
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

  // =========================== Visible ============================
  const showDropdown = getDropContainer && container && !disabled;

  // ============================ Render ============================
  if (!showDropdown) {
    return null;
  }

  const areaCls = `${prefixCls}-drop-area`;

  return createPortal(
    <div
      className={clsx(areaCls, className, {
        [`${areaCls}-on-body`]: container.tagName === 'BODY',
      })}
      style={{ display: showArea ? 'block' : 'none', ...style }}
    >
      {children}
    </div>,
    container,
  );
}
