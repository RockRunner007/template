# Deprecation Policy

Guidelines for removing old features, APIs, and dependencies while maintaining user trust.

## Core Principle

Users should never be surprised by breaking changes. Deprecation is a gradual, communicated transition.

## Deprecation Levels

### Level 1: Announcement

**Duration:** 1 release cycle (2-4 weeks)  
**User Impact:** None yet

- Feature works normally
- No warnings logged
- Changelog and docs updated with notice
- Release notes highlight deprecation
- Blog post or email announcement
- Migration guide published

**Example:**

```text
v2.1.0 - DEPRECATED: /v1/auth endpoints will be removed in v3.0.0
         Use /v2/auth instead. See migration guide: [link]
```

### Level 2: Warning

**Duration:** 1-2 release cycles (2-8 weeks)  
**User Impact:** Warnings in logs/UI

- Feature still works
- Console/log warnings on usage
- Debug-level telemetry tracking usage
- Support documentation updated
- Escalation path communicated

**Example Log:**

```text
[DEPRECATED] /v1/auth will be removed in v3.0.0. 
Use /v2/auth instead. 
Reference: https://docs.example.com/migration/v1-to-v2
Contact: support@example.com for help.
```

### Level 3: Limited Support

**Duration:** 1 release cycle (2-4 weeks)  
**User Impact:** Reduced functionality

- Feature may have bugs unfixed
- Will not receive performance improvements
- No new features added
- Edge cases not supported
- On-call may defer support to migration path

**Example:**

```text
v3.0.0 - UNSUPPORTED: /v1/auth endpoints 
         Critical bugs fixed only. No new features.
         Strongly migrate to /v2/auth.
```

### Level 4: Removal

**Duration:** Immediate  
**User Impact:** Complete

- Feature completely removed
- API returns 404 or 410 Gone
- Calling code fails immediately
- Release notes highlight removal
- Support escalates to migration

**Example:**

```text
v4.0.0 - REMOVED: /v1/auth endpoints deleted
         All requests to /v1/auth return 410 Gone.
         See migration guide: [link]
```

## Timeline

### Standard Deprecation (2 minor releases)

```text
v2.0.0: NEW - Add /v2/auth (new way)
v2.0.0: DEPRECATED - /v1/auth (old way) works, no warnings

v2.1.0: WARNING - /v1/auth works but logs warnings

v3.0.0: REMOVED - /v1/auth deleted entirely
```

**Total timeline:** 2-3 months

### Fast-Track Deprecation (urgent issues)

```text
v2.0.0: NEW - Add /v2/auth
v2.0.0: DEPRECATED + WARNING - /v1/auth works but warns

v2.1.0: REMOVED - /v1/auth deleted
```

**Total timeline:** 2-4 weeks (security/critical only)

### Extended Deprecation (widely used)

```text
v2.0.0: NEW - Add /v2/auth
v2.0.0: DEPRECATED - No warnings, just notice

v2.1.0: WARNING - Logs warnings
v2.2.0: WARNING - Still warns, more visible
v2.3.0: LIMITED - Bugs unfixed, no improvements
v3.0.0: REMOVED
```

**Total timeline:** 4-6 months

## What to Deprecate

### Good Candidates

- Unused endpoints (< 5% usage)
- Superseded by better alternatives
- Performance or security issues
- Breaking changes in dependencies
- Architectural improvements
- Difficult to maintain

### Poor Candidates

- Critical features users rely on
- Without a clear migration path
- Without advance notice
- During major outages
- Right before holidays/events

## Communication Strategy

### Before Deprecation (Planning Phase)

1. **Internal review** - Tech leads decide on deprecation
2. **Migration path** - New alternative must be ready
3. **Documentation** - Migration guide drafted
4. **Estimation** - How many users affected?

### Announcement Phase (2-4 weeks before)

1. **Blog post** - Announce deprecation, explain why, provide timeline
2. **Email** - Direct message to affected users
3. **In-app notice** - If applicable, show notice to users
4. **Support alert** - Prepare support team with FAQs

