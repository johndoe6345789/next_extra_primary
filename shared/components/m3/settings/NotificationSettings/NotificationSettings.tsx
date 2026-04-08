'use client';
/**
 * NotificationSettings Component
 * Notification preferences and subscriptions
 */

import React from 'react';
import { InAppNotificationSettings }
  from './InAppNotificationSettings';
import { EmailNotificationSettings }
  from './EmailNotificationSettings';
import { PushNotificationSettings }
  from './PushNotificationSettings';
import { NotificationHistorySettings }
  from './NotificationHistorySettings';
import { NotificationSaveFooter }
  from './NotificationSaveFooter';
import { useNotificationSettings }
  from './useNotificationSettings';
import { testId } from '../accessibility';

/**
 * Notification settings section with in-app,
 * email, push, and history sub-panels.
 */
export const NotificationSettings: React.FC =
  () => {
    const ns = useNotificationSettings();
    return (
      <section
        data-testid={
          testId.settingsNotificationSection()}
        aria-label="Notification settings">
        <InAppNotificationSettings
          workflowExecuted={
            ns.settings.workflowExecuted}
          workflowFailed={
            ns.settings.workflowFailed}
          projectShared={
            ns.settings.projectShared}
          collaboratorJoined={
            ns.settings.collaboratorJoined}
          onSettingChange={
            ns.handleSettingChange} />
        <EmailNotificationSettings
          emailExecutionSummary={
            ns.settings.emailExecutionSummary}
          emailWeeklyDigest={
            ns.settings.emailWeeklyDigest}
          emailSecurityAlerts={
            ns.settings.emailSecurityAlerts}
          emailProductUpdates={
            ns.settings.emailProductUpdates}
          onSettingChange={
            ns.handleSettingChange} />
        <PushNotificationSettings
          soundEnabled={
            ns.settings.soundEnabled}
          desktopNotifications={
            ns.settings.desktopNotifications}
          onSettingChange={
            ns.handleSettingChange} />
        <NotificationHistorySettings
          onClearItem={
            ns.handleClearHistoryItem}
          onClearAll={
            ns.handleClearAllHistory} />
        <NotificationSaveFooter
          onSave={ns.handleSave}
          isSaving={ns.isSaving}
          saveMessage={ns.saveMessage} />
      </section>
    );
  };

export default NotificationSettings;
