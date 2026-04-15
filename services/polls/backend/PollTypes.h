#pragma once
/**
 * @file PollTypes.h
 * @brief Strong types shared across the polls daemon.
 */

#include <cstdint>
#include <string>
#include <vector>
#include <optional>

namespace nextra::polls
{

/** @brief Poll kind enum (mirrors SQL CHECK). */
enum class PollKind
{
    Single,
    Multi,
    Rank,
    Approval,
};

/** @brief Single poll option row. */
struct PollOption
{
    std::int64_t id{0};
    std::int64_t pollId{0};
    int position{0};
    std::string label;
};

/** @brief Poll metadata row. */
struct Poll
{
    std::int64_t id{0};
    std::string tenantId;
    std::string creatorId;
    std::string question;
    PollKind kind{PollKind::Single};
    std::string opensAt;
    std::string closesAt;
    bool isPublic{true};
    std::string createdAt;
    std::vector<PollOption> options;
};

/** @brief One cast vote. */
struct PollVote
{
    std::int64_t id{0};
    std::int64_t pollId{0};
    std::string voterId;
    std::int64_t optionId{0};
    std::optional<int> rank;
    double weight{1.0};
    std::string castAt;
};

/** @brief Tally result for a single option. */
struct OptionTally
{
    std::int64_t optionId{0};
    std::string label;
    double score{0.0};
    std::int64_t voteCount{0};
};

/** @brief Parse a kind from SQL text form. */
PollKind parseKind(const std::string& s);

/** @brief Render a kind as SQL text. */
std::string kindToString(PollKind k);

}  // namespace nextra::polls
