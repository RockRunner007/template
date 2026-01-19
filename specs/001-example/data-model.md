# Authentication System - Data Model

Complete database schema specification.

## Entity Relationship Diagram

See `diagrams/data-model.mmd` for visual overview.

## Tables

### USER

Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  verified_at TIMESTAMP,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Columns:**
- `id`: Unique user identifier
- `email`: Unique email address
- `password_hash`: bcrypt hashed password (never plaintext)
- `first_name`: User's first name
- `last_name`: User's last name
- `verified_at`: Timestamp when email was verified
- `failed_login_attempts`: Counter for brute force protection
- `locked_until`: Account lockout expiration time
- `created_at`: Account creation timestamp
- `updated_at`: Last modification timestamp
- `deleted_at`: Soft delete timestamp (NULL if active)

### SESSION

Tracks active login sessions.

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_revoked_at ON sessions(revoked_at);
```

**Columns:**

- `id`: Unique session identifier
- `user_id`: Reference to user
- `token_hash`: Hash of JWT token (for blacklist)
- `ip_address`: Client IP address
- `user_agent`: Browser user agent
- `expires_at`: Session expiration time
- `created_at`: Session start time
- `revoked_at`: Logout timestamp (NULL if active)

### PASSWORD_RESET

Temporary tokens for password reset flow.

```sql
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
```

**Columns:**

- `id`: Unique reset request identifier
- `user_id`: Reference to user
- `token_hash`: Hash of reset token sent via email
- `expires_at`: Token expiration (24 hours)
- `used_at`: Timestamp when reset was completed
- `created_at`: Request creation time

### AUDIT_LOG

Tracks authentication-related events for security and compliance.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Columns:**

- `id`: Unique log entry identifier
- `user_id`: Reference to user (NULL for system events)
- `event_type`: Type of event (login, logout, password_change, etc.)
- `ip_address`: Client IP address
- `user_agent`: Browser user agent
- `details`: JSON object with event-specific data
- `created_at`: Event timestamp

**Event Types:**

- `user.registered`
- `user.login_success`
- `user.login_failed`
- `user.logout`
- `user.password_reset_requested`
- `user.password_changed`
- `user.account_locked`
- `user.deleted`

## Relationships

```text
USER (1) ──── (many) SESSION
USER (1) ──── (many) PASSWORD_RESET
USER (1) ──── (many) AUDIT_LOG
```

## Indexes

All foreign keys and frequently searched columns are indexed for query performance.

## Data Retention

- `users`: Keep forever (or until deleted)
- `sessions`: Purge 30 days after expiration
- `password_resets`: Purge 7 days after expiration
- `audit_logs`: Keep for 2 years (compliance requirement)

## See Also

- [Spec](spec.md) - Feature requirements
- [Plan](plan.md) - Implementation phases
- [Diagrams](diagrams/) - Visual schema overview
