# Authentication System - Events

Async events published by the authentication system for other services.

## Events

### 1. user.registered

**Topic:** `events.user.registered`

Published when a new user creates an account.

**Payload:**

```json
{
  "eventId": "evt_abc123",
  "timestamp": "2024-01-19T10:30:00Z",
  "eventType": "user.registered",
  "userId": "user_123",
  "data": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Subscribers:** Email service (send welcome email), Analytics

### 2. user.login

**Topic:** `events.user.login`

Published on successful login.

**Payload:**

```json
{
  "eventId": "evt_def456",
  "timestamp": "2024-01-19T10:35:00Z",
  "eventType": "user.login",
  "userId": "user_123",
  "data": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "location": "San Francisco, CA"
  }
}
```

**Subscribers:** Audit log, Security monitoring

### 3. user.password_reset_requested

**Topic:** `events.user.password_reset_requested`

Published when user requests password reset.

**Payload:**

```json
{
  "eventId": "evt_ghi789",
  "timestamp": "2024-01-19T10:40:00Z",
  "eventType": "user.password_reset_requested",
  "userId": "user_123",
  "data": {
    "email": "user@example.com",
    "resetTokenExpires": "2024-01-19T11:40:00Z"
  }
}
```

**Subscribers:** Email service (send reset link)

### 4. user.password_changed

**Topic:** `events.user.password_changed`

Published when user changes password.

**Payload:**

```json
{
  "eventId": "evt_jkl012",
  "timestamp": "2024-01-19T10:45:00Z",
  "eventType": "user.password_changed",
  "userId": "user_123",
  "data": {
    "email": "user@example.com",
    "method": "reset|self_change"
  }
}
```

**Subscribers:** Security monitoring, Audit log

### 5. user.logout

**Topic:** `events.user.logout`

Published on user logout.

**Payload:**

```json
{
  "eventId": "evt_mno345",
  "timestamp": "2024-01-19T10:50:00Z",
  "eventType": "user.logout",
  "userId": "user_123",
  "data": {
    "sessionDuration": 1200,
    "ipAddress": "192.168.1.1"
  }
}
```

**Subscribers:** Session tracking, Analytics

### 6. user.login_failed

**Topic:** `events.user.login_failed`

Published on failed login attempt.

**Payload:**

```json
{
  "eventId": "evt_pqr678",
  "timestamp": "2024-01-19T10:55:00Z",
  "eventType": "user.login_failed",
  "data": {
    "email": "user@example.com",
    "reason": "invalid_password|user_not_found",
    "ipAddress": "192.168.1.1",
    "attemptNumber": 3
  }
}
```

**Subscribers:** Security monitoring, Audit log

## Event Format

All events follow this standard format:

```json
{
  "eventId": "unique_event_id",
  "timestamp": "ISO8601_timestamp",
  "eventType": "event.type",
  "userId": "user_id_or_null",
  "data": {
    "...event_specific_fields"
  }
}
```

## Publishing

Events are published to message queue (RabbitMQ/Kafka) for async processing. Subscribers should:

1. Handle events idempotently (duplicate events possible)
2. Implement retry logic
3. Log unparseable events
4. Process within 5 minutes of publish

## See Also

- [Spec](../spec.md) - Feature requirements
- [Endpoints](endpoints.md) - REST API specifications
