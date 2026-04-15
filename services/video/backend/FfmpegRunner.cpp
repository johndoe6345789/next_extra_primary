/**
 * @file FfmpegRunner.cpp
 * @brief posix_spawn + progress pipe implementation.
 */

#include "video/backend/FfmpegRunner.h"

#include <spawn.h>
#include <sys/wait.h>
#include <unistd.h>

#include <array>
#include <cerrno>
#include <cstring>
#include <stdexcept>
#include <string>
#include <vector>

extern char** environ;

namespace nextra::video
{
namespace
{
void drainPipe(int fd, std::string& tail,
               const std::function<void(const std::string&)>& cb)
{
    std::string buf;
    std::array<char, 4096> chunk{};
    ssize_t n = 0;
    while ((n = ::read(fd, chunk.data(), chunk.size())) > 0) {
        buf.append(chunk.data(), static_cast<size_t>(n));
        size_t pos = 0;
        while (true) {
            const auto nl = buf.find('\n', pos);
            if (nl == std::string::npos) break;
            if (cb) cb(buf.substr(pos, nl - pos));
            pos = nl + 1;
        }
        buf.erase(0, pos);
        if (tail.size() < 4096)
            tail.append(chunk.data(), static_cast<size_t>(n));
    }
    if (!buf.empty() && cb) cb(buf);
}
}  // namespace

FfmpegResult runFfmpeg(
    const std::string& binary,
    const std::vector<std::string>& argv,
    const std::function<void(const std::string&)>& onProgressLine)
{
    int pipeFd[2] = {-1, -1};
    if (::pipe(pipeFd) != 0)
        throw std::runtime_error("pipe() failed");

    posix_spawn_file_actions_t acts;
    posix_spawn_file_actions_init(&acts);
    posix_spawn_file_actions_addclose(&acts, pipeFd[0]);
    posix_spawn_file_actions_adddup2(&acts, pipeFd[1], 2);
    posix_spawn_file_actions_addclose(&acts, pipeFd[1]);

    std::vector<char*> cargv;
    cargv.reserve(argv.size() + 2);
    cargv.push_back(const_cast<char*>(binary.c_str()));
    for (const auto& a : argv)
        cargv.push_back(const_cast<char*>(a.c_str()));
    cargv.push_back(nullptr);

    pid_t pid = 0;
    const int rc = ::posix_spawn(
        &pid, binary.c_str(), &acts, nullptr,
        cargv.data(), environ);
    posix_spawn_file_actions_destroy(&acts);
    ::close(pipeFd[1]);
    if (rc != 0) {
        ::close(pipeFd[0]);
        throw std::runtime_error(
            std::string{"posix_spawn: "} + std::strerror(rc));
    }

    FfmpegResult res;
    drainPipe(pipeFd[0], res.stderrTail, onProgressLine);
    ::close(pipeFd[0]);

    int status = 0;
    ::waitpid(pid, &status, 0);
    res.exitCode = WIFEXITED(status) ? WEXITSTATUS(status) : -1;
    return res;
}

}  // namespace nextra::video
