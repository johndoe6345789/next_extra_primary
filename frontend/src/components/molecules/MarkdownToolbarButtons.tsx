'use client';

import React from 'react';
import { Box, Button } from '@shared/m3';
import { MD_ACTIONS } from './markdownToolbarActions';
import type { MdAction } from './markdownActionTypes';
import s from './MarkdownEditor.module.scss';

/** Props for MarkdownToolbarButtons. */
export interface MarkdownToolbarButtonsProps {
  onAction: (a: MdAction) => () => void;
  onOpenLink: () => void;
  onOpenLang: () => void;
  langBtnRef: React.RefObject<HTMLButtonElement | null>;
}

/** Pure presentational row of formatting buttons. */
export function MarkdownToolbarButtons({
  onAction, onOpenLink, onOpenLang, langBtnRef,
}: MarkdownToolbarButtonsProps): React.ReactElement {
  return (
    <Box
      className={s.toolbar}
      role="toolbar"
      aria-label="Formatting"
      data-testid="md-toolbar"
    >
      {MD_ACTIONS.map((a) => {
        const btn = (
          <Button
            type="button"
            size="small"
            variant="text"
            onClick={onAction(a)}
            aria-label={a.label}
            testId={`md-tb-${a.label}`}
          >
            {a.label}
          </Button>
        );
        if (a.label !== 'Code') {
          return (
            <React.Fragment key={a.label}>
              {btn}
            </React.Fragment>
          );
        }
        return (
          <span key={a.label} className={s.codeGroup}>
            {btn}
            <Button
              ref={langBtnRef as React.Ref<
                HTMLInputElement | HTMLDivElement
              >}
              type="button"
              size="small"
              variant="text"
              className={s.codeLangBtn}
              onClick={onOpenLang}
              aria-label="Pick code language"
              testId="md-tb-Code-lang"
            >
              ▾
            </Button>
          </span>
        );
      })}
      <Button
        type="button"
        size="small"
        variant="text"
        onClick={onOpenLink}
        aria-label="Link"
        testId="md-tb-Link"
      >
        Link
      </Button>
    </Box>
  );
}
