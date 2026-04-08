/**
 * Dialog - M3 modal dialog with backdrop,
 * focus trap, and portal rendering.
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DialogOverlay, DialogPanel } from '../utils/Dialog';
import { useFocusTrap } from '../../../hooks/useAccessible';
import type { DialogProps } from './DialogTypes';

export type { DialogProps } from './DialogTypes';

/** Modal dialog with escape-key and backdrop close. */
export function Dialog({
  open,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  fullScreen = false,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  testId,
  'aria-labelledby': ariaLabelledBy,
}: DialogProps): React.ReactElement | null {
  const { focusTrapRef } = useFocusTrap(open);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeKeyDown) {
        onClose();
      }
    },
    [onClose, disableEscapeKeyDown],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!disableBackdropClick) onClose();
  };

  const sizeProps = {
    sm: maxWidth === 'xs' || maxWidth === 'sm',
    lg: maxWidth === 'md' || maxWidth === 'lg',
    xl: maxWidth === 'xl',
  };

  const dialog = (
    <DialogOverlay onClick={handleBackdropClick}>
      <div ref={focusTrapRef}>
        <DialogPanel
          open={open}
          fullScreen={fullScreen}
          fullWidth={fullWidth}
          sm={sizeProps.sm}
          lg={sizeProps.lg}
          xl={sizeProps.xl}
          hasActions={true}
          testId={testId}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </DialogPanel>
      </div>
    </DialogOverlay>
  );

  if (typeof document !== 'undefined') {
    return createPortal(dialog, document.body);
  }
  return dialog;
}

export default Dialog;
