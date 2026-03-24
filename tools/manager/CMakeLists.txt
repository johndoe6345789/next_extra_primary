cmake_minimum_required(VERSION 3.20)
project(manager LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(CLI11 REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(fmt REQUIRED)

file(GLOB_RECURSE MANAGER_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp"
)

add_executable(manager ${MANAGER_SOURCES})

target_include_directories(manager
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(manager
    PRIVATE
        CLI11::CLI11
        nlohmann_json::nlohmann_json
        fmt::fmt
)

install(TARGETS manager RUNTIME DESTINATION bin)
