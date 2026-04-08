/**
 * Configuration for the ShortcutCheatSheet
 * dialog.
 * @module organisms/shortcutCheatSheetConfig
 */
import type { ShortcutDef } from
  '@/lib/shortcutLabel';
import shortcuts from
  '@/constants/keyboard-shortcuts.json';

/** A named group of shortcut definitions. */
type Section = Record<string, ShortcutDef>;

/** Shortcut category identifiers. */
export type SectionKey =
  'global' | 'chat' | 'navigation';

/** Category key paired with its data. */
export interface SectionEntry {
  /** Category identifier. */
  key: SectionKey;
  /** Shortcut definitions for this section. */
  data: Section;
}

/** Ordered list of shortcut sections. */
export const SECTION_KEYS: SectionEntry[] = [
  {
    key: 'global',
    data: shortcuts.global as Section,
  },
  {
    key: 'chat',
    data: shortcuts.chat as Section,
  },
  {
    key: 'navigation',
    data: shortcuts.navigation as Section,
  },
];
