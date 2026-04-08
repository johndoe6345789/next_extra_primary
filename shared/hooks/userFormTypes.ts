/**
 * Type definitions for useUserForm hook
 */

import type { User } from '@/lib/level-types'
import type {
  UserFormData,
  UserFormErrors,
} from '@/lib/validation/user-validation'

export interface UseUserFormOptions {
  baseUrl?: string
  initialData?: Partial<User>
  onSuccess?: (user: User) => void
  onError?: (error: string) => void
}

export interface UseUserFormState {
  formData: UserFormData
  errors: UserFormErrors
  loading: boolean
  submitError: string | null
  isValid: boolean
  isDirty: boolean
}

export interface UseUserFormHandlers {
  setField: (
    name: keyof UserFormData,
    value: unknown
  ) => void
  setErrors: (
    errors: Partial<UserFormErrors>
  ) => void
  validateForm: () => boolean
  validateField: (
    field: keyof UserFormData
  ) => boolean
  submitCreate: (
    data?: UserFormData
  ) => Promise<User | null>
  submitUpdate: (
    userId: string,
    data?: UserFormData
  ) => Promise<User | null>
  reset: () => void
}

export interface UseUserFormReturn
  extends UseUserFormState {
  handlers: UseUserFormHandlers
}

/** Default form data structure */
export const DEFAULT_FORM_DATA: UserFormData = {
  username: '',
  email: '',
  role: 'user',
  bio: '',
  profilePicture: '',
}
