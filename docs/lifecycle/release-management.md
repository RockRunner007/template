# Release Management

Standards and procedures for version releases and changelog management.

## Versioning Strategy

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH-PRERELEASE+BUILD`

Example: `2.1.3-rc.1+build.123`

**MAJOR** - Breaking API changes, major features

- Increments on incompatible API changes
- Requires migration guide
- Notify users well in advance

**MINOR** - New features, backward compatible

- New endpoints or capabilities
- Performance improvements
- Dependency updates

**PATCH** - Bug fixes, security patches

- Non-breaking fixes
- Hotfixes for production issues
- Performance tweaks

**PRERELEASE** - Beta, release candidate (optional)

- `-alpha` - Early development
- `-beta` - Feature complete, testing
- `-rc` - Release candidate

### Version Numbering Rules

- Start at `1.0.0` on first production release
- `0.x.y` reserved for development/beta
- Never skip versions
- Increment left-most changed number, reset others to 0
- Examples:
  - `1.2.3` → `2.0.0` (breaking change)
  - `1.2.3` → `1.3.0` (new feature)
  - `1.2.3` → `1.2.4` (bug fix)

## Release Types

### Feature Release (MINOR)

**Trigger:** Collection of features + bug fixes (2-4 weeks of work)

**Process:**

1. Create release branch: `release/v1.2.0`
2. Run full test suite
3. Update version in code
4. Generate changelog
5. Create release tag: `v1.2.0`
6. Deploy to production
7. Create GitHub Release with notes
8. Merge back to main

**Timing:** Every 2-4 weeks

### Patch Release (PATCH)

**Trigger:** Security fix, critical bug, or hotfix

**Process:**

1. Create hotfix branch: `hotfix/v1.2.1`
2. Apply fix and test
3. Bump version to `1.2.1`
4. Generate changelog for fixes only
5. Create release tag: `v1.2.1`
6. Deploy to production
7. Merge back to main and develop

**Timing:** As needed (typically within 24-48 hours of identification)

### Major Release (MAJOR)

**Trigger:** Breaking changes, major architecture shift

**Process:**

1. Extended testing (2+ weeks)
2. Migration guide required
3. Deprecation warnings in v(N-1).x
4. User communication 30+ days before
5. Early access program
6. Staged rollout
7. Extensive monitoring

**Timing:** 2-4 times per year, planned in advance

## Changelog Format

### File Location

`CHANGELOG.md` in repository root

### Format (Keep a Changelog style)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-01-19

### Added
- New user profile page with avatars
- Email notifications for account events
- Two-factor authentication support
- API rate limiting with backoff header

### Changed
- Improved login performance by 40%
- Simplified password reset flow
- Updated dependencies to latest versions

### Fixed
- Critical bug in session management
- Memory leak in notification processor
- Incorrect timezone handling in reports

### Deprecated
- Old `/v1/auth` endpoints (use `/v2/auth` instead)
- Legacy email format parameter

### Security
- Fixed XSS vulnerability in user bio field
- Upgraded bcrypt to address timing attacks
- Added CSRF token validation

### Removed
- Support for Python 2.7
- Deprecated XML API endpoints

[2.1.0]: https://github.com/RockRunner007/template/releases/tag/v2.1.0
```

### Categories (in order)

1. **Added** - New features and capabilities
2. **Changed** - Existing functionality changes (backward compatible)
3. **Fixed** - Bug fixes
4. **Deprecated** - Soon-to-be-removed features (warnings only)
5. **Removed** - Previously deprecated features now gone
6. **Security** - Vulnerability fixes and hardening

## Release Checklist

### Pre-Release (1 week before)

- [ ] All specs for release completed
- [ ] Code review completed
- [ ] All acceptance criteria verified
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Staging tests pass
- [ ] Changelog drafted
- [ ] Release notes written
- [ ] Rollback procedure documented
- [ ] Stakeholders notified

### Release Day

- [ ] Create release branch from main
- [ ] Update version numbers in code
- [ ] Update CHANGELOG.md
- [ ] Commit version changes
- [ ] Create git tag: `v{VERSION}`
- [ ] Push tag to repository
- [ ] Create GitHub Release from tag
- [ ] Add release notes and changelog
- [ ] Deploy to production
- [ ] Run smoke tests
- [ ] Verify health checks
- [ ] Monitor error rates for 1 hour

### Post-Release

- [ ] Send release announcement
- [ ] Update documentation site
- [ ] Log release in tracking system
- [ ] Assign on-call rotation
- [ ] Schedule retrospective if issues

## Hotfix Process

For critical production issues:

1. **Assess severity**
   - Critical: Data loss, security breach, complete outage
   - High: Major feature broken, service degraded
   - Medium: Non-critical feature broken
   - Low: Minor issue, can wait for next release

2. **Critical/High = Hotfix**
   - Create `hotfix/v{VERSION}` branch from main
   - Apply minimal fix only
   - Add test for the bug
   - Increment PATCH version
   - Follow release checklist
   - Merge hotfix to main and develop

3. **Medium/Low = Next Release**
   - Create feature branch from main
   - Apply fix with context
   - Follow normal release cycle

## Deprecation Policy

### Announcing Deprecation

In release notes:
```
⚠️ DEPRECATED: The `/v1/auth` endpoints will be removed in v3.0.0.
Use `/v2/auth` instead. Migration guide: [link]
```

### Deprecation Timeline

- **v(N).x** - Announce deprecation, issue warning logs
- **v(N+1).x** - Keep working but warn heavily
- **v(N+2).0** - Remove the deprecated feature

**Minimum: 2 releases, 6 months advance notice**

### Deprecation Example

```
v2.0.0: Add new /v2/auth endpoints
v2.0.0: Add deprecation warnings to /v1/auth
v3.0.0: Remove /v1/auth endpoints
```

## Release Automation

GitHub Actions workflows for:

1. **Version bump** - Automated from commit messages (Conventional Commits)
2. **Changelog generation** - Auto-generate from git log
3. **Release creation** - Create GitHub Release automatically
4. **Notification** - Slack/email announcement

See: `.github/workflows/release.yml`

## Version Branching

### Branch Structure

```
main (stable, production)
  ↓ (release branches)
release/v2.1.0
  ↓ (hotfix if needed)
hotfix/v2.1.1
```

### Branch Protection Rules

- Require PR review (2 approvals)
- Require status checks pass
- Dismiss stale PR reviews
- Require branches up to date
- Include admins in restrictions

## Release Rollback

If critical issues after release:

1. **Assess impact** (errors, data loss, security)
2. **Decide: Fix forward vs rollback**
   - Fix forward: Deploy patch quickly
   - Rollback: Revert to previous version
3. **Execute rollback** - See `docs/runbooks/rollback.md`
4. **Root cause analysis** - Scheduled within 48 hours
5. **Post-mortem** - Identify prevention measures

**Rollback SLA:** < 15 minutes from decision to previous version stable

## Release Metrics

Track per release:

- **Lead time** - Days from spec to production
- **Deployment frequency** - Releases per month
- **Change failure rate** - % of releases requiring hotfix
- **Recovery time** - Time to resolve production issues
- **Uptime** - % of time service available

**Goals:**

- Lead time: < 7 days
- Deployment frequency: 2-4 per month
- Change failure rate: < 15%
- Recovery time: < 1 hour
- Uptime: > 99.9%
