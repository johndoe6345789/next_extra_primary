/**
 * Realtime Service - barrel re-export
 */

export type {
  RemoteUser, RemoteCursor,
  RealtimeListener,
} from './realtimeTypes';

export { RealtimeService } from
  './realtimeConnection';
import { RealtimeService } from
  './realtimeConnection';

export const realtimeService =
  new RealtimeService();
export default realtimeService;
