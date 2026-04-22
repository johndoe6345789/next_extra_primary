'use client';

/**
 * Tool-links section for nav drawers.
 * Used in both the main app drawer and
 * the webmail sidebar — single source of truth.
 * @module shared/components/ui/DrawerToolLinks
 */
import React from 'react';
import TOOL_LINKS from
  '../../constants/tool-links.json';

/** Visual style variant for the host context. */
export type DrawerToolLinksVariant =
  | 'app'    // main app drawer (list-item-button)
  | 'mail';  // webmail sidebar (mailbox-tool-link)

/** Props for DrawerToolLinks. */
export interface DrawerToolLinksProps {
  /** Label shown above the section. */
  sectionLabel?: string;
  /**
   * Tool URLs to hide (e.g. omit webmail
   * when already inside webmail).
   */
  excludeUrls?: string[];
  /**
   * Style variant — 'app' uses main-app CSS
   * classes, 'mail' uses mailbox CSS classes.
   */
  variant?: DrawerToolLinksVariant;
  /** data-testid override. */
  testId?: string;
}

/**
 * Shared tool links list.
 * Reads from shared/constants/tool-links.json.
 *
 * @param props - Component props.
 */
export const DrawerToolLinks: React.FC<
  DrawerToolLinksProps
> = ({
  sectionLabel = 'Tools',
  excludeUrls = [],
  variant = 'app',
  testId = 'drawer-tools',
}) => {
  const tools = TOOL_LINKS.filter(
    (t) => !excludeUrls.includes(t.url),
  );

  if (tools.length === 0) return null;

  if (variant === 'mail') {
    return (
      <div data-testid={testId}
        className="mailbox-tools-section">
        <span className="mailbox-tools-label">
          {sectionLabel}
        </span>
        {tools.map((link) => (
          <a key={link.url} href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mailbox-tool-link"
            aria-label={link.label}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
            <span
              className="material-symbols-outlined
                mailbox-tool-ext"
              style={{ fontSize: 16 }}>
              open_in_new
            </span>
          </a>
        ))}
      </div>
    );
  }

  /* variant === 'app' — main drawer classes */
  return (
    <div data-testid={testId}>
      <div className="list-subheader">
        {sectionLabel}
      </div>
      {tools.map((link) => (
        <a key={link.url} href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="list-item-button"
          aria-label={link.label}>
          <span className="list-item-icon
            material-symbols-outlined"
            style={{ fontSize: 20 }}>
            {link.icon}
          </span>
          <span className="list-item-text">
            {link.label}
          </span>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, opacity: 0.5 }}>
            open_in_new
          </span>
        </a>
      ))}
    </div>
  );
};

export default DrawerToolLinks;
