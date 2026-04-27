## @brief nextra-media — image, video, streaming, pdf.
cmake_minimum_required(VERSION 3.20)
project(nextra-media VERSION 0.1.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(
    "${CMAKE_CURRENT_SOURCE_DIR}/../../cmake/service.cmake"
)

nextra_service(
    NAME nextra-media
    DIRS
        image/backend
        image/backend/commands
        image/controllers
        video/backend
        video/backend/commands
        video/controllers
        streaming/backend
        streaming/backend/commands
        streaming/controllers
        pdf/backend
        pdf/backend/commands
        pdf/controllers
)
