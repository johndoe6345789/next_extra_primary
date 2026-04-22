##
## @file CMakeLists.txt
## @brief Top-level CMake for the domain-sliced Nextra backend.
##
## Every domain lives under services/<domain>/ with its own
## backend/ controllers/ tests/ subfolders. This file globs
## per-domain and feeds every .cpp into one nextra-api binary.
##
## Build:
##   conan install services/drogon-host --build=missing
##   cmake --preset conan-release
##   cmake --build --preset conan-release
##

cmake_minimum_required(VERSION 3.20)
project(nextra-api
    VERSION   0.1.0
    LANGUAGES CXX
)

set(CMAKE_CXX_STANDARD          20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS        OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(Drogon        REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(CLI11         REQUIRED)
find_package(jwt-cpp       REQUIRED)
find_package(inja          REQUIRED)
find_package(mailio        REQUIRED)
find_package(fmt           REQUIRED)
find_package(spdlog        REQUIRED)
find_package(hiredis       REQUIRED)
find_package(OpenSSL       REQUIRED)

find_package(RdKafka       QUIET)
find_package(PkgConfig     QUIET)
if(PkgConfig_FOUND)
    pkg_check_modules(VIPS vips)
endif()

include(cmake/sources.cmake)
include(cmake/portal.cmake)

add_executable(${PROJECT_NAME} ${NEXTRA_SOURCES})

# Domain-rooted include paths: include "audit/backend/X.h"
target_include_directories(${PROJECT_NAME}
    PRIVATE
        "${CMAKE_CURRENT_SOURCE_DIR}/services"
        "${CMAKE_CURRENT_SOURCE_DIR}/services/drogon-host/backend"
        "${NEXTRA_PORTAL_GEN_INCLUDE}"
)

target_compile_definitions(${PROJECT_NAME}
    PRIVATE NEXTRA_VERSION="${PROJECT_VERSION}"
)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        Drogon::Drogon
        nlohmann_json::nlohmann_json
        CLI11::CLI11
        jwt-cpp::jwt-cpp
        pantor::inja
        mailio::mailio
        fmt::fmt
        spdlog::spdlog
        hiredis::hiredis
        OpenSSL::Crypto
)

if(RdKafka_FOUND)
    target_link_libraries(${PROJECT_NAME}
        PRIVATE RdKafka::rdkafka)
    target_compile_definitions(${PROJECT_NAME}
        PRIVATE NEXTRA_HAVE_KAFKA)
endif()

if(VIPS_FOUND)
    target_include_directories(${PROJECT_NAME}
        PRIVATE ${VIPS_INCLUDE_DIRS})
    target_link_libraries(${PROJECT_NAME}
        PRIVATE ${VIPS_LIBRARIES})
    target_compile_definitions(${PROJECT_NAME}
        PRIVATE NEXTRA_HAVE_VIPS)
endif()

option(BUILD_TESTING "Build GTest suite" OFF)
if(BUILD_TESTING)
    enable_testing()
    find_package(GTest REQUIRED)
    include(cmake/tests.cmake)
endif()
