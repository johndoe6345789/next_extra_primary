/**
 * Barrel export for shared UI components.
 * @module shared/components/ui
 */

export { NavbarLogo } from './NavbarLogo';
export type { NavbarLogoProps } from './NavbarLogo';

export { HeroCta } from './HeroCta';
export type { HeroCtaProps } from './HeroCta';

export { Footer } from './Footer';
export type {
  FooterProps,
  FooterLink,
} from './Footer';

export { DrawerNavItem } from './DrawerNavItem';
export type {
  DrawerNavItemProps,
} from './DrawerNavItem';

export { FeatureCard } from './FeatureCard';
export type { FeatureCardProps }
  from './FeatureCard';

export { FeatureGrid } from './FeatureGrid';
export type { FeatureGridProps }
  from './FeatureGrid';

export { AuthHero } from './AuthHero';

export { BurgerButton } from './BurgerButton';
export type { BurgerButtonProps }
  from './BurgerButton';

export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

export { LoginFormFields } from './LoginFormFields';
export type { LoginFieldsProps }
  from './LoginFormFields';

export { RegisterForm } from './RegisterForm';
export type { RegisterFormProps }
  from './RegisterForm';

export { RegisterFormFields }
  from './RegisterFormFields';
export type {
  RegisterFieldsProps,
  RegFields,
} from './RegisterFormFields';

export { ForgotPasswordForm }
  from './ForgotPasswordForm';
export type { ForgotPasswordFormProps }
  from './ForgotPasswordForm';

export { SearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';

export { LinkProvider, useLink } from './LinkContext';
export type { LinkComponent } from './LinkContext';

export { DrawerProvider, useDrawer } from './DrawerContext';
