# Authentication API - Endpoint Specifications

## Base URL

```text
https://api.example.com/auth
```

## Endpoints

### 1. User Registration

**POST** `/register`

Creates a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-19T10:30:00Z"
}
```

**Error Response (409):**

```json
{
  "error": "email_already_registered",
  "message": "This email is already registered"
}
```

### 2. User Login

**POST** `/login`

Authenticates user and returns JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John"
  }
}
```

**Error Response (401):**

```json
{
  "error": "invalid_credentials",
  "message": "Email or password is incorrect"
}
```

### 3. User Logout

**POST** `/logout`

Invalidates current session. Requires authentication.

**Headers:**

```text
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "message": "Successfully logged out"
}
```

### 4. Request Password Reset

**POST** `/password-reset/request`

Sends password reset link to email.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset link sent to email"
}
```

### 5. Reset Password

**POST** `/password-reset/confirm`

Confirms password reset with token.

**Request:**

```json
{
  "token": "reset_token_abc123",
  "newPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**

```json
{
  "message": "Password successfully reset"
}
```

**Error Response (400):**

```json
{
  "error": "invalid_token",
  "message": "Reset token is invalid or expired"
}
```

### 6. Refresh Token

**POST** `/refresh`

Generates new JWT token using refresh token.

**Request:**

```json
{
  "refreshToken": "refresh_token_xyz789"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

## Rate Limiting

- Login endpoint: 5 attempts per minute per IP
- Registration: 3 accounts per hour per IP
- Password reset request: 3 requests per hour per email

## Authentication

Protected endpoints require:

```text
Authorization: Bearer {jwt_token}
```

All tokens expire after 1 hour. Use refresh endpoint for new tokens.

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid credentials |
| 409 | Conflict / email already registered |
| 429 | Rate limit exceeded |
| 500 | Server error |

## See Also

- [Spec](../spec.md) - Feature requirements
- [Data Model](../data-model.md) - Database schema
- [Diagrams](../diagrams/) - System architecture
