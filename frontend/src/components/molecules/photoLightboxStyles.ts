/**
 * Style constants for PhotoLightbox.
 * @module components/molecules/photoLightboxStyles
 */
import type { CSSProperties } from 'react';

/** Wrapper box styles for lightbox content. */
export const LIGHTBOX_BOX: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  minHeight: '60dvh',
};

/** Style for the previous/next nav buttons. */
export const PREV_BTN: CSSProperties = {
  position: 'absolute',
  left: 8,
};

/** Style for the next nav button. */
export const NEXT_BTN: CSSProperties = {
  position: 'absolute',
  right: 8,
};

/** Style for the lightbox image element. */
export const LIGHTBOX_IMG: CSSProperties = {
  maxHeight: '80dvh',
  maxWidth: '100%',
};

/** Style for DialogContent overscroll. */
export const DIALOG_CONTENT: CSSProperties = {
  overscrollBehavior: 'contain',
  padding: 0,
};
