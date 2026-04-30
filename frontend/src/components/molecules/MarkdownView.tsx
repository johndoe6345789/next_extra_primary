'use client';

import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import s from './MarkdownView.module.scss';

/** Props for MarkdownView. */
export interface MarkdownViewProps {
  /** Markdown source. */
  source: string;
  /** Optional override className. */
  className?: string;
}

/** Marked options: GitHub-style line breaks, no
 *  HTML passthrough (DOMPurify also enforces this). */
marked.setOptions({ breaks: true, gfm: true });

/** Render untrusted markdown safely:
 *  marked → HTML → DOMPurify sanitise.
 *  DOMPurify is the documented React-recommended
 *  defence against XSS when using
 *  dangerouslySetInnerHTML. */
export function MarkdownView({
  source, className,
}: MarkdownViewProps): React.ReactElement {
  const html = useMemo(() => {
    if (!source) return '';
    const raw = marked.parse(source, {
      async: false,
    }) as string;
    return DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
    });
  }, [source]);

  if (!source) return <></>;

  return (
    <div
      className={`${s.markdown} ${className ?? ''}`}
      // sanitised by DOMPurify on the line above
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid="markdown-view"
    />
  );
}

export default MarkdownView;
