/**
 * Property maps and sets for the sx utility.
 */

export { colorMap } from './sxColorMap'

/** Map sx shorthand properties to CSS. */
export const sxToCssMap: Record<
  string, string | string[]
> = {
  m: 'margin',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],
  p: 'padding',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
  gap: 'gap',
  rowGap: 'rowGap',
  columnGap: 'columnGap',
  bgcolor: 'backgroundColor',
  color: 'color',
  border: 'border',
  borderRadius: 'borderRadius',
  borderColor: 'borderColor',
  width: 'width',
  height: 'height',
  minWidth: 'minWidth',
  maxWidth: 'maxWidth',
  minHeight: 'minHeight',
  maxHeight: 'maxHeight',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  lineHeight: 'lineHeight',
  textAlign: 'textAlign',
  display: 'display',
  flex: 'flex',
  flexDirection: 'flexDirection',
  flexWrap: 'flexWrap',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
  alignContent: 'alignContent',
  alignSelf: 'alignSelf',
  gridTemplateColumns: 'gridTemplateColumns',
  gridTemplateRows: 'gridTemplateRows',
  gridColumn: 'gridColumn',
  gridRow: 'gridRow',
  position: 'position',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  zIndex: 'zIndex',
  boxShadow: 'boxShadow',
  opacity: 'opacity',
  overflow: 'overflow',
  cursor: 'cursor',
  transform: 'transform',
  transition: 'transition',
}

/** Properties using spacing units (8px). */
export const spacingProperties = new Set([
  'm', 'mt', 'mb', 'ml', 'mr', 'mx', 'my',
  'p', 'pt', 'pb', 'pl', 'pr', 'px', 'py',
  'gap', 'rowGap', 'columnGap',
])

/** Properties needing px suffix for numbers. */
export const pixelProperties = new Set([
  'width', 'height', 'minWidth', 'maxWidth',
  'minHeight', 'maxHeight', 'top', 'right',
  'bottom', 'left', 'fontSize', 'borderRadius',
])
