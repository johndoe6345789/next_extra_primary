cmake_minimum_required(VERSION 3.20)
project(packagerepo-backend LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

find_package(Drogon REQUIRED)
find_package(OpenSSL REQUIRED)

add_executable(packagerepo-server
    src/main.cpp
    src/controllers/AuthCtrl.cpp
    src/controllers/ArtifactCtrl.cpp
    src/controllers/ArtifactQuery.cpp
    src/controllers/HealthCtrl.cpp
    src/controllers/AdminCtrl.cpp
    src/filters/AuthFilter.cpp
    src/services/S3BlobStore.cpp
)

target_include_directories(packagerepo-server
    PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src
)

target_link_libraries(packagerepo-server
    PRIVATE
        Drogon::Drogon
        OpenSSL::SSL
        OpenSSL::Crypto
)

install(TARGETS packagerepo-server
    RUNTIME DESTINATION bin
)
