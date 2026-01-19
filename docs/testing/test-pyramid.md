# Testing Strategy

Comprehensive testing approach from unit tests to performance and security testing.

## Test Pyramid

```
         /\
        /  \        Manual Testing
       /────\       (Edge cases, UAT)
      /      \
     /────────\     End-to-End Testing
    /          \    (Full workflows)
   /____________\
  /              \  Integration Testing
 /________________\ (Component interaction)
/                  \ Unit Testing
/____________________\ (Individual functions)

Ratio: 1 E2E : 5 Integration : 10 Unit : Manual
```

## Unit Testing

### Purpose

Test individual functions, classes, and methods in isolation.

### Coverage Target

- **Minimum:** 80% code coverage
- **Security-critical:** 100% coverage
- **Standard:** 85% coverage

### Example: Authentication Service

```javascript
describe('AuthService', () => {
  describe('hashPassword()', () => {
    it('should hash password with bcrypt', async () => {
      const password = 'TestPassword123!';
      const hash = await authService.hashPassword(password);
      
      expect(hash).not.toEqual(password);
      expect(hash.length).toBeGreaterThan(20);
    });
    
    it('should create different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);
      
      expect(hash1).not.toEqual(hash2);
    });
  });
  
  describe('verifyPassword()', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await authService.hashPassword(password);
      
      const result = await authService.verifyPassword(password, hash);
      expect(result).toBe(true);
    });
    
    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await authService.hashPassword(password);
      
      const result = await authService.verifyPassword(wrongPassword, hash);
      expect(result).toBe(false);
    });
  });
});
```

### Running Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- auth.test.js

# Watch mode (re-run on changes)
npm test -- --watch
```

### Mocking Dependencies

```javascript
// Mock database for unit testing
jest.mock('../db', () => ({
  query: jest.fn()
}));

