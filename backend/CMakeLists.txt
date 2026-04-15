##
## @file CMakeLists.txt
## @brief Top-level CMake configuration for the nextra-api
##        backend service.
##
## Build instructions (Conan 2 + CMake):
##   conan install . --build=missing
##   cmake --preset conan-release   # or conan-debug
##   cmake --build --preset conan-release
##

cmake_minimum_required(VERSION 3.20)
project(nextra-api
    VERSION   0.1.0
    LANGUAGES CXX
)

# ----------------------------------------------------------------
# Global compiler settings
# ----------------------------------------------------------------
set(CMAKE_CXX_STANDARD          20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS        OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ----------------------------------------------------------------
# Locate Conan-provided packages
# ----------------------------------------------------------------
find_package(Drogon       REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(CLI11        REQUIRED)
find_package(jwt-cpp      REQUIRED)
find_package(inja         REQUIRED)
find_package(mailio       REQUIRED)
find_package(fmt          REQUIRED)
find_package(spdlog       REQUIRED)

# ----------------------------------------------------------------
# Collect source files
#
# NOTE: GLOB is used during bootstrap.  Once code-generation
#       tooling is in place this will be replaced with an
#       explicit file list produced by the generator.
# ----------------------------------------------------------------
file(GLOB NEXTRA_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/commands/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/constants/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/controllers/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/filters/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/models/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/blog/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/cron/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/infra/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/image/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/flags/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/gallery/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/wiki/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/auth/passkeys/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/auth/totp/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/services/auth/oauth/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/utils/*.cpp"
)

# ----------------------------------------------------------------
# Main executable
# ----------------------------------------------------------------
add_executable(${PROJECT_NAME} ${NEXTRA_SOURCES})

target_include_directories(${PROJECT_NAME}
    PRIVATE
        "${CMAKE_CURRENT_SOURCE_DIR}/src"
)

target_compile_definitions(${PROJECT_NAME}
    PRIVATE
        NEXTRA_VERSION="${PROJECT_VERSION}"
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
        RdKafka::rdkafka
)

# ----------------------------------------------------------------
# Optional: unit / integration tests
# ----------------------------------------------------------------
option(BUILD_TESTING
    "Build the test suite (requires GTest)" OFF
)

if(BUILD_TESTING)
    enable_testing()
    find_package(GTest REQUIRED)

    file(GLOB NEXTRA_TEST_SOURCES
        "${CMAKE_CURRENT_SOURCE_DIR}/tests/*.cpp"
    )

    if(NEXTRA_TEST_SOURCES)
        add_executable(nextra-tests ${NEXTRA_TEST_SOURCES})

        target_include_directories(nextra-tests
            PRIVATE
                "${CMAKE_CURRENT_SOURCE_DIR}/src"
        )

        target_link_libraries(nextra-tests
            PRIVATE
                Drogon::Drogon
                nlohmann_json::nlohmann_json
                jwt-cpp::jwt-cpp
                fmt::fmt
                spdlog::spdlog
                GTest::gtest
                GTest::gtest_main
        )

        include(GoogleTest)
        gtest_discover_tests(nextra-tests)
    endif()
endif()
