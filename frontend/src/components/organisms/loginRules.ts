/**
 * Validation rules for login form.
 * @module components/organisms/loginRules
 */
import type { ValidationRules } from '@/hooks';

/** Login form validation rules. */
export const LOGIN_RULES: ValidationRules = {
  email: [
    { required: true, message: 'Required' },
    {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      message: 'Invalid email',
    },
  ],
  password: [
    { required: true, message: 'Required' },
    { minLength: 8, message: 'Min 8 chars' },
  ],
};
