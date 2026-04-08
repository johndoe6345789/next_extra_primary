'use client';
/**
 * CanvasSettings Component
 * Canvas appearance and behavior preferences
 */

import React from 'react';
import { GridSettings } from './GridSettings';
import { SnapSettings } from './SnapSettings';
import { LayoutSettings } from './LayoutSettings';
import { ZoomSettings } from './ZoomSettings';
import { ViewportSettings }
  from './ViewportSettings';
import { CanvasSaveFooter }
  from './CanvasSaveFooter';
import { useCanvasSettings }
  from './useCanvasSettings';
import { testId } from '../accessibility';

/**
 * Canvas settings section composed of grid,
 * snap, layout, zoom, and viewport.
 */
export const CanvasSettings: React.FC = () => {
  const cs = useCanvasSettings();
  return (
    <section
      data-testid={
        testId.settingsCanvasSection()}
      aria-label="Canvas settings">
      <GridSettings
        gridVisible={cs.settings.gridVisible}
        gridSnapping={cs.settings.gridSnapping}
        gridSize={cs.settings.gridSize}
        gridStyle={cs.settings.gridStyle}
        onSettingChange={
          cs.handleSettingChange} />
      <SnapSettings
        autoSave={cs.settings.autoSave}
        autoSaveInterval={
          cs.settings.autoSaveInterval}
        zoomInvert={cs.settings.zoomInvert}
        panDirection={cs.settings.panDirection}
        onSettingChange={
          cs.handleSettingChange} />
      <LayoutSettings
        cardPreviewSize={
          cs.settings.cardPreviewSize}
        showCardDescriptions={
          cs.settings.showCardDescriptions}
        cardAnimations={
          cs.settings.cardAnimations}
        onSettingChange={
          cs.handleSettingChange} />
      <ZoomSettings
        enableVirtualization={
          cs.settings.enableVirtualization}
        maxConcurrentRenders={
          cs.settings.maxConcurrentRenders}
        onSettingChange={
          cs.handleSettingChange} />
      <ViewportSettings
        defaultZoom={cs.settings.defaultZoom}
        minZoom={cs.settings.minZoom}
        maxZoom={cs.settings.maxZoom}
        onSettingChange={
          cs.handleSettingChange} />
      <CanvasSaveFooter onSave={cs.handleSave}
        isSaving={cs.isSaving}
        saveMessage={cs.saveMessage} />
    </section>
  );
};

export default CanvasSettings;
