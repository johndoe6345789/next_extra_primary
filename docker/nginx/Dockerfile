# Portal nginx image — config baked in at build time.
# No bind mounts; rebuild to pick up nginx.conf changes.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY portal    /usr/share/nginx/portal
