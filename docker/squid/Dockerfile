FROM ubuntu/squid:latest
COPY squid.conf /etc/squid/squid.conf
# Ensure cache dir exists with correct ownership before squid starts.
# squid -z initialises the ufs directory tree; harmless if already done.
ENTRYPOINT ["/bin/sh", "-c", \
    "squid -z --foreground 2>/dev/null; exec squid -NsY"]
