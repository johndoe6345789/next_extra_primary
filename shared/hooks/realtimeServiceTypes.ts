/**
 * Type definitions for useRealtimeService hook
 */

/** Connected user interface */
export interface ConnectedUser {
  userId: string;
  userName: string;
  userColor: string;
  cursorPosition?: { x: number; y: number };
}

/** Current user interface */
export interface CurrentUser {
  id: string;
  name: string;
}

/** Realtime service interface */
export interface RealtimeService {
  connect: (
    projectId: string,
    userId: string,
    userName: string,
    userColor: string
  ) => void;
  disconnect: () => void;
  subscribe: (
    event: string,
    callback: (data: unknown) => void
  ) => void;
  broadcastCanvasUpdate: (
    itemId: string,
    position: { x: number; y: number },
    size: { width: number; height: number }
  ) => void;
  broadcastCursorPosition: (
    x: number,
    y: number
  ) => void;
  lockItem: (itemId: string) => void;
  releaseItem: (itemId: string) => void;
}

/** Redux actions interface */
export interface RealtimeActions {
  setConnected: (
    connected: boolean
  ) => any;
  addConnectedUser: (
    user: ConnectedUser
  ) => any;
  removeConnectedUser: (
    userId: string
  ) => any;
  updateRemoteCursor: (data: {
    userId: string;
    position: { x: number; y: number };
  }) => any;
  lockItem: (data: {
    itemId: string;
    userId: string;
  }) => any;
  releaseItem: (itemId: string) => any;
}

/** Options for useRealtimeService */
export interface UseRealtimeServiceOptions {
  projectId: string;
  enabled?: boolean;
  onError?: (error: Error) => void;
  /** Redux dispatch function */
  dispatch: (action: unknown) => void;
  /** Current user from Redux state */
  user: CurrentUser | null;
  /** Connected users from Redux state */
  connectedUsers: ConnectedUser[];
  /** Realtime service instance */
  realtimeService: RealtimeService;
  /** Redux action creators */
  actions: RealtimeActions;
}
