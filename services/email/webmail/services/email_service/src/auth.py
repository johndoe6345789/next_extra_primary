"""JWT-based session auth for the email service.

Derives the tenant identifier from the authenticated
session (JWT cookie or Bearer header) instead of
trusting a caller-supplied X-Tenant-Id header, which
allowed any authenticated user to read another
tenant's email.

The JWT is signed by the upstream C++ API with the
shared JWT_SECRET env var. Claims of interest:

* ``sub``      -- user id (UUID string)
* ``tenant``   -- tenant id (falls back to ``sub``
  for single-tenant deployments)
* ``type``     -- must be ``access``; ``refresh``
  tokens are rejected here as well.
"""

from __future__ import annotations

import os
from functools import wraps
from typing import Any, Callable

import jwt
from flask import g, jsonify, request

JWT_ALG = "HS256"
COOKIE_NAME = "nextra_sso"
BEARER_PREFIX = "Bearer "


def _extract_token() -> str | None:
    auth = request.headers.get("Authorization", "")
    if auth.startswith(BEARER_PREFIX):
        return auth[len(BEARER_PREFIX):]
    cookie = request.cookies.get(COOKIE_NAME)
    return cookie or None


def _decode(token: str) -> dict[str, Any]:
    secret = os.environ.get("JWT_SECRET", "")
    if not secret:
        raise jwt.InvalidTokenError(
            "JWT_SECRET is not configured"
        )
    return jwt.decode(
        token, secret, algorithms=[JWT_ALG]
    )


def require_session(
    fn: Callable[..., Any],
) -> Callable[..., Any]:
    """Validate the JWT and populate ``g.tenant_id``.

    Rejects requests with no token, an invalid
    signature, or a refresh-typed token. Tenant is
    taken from the ``tenant`` claim and falls back
    to ``sub`` for single-tenant deployments --
    never from the X-Tenant-Id header.
    """

    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        token = _extract_token()
        if not token:
            return jsonify(
                {"error": "Authentication required"}
            ), 401
        try:
            claims = _decode(token)
        except jwt.InvalidTokenError:
            return jsonify(
                {"error": "Invalid token"}
            ), 401
        if claims.get("type") == "refresh":
            return jsonify(
                {"error": "Refresh token rejected"}
            ), 401
        g.user_id = claims.get("sub", "")
        g.tenant_id = (
            claims.get("tenant") or g.user_id
        )
        if not g.tenant_id:
            return jsonify(
                {"error": "Missing tenant claim"}
            ), 401
        return fn(*args, **kwargs)

    return wrapper
