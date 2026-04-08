/** Props for the NotFoundState component. */
export interface NotFoundStateProps {
  /** Error code to display */
  errorCode?: string | number;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Primary action button text */
  primaryActionText?: string;
  /** Primary action button href */
  primaryActionHref?: string;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Secondary action button href */
  secondaryActionHref?: string;
  /** Additional CSS class */
  className?: string;
  [key: string]: unknown;
}
