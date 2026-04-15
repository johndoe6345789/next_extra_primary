"""Regression test: tenant must come from the JWT.

Prior bug: messages.py read tenant_id from the
X-Tenant-Id header, so any authenticated caller
could read another tenant's email by changing the
header. The fix derives tenant from the signed JWT
via src.auth.require_session.
"""

import os
import unittest
from unittest.mock import patch

import jwt
from flask import Flask, g, jsonify

from src.auth import require_session

SECRET = "test-only-secret"


def _make_token(
    sub="u1", tenant="tA", typ="access"
):
    return jwt.encode(
        {"sub": sub, "tenant": tenant, "type": typ},
        SECRET,
        algorithm="HS256",
    )


def _make_app():
    app = Flask(__name__)

    @app.route("/probe")
    @require_session
    def probe():
        return jsonify(
            {"tenant": g.tenant_id,
             "user": g.user_id}
        )

    return app


class TenantFromJwtTests(unittest.TestCase):
    def setUp(self):
        self._env = patch.dict(
            os.environ, {"JWT_SECRET": SECRET}
        )
        self._env.start()
        self.client = _make_app().test_client()

    def tearDown(self):
        self._env.stop()

    def test_no_token_is_rejected(self):
        r = self.client.get("/probe")
        self.assertEqual(r.status_code, 401)

    def test_header_spoof_is_ignored(self):
        tok = _make_token(tenant="tA")
        r = self.client.get(
            "/probe",
            headers={
                "Authorization": f"Bearer {tok}",
                "X-Tenant-Id": "tB-evil",
            },
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(
            r.get_json()["tenant"], "tA"
        )

    def test_refresh_token_rejected(self):
        tok = _make_token(typ="refresh")
        r = self.client.get(
            "/probe",
            headers={
                "Authorization": f"Bearer {tok}"
            },
        )
        self.assertEqual(r.status_code, 401)

    def test_bad_signature_rejected(self):
        bad = jwt.encode(
            {"sub": "u1", "tenant": "tA"},
            "wrong",
            algorithm="HS256",
        )
        r = self.client.get(
            "/probe",
            headers={
                "Authorization": f"Bearer {bad}"
            },
        )
        self.assertEqual(r.status_code, 401)
