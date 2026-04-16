'use client';

/**
 * Dialog for starting a new DM thread.
 * Opens a user-search UI; selecting a user
 * creates a thread and calls onCreated.
 * @module components/organisms/NewDmDialog
 */

import React from 'react';
import {
  DialogOverlay,
  DialogPanel,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
} from '@shared/m3/utils/Dialog';
import { useTranslations } from 'next-intl';
import { useNewDm } from '@/hooks/useNewDm';
import NewDmUserSearch from './NewDmUserSearch';
import type { UserProfile } from '@/types/user';

/** Props for NewDmDialog. */
export interface NewDmDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog should close. */
  onClose: () => void;
  /**
   * Called after a new thread is created.
   * @param threadId - The new thread's ID.
   */
  onCreated: (threadId: string) => void;
}

/**
 * Modal dialog for composing a new DM.
 * @param props - Component props.
 */
const NewDmDialog: React.FC<NewDmDialogProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const t = useTranslations('social');
  const {
    query,
    setQuery,
    results,
    searching,
    creating,
    createThread,
  } = useNewDm();

  const handleSelect = async (user: UserProfile) => {
    const id = await createThread(user.id);
    if (id) {
      onClose();
      onCreated(id);
    }
  };

  if (!open) return null;

  return (
    <DialogOverlay
      onClick={onClose}
      data-testid="new-dm-overlay"
    >
      <DialogPanel
        open={open}
        testId="new-dm-dialog"
        aria-labelledby="new-dm-title"
      >
        <DialogHeader>
          <DialogTitle id="new-dm-title">
            {t('newDm.title')}
          </DialogTitle>
          <DialogClose
            onClick={onClose}
            aria-label={t('newDm.close')}
          />
        </DialogHeader>
        <DialogContent>
          <NewDmUserSearch
            query={query}
            onQueryChange={setQuery}
            results={results}
            searching={searching}
            onSelect={handleSelect}
            creating={creating}
          />
        </DialogContent>
      </DialogPanel>
    </DialogOverlay>
  );
};

export default NewDmDialog;
