# Code Review Standards

Guidelines for reviewing specifications, code, and pull requests.

## Review Objectives

1. **Correctness** - Does it solve the problem?
2. **Quality** - Is the code/spec well-written?
3. **Security** - Are there security vulnerabilities?
4. **Performance** - Will this scale?
5. **Maintainability** - Can others understand it?

## Reviewing Specifications

### Specification Review Checklist

- [ ] **User Stories Clear** - Can a developer understand what to build?
- [ ] **Acceptance Criteria Testable** - Can QA verify these?
- [ ] **Edge Cases Documented** - What about error scenarios?
- [ ] **Non-Functional Requirements** - Performance, security, scale requirements defined?
- [ ] **Dependencies Listed** - What does this depend on?
- [ ] **Ambiguities Marked** - Use `[NEEDS CLARIFICATION: question]`
- [ ] **Architecture Sound** - Will this work with current systems?
- [ ] **Backwards Compatibility** - Breaking changes documented?

### Example Spec Review Comment

```text
## Issue: Acceptance Criteria Not Testable

**Spec:**
> "The login should be fast"

**Problem:** "Fast" is subjective. QA can't test this.

**Suggestion:**
> "The login response time must be < 200ms (p95)"

This is measurable and testable. We can automate this check.
```

## Reviewing Code

### Code Review Checklist

**Before approving, verify:**

- [ ] **Spec Implemented** - All acceptance criteria met?
- [ ] **Tests Included** - Unit tests, integration tests?
- [ ] **Test Coverage** - Minimum 80%?
- [ ] **No Secrets** - Hardcoded passwords, API keys?
- [ ] **Error Handling** - All error paths handled?
- [ ] **Validation** - Input validated?
- [ ] **Documentation** - Complex logic commented?
- [ ] **Performance** - Not O(n²) or worse?
- [ ] **Security** - No SQL injection, XSS, CSRF?
- [ ] **Logging** - Sufficient for debugging?
- [ ] **Backwards Compatible** - Or documented breaking change?

### Example Code Review Comments

**Good Comment (Constructive):**

```text
## Performance Concern

The nested loop here is O(n²). With 10,000 users, this could be slow.

Suggestion: Use a Set for O(1) lookup

Before:
for (const user of users) {
  if (excludedUsers.includes(user.id)) {
    // ...
  }
}

After:
const excluded = new Set(excludedUsers.map(u => u.id));
for (const user of users) {
  if (excluded.has(user.id)) {
    // ...
  }
}
```

**Bad Comment (Unhelpful):**

```text
This is inefficient
```

### Approval Requirements

**Minimum reviewers:**

- Feature code: 2 approvals
- Security-critical: 2 + security lead
- Infrastructure: 2 + DevOps lead
- Documentation: 1

**Automatic failures:**

- [ ] Security scan failed
- [ ] Tests not passing
- [ ] Code coverage below 80%
- [ ] Linting errors

## Reviewing Pull Requests

### PR Description Review

Check that PR description includes:

- [ ] **Title** - Clear, concise summary
- [ ] **Spec Link** - Link to related specification
- [ ] **Changes** - What changed and why?
- [ ] **Testing** - How was this tested?
- [ ] **Breaking Changes** - Any migrations needed?
- [ ] **Screenshots** - Visual changes shown (if UI)

### Example PR Description

```text
## Title
Fix: Prevent duplicate session creation on rapid login

## Spec
Implements: [001-authentication/spec.md](link)

## Changes
- Added mutex lock to login endpoint
- Prevents multiple simultaneous logins creating multiple sessions
- Only first login succeeds, others get 409 Conflict

## Testing
- Added integration test for concurrent logins
- Verified on staging with 100 concurrent users
- No performance impact (lock acquired for ~10ms)

## Breaking Changes
None - Only affects invalid (concurrent) requests

## Deploy Notes
- No database migration needed
- Safe to deploy anytime
```

## Review Process

### Step 1: Author Submits PR

- [ ] PR description complete
- [ ] All tests passing locally
- [ ] Self-reviewed before submitting

### Step 2: Automated Checks

- [ ] Linting passes
- [ ] Tests pass
- [ ] Code coverage > 80%
- [ ] Security scan clean
- [ ] No conflicts with main

### Step 3: Code Review

- [ ] 1st reviewer reviews and comments
- [ ] 2nd reviewer reviews and approves
- [ ] Author responds to comments
- [ ] If requested changes: author updates and requests re-review

### Step 4: Merge

- [ ] All checks passing
- [ ] All conversations resolved
- [ ] Minimum approvals received
- [ ] Ready to deploy

## Reviewing Different Types of Changes

### Feature Implementation

**Focus on:**

- Spec completeness - All acceptance criteria met?
- Code quality - Is it maintainable?
- Test coverage - Edge cases tested?
- Performance - Will this scale?

### Bug Fix

**Focus on:**

- Root cause - Is this fixing the real issue or symptom?
- Regression - Could this break other things?
- Test - Includes test that prevents regression?

### Documentation

**Focus on:**

- Clarity - Can a newcomer understand?
- Accuracy - Is information correct?
- Completeness - Are all edge cases covered?
- Examples - Do examples work as shown?

### Dependency Update

**Focus on:**

- Security - Fixing known vulnerability?
- Breaking changes - Does it break our code?
- Performance - Improvement or regression?
- Compatibility - Supports our Node/Python version?

## Difficult Reviews

### Disagreement with Approach

**Don't say:**
> "This approach is wrong"

**Say:**
> "I see this approach could work. I have concerns about X because Y.
> Have you considered Z approach? Here's a link to more info."

### Performance Concerns

Provide evidence:

```text
I notice this query could be slow with 100,000 records.

Before optimization:
SELECT * FROM transactions 
WHERE user_id IN (...) -- 500 IDs
-- Full scan of transactions table

After optimization:
SELECT * FROM transactions 
WHERE user_id IN (...) 
AND created_at > NOW() - INTERVAL 90 DAY
-- Uses index on (created_at, user_id)

This should reduce query time from 2s to 50ms.
Can you add this date filter to spec?
```

### Security Issues

Be specific:

```text
## Security: SQL Injection Risk

The query uses string concatenation:
```sql
query = "SELECT * FROM users WHERE email = '" + email + "'"
```

If email = `' OR '1'='1`, this executes malicious SQL.

Solution: Use parameterized queries:

```javascript
db.query('SELECT * FROM users WHERE email = ?', [email])

See: [OWASP SQL Injection](link)
```

## Red Flags

**Block approval if:**

- No tests (unless documentation)
- Test coverage below 80%
- Hardcoded secrets/credentials
- Security vulnerability
- Database changes without migration
- Breaks existing tests
- No spec/issue linked

**Request changes if:**

- Poor documentation
- Violates naming conventions
- Performance degradation
- Missing error handling
- Incomplete spec implementation

## Praise & Recognition

**Good review includes:**

- Acknowledgment of good solutions
- Explanation of why approach is good
- Appreciation for testing
- Recognition of effort

**Example:**
> Great solution using memoization! This is much cleaner than the previous approach and improves performance by 40%. Thanks for adding comprehensive tests - the coverage is excellent.

## Review Metrics

Track per month:

| Metric | Target | Action |
|--------|--------|--------|
| Review time | < 24h | Prioritize |
| Approval rate | 90%+ | Ensure quality |
| Revision rate | < 30% | Improve reviews |
| Rework cycles | < 2 | Clear feedback |

## References

- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Spec-Kit](https://github.com/github/spec-kit)
