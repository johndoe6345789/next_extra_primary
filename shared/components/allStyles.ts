/**
 * Combined animation styles for all components.
 *
 * Inject into your global CSS or use a style tag.
 *
 * @example
 * import { allStyles } from '@shared/components'
 * const tag = document.createElement('style')
 * tag.textContent = allStyles
 * document.head.appendChild(tag)
 */
export const allStyles = `
/* Loading animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes pulse-animation {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
@keyframes progress-animation {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}
@keyframes dots-animation {
  0%, 80%, 100% { opacity: 0; transform: scale(0); }
  40% { opacity: 1; transform: scale(1); }
}

/* Empty state animations */
.empty-state-animated {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Skeleton animations */
@keyframes skeleton-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.skeleton-animate {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

/* Notification animations */
@keyframes notification-slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Status indicator animations */
@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes status-spin {
  to { transform: rotate(360deg); }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .empty-state-animated,
  .skeleton-animate,
  .loading-spinner,
  [data-testid^="notification-"],
  [data-testid="status-badge"] span {
    animation: none;
  }
}
`
