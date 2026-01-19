# Security Testing Playbook

Comprehensive approach to finding and preventing security vulnerabilities.

## Security Testing Layers

```text
Level 1: Static Analysis (Code)
  ├─ SAST (CodeQL, SonarQube)
  ├─ Dependency scanning
  └─ Secret scanning

Level 2: Dynamic Analysis (Running App)
  ├─ DAST scanning
  ├─ API security testing
  └─ Input validation testing

Level 3: Penetration Testing
  ├─ Manual vulnerability hunting
  ├─ Social engineering
  └─ Physical security

Level 4: Compliance
  ├─ SOC 2 audit
  ├─ GDPR compliance
  └─ Industry standards
```

## SAST (Static Application Security Testing)

### CodeQL

Automated code scanning for vulnerabilities:

```bash
# Initialize CodeQL database
codeql database create cpp_db --language=cpp

# Run queries
codeql database analyze cpp_db --format=csv --output=results.csv

# View in GitHub
# GitHub Actions runs automatically on push
```

### Configuration

`.github/codeql-config.yml`:

```yaml
name: "CodeQL Advanced"

queries:
  - uses: security-and-quality

disable-default-queries: false

paths-ignore:
  - tests
  - docs
```

### Queries to Run

- **Authentication Bypass** - Missing auth checks
- **SQL Injection** - Unsanitized SQL queries
- **XSS Vulnerabilities** - Unescaped output
- **CSRF** - Missing CSRF tokens
- **Insecure Crypto** - Weak algorithms
- **Hardcoded Credentials** - Secrets in code

## Dependency Scanning

### NPM Audit

```bash
# Check current vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Detailed report
npm audit --json > audit-report.json
```

### GitHub Dependabot

Automatically creates PRs for updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "security-team"
    allow:
      - dependency-type: "all"
```

### Security Advisories

Monitor for public vulnerabilities:

```bash
# Check GitHub Security Advisories
curl https://api.github.com/graphql -d @query.graphql

# Query
query {
  securityVulnerabilities(first: 100) {
    nodes {
      package { name }
      advisory { description }
    }
  }
}
```

## Secret Scanning

### Detect Exposed Secrets

```bash
# Scan with GitGuardian
ggshield scan --all-history

# Results show:
# - API keys found
# - Database passwords
# - Private keys
# - Tokens
```

### Git Hooks

Prevent committing secrets:

```bash
# .git/hooks/pre-commit
#!/bin/bash
if git diff --cached | grep -E '(password|api_key|secret|token)'; then
  echo "⚠️  Potential secret detected!"
  exit 1
fi
```

## DAST (Dynamic Application Security Testing)

### API Security Testing

**Test for common vulnerabilities:**

```javascript
describe('Security: API Endpoints', () => {
  // Test 1: Authentication Required
  it('should require authentication', async () => {
    const response = await request(app).get('/api/users/me');
    expect(response.status).toBe(401);
  });
  
  // Test 2: Authorization (users can only access their own data)
  it('should prevent accessing other user data', async () => {
    const token1 = generateToken({ user_id: 'user_1' });
    const response = await request(app)
      .get('/api/users/user_2')
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(403);
  });
  
  // Test 3: Rate Limiting
  it('should rate limit login attempts', async () => {
    for (let i = 0; i < 20; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
    }
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    
    expect(response.status).toBe(429);
  });
  
  // Test 4: Input Validation
  it('should validate input types', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'not-an-email',
        age: 'not-a-number',
        name: 12345
      });
    
    expect(response.status).toBe(400);
  });
  
  // Test 5: CSRF Protection
  it('should enforce CSRF tokens', async () => {
    const response = await request(app)
      .post('/api/users/change-password')
      .send({ new_password: 'xyz' })
      .set('Origin', 'https://evil.com');
    
    expect(response.status).toBe(403);
  });
  
  // Test 6: Response Headers
  it('should include security headers', async () => {
    const response = await request(app).get('/');
    
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['strict-transport-security']).toBeDefined();
  });
});
```

### OWASP ZAP Scanning

Automated security scanning:

```bash
# Install ZAP
docker run -it -v $(pwd):/zap/wrk:rw owasp/zap2docker-stable \
  zap-baseline.py -t http://app:3000 -r report.html

