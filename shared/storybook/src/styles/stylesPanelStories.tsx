/**
 * Storybook stories for the Styles Panel.
 */

import React from 'react';
import { StylesPanel } from './StylesPanel';

/** Default export for Storybook. */
export default {
  title: 'Developer/Styles Viewer',
  component: StylesPanel,
};

/** UI Home package styles. */
export const UIHome = () => (
  <StylesPanel packageId="ui_home" />
);

/** UI Header package styles. */
export const UIHeader = () => (
  <StylesPanel packageId="ui_header" />
);

/** UI Footer package styles. */
export const UIFooter = () => (
  <StylesPanel packageId="ui_footer" />
);

/** Shared package styles. */
export const Shared = () => (
  <StylesPanel packageId="shared" />
);
