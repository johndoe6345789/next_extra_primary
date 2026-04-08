import React from 'react';

/** Sun icon for light mode. */
export const SunIcon: React.FC = () => (
  <svg
    width="20" height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM13 4h-2V1h2v3zm0 19h-2v-3h2v3zM5 11H2v2h3v-2zm17 0h-3v2h3v-2zM6.3 5.3l-2.1-2.1-1.4 1.4 2.1 2.1L6.3 5.3zm15.3 15.3l-2.1-2.1-1.4 1.4 2.1 2.1 1.4-1.4zm-2.1-15.3l2.1-2.1-1.4-1.4-2.1 2.1 1.4 1.4zM4.9 20.6l2.1-2.1-1.4-1.4-2.1 2.1 1.4 1.4z"/>
  </svg>
);

/** Moon icon for dark mode. */
export const MoonIcon: React.FC = () => (
  <svg
    width="20" height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);
