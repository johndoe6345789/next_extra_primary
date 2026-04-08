/**
 * Type definitions for admin API endpoints.
 * @module store/api/adminTypes
 */

/** Backend environment variable entry. */
export interface EnvVar {
  name: string;
  group: string;
  value: string;
  set: boolean;
}

/** User entry for admin list. */
export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
