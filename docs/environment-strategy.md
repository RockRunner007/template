# Environment Strategy

Development, staging, and production environments with promotion pipeline.

## Environment Overview

| Aspect | Dev | Staging | Production |
|--------|-----|---------|------------|
| **Purpose** | Development & testing | QA & integration testing | Live users |
| **Users** | Dev team | QA + stakeholders | End users |
| **Data** | Synthetic | Production-like | Real customer data |
| **Scale** | Low (100 RPS) | Medium (1K RPS) | High (10K+ RPS) |
| **Uptime SLA** | None | 95% | 99.9% |
| **Cost** | ~$300/mo | ~$500/mo | ~$2000/mo |
| **Deployment** | Manual/auto | Manual gated | Fully automated |

## Development Environment

### Purpose

Fast iteration, experimentation, testing new features before staging.

### Characteristics

- **Minimal infrastructure** - Single-instance databases, no redundancy
- **Frequent changes** - Deploy multiple times daily
- **Loose constraints** - No strict security or compliance requirements
- **Easy reset** - Can destroy and recreate anytime

### Resources

```text
Dev Database: PostgreSQL single instance (2GB)
Dev Cache: Redis single node
Dev App: 1-2 instances (auto-scale disabled)
Dev Storage: 10GB logs (auto-purge after 7 days)
```

### Access

- All developers can deploy
- No approval required
- Full database access for testing
- Local development also encouraged

### Data Management

- Synthetic test data only
- Can reset to clean state anytime
- PII masking not required
- Public test credentials OK

### Monitoring

- Basic health checks only
- Errors logged but no alerts
- Manual inspection of logs
- Performance not critical

## Staging Environment

### Purpose

Production-like testing before release. QA, integration testing, performance validation.

### Characteristics

- **Production-like scale** - Similar infrastructure to prod
- **Gated deployments** - Require approval before deploying
- **Real scenarios** - Use production-like data volumes
- **Metrics tracked** - Performance and reliability validated

### Resources

```text
Staging Database: PostgreSQL HA (multi-AZ capable)
Staging Cache: Redis with replication
Staging App: 2-3 instances with auto-scaling
Staging Storage: 100GB logs (30-day retention)
```

### Access

- Developers via merge to `main`
- QA team has full environment access
- Product team can test features
- Limited access to production data (if needed)

### Data Management

- Anonymized copy of production data (weekly)
- Alternatively: High-volume synthetic data
- PII must be masked or removed
- Test data reset before major releases

### Deployment Process

1. **Automatic from main:** Code merged to `main` → auto-deploys to staging
2. **Gated by tests:** All tests must pass
3. **Gated by security:** CodeQL, SAST, dependency checks must pass
4. **Monitoring:** Error budgets tracked

### Testing in Staging

- [ ] Full test suite passes
- [ ] Performance within SLA
- [ ] Load test (1-5x expected traffic)
- [ ] Chaos engineering (kill pods, latency injection)
- [ ] Data migration testing (if applicable)
- [ ] QA manual testing (happy paths + edge cases)
- [ ] Performance profiling
- [ ] Security scanning results reviewed

### Monitoring

- Full observability enabled
- Performance metrics tracked
- Error budgets calculated
- Alerts configured but non-critical

## Production Environment

### Purpose

Serve real users with high reliability, security, and performance.

### Characteristics

- **High availability** - Multi-AZ, auto-failover
- **Strict deployments** - Planned, reviewed, staged
- **Security hardened** - Encryption, WAF, rate limiting
- **Observable** - Comprehensive monitoring & alerting
- **Optimized** - Performance tuned for scale

### Resources

```text
Production Database: PostgreSQL HA multi-AZ (16GB+)
Production Cache: Redis cluster with replication & failover
Production App: 4-6 instances, auto-scale 2-20
Production Storage: 1TB logs (2-year retention)
Production CDN: Global content delivery
```

### Access

- **Code:** Only via approved PRs to `main`
- **Deployment:** Release engineer only
- **Database:** Read-only for debugging (very limited)
- **Secrets:** Via Key Vault (audit logged)
- **SSH:** Emergency only (bastion host + approval)

### Data Management

- **Real customer data** - Encrypted at rest
- **Backups:** Daily + point-in-time recovery
- **Retention:** Per compliance requirements
- **PII:** Encrypted, access logged
- **GDPR:** Data deletion honored immediately

### Deployment Process

1. **Tag Release:** Version created in code
2. **Build Artifact:** Docker image built and scanned
3. **Approval Gate:** Release manager approves
4. **Deploy to Staging:** Automated
5. **Smoke Tests:** Automated validation
6. **Blue/Green Deploy:** New version alongside old
7. **Traffic Switch:** Gradual shift (5% → 50% → 100%)
8. **Monitoring:** Watch error rates, latency
9. **Verification:** Business metrics validated
10. **Rollback Ready:** Previous version available

**Total time:** 30 minutes to 2 hours (depending on size)

### Deployment Approval Checklist

- [ ] All specs completed
- [ ] All acceptance criteria verified
- [ ] Code review approved (2 reviewers)
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Staging tests passed
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] On-call team ready
- [ ] Change window approved

