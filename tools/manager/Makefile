# tools/manager/Makefile -- builds the manager CLI tool.
#
# Uses header-only deps (CLI11, nlohmann/json) downloaded
# on first build. fmt::print is shimmed by ./fmt/core.h
# using C++20 std::format, so fmtlib is not needed.
#
# Usage:
#   make            # build
#   make deps       # download headers only
#   make clean      # remove binary + deps

CXX      ?= g++
CXXFLAGS := -std=c++20 -O2 -Wall -Wextra -I.

SRCS := main.cpp \
        commands/BuildCmd.cpp \
        commands/ConanInstallCmd.cpp \
        commands/DockerBuildxCmd.cpp \
        commands/DockerCmd.cpp \
        commands/DockerDepsCmd.cpp \
        commands/DockerStatusCmd.cpp \
        commands/GenerateCmd.cpp \
        commands/LintCmd.cpp \
        commands/SetupExoticArchCmd.cpp \
        commands/TestCmd.cpp

CLI11_URL := https://github.com/CLIUtils/CLI11/releases/download/v2.4.2/CLI11.hpp
JSON_URL  := https://github.com/nlohmann/json/releases/download/v3.11.3/json.hpp

manager: $(SRCS) CLI/CLI.hpp nlohmann/json.hpp
	$(CXX) $(CXXFLAGS) $(SRCS) -o $@

deps: CLI/CLI.hpp nlohmann/json.hpp

CLI/CLI.hpp:
	mkdir -p CLI && curl -sL $(CLI11_URL) -o $@

nlohmann/json.hpp:
	mkdir -p nlohmann && curl -sL $(JSON_URL) -o $@

clean:
	rm -f manager
	rm -rf CLI nlohmann

.PHONY: deps clean
