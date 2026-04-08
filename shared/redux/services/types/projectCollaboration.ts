/**
 * Project Collaboration Types
 * Types for real-time collaboration,
 * activity feeds, and conflict resolution.
 */

import type {
  CanvasPosition,
  CanvasSize,
  ProjectCanvasItem,
} from './projectEntities'

/** @brief User presence for collab */
export interface CollaborativeUser {
  userId: string;
  userName: string;
  color: string;
  cursorPosition?: { x: number; y: number };
  lastSeen: number;
}

/** @brief Canvas update event for sync */
export interface CanvasUpdateEvent {
  projectId: string;
  itemId: string;
  userId: string;
  timestamp: number;
  position?: CanvasPosition;
  size?: CanvasSize;
  zIndex?: number;
  color?: string;
  minimized?: boolean;
}

/** @brief Cursor update for collab */
export interface CursorUpdateEvent {
  projectId: string;
  userId: string;
  userName: string;
  position: CanvasPosition;
  color: string;
  timestamp: number;
}

/** @brief Activity feed entry */
export interface ActivityFeedEntry {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  action:
    | 'create'
    | 'update'
    | 'delete'
    | 'move'
    | 'resize'
    | 'join'
    | 'leave';
  entityType: 'workflow' | 'project' | 'user';
  entityId?: string;
  entityName?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/** @brief Conflict resolution info */
export interface ConflictItem {
  itemId: string;
  conflictingUsers: string[];
  localChange: Partial<ProjectCanvasItem>;
  remoteChange: Partial<ProjectCanvasItem>;
  resolution: 'local' | 'remote' | 'merge';
}
