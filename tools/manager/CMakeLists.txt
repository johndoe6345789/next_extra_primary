cmake_minimum_required(VERSION 3.20)
project(manager LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(CLI11 REQUIRED)
find_package(nlohmann_json REQUIRED)
find_package(fmt REQUIRED)

add_executable(manager
    main.cpp
    commands/BuildCmd.cpp
    commands/DockerBuildxCmd.cpp
    commands/DockerCmd.cpp
    commands/DockerDepsCmd.cpp
    commands/DockerStatusCmd.cpp
    commands/GenerateCmd.cpp
    commands/LintCmd.cpp
    commands/TestCmd.cpp
)

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
