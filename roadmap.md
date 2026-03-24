<![CDATA[# Nextra Feature Roadmap

---

## v1.0 (Current Release)

The foundation release covering all core features.

### Authentication
- Email/password registration with email confirmation.
- Login with JWT access and refresh tokens.
- Password reset via email link.
- Token blocklist for secure logout.
- Role-based access (user, admin).

### Gamification
- Points system: login (+10), chat message (+5), badge earned (+50).
- Level progression with configurable thresholds.
- Badges: Early Adopter, Streak Master, Chatterbox, Night Owl, and more.
- Daily login streaks with streak-break recovery window.
- Leaderboard (weekly, monthly, all-time).

### AI Chat
- Chat with Claude (Anthropic) and OpenAI models.
- Provider toggle in the UI.
- Chat history stored in the database with pagination.
- Token usage tracking per message.

### Notifications
- In-app notification inbox with unread count badge.
- Notification types: badge earned, level up, streak milestone, system.
- Mark as read (individual and bulk).
- Polling-based updates (every 30 seconds).

### Internationalization
- English and Spanish translations.
- next-intl integration with Next.js 16 proxy pattern.
- Locale switcher in the navigation bar.
- All user-facing strings externalized to JSON files.

### Dark Mode
- MUI colorSchemes API (no flash of wrong theme).
- System preference detection.
- Manual toggle with localStorage persistence.
- All components respect the active color scheme.

### Infrastructure
- Multi-stage Docker builds for frontend and backend.
- Docker Compose for local development and production.
- CapRover deployment configuration.
- C++ project manager CLI tool (no shell scripts).

---

## v1.1 - Real-Time Features

- **WebSocket notifications**: Replace polling with persistent WebSocket
  connections for instant notification delivery.
- **Chat streaming**: Stream AI responses token-by-token via Server-Sent
  Events (SSE) for a more interactive chat experience.
- **Online presence indicators**: Show which users are currently active.
- **Typing indicators**: Display when the AI is generating a response.

---

## v1.2 - Admin Dashboard

- **Admin panel**: Protected admin area for user management.
- **User management**: View, search, activate/deactivate, and change
  roles for user accounts.
- **Analytics dashboard**: Charts showing user signups, active users,
  chat usage, and gamification engagement over time.
- **System health dashboard**: Monitor API response times, error rates,
  database connection pool status, and memory usage.
- **Audit log**: Track admin actions (role changes, account modifications).

---

## v1.3 - OAuth Providers

- **Google OAuth**: Sign in with Google accounts.
- **GitHub OAuth**: Sign in with GitHub accounts.
- **Account linking**: Connect OAuth providers to existing email accounts.
- **Profile picture sync**: Import avatar from OAuth provider.
- **Graceful fallback**: Continue supporting email/password alongside OAuth.

---

## v1.4 - Mobile PWA Support

- **Progressive Web App**: Service worker for offline capability.
- **Responsive redesign**: Optimized layouts for mobile viewports.
- **Push notifications**: Browser push notifications for badge earned,
  level up, and new chat messages.
- **Install prompt**: Add-to-home-screen support on mobile browsers.
- **Offline chat history**: Cache recent chat messages for offline viewing.

---

## v2.0 - Multiplayer and Social

- **Teams**: Create and join teams with shared leaderboards.
- **Challenges**: Timed team challenges with bonus points.
- **Direct messaging**: User-to-user chat alongside AI chat.
- **Activity feed**: Social feed showing badge earned and level up events
  from followed users.
- **Achievements**: Team-based achievements that require group coordination.
- **Tournament mode**: Periodic competitive events with exclusive badges.

---

## Backlog (Unscheduled)

- Email digest notifications (daily/weekly summary).
- API rate limiting dashboard for users.
- Custom badge creation (admin feature).
- Export chat history as PDF or Markdown.
- Plugin system for third-party gamification rules.
- GraphQL API layer alongside REST.
- Redis caching layer for leaderboard and session data.
- Kubernetes Helm chart for large-scale deployment.
]]>