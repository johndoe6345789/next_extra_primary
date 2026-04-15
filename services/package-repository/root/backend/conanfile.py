from conan import ConanFile
from conan.tools.cmake import CMake, cmake_layout


class PackageRepoBackend(ConanFile):
    """Conan recipe for the package repository backend."""

    name = "packagerepo-backend"
    version = "0.1.0"
    settings = "os", "compiler", "build_type", "arch"
    generators = "CMakeDeps", "CMakeToolchain"

    def requirements(self):
        self.requires("drogon/1.9.3")
        self.requires("openssl/3.2.1")

    def layout(self):
        cmake_layout(self)

    def build(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.build()
