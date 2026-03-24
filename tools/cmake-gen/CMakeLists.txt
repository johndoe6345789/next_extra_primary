cmake_minimum_required(VERSION 3.20)
project(cmake-gen LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(nlohmann_json REQUIRED)
find_package(CLI11 REQUIRED)
find_package(inja REQUIRED)

add_executable(cmake-gen main.cpp)

target_link_libraries(cmake-gen
    PRIVATE
        nlohmann_json::nlohmann_json
        CLI11::CLI11
        pantor::inja
)

install(TARGETS cmake-gen RUNTIME DESTINATION bin)
