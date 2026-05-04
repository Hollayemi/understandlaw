# LawTicha Backend Data Model (derived from current frontend)

This model is designed from the current dashboard/frontend flows (`/dashboard`, `/dashboard/learn`, `/dashboard/activities`, `/dashboard/marketplace`, `/dashboard/settings`) and optimized for **decentralized domain schemas**.

## 1) Domain decomposition (decentralized by schema)

- `identity`: users, roles, auth identities, profile preferences
- `learning`: modules, lessons, enrollment, progress, quizzes, bookmarks, certificates
- `consultation`: lawyers, consultation requests, sessions, timeline events, ratings
- `marketplace`: lawyer matching requests and match results
- `community`: posts/highlights/likes/comments (for community widgets)
- `notifications`: channels, preferences, events, deliveries
- `payments`: invoices, receipts, settlements
- `audit`: immutable event log

This keeps high-change product surfaces isolated and lets you populate each schema independently.

## 2) Core entities required by current frontend

### Identity
- `User`
- `UserProfile`
- `AuthIdentity`
- `UserPreference`

### Learning
- `Topic`
- `Module`
- `Lesson`
- `InstructorProfile`
- `Enrollment`
- `LessonProgress`
- `DailyChallenge`
- `DailyChallengeAttempt`
- `Bookmark`
- `Certificate`
- `LearningStatSnapshot`

### Consultation
- `LawyerProfile`
- `LawyerSpecialism`
- `ConsultationRequest`
- `ConsultationTimelineEvent`
- `ConsultationSession`
- `ConsultationRating`

### Marketplace
- `LawyerMatchRequest`
- `LawyerMatchCandidate`
- `LawyerMatch`

### Notifications
- `NotificationPreference`
- `NotificationEvent`
- `NotificationDelivery`

### Payments
- `Invoice`
- `PaymentTransaction`
- `Receipt`
- `Payout`

### Community
- `CommunityPost`
- `CommunityLike`
- `CommunityComment`

### Audit
- `AuditEvent`

## 3) Relationship map (high-level)

- `identity.User` 1—1 `identity.UserProfile`
- `identity.User` 1—N `learning.Enrollment`
- `learning.Module` 1—N `learning.Lesson`
- `learning.Module` N—1 `learning.Topic`
- `learning.Enrollment` 1—N `learning.LessonProgress`
- `identity.User` 1—N `consultation.ConsultationRequest`
- `consultation.LawyerProfile` 1—N `consultation.ConsultationRequest`
- `consultation.ConsultationRequest` 1—N `consultation.ConsultationTimelineEvent`
- `consultation.ConsultationRequest` 0..1—1 `consultation.ConsultationSession`
- `consultation.ConsultationRequest` 0..1—1 `consultation.ConsultationRating`
- `identity.User` 1—N `marketplace.LawyerMatchRequest`
- `marketplace.LawyerMatchRequest` 1—N `marketplace.LawyerMatchCandidate`
- `marketplace.LawyerMatchRequest` 0..1—1 `marketplace.LawyerMatch`
- `identity.User` 1—N `notifications.NotificationPreference`
- `payments.Invoice` 1—N `payments.PaymentTransaction`
- `payments.Invoice` 0..1—1 `payments.Receipt`
- `audit.AuditEvent` references any entity by `{entity_schema, entity_table, entity_id}`

## 4) Suggested implementation strategy

1. Use PostgreSQL with multiple schemas (same DB cluster).
2. Keep shared IDs as UUIDv7/ULID strings for cross-schema links.
3. Enforce strict FK within each schema; cross-schema links are explicit UUID refs + app-level checks.
4. Use outbox/event table (`audit.AuditEvent`) for cross-domain propagation.
5. Build read models for dashboards:
   - `learning.user_dashboard_view`
   - `consultation.request_activity_view`
   - `marketplace.match_pipeline_view`

## 5) API surface needed by existing frontend

- `GET /me/dashboard-overview`
- `GET /me/learning/modules?tab=all|active|complete|saved`
- `GET /me/learning/continue-reading`
- `GET /me/daily-challenge`
- `POST /me/daily-challenge/:id/attempt`
- `GET /me/bookmarks`
- `GET /me/activities?type=consultation|lawyer_request`
- `POST /consultations`
- `POST /lawyer-requests`
- `GET /marketplace/lawyers?specialism=&state=&available=`
- `GET /settings/preferences`
- `PATCH /settings/preferences`
- `PATCH /settings/profile`

## 6) Notes for population/seeding

- Seed `learning.Topic`, `learning.Module`, `learning.Lesson`, `consultation.LawyerProfile` independently.
- Create fixture generators per schema so one broken domain does not block others.
- Use idempotent upserts keyed by natural IDs (`slug`, `nba_number`, external `provider_ref`).