### Monitoring

**Real-time dashboards:**

- Request rate, latency (p50/p95/p99)
- Error rate by endpoint
- Database performance
- Cache hit rate
- Resource utilization

**Alerting:**

- Critical: Page on-call immediately
- High: Create incident ticket
- Medium: Log for investigation
- Low: Weekly report

**SLOs:**

- Availability: 99.9%
- Latency p99: < 200ms
- Error rate: < 0.1%

## Promotion Pipeline

### Workflow

```text
Local Development
       ↓
   [git push to feature branch]
       ↓
GitHub PR (automated checks)
       ↓
   [PR approved, merged to main]
       ↓
Automatic Deploy to Staging
       ↓
   [Automated + manual testing]
       ↓
Manual Deploy to Production
       ↓
   [Release tagged, canary deploy]
       ↓
Production Stable
```

### Environment Variables

Each environment has separate configuration:

```text
Dev:
- LOG_LEVEL=debug
- CACHE_ENABLED=true
- API_TIMEOUT=30s
- DB_POOL_SIZE=5

Staging:
- LOG_LEVEL=info
- CACHE_ENABLED=true
- API_TIMEOUT=10s
- DB_POOL_SIZE=20

Production:
- LOG_LEVEL=warn
- CACHE_ENABLED=true
- API_TIMEOUT=5s
- DB_POOL_SIZE=50
- ENABLE_METRICS=true
- ALERT_ON_ERRORS=true
```

Stored in Key Vault per environment.

## Blue/Green Deployments

### Process

1. **Blue (current)** - Version 2.0.0 running, receiving 100% traffic
2. **Green (new)** - Version 2.1.0 deployed, receiving 0% traffic
3. **Test Green** - Run smoke tests against new version
4. **Switch Traffic** - Gradually shift traffic to green
   - 1% for 5 minutes (watch errors)
   - 10% for 10 minutes (watch metrics)
   - 50% for 15 minutes (half users, half old)
   - 100% (all users on new version)
5. **Monitor** - Keep blue running for 1 hour as fallback
6. **Finalize** - Keep blue as standby for 24 hours

### Rollback

If issues detected during traffic shift:

1. Immediately stop traffic to green
2. Revert to 100% traffic to blue
3. Investigate issues
4. Fix and try again

**Rollback time:** < 5 minutes

## Database Migrations

### Strategy

Migrations run **before** app deployment to prevent downtime.

```text
1. Add new column (nullable) to database
2. Update app code to use new column
3. Backfill data for old records
4. Drop old column (later release)
```

### Timeline Example

**Release 2.1.0:**

- Migration: Add `user_id` column (nullable) to transactions table
- App code: Start writing to both old and new column
- Data backfill: Fill `user_id` for existing records

**Release 2.2.0:**

- Migration: Make `user_id` NOT NULL (backfill complete)
- App code: Remove writes to old column

**Release 2.3.0:**

- Migration: Drop old column
- App code: No longer uses old column

### Testing Migrations

1. Run migration on staging database (full copy of production)
2. Verify data integrity (counts, checksums)
3. Test rollback procedure
4. Verify app handles both old and new schema
5. Performance test (large tables)

## Secrets Management

### Per-Environment Secrets

Each environment has separate secrets in Key Vault:

```text
Environment: dev
- POSTGRES_PASSWORD: devpassword123
- JWT_SECRET: dev-signing-key
- API_KEY: demo-key-12345

Environment: staging
- POSTGRES_PASSWORD: [unique strong password]
- JWT_SECRET: [staging specific key]
- API_KEY: [staging key]

Environment: production
- POSTGRES_PASSWORD: [HSM-encrypted, rotated monthly]
- JWT_SECRET: [HSM-encrypted, rotated quarterly]
- API_KEY: [production key, audit logged access]
```

### Secret Rotation

- **Database passwords:** Every 30 days
- **API keys:** Every 90 days
- **Signing keys:** Every 6 months
- **Certificates:** Automated renewal 30 days before expiry

## Cost Allocation

### Budget by Environment

- **Dev:** $300/month - Flexible, experimentation encouraged
- **Staging:** $500/month - Scaled testing
- **Production:** $2000/month - High availability

### Cost Optimization

- Kill unused resources immediately
- Schedule shutdown during off-hours
- Use cheaper instance types in dev/staging
- Reserved instances for prod (33% savings)
- Archive old logs to cold storage

## Compliance & Data

### Data Residency

- All data stored in single region [specify: us-east, eu-west, etc.]
- No cross-border transfer of PII
- Complies with GDPR, CCPA requirements

### Access Logs

- All database access logged to audit table
- Production database access requires approval
- SSH access logged to syslog
- API access logged with user/IP/timestamp

### Disaster Recovery

- Dev: Not required, can rebuild
- Staging: Restore from weekly backup
- Production: RTO < 1 hour, RPO < 5 minutes

## References

- [Feature Lifecycle](lifecycle/feature-lifecycle.md)
- [Deployment Runbook](runbooks/deploy.md)
- [Monitoring Guide](runbooks/monitoring-observability.md)