test('getUserById should query database', async () => {
  const mockUser = { id: '123', name: 'John' };
  db.query.mockResolvedValueOnce([mockUser]);
  
  const result = await authService.getUserById('123');
  
  expect(db.query).toHaveBeenCalledWith(
    'SELECT * FROM users WHERE id = ?',
    ['123']
  );
  expect(result).toEqual(mockUser);
});
```

## Integration Testing

### Purpose

Test how multiple components work together (auth + database, API + cache, etc.).

### Coverage Target

- **Critical paths:** 100%
- **Standard flows:** 70%
- **Edge cases:** 30%

### Example: Login Flow

```javascript
describe('Login Integration', () => {
  let testDb;
  let testCache;
  
  beforeEach(async () => {
    testDb = await setupTestDatabase();
    testCache = await setupTestCache();
  });
  
  it('should complete successful login flow', async () => {
    // Setup
    const user = await testDb.users.create({
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password123', 10)
    });
    
    // Test login
    const response = await loginEndpoint({
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Verify response
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    
    // Verify session stored
    const session = await testCache.get(`session:${response.body.token}`);
    expect(session.user_id).toBe(user.id);
    
    // Verify audit log
    const logs = await testDb.auditLogs.find({ user_id: user.id });
    expect(logs[0].event).toBe('login_success');
  });
  
  it('should fail with wrong password', async () => {
    await testDb.users.create({
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('correct_password', 10)
    });
    
    const response = await loginEndpoint({
      email: 'test@example.com',
      password: 'wrong_password'
    });
    
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('invalid_credentials');
  });
});
```

### Running Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run with specific database
DATABASE_URL=postgres://localhost:5432/test npm run test:integration

# Run with coverage
npm run test:integration -- --coverage
```

## End-to-End Testing

### Purpose

Test complete workflows from user perspective (API requests, UI interactions).

### Coverage Target

- **Critical user flows:** 100%
- **Common flows:** 70%
- **Edge cases:** 20%

### Example: Registration Flow (API)

```javascript
describe('User Registration E2E', () => {
  it('should complete registration flow', async () => {
    // Step 1: Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      });
    
    expect(registerResponse.status).toBe(201);
    const { id: userId } = registerResponse.body;
    
    // Step 2: Verify email (get verification link from email service)
    const verificationToken = await getVerificationToken(userId);
    const verifyResponse = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: verificationToken });
    
    expect(verifyResponse.status).toBe(200);
    
    // Step 3: Login with new account
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass123!'
      });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    
    // Step 4: Verify user data
    const profileResponse = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    
    expect(profileResponse.body.email).toBe('newuser@example.com');
    expect(profileResponse.body.firstName).toBe('John');
  });
});
```

### Running E2E Tests

```bash
# Run E2E tests (requires running app)
npm run test:e2e

# Run against staging
API_BASE_URL=https://staging.example.com npm run test:e2e

# Run specific test file
npm run test:e2e -- registration.e2e.js
```

## Performance Testing

### Load Testing

**Goal:** Verify performance under expected load.

**Tool:** Apache JMeter, k6, or Locust

```yaml
# k6 load test
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,                    // 100 concurrent users
  duration: '5m',              // Run for 5 minutes
  rps: 1000,                   // Max 1000 requests/second
};

export default function () {
  let response = http.post('https://api.example.com/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

**Run load test:**

```bash
k6 run loadtest.js

# Results show:
# - Request latency (p50, p95, p99)
# - Errors and failures
# - RPS throughput
# - Resource utilization
```

### Spike Testing

**Goal:** Verify behavior under sudden traffic increase.

```yaml
export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '1m', target: 500 },   // Spike
    { duration: '2m', target: 100 },   // Ramp down
  ],
};
```

### Soak Testing

**Goal:** Find memory leaks under extended load.

```yaml
export let options = {
  stages: [
    { duration: '5m', target: 100 },   // Ramp up
    { duration: '2h', target: 100 },   // Stay at load (2 hours)
    { duration: '5m', target: 0 },     // Ramp down
  ],
};
```

**Monitor during test:**

- Memory usage trend (should stay flat)
- Error rate increase (indicates degradation)
- Response latency trend (indicates problems)

## Security Testing

### Input Validation Testing

```javascript
describe('Security: Input Validation', () => {
  it('should reject SQL injection attempts', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "admin' OR '1'='1",
        password: 'anything'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('invalid_email');
  });
  
  it('should reject XSS payload in name', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: '<script>alert("xss")</script>'
      });
    
    expect(response.status).toBe(400);
  });
  
  it('should sanitize output', async () => {
    // User with script in name
    await testDb.users.create({
      firstName: '<img src=x onerror=alert(1)>'
    });
    
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    
    // Script should be removed/escaped
    expect(response.body.firstName).not.toContain('<script>');
    expect(response.body.firstName).not.toContain('onerror=');
  });
});
```

### Authentication Testing

```javascript
describe('Security: Authentication', () => {
  it('should require valid token', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid_token');
    
    expect(response.status).toBe(401);
  });
  
  it('should reject expired tokens', async () => {
    const expiredToken = generateToken({ exp: Date.now() - 1000 });
    
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${expiredToken}`);
    
    expect(response.status).toBe(401);
  });
  
  it('should prevent rate limit bypass', async () => {
    // Make 10 login attempts
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        });
    }
    
    // 11th attempt should be blocked
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrong'
      });
    
    expect(response.status).toBe(429);
    expect(response.body.error).toBe('too_many_attempts');
  });
});
```

### Dependency Security Testing

```bash
# Check for known vulnerabilities
npm audit

# Update vulnerable dependencies
npm audit fix

# Check in CI/CD pipeline
npm audit --audit-level=moderate
```

## Test Data Management

### Test Database Fixtures

```javascript
// fixtures/users.js
module.exports = [
  {
    id: 'user_001',
    email: 'alice@example.com',
    password_hash: '$2b$10$...',  // bcrypt hash
    verified_at: new Date()
  },
  {
    id: 'user_002',
    email: 'bob@example.com',
    password_hash: '$2b$10$...',
    verified_at: null
  }
];
```

### Setup/Teardown

```javascript
beforeEach(async () => {
  // Clear database
  await testDb.truncateAll();
  
  // Load fixtures
  await testDb.users.insert(userFixtures);
  await testDb.sessions.insert(sessionFixtures);
});

afterEach(async () => {
  // Clean up
  await testDb.truncateAll();
});
```

## CI/CD Integration

### Test Pipeline

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Unit Tests
        run: npm run test:unit -- --coverage
        
      - name: Integration Tests
        run: npm run test:integration
        
      - name: E2E Tests
        run: npm run test:e2e
        
      - name: Security Tests
        run: npm audit && npm run test:security
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Acceptance Criteria

All tests must pass before merge:

- [ ] Unit tests: 80%+ coverage
- [ ] Integration tests: All pass
- [ ] E2E tests: Critical flows pass
- [ ] Security tests: No vulnerabilities
- [ ] Performance: Within SLA

## Test Metrics

Track these per release:

| Metric | Target | Action |
|--------|--------|--------|
| Code coverage | 80%+ | Fail build if below |
| Test pass rate | 100% | Block merge if failing |
| Mean time to test | < 10 min | Optimize slow tests |
| Test flakiness | < 1% | Fix flaky tests |
| Bugs in staging | < 3 | Extend test coverage |
| Bugs in production | 0 | Improve E2E coverage |

## References

- [Testing Best Practices](https://testing-library.com/docs/)
- [Performance Testing Guide](https://k6.io/docs/)
- [OWASP Security Testing](https://owasp.org/www-project-web-security-testing-guide/)
