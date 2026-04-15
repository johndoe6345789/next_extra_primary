"""Email message list and detail endpoints.

Tenant isolation is derived from the JWT session
(see src.auth.require_session), NOT from the
X-Tenant-Id header which was previously spoofable.
"""

import logging
from flask import Blueprint, g, jsonify, request
from src.auth import require_session
from src.extensions import db
from src.models.message import EmailMessage

logger = logging.getLogger(__name__)
messages_bp = Blueprint("messages", __name__)


def _find_msg(message_id):
    return EmailMessage.query.filter_by(
        id=message_id, tenant_id=g.tenant_id
    ).first()


def _not_found():
    return jsonify(
        {"error": "Message not found"}
    ), 404


@messages_bp.route("/", methods=["GET"])
@require_session
def list_messages():
    tenant_id = g.tenant_id
    account_id = request.args.get("accountId", type=int)
    folder = request.args.get("folder", "INBOX")
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get("pageSize", 50, type=int)

    query = EmailMessage.query.filter_by(
        tenant_id=tenant_id, folder=folder
    )
    if account_id:
        query = query.filter_by(
            account_id=account_id
        )

    query = query.order_by(
        EmailMessage.date_received.desc()
    )
    total = query.count()
    messages = query.offset(
        (page - 1) * page_size
    ).limit(page_size).all()

    return jsonify({
        "messages": [m.to_dict() for m in messages],
        "total": total,
        "page": page,
        "pageSize": page_size,
    })


@messages_bp.route(
    "/<int:message_id>", methods=["GET"]
)
@require_session
def get_message(message_id):
    msg = _find_msg(message_id)
    if not msg:
        return _not_found()
    return jsonify(msg.to_dict())


@messages_bp.route(
    "/<int:message_id>/read", methods=["PUT"]
)
@require_session
def mark_read(message_id):
    msg = _find_msg(message_id)
    if not msg:
        return _not_found()
    msg.is_read = request.json.get("isRead", True)
    db.session.commit()
    return jsonify(msg.to_dict())


@messages_bp.route(
    "/<int:message_id>/star", methods=["PUT"]
)
@require_session
def toggle_star(message_id):
    msg = _find_msg(message_id)
    if not msg:
        return _not_found()
    msg.is_starred = request.json.get("isStarred", True)
    db.session.commit()
    return jsonify(msg.to_dict())
