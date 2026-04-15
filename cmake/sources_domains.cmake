##
## @file cmake/sources_domains.cmake
## @brief Flat list of every leaf directory whose *.cpp
##        files link into the nextra-api binary. Split into
##        two half-files to respect the 100-LOC cap.
##

set(NEXTRA_DOMAIN_DIRS "")
include(${CMAKE_CURRENT_LIST_DIR}/sources_domains_am.cmake)
include(${CMAKE_CURRENT_LIST_DIR}/sources_domains_nz.cmake)
