FROM ubuntu/squid:latest
COPY squid.conf /etc/squid/squid.conf
# Ensure cache dir exists with correct ownership before
# squid starts. squid -z initialises the ufs directory
# tree; harmless if already done.
#
# rm -f /run/squid.pid: stale PID files from prior boots
# made squid abort with "Found fresh instance PID file
# … FATAL: Squid is already running" and the container
# would never come up.
ENTRYPOINT ["/bin/sh", "-c", \
    "rm -f /run/squid.pid; \
     squid -z --foreground 2>/dev/null; \
     exec squid -NsY"]
