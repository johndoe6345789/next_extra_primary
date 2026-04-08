/**
 * Adapter-Specific Types
 *
 * Types that are unique to the adapter layer,
 * not re-exported from @shared/types.
 */

/** Request to create a canvas item */
export interface CreateCanvasItemRequest {
  workflowId: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
}

/** Request to update a canvas item */
export interface UpdateCanvasItemRequest {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

/** User entity for authentication */
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

/** Authentication response */
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}
