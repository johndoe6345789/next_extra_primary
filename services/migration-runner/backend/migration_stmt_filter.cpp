/** @file migration_stmt_filter.cpp @brief See header. */
#include "migration-runner/backend/migration_stmt_filter.h"

#include <cctype>

namespace services::migrations
{

bool isTxnCtl(const std::string& s)
{
    std::string w;
    for (const char c : s) {
        if (std::isspace(static_cast<unsigned char>(c))) {
            if (!w.empty()) {
                break;
            }
            continue;
        }
        w += static_cast<char>(
            std::toupper(static_cast<unsigned char>(c)));
    }
    return w == "BEGIN" || w == "COMMIT" || w == "ROLLBACK"
           || w == "START" || w == "END";
}

bool isBenignDup(const std::string& msg)
{
    return msg.find("already exists") != std::string::npos
           || msg.find("duplicate key value")
                  != std::string::npos;
}

} // namespace services::migrations
