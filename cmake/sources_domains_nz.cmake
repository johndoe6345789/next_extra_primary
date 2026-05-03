##
## @file cmake/sources_domains_nz.cmake
## @brief Domain dirs N..Z (second half) — appended to
##        NEXTRA_DOMAIN_DIRS by sources_domains.cmake.
##

list(APPEND NEXTRA_DOMAIN_DIRS
    notifications/backend
    notifications/backend/commands
    notifications/controllers
    orm-models/backend
    pdf/backend
    pdf/backend/commands
    pdf/controllers
    polls/backend
    polls/controllers
    portal/backend
    portal/controllers
    progress/backend
    rate-limit/backend
    rate-limit/controllers
    search/backend
    search/backend/commands
    search/controllers
    search/events
    social/backend
    social/backend/dm
    social/backend/follows
    social/backend/groups
    social/backend/mentions
    social/backend/presence
    social/backend/reactions
    social/controllers
    streaks/backend
    streaming/backend
    streaming/backend/commands
    streaming/controllers
    user-preferences/backend
    user-preferences/controllers
    users/backend
    users/backend/commands
    users/controllers
    video/backend
    video/backend/commands
    video/controllers
    webhooks/backend
    webhooks/backend/commands
    webhooks/controllers
    wiki/backend
    wiki/controllers
    xp/backend
)
