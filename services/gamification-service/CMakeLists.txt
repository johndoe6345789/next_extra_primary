## @brief nextra-gamification — XP, badges,
##        levels, leaderboards, streaks, progress.
cmake_minimum_required(VERSION 3.20)
project(nextra-gamification VERSION 0.1.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(
    "${CMAKE_CURRENT_SOURCE_DIR}/../../cmake/service.cmake"
)

nextra_service(
    NAME nextra-gamification
    DIRS
        gamification/backend
        gamification/controllers
        badges/backend
        xp/backend
        levels/backend
        leaderboards/backend
        streaks/backend
        progress/backend
)
