"""Email message list and detail endpoints."""

import logging
from flask import Blueprint, jsonify, request
from src.models.message import EmailMessage

logger = logging.getLogger(__name__)
messages_bp = Blueprint("messages", __name__)


@messages_bp.route("/", methods=["GET"])
def list_messages():
    tenant_id = request.headers.get(
        "X-Tenant-Id", "default"
    )
    account_id = request.args.get(
        "accountId", type=int
    )
    folder = request.args.get("folder", "INBOX")
    page = request.args.get("page", 1, type=int)
    page_size = request.args.get(
        "pageSize", 50, type=int
    )

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
def get_message(message_id):
    tenant_id = request.headers.get(
        "X-Tenant-Id", "default"
    )
    msg = EmailMessage.query.filter_by(
        id=message_id, tenant_id=tenant_id
    ).first()
    if not msg:
        return jsonify(
            {"error": "Message not found"}
        ), 404
    return jsonify(msg.to_dict())


@messages_bp.route(
    "/<int:message_id>/read", methods=["PUT"]
)
def mark_read(message_id):
    tenant_id = request.headers.get(
        "X-Tenant-Id", "default"
    )
    msg = EmailMessage.query.filter_by(
        id=message_id, tenant_id=tenant_id
    ).first()
    if not msg:
        return jsonify(
            {"error": "Message not found"}
        ), 404
    from src.extensions import db
    msg.is_read = request.json.get(
        "isRead", True
    )
    db.session.commit()
    return jsonify(msg.to_dict())


@messages_bp.route(
    "/<int:message_id>/star", methods=["PUT"]
)
def toggle_star(message_id):
    tenant_id = request.headers.get(
        "X-Tenant-Id", "default"
    )
    msg = EmailMessage.query.filter_by(
        id=message_id, tenant_id=tenant_id
    ).first()
    if not msg:
        return jsonify(
            {"error": "Message not found"}
        ), 404
    from src.extensions import db
    msg.is_starred = request.json.get(
        "isStarred", True
    )
    db.session.commit()
    return jsonify(msg.to_dict())
