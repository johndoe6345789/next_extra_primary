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

set(NEXTRA_SERVICE_SHARED_DIRS
    drogon-host/backend/utils
    http-filters/backend
    infra/backend
    orm-models/backend
    service-host
)

macro(nextra_service)
    cmake_parse_arguments(SVC "" "NAME" "DIRS" ${ARGN})

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

    foreach(_dir IN LISTS
            NEXTRA_SERVICE_SHARED_DIRS ${SVC_DIRS})
        file(GLOB _d
            "${_root}/services/${_dir}/*.cpp")
        list(APPEND _srcs ${_d})
    endforeach()

    add_executable(${SVC_NAME} ${_srcs})

    target_include_directories(${SVC_NAME}
        PRIVATE
            "${_root}/services"
            "${_root}/services/drogon-host/backend"
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
