# API Reference

Base URL: `http://localhost:8080/api`

All request and response bodies use `Content-Type: application/json`.

---

## Authentication

All endpoints except Auth (register, login, confirm) and Health require
a valid JWT in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via the `/api/auth/login` endpoint and refreshed
via `/api/auth/refresh`.

---

## Error Response Format

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

**Common error codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Pagination Format

List endpoints return paginated results:

```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

Query parameters: `?page=1&per_page=20`

---

## Auth Endpoints

### POST /api/auth/register

Register a new user account.

**Request body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "display_name": "John Doe"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "is_confirmed": false,
    "created_at": "2025-01-01T00:00:00Z"
  },
  "message": "Registration successful. Check your email."
}
```

**Auth required:** No

---

### POST /api/auth/login

Authenticate and receive JWT tokens.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "display_name": "John Doe",
      "role": "user",
      "total_points": 100,
      "current_level": 2
    },
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}
```

**Auth required:** No

---

### POST /api/auth/logout

Invalidate the current token pair.

**Request body:**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Auth required:** Yes

---

### POST /api/auth/refresh

Exchange a refresh token for a new token pair.

**Request body:**
```json
{
  "refresh_token": "eyJ..."
}
```

**Response (200):**
```json
{
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "expires_in": 900
  }
}
```

**Auth required:** No

---

### POST /api/auth/forgot-password

Send a password reset email.

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link was sent."
}
```

**Auth required:** No

---

### POST /api/auth/reset-password/{token}

Reset the password using a valid reset token.

**Request body:**
```json
{
  "password": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Auth required:** No

---

### GET /api/auth/confirm/{token}

Confirm email address using the confirmation token.

**Response (200):**
```json
{
  "message": "Email confirmed successfully"
}
```

**Auth required:** No

---

### GET /api/auth/me

Get the currently authenticated user.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": null,
    "role": "user",
    "total_points": 100,
    "current_level": 2,
    "is_confirmed": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Auth required:** Yes

---

## User Endpoints

### GET /api/users

List all users (admin only).

**Query parameters:** `page`, `per_page`, `search`

**Response (200):** Paginated list of user objects.

**Auth required:** Yes (admin)

---

### GET /api/users/{id}

Get a user profile by ID.

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "display_name": "John Doe",
    "avatar_url": null,
    "total_points": 100,
    "current_level": 2,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Auth required:** Yes

---

### PATCH /api/users/{id}

Update user profile (own profile or admin).

**Request body:**
```json
{
  "display_name": "John D.",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response (200):** Updated user object.

**Auth required:** Yes (owner or admin)

---

### GET /api/users/{id}/badges

Get all badges earned by a user.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Early Adopter",
      "description": "Joined during the first month",
      "icon_url": "/badges/early-adopter.svg",
      "category": "special",
      "earned_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Auth required:** Yes

---

### GET /api/users/{id}/stats

Get a user's gamification statistics.

**Response (200):**
```json
{
  "data": {
    "total_points": 100,
    "current_level": 2,
    "badges_count": 3,
    "current_streak": 5,
    "longest_streak": 12,
    "rank": 15,
    "messages_sent": 42
  }
}
```

**Auth required:** Yes

---

## Gamification Endpoints

### GET /api/gamification/badges

List all available badges.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Streak Master",
      "description": "Maintain a 7-day login streak",
      "icon_url": "/badges/streak-master.svg",
      "category": "streak",
      "points_required": 0
    }
  ]
}
```

**Auth required:** Yes

---

### GET /api/gamification/leaderboard

Get the points leaderboard.

**Query parameters:** `period` (`weekly`, `monthly`, `all_time`),
`page`, `per_page`

**Response (200):**
```json
{
  "data": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "topuser",
      "display_name": "Top User",
      "avatar_url": null,
      "total_points": 5000,
      "current_level": 10
    }
  ],
  "pagination": { ... }
}
```

**Auth required:** Yes

---

### GET /api/gamification/streaks/me

Get the current user's streak information.

**Response (200):**
```json
{
  "data": {
    "current_streak": 5,
    "longest_streak": 12,
    "last_activity_date": "2025-06-15"
  }
}
```

**Auth required:** Yes

---

### POST /api/gamification/points/award

Award points to a user (admin or system).

**Request body:**
```json
{
  "user_id": "uuid",
  "amount": 10,
  "reason": "daily_login",
  "source": "system"
}
```

**Response (200):**
```json
{
  "data": {
    "new_total": 110,
    "new_level": 2,
    "badges_earned": [],
    "level_up": false
  }
}
```

**Auth required:** Yes (admin or system)

---

### GET /api/gamification/progress/me

Get the current user's overall gamification progress.

**Response (200):**
```json
{
  "data": {
    "total_points": 100,
    "current_level": 2,
    "points_to_next_level": 150,
    "badges_earned": 3,
    "badges_available": 12,
    "current_streak": 5,
    "longest_streak": 12
  }
}
```

**Auth required:** Yes

---

## Notification Endpoints

### GET /api/notifications

List the current user's notifications.

**Query parameters:** `page`, `per_page`, `type`, `is_read`

**Response (200):** Paginated list of notification objects.

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Badge Earned!",
      "body": "You earned the Early Adopter badge.",
      "type": "badge_earned",
      "is_read": false,
      "metadata": { "badge_id": "uuid" },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

**Auth required:** Yes

---

### GET /api/notifications/unread-count

Get the count of unread notifications.

**Response (200):**
```json
{
  "data": {
    "unread_count": 3
  }
}
```

**Auth required:** Yes

---

### PATCH /api/notifications/{id}/read

Mark a single notification as read.

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

**Auth required:** Yes

---

### POST /api/notifications/mark-all-read

Mark all notifications as read for the current user.

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "data": { "updated_count": 5 }
}
```

**Auth required:** Yes

---

### DELETE /api/notifications/{id}

Delete a notification.

**Response (204):** No content.

**Auth required:** Yes

---

## Chat Endpoints

### POST /api/chat/messages

Send a message to an AI provider and receive a response.

**Request body:**
```json
{
  "content": "Hello, how are you?",
  "provider": "claude",
  "model": "claude-sonnet-4-20250514"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "role": "assistant",
    "content": "Hello! I'm doing well. How can I help?",
    "provider": "claude",
    "model": "claude-sonnet-4-20250514",
    "tokens_used": 42,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Auth required:** Yes

---

### GET /api/chat/history

Get the current user's chat history.

**Query parameters:** `page`, `per_page`, `provider`

**Response (200):** Paginated list of chat message objects.

**Auth required:** Yes

---

### DELETE /api/chat/history

Clear the current user's chat history.

**Response (204):** No content.

**Auth required:** Yes

---

## Health Endpoints

### GET /api/health

Service health check.

**Response (200):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime_seconds": 3600
}
```

**Auth required:** No
