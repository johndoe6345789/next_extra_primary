# Keycloak 26 image for Nextra.
# Bakes the realm export into the image (no bind mounts).
FROM quay.io/keycloak/keycloak:26.0 AS builder

ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_HTTP_RELATIVE_PATH=/sso

RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.0

COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY realm-export.json /opt/keycloak/data/import/realm-export.json
# Custom Nextra login theme (matches the app's M3
# dark surface + purple accent). Realm config sets
# loginTheme="nextra" to activate.
COPY themes/nextra /opt/keycloak/themes/nextra

ENV KC_DB=postgres
ENV KC_HTTP_RELATIVE_PATH=/sso
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev", "--import-realm"]