# Results include:
# - SQL Injection risks
# - XSS vulnerabilities
# - Missing security headers
# - Misconfigured CORS
```

## Input Validation Testing

### Password Validation

```javascript
describe('Security: Password Strength', () => {
  it('should require minimum 8 characters', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Short1!'
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('password_too_short');
  });
  
  it('should require uppercase letter', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'lowercase123!'
      });
    expect(response.status).toBe(400);
  });
  
  it('should require number', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'NoNumbers!'
      });
    expect(response.status).toBe(400);
  });
  
  it('should require special character', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'NoSpecial123'
      });
    expect(response.status).toBe(400);
  });
});
```

### SQL Injection Prevention

```javascript
describe('Security: SQL Injection', () => {
  it('should safely handle quotes in email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: "admin'--",
        password: 'anything'
      });
    
    // Should not expose database error or execute injection
    expect(response.status).toBe(401);
    expect(response.body.message).not.toContain('SQL');
  });
  
  it('should safely handle backslashes', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin\\x27--',
        password: 'anything'
      });
    
    expect(response.status).toBe(401);
  });
});
```

### XSS Prevention

```javascript
describe('Security: Cross-Site Scripting', () => {
  it('should escape user input in responses', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    
    await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: xssPayload
      });
    
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    
    // Script should not be executable
    expect(response.body.name).not.toContain('<script>');
  });
  
  it('should escape HTML entities', async () => {
    const html = '<img src=x onerror="alert(1)">';
    
    const response = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: html });
    
    const profile = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);
    
    // HTML entities should be escaped
    expect(profile.body.bio).toContain('&lt;');
    expect(profile.body.bio).toContain('&gt;');
  });
});
```

## Penetration Testing

### Manual Testing Checklist

**Authentication:**

- [ ] Bypass login with manipulated tokens
- [ ] Access other user accounts
- [ ] Test session fixation
- [ ] Test password reset vulnerabilities
- [ ] Test account lockout bypass
- [ ] Test 2FA bypass

**Authorization:**

- [ ] Access higher privilege resources
- [ ] Horizontal privilege escalation
- [ ] Test object-level authorization
- [ ] Test function-level authorization

**Data Protection:**

- [ ] Extract sensitive data from responses
- [ ] Intercept unencrypted data (HTTPS required)
- [ ] Test data leakage in logs
- [ ] Test backup/export security

**Business Logic:**

- [ ] Bypass workflow steps
- [ ] Manipulate prices or amounts
- [ ] Create fraudulent transactions
- [ ] Exploit race conditions

### Tools

**Burp Suite** - Web application testing

```text
1. Intercept HTTP requests
2. Modify and replay requests
3. Scan for vulnerabilities
4. Analyze security issues
```

**OWASP ZAP** - Automated vulnerability scanning

```bash
docker run owasp/zap2docker-stable \
  zap-baseline.py -t http://target.com
```

## Security Compliance

### Code Review Checklist

Before merging, verify:

- [ ] No hardcoded secrets
- [ ] Input validation on all endpoints
- [ ] Output escaping implemented
- [ ] CSRF tokens on state-changing operations
- [ ] Rate limiting on sensitive endpoints
- [ ] Proper error messages (no info leakage)
- [ ] Security headers set correctly
- [ ] Dependency vulnerabilities resolved
- [ ] OWASP Top 10 mitigations in place

### Vulnerability Severity

| Severity | CVSS | Impact | Timeline |
|----------|------|--------|----------|
| Critical | 9.0-10.0 | Immediate threat | Fix in < 24h |
| High | 7.0-8.9 | Serious risk | Fix in < 1 week |
| Medium | 4.0-6.9 | Moderate risk | Fix in < 30 days |
| Low | 0.1-3.9 | Minor risk | Fix when possible |

## Continuous Security

### Monitoring for Threats

- [ ] Monitor for new CVEs affecting dependencies
- [ ] Subscribe to security mailing lists
- [ ] Track GitHub security advisories
- [ ] Monitor cloud provider security bulletins
- [ ] Review access logs for suspicious activity

### Security Incident Response

1. **Immediate** - Isolate affected system
2. **Assessment** - Understand scope
3. **Remediation** - Fix vulnerability
4. **Verification** - Confirm fix works
5. **Post-mortem** - Prevent recurrence

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CodeQL Documentation](https://codeql.github.com/)
- [Burp Suite Learning](https://portswigger.net/web-security)
