##
## @file cmake/portal.cmake
## @brief Embeds shared/constants/tool-links.json and
##        services/portal/static/styles.css into the
##        nextra-api binary via configure_file.
##
## Adds the generated include root to
##   NEXTRA_PORTAL_GEN_INCLUDE
## which the top-level CMakeLists.txt attaches to
## both the nextra-api target and the test binary.
##

set(_PORTAL_TOOL_LINKS
    "${CMAKE_SOURCE_DIR}/shared/constants/tool-links.json"
)
set(_PORTAL_STYLES
    "${CMAKE_SOURCE_DIR}/services/portal/static/styles.css"
)

file(READ "${_PORTAL_TOOL_LINKS}"
    NEXTRA_TOOL_LINKS_JSON)
file(READ "${_PORTAL_STYLES}"
    NEXTRA_PORTAL_STYLES_CSS)

set(NEXTRA_PORTAL_GEN_INCLUDE
    "${CMAKE_BINARY_DIR}/generated")
file(MAKE_DIRECTORY
    "${NEXTRA_PORTAL_GEN_INCLUDE}/portal/backend")

configure_file(
    "${CMAKE_SOURCE_DIR}/services/portal/backend/portal_embedded.h.in"
    "${NEXTRA_PORTAL_GEN_INCLUDE}/portal/backend/portal_embedded.h"
    @ONLY
)
