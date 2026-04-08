import styles
  from '../../../scss/atoms/typography.module.scss'

/** Map variant names to CSS classes. */
export const variantMap: Record<
  string, string
> = {
  h1: styles.typographyH1,
  h2: styles.typographyH2,
  h3: styles.typographyH3,
  h4: styles.typographyH4,
  h5: styles.typographyH5,
  h6: styles.typographyH6,
  body1: styles.typographyBody1,
  body2: styles.typographyBody2,
  subtitle1: styles.typographySubtitle1,
  subtitle2: styles.typographySubtitle2,
  caption: styles.typographyCaption,
  overline: styles.typographyOverline,
}

/** Map color names to CSS classes. */
export const colorMap: Record<
  string, string | undefined
> = {
  primary: styles.typographyPrimary,
  secondary: styles.typographySecondary,
  error: styles.typographyError,
  inherit: styles.typographyInherit,
}

/** Map align values to CSS classes. */
export const alignMap: Record<
  string, string | undefined
> = {
  center: styles.typographyCenter,
  right: styles.typographyRight,
}
