# =============================================================
# Base image: nextra C++ deps (conan cache primed).
# Extends nextra-base-apt with the full ~/.conan2 cache
# pre-populated for the services/drogon-host/conanfile.py —
# Drogon, nlohmann_json, cli11, jwt-cpp, inja, mailio, fmt,
# spdlog, hiredis, OpenSSL, librdkafka all baked in.
# =============================================================
ARG APT_IMAGE=host.docker.internal:5050/next_extra_primary/nextra-base-apt:latest
FROM ${APT_IMAGE}

WORKDIR /warm
COPY services/drogon-host/conanfile.py .

ENV CONAN_CPU_COUNT=14
ENV CONAN_SKIP_TEST=1
RUN conan install . \
        --build=missing \
        -s build_type=Release \
        -s compiler.cppstd=20 \
        -of /warm/build/Release

# The conan cache now lives at /root/.conan2 and will be
# reused by any image that FROMs this one. Strip build dir
# so we don't ship intermediate artefacts.
RUN rm -rf /warm
