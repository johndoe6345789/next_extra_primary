## @brief nextra-platform — feature flags, i18n,
##        rate-limit, portal, api-docs.
cmake_minimum_required(VERSION 3.20)
project(nextra-platform VERSION 0.1.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(
    "${CMAKE_CURRENT_SOURCE_DIR}/../../cmake/service.cmake"
)

nextra_service(
    NAME nextra-platform
    DIRS
        feature-flags/backend
        feature-flags/controllers
        i18n/backend
        i18n/controllers
        rate-limit/backend
        rate-limit/controllers
        portal/backend
        portal/controllers
        drogon-host/controllers
        api-documentation/backend
)
