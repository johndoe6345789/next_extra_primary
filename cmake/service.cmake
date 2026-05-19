##
## @file cmake/service.cmake
## @brief Macro for building a nextra microservice.
##
## Usage (from a service's CMakeLists.txt):
##   include(service.cmake)
##   nextra_service(
##     NAME nextra-auth
##     DIRS auth/backend auth/backend/oauth ...
##   )
##
## SHARED dirs (drogon-host/backend/utils,
## http-filters/backend, infra/backend,
## orm-models/backend, service-host) are always
## added automatically.

## HTTP services: full shared kernel (auth filters need
## auth/backend; every request authenticates).
set(NEXTRA_SERVICE_SHARED_DIRS
    drogon-host/backend/utils
    http-filters/backend
    auth/backend
    auth/backend/keycloak
    infra/backend
    orm-models/backend
    rate-limit/backend
    service-host
)

## CLI one-shots (NO_HTTP): minimal set — no http-filters /
## auth / keycloak / rate-limit, so the auth dependency
## cascade (auth -> email -> ...) is not dragged into a
## non-serving binary like nextra-migrate.
set(NEXTRA_SERVICE_CLI_DIRS
    drogon-host/backend/utils
    infra/backend
    orm-models/backend
    service-host
)

macro(nextra_service)
    cmake_parse_arguments(SVC "NO_HTTP" "NAME" "DIRS" ${ARGN})

    set(_root "${CMAKE_CURRENT_SOURCE_DIR}/../..")

    find_package(Drogon        REQUIRED)
    find_package(nlohmann_json REQUIRED)
    find_package(jwt-cpp       REQUIRED)
    find_package(fmt           REQUIRED)
    find_package(spdlog        REQUIRED)
    find_package(hiredis       REQUIRED)
    find_package(OpenSSL       REQUIRED)
    find_package(RdKafka       QUIET)
    find_package(mailio        QUIET)
    find_package(PkgConfig     QUIET)
    if(PkgConfig_FOUND)
        pkg_check_modules(VIPS vips)
    endif()

    set(_srcs "${CMAKE_CURRENT_SOURCE_DIR}/main.cpp")

    if(SVC_NO_HTTP)
        set(_shared ${NEXTRA_SERVICE_CLI_DIRS})
    else()
        set(_shared ${NEXTRA_SERVICE_SHARED_DIRS})
    endif()
    set(_all_dirs ${_shared} ${SVC_DIRS})
    # A service may also list a shared dir explicitly; dedupe
    # so it is not globbed twice (multiple-definition link err).
    list(REMOVE_DUPLICATES _all_dirs)
    foreach(_dir IN LISTS _all_dirs)
        file(GLOB _d
            "${_root}/services/${_dir}/*.cpp")
        list(APPEND _srcs ${_d})
    endforeach()
    list(REMOVE_DUPLICATES _srcs)

    add_executable(${SVC_NAME} ${_srcs})

    target_include_directories(${SVC_NAME}
        PRIVATE
            "${_root}/services"
            "${_root}/services/drogon-host/backend"
    )

    target_compile_definitions(${SVC_NAME}
        PRIVATE NEXTRA_VERSION="${PROJECT_VERSION}"
    )

    target_link_libraries(${SVC_NAME}
        PRIVATE
            Drogon::Drogon
            nlohmann_json::nlohmann_json
            jwt-cpp::jwt-cpp
            fmt::fmt
            spdlog::spdlog
            hiredis::hiredis
            OpenSSL::Crypto
    )

    if(RdKafka_FOUND)
        target_link_libraries(${SVC_NAME}
            PRIVATE RdKafka::rdkafka)
        target_compile_definitions(${SVC_NAME}
            PRIVATE NEXTRA_HAVE_KAFKA)
    endif()

    if(mailio_FOUND)
        target_link_libraries(${SVC_NAME}
            PRIVATE mailio::mailio)
    endif()

    if(VIPS_FOUND)
        target_include_directories(${SVC_NAME}
            PRIVATE ${VIPS_INCLUDE_DIRS})
        target_link_libraries(${SVC_NAME}
            PRIVATE ${VIPS_LIBRARIES})
        target_compile_definitions(${SVC_NAME}
            PRIVATE NEXTRA_HAVE_VIPS)
    endif()
endmacro()
