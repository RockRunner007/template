# Change Management

Guidelines for planning, reviewing, and implementing changes.

## Change Classification

### Level 1: Patch (Low Risk)

**Impact:** Limited, internal only

**Examples:**

- Bug fixes (< 100 lines changed)
- UI text improvements
- Internal utility refactoring
- Documentation updates

**Approval:** 1 reviewer

**Testing:** Unit tests, manual

**Deployment:** During business hours or any time

### Level 2: Minor Feature (Medium Risk)

**Impact:** New functionality, user-facing

**Examples:**

- New endpoint (< 500 lines)
- Database field addition
- Feature flag
- Dependency updates

**Approval:** 2 reviewers + tech lead

**Testing:** Unit + integration tests, QA sign-off

**Deployment:** During business hours

**Monitoring:** Watch error rates for 1 hour

### Level 3: Major Feature (High Risk)

**Impact:** Significant new capability, affects core behavior

**Examples:**

- Authentication system rewrite
- Database migration
- Payment processing changes
- Architectural changes

**Approval:** 2 reviewers + tech lead + security lead

**Testing:** Full test suite, E2E tests, staging validation

**Deployment:** Planned maintenance window, < 10% rollout

**Monitoring:** Watch for 24 hours

### Level 4: Critical Change (Very High Risk)

**Impact:** Affects all users, potential data loss

**Examples:**

- Payment system changes
- Data deletion
- Security fix for vulnerability
- Service migration

**Approval:** Full team consensus

**Testing:** Extensive testing, penetration testing if security

**Deployment:** Controlled rollout, full team on standby

**Monitoring:** 24/7 for 72 hours

## Change Request Process

### 1. Plan Phase

**Create change request:**

```text
Title: Implement user authentication system
Type: Major Feature
Risk Level: 3 (High)
Timeline: 2 weeks development
Owner: @alice
```

**Include:**

- [ ] Business justification
- [ ] Technical approach
- [ ] Affected systems
- [ ] Rollback plan
- [ ] Estimated timeline

**Review & Approval:**

- [ ] Tech lead approves approach
- [ ] Product lead approves business case
- [ ] Security lead reviews security impacts
- [ ] DevOps validates infrastructure needs

### 2. Development Phase

**Standard development process:**

- [ ] Specification written
- [ ] Code review completed
- [ ] Tests passing (> 80% coverage)
- [ ] Integration testing done

**Quality gates:**

- [ ] All tests pass
- [ ] Security scan passes
- [ ] Performance validated

### 3. Staging Phase

**Deploy to staging:**

- [ ] Code merged to main
- [ ] Deploy to staging environment
- [ ] Run full test suite
- [ ] Run security tests
- [ ] Load test (if applicable)

**QA Sign-Off:**

- [ ] QA tests acceptance criteria
- [ ] QA tests edge cases
- [ ] QA tests rollback procedure
- [ ] QA signs off in ticket

### 4. Deployment Planning

**Before deployment:**

- [ ] Maintenance window scheduled
- [ ] Team notified
- [ ] On-call engineer assigned
- [ ] Rollback procedure tested
- [ ] Communication plan ready

**Deployment window:**

- [ ] Dev environment ready
- [ ] Staging verified
- [ ] Production database backed up
- [ ] Team standing by
- [ ] Monitoring dashboards open

### 5. Deployment

**Execute deployment:**

```text
1. Deploy to 1 instance (canary) - 5%
2. Monitor for 5 minutes
3. Deploy to 25% of instances
4. Monitor for 10 minutes
5. Deploy to remaining instances
6. Monitor for 1 hour
```

**Rollback decision point:**

- Error rate > 1%?  → Rollback
- Latency p99 > 2x SLA?  → Rollback
- Customer reports?  → Investigate then decide

### 6. Post-Deployment

**Immediate (1 hour):**

- [ ] Verify deployment succeeded
- [ ] Check error rates normal
- [ ] Verify business metrics
- [ ] Check logs for issues

**Short-term (24 hours):**

- [ ] Monitor stability
- [ ] Watch for user reports
- [ ] Check database health
- [ ] Verify backups working

**Follow-up (1 week):**

- [ ] Post-mortem if issues
- [ ] Document lessons learned
- [ ] Update runbooks if needed
- [ ] Archive deployment artifacts

## Risk Assessment

Rate each change:

