#pragma once
/**
 * @file ProgressService.h
 * @brief Aggregates a user's gamification progress.
 *
 * Fetches points, streak counters, badges, and
 * computed level data for a single user.
 */

#include "services/LevelService.h"
#include "services/gamification_types.h"

#include <string>

namespace services
{

/**
 * @class ProgressService
 * @brief Queries and assembles user progress data.
 */
class ProgressService
{
  public:
    /**
     * @brief Construct with a LevelService pointer.
     *
     * @param levels Non-owning pointer to a
     *               LevelService; must outlive this.
     */
    explicit ProgressService(
        const LevelService* levels);

    ~ProgressService() = default;

    /**
     * @brief Fetch a user's overall gamification
     *        progress.
     *
     * Returns level, points, streak counters, and
     * earned badges in a single JSON object.
     *
     * @param userId    Target user ID.
     * @param onSuccess Callback with progress JSON.
     * @param onError   Callback on failure.
     */
    void getUserProgress(
        const std::string& userId,
        Callback           onSuccess,
        ErrCallback        onError);

  private:
    [[nodiscard]] static auto db() -> DbClientPtr;

    const LevelService* levels_{nullptr};
};

} // namespace services
