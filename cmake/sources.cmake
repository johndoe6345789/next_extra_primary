##
## @file cmake/sources.cmake
## @brief Per-domain GLOB (non-recursive) of every .cpp
##        that belongs to the nextra-api binary.
##
## The domain list lives in sources_domains.cmake; this
## file iterates and globs. No GLOB_RECURSE — project policy.
##

include(${CMAKE_CURRENT_LIST_DIR}/sources_domains.cmake)

set(NEXTRA_SOURCES "")
foreach(dir IN LISTS NEXTRA_DOMAIN_DIRS)
    file(GLOB _domain_srcs
        "${CMAKE_SOURCE_DIR}/services/${dir}/*.cpp"
    )
    list(APPEND NEXTRA_SOURCES ${_domain_srcs})
endforeach()
