/**
 * Collaboration and real-time sync type definitions
 * Used for multi-user canvas editing
 */

import type {
  CanvasPosition, ProjectCanvasItem,
} from './projectBase';

/**
 * Collaborative presence for real-time sync
 */
export interface CollaborativeUser {
  userId: string;
  userName: string;
  color: string;
  cursorPosition?: { x: number; y: number };
  lastSeen: number;
}

/**
 * Canvas update event for real-time sync
 */
export interface CanvasUpdateEvent {
  projectId: string;
  itemId: string;
  userId: string;
  timestamp: number;
  position?: CanvasPosition;
  size?: { width: number; height: number };
  zIndex?: number;
  color?: string;
  minimized?: boolean;
}

/**
 * Cursor update event for collaborative features
 */
export interface CursorUpdateEvent {
  projectId: string;
  userId: string;
  userName: string;
  position: CanvasPosition;
  color: string;
  timestamp: number;
}

/**
 * Activity feed entry
 */
export interface ActivityFeedEntry {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  action:
    | 'create' | 'update' | 'delete'
    | 'move' | 'resize' | 'join' | 'leave';
  entityType: 'workflow' | 'project' | 'user';
  entityId?: string;
  entityName?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Conflict resolution for simultaneous edits
 */
export interface ConflictItem {
  itemId: string;
  conflictingUsers: string[];
  localChange: Partial<ProjectCanvasItem>;
  remoteChange: Partial<ProjectCanvasItem>;
  resolution: 'local' | 'remote' | 'merge';
}
