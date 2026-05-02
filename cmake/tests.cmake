##
## @file cmake/tests.cmake
## @brief GTest binary built from every services/*/tests/*.cpp.
##

set(NEXTRA_TEST_DIRS
    alerts/tests
    audit/tests
    auth/tests
    blog/tests
    comments/tests
    drogon-host/tests
    ecommerce/tests
    feature-flags/tests
    gallery/tests
    image/tests
    infra/tests
    notifications/tests
    polls/tests
    portal/tests
    rate-limit/tests
    search/tests
    social/tests
    user-preferences/tests
    webhooks/tests
    wiki/tests
)

set(NEXTRA_TEST_SOURCES "")
foreach(dir IN LISTS NEXTRA_TEST_DIRS)
    file(GLOB _t "${CMAKE_SOURCE_DIR}/services/${dir}/*.cpp")
    list(APPEND NEXTRA_TEST_SOURCES ${_t})
endforeach()

if(NEXTRA_TEST_SOURCES)
    add_executable(nextra-tests ${NEXTRA_TEST_SOURCES})
    target_include_directories(nextra-tests
        PRIVATE
            "${CMAKE_SOURCE_DIR}/services"
            "${CMAKE_SOURCE_DIR}/services/drogon-host/backend"
            "${NEXTRA_PORTAL_GEN_INCLUDE}"
    )
    target_link_libraries(nextra-tests
        PRIVATE
            Drogon::Drogon
            nlohmann_json::nlohmann_json
            jwt-cpp::jwt-cpp
            fmt::fmt
            spdlog::spdlog
            OpenSSL::Crypto
            GTest::gtest
            GTest::gtest_main
    )
    include(GoogleTest)
    gtest_discover_tests(nextra-tests)
endif()