**Example announcement:**

> **Deprecation Notice: /v1/auth endpoints**
> 
> We're deprecating the old `/v1/auth` endpoints in favor of the new `/v2/auth` which offers:
> - 3x faster response times
> - Better error messages
> - Support for multi-factor authentication
> 
> **Timeline:**
> - v2.0.0 (today): New endpoints available
> - v2.1.0 (Feb): Warnings logged when using v1
> - v3.0.0 (Mar): v1 endpoints removed
> 
> **What to do:**
> 1. Read [migration guide](link)
> 2. Update your code to use /v2/auth
> 3. Test in staging
> 4. Deploy to production
> 
> Questions? Email support@example.com or post in [community forum](link).

### Warning Phase (Active Usage)

1. **Log warnings** - Every time old feature is used
2. **Email summary** - Weekly/monthly for heavy users
3. **Support escalation** - Self-serve resources priority
4. **Metrics tracking** - Monitor usage decline

### Removal Phase (Post-Removal)

1. **Release notes** - Clearly state what's removed
2. **Error messages** - Helpful message pointing to migration guide
3. **Support ready** - Fast-track support for migration issues
4. **Post-mortem** - Learn from the process

## Dependency Deprecation

### Framework Updates

When upgrading framework (e.g., Spring Boot 2 → 3):

1. **New version branch** - v2 supports Spring 2, v3 supports Spring 3
2. **Overlap period** - v2.x continues for 6 months
3. **Maintenance mode** - v2.x gets critical fixes only
4. **End of life** - Stop accepting issues for v2

### Library Updates

When updating dependencies:

1. **Evaluate compatibility** - Does it break our API?
2. **Version constraints** - Specify exact ranges
3. **Test thoroughly** - Integration tests catch breaking changes
4. **Release strategy** - PATCH if compatible, MINOR if new requirements
5. **Communication** - Announce if users must update

## Handling Deprecation Issues

### Users Can't Migrate

- Provide extended timeline (negotiate with product)
- Offer migration assistance (engineering support)
- Create bridge solution if possible
- Document workarounds

### Bugs in Deprecated Feature

- Security bugs: Fix immediately
- Data corruption: Fix immediately
- UX issues: Defer to migration
- Performance: Defer to migration

### Late Users Still Using Old API

- Send escalation email
- Support team offers help
- Migration sprint if enterprise customer
- At removal date, feature stops working

## Metrics & Monitoring

### Track During Deprecation

- % of users still on old version
- Requests/day to deprecated endpoint
- Error rate from deprecated code
- Support tickets related to migration
- Migration completion rate

### Success Criteria

- 95%+ usage migrated before removal
- < 5 support tickets from removal
- No revenue impact from breaking change
- Existing functionality preserved in new way

## Examples

### Example 1: API Endpoint Deprecation

```text
2026-01-20 (v2.0.0):
- NEW: POST /v2/users/login 
- DEPRECATED: POST /v1/auth/login (still works, no warnings)
- Changelog: "Old /v1/auth endpoints superseded by /v2/users"
- Blog: "Announcing improved auth API"

2026-02-15 (v2.1.0):
- /v1/auth/login logs: "[DEPRECATED] Use /v2/users/login instead"
- Telemetry: Track usage of /v1/auth

2026-03-15 (v3.0.0):
- /v1/auth/login returns: 410 Gone
- Error message: "Endpoint removed. Use /v2/users/login"
- Support ready for migration assistance
```

### Example 2: Configuration Deprecation

```text
2026-01-20 (v2.0.0):
- NEW: Config key 'auth.timeout_seconds'
- DEPRECATED: Config key 'auth.timeout' (still works)
- Migration guide published

2026-02-15 (v2.1.0):
- Config 'auth.timeout' logs warning: "Use auth.timeout_seconds"
- Auto-migrate if found

2026-03-15 (v3.0.0):
- Config 'auth.timeout' removed
- If provided, app fails to start with helpful message
```

## References

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Deprecation Best Practices](https://en.wikipedia.org/wiki/Deprecation)
