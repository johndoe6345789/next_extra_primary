import type React from 'react'

/**
 * Build multi-column content styles.
 * @param columnHeight - Max column height.
 * @returns CSSProperties for multi-column.
 */
export function buildMultiColumnStyle(
  columnHeight?: number
): React.CSSProperties {
  const maxH = columnHeight
    ?? Math.round(window.innerHeight * 0.8);
  return {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    maxHeight: `${maxH}px`,
  };
}

/**
 * Build panel positioning styles.
 * @param position - Base position styles.
 * @param multiColumn - Multi-column mode.
 * @param extraStyle - Additional style overrides.
 * @returns Merged panel CSSProperties.
 */
export function buildPanelStyle(
  position: React.CSSProperties,
  multiColumn?: boolean,
  extraStyle?: React.CSSProperties,
): React.CSSProperties {
  return {
    ...position,
    ...(multiColumn
      ? {
          maxWidth: 'none',
          overflow: 'auto',
          maxHeight: `${
            Math.round(
              window.innerHeight * 0.9
            )
          }px`,
        }
      : {}),
    ...extraStyle,
  };
}
