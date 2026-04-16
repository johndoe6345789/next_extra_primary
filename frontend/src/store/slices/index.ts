/**
 * Barrel export for all Redux slices.
 * @module store/slices
 */

export { default as authReducer } from './authSlice';
export * from './authSlice';

export { default as themeReducer } from './themeSlice';
export * from './themeSlice';

export { default as notificationReducer } from './notificationSlice';
export * from './notificationSlice';

export { default as gamificationReducer } from './gamificationSlice';
export * from './gamificationSlice';

export { default as chatReducer } from './chatSlice';
export * from './chatSlice';

export { default as uiReducer } from './uiSlice';
export * from './uiSlice';

export { default as cartReducer } from './cartSlice';
export * from './cartSlice';
