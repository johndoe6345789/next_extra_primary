#pragma once
/**
 * @file AlertService.h
 * @brief Async data-access for the alerts table:
 *        ingest (UPSERT), list, acknowledge, resolve.
 */

#include "alerts/backend/AlertTypes.h"

#include <drogon/orm/DbClient.h>

#include <cstdint>
#include <memory>
#include <string>

namespace nextra::alerts
{

/**
 * @class AlertService
 * @brief Drogon-ORM-backed alerts service.
 */
class AlertService
{
  public:
    /** @brief Construct using the default DB client. */
    AlertService();

    /**
     * @brief UPSERT an alert keyed by
     *        (source, dedupe_key, status='open').
     */
    void ingest(const Alert& a, OkCb onOk, ErrCb onErr);

    /** @brief List newest-first; returns JSON array. */
    void list(std::int64_t limit,
              std::int64_t offset,
              const std::string& statusFilter,
              const std::string& severityFilter,
              OkCb onOk, ErrCb onErr);

    /** @brief Mark alert acknowledged by @p actor. */
    void acknowledge(const std::string& id,
                     const std::string& actor,
                     OkCb onOk, ErrCb onErr);

    /** @brief Mark alert resolved. */
    void resolve(const std::string& id,
                 OkCb onOk, ErrCb onErr);

  private:
    drogon::orm::DbClientPtr db_;
};

} // namespace nextra::alerts