| Factor | Impact | Score |
|--------|--------|-------|
| **Lines changed** | 0-100: 1pt, 100-500: 2pts, 500+: 3pts | |
| **Systems affected** | 1 system: 1pt, 2-3 systems: 2pts, 4+: 3pts | |
| **Data impact** | No data: 1pt, Reads only: 2pts, Writes: 3pts | |
| **User impact** | Internal only: 1pt, Some users: 2pts, All users: 3pts | |
| **Reversibility** | Easy rollback: 1pt, Hard rollback: 2pts, No rollback: 3pts | |
| **Testing coverage** | 90%+: 1pt, 70-90%: 2pts, <70%: 3pts | |

**Risk Level:**

- Score 6-10: Low risk (Patch)
- Score 11-14: Medium risk (Minor Feature)
- Score 15-17: High risk (Major Feature)
- Score 18+: Very high risk (Critical Change)

## Communication

### Announcement (Before Deployment)

```text
Subject: Upcoming Deployment: Authentication System

We'll be deploying improvements to the authentication system 
on [Date] at [Time] ([Duration] expected downtime).

What's changing:
- Faster login process (3x improvement)
- Better error messages
- Improved security

User impact:
- Sessions may be invalidated (users need to re-login)
- Old mobile app versions won't work (update required)

Rollback plan:
- If issues occur, we'll revert to previous version (5 min downtime)

Questions? Ask in #deployment
```

### Update During Deployment

```text
🚀 Deployment started at 14:00 UTC

14:05 ✅ Deployment to canary (5%) successful
       Error rate: 0.02% (normal)
       
14:15 ✅ Expanded to 50% of instances
       Error rate: 0.05% (normal)
       
14:25 ✅ Full deployment complete
       All systems operational
```

### Post-Deployment Report

```text
📊 Deployment Complete

Deployed: v2.1.0 (Authentication improvements)
Duration: 25 minutes
Status: ✅ Successful

Metrics:
- Error rate: 0.03% (normal)
- Latency p99: 195ms (normal)
- Success rate: 99.97%

Notes:
- 1 user reported stale session (expected)
- All systems healthy
- Database replication lag: 2s (normal)

Next: Monitor for 24h
```

## Rollback Decision

**Rollback if:**

- [ ] Error rate > 1% (or 5x baseline)
- [ ] Latency p99 > 2x SLA
- [ ] Customer data loss or corruption
- [ ] Security vulnerability discovered
- [ ] Business-critical feature broken
- [ ] Can't be fixed within 15 minutes

**Don't rollback if:**

- [ ] Single user affected (can help individually)
- [ ] Minor UI issue (can fix forward)
- [ ] Non-critical feature broken (can disable)
- [ ] Error rate 0.1-0.3% (within tolerance)

## Change Metrics

Track per month:

| Metric | Target | Action |
|--------|--------|--------|
| Deployment frequency | 2-4x/month | Increase if lower |
| Lead time | < 7 days | Reduce if higher |
| Change failure rate | < 15% | Investigate high rates |
| Recovery time | < 1 hour | Practice rollbacks |
| Rollback rate | < 5% | Improve testing |

## Documentation

### Change Log

Maintain in `CHANGELOG.md`:

```markdown
## [2.1.0] - 2026-02-01

### Added
- New authentication endpoints (/v2/auth)
- JWT token refresh mechanism
- Rate limiting on login attempts

### Changed
- Improved login performance 3x
- Better error messages for auth failures

### Fixed
- Security: Fixed timing attack in password comparison

### Breaking Changes
- /v1/auth endpoints deprecated (use /v2/auth)
- Mobile app must be updated (< v1.5 won't work)

### Migration Guide
See: https://docs.example.com/migration/v2.1.0
```

### Runbook Updates

After deployment, update relevant runbooks:

- [Incident Response Runbook](../runbooks/incident-response.md) - Add new troubleshooting section
- [Deploy Runbook](../runbooks/deploy.md) - Add deployment steps if complex
- [Monitoring Guide](../runbooks/monitoring-observability.md) - Add new alerts if needed

## References

- [Feature Lifecycle](../lifecycle/feature-lifecycle.md)
- [Deployment Runbook](../runbooks/deploy.md)
- [Release Management](../lifecycle/release-management.md)
- [Incident Response](../runbooks/incident-response.md)
