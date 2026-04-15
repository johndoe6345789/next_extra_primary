#pragma once

/**
 * @file cli_dispatch_daemons_table.h
 * @brief Static dispatch table wiring each daemon
 *        sub-command handle to its cmdXxx handler.
 *
 * Kept separate from cli_dispatch_daemons.h so both
 * files remain under the 100-line project limit.
 */

#include "cli_daemon_opts.h"
#include "commands/backup_manager.h"
#include "commands/cron_manager.h"
#include "commands/image_processor.h"
#include "commands/job_scheduler.h"
#include "commands/media_streaming.h"
#include "commands/notification_router.h"
#include "commands/pdf_generator.h"
#include "commands/search_indexer.h"
#include "commands/video_transcoder.h"
#include "commands/webhook_dispatcher.h"

#include <CLI/CLI.hpp>

#include <array>

/**
 * @brief One row of the daemon dispatch table.
 *
 * @c handle is a pointer-to-member picking the CLI11
 * sub-command inside a @ref DaemonCmds; @c run is a
 * function pointer that unpacks the matching config
 * from @ref DaemonOpts and calls cmdXxx.
 */
struct DaemonEntry
{
    const char* name;
    CLI::App* DaemonCmds::* handle;
    void (*run)(const DaemonOpts&);
};

/**
 * @brief Accessor returning the static dispatch table.
 * @return Array of @ref DaemonEntry, one per daemon.
 */
inline const std::array<DaemonEntry, 10>&
daemonDispatchTable()
{
    static const std::array<DaemonEntry, 10> kTable{{
        {"backup-manager", &DaemonCmds::backup,
         [](const DaemonOpts& o) {
             commands::cmdBackupManager(o.backupConfig);
         }},
        {"cron-manager", &DaemonCmds::cron,
         [](const DaemonOpts& o) {
             commands::cmdCronManager(o.cronConfig);
         }},
        {"image-processor", &DaemonCmds::image,
         [](const DaemonOpts& o) {
             commands::cmdImageProcessor(o.imageConfig);
         }},
        {"job-scheduler", &DaemonCmds::job,
         [](const DaemonOpts& o) {
             commands::cmdJobScheduler(o.jobConfig);
         }},
        {"media-streaming", &DaemonCmds::media,
         [](const DaemonOpts& o) {
             commands::cmdMediaStreaming(
                 o.mediaConfig);
         }},
        {"notification-router",
         &DaemonCmds::notification,
         [](const DaemonOpts& o) {
             commands::cmdNotificationRouter(
                 o.notificationConfig);
         }},
        {"pdf-generator", &DaemonCmds::pdf,
         [](const DaemonOpts& o) {
             commands::cmdPdfGenerator(o.pdfConfig);
         }},
        {"search-indexer", &DaemonCmds::search,
         [](const DaemonOpts& o) {
             commands::cmdSearchIndexer(
                 o.searchConfig);
         }},
        {"video-transcoder", &DaemonCmds::video,
         [](const DaemonOpts& o) {
             commands::cmdVideoTranscoder(
                 o.videoConfig);
         }},
        {"webhook-dispatcher", &DaemonCmds::webhook,
         [](const DaemonOpts& o) {
             commands::cmdWebhookDispatcher(
                 o.webhookConfig);
         }},
    }};
    return kTable;
}
