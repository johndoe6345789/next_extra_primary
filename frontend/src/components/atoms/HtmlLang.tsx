'use client';

import { useEffect } from 'react';

/** Props for the HtmlLang component. */
interface HtmlLangProps {
  /** BCP-47 locale tag to set on <html>. */
  readonly locale: string;
}

/**
 * Sets the `lang` attribute on the root `<html>`
 * element to match the active locale.
 *
 * @param props - Component props.
 * @returns Nothing (side-effect only).
 */
export function HtmlLang({
  locale,
}: HtmlLangProps): null {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
