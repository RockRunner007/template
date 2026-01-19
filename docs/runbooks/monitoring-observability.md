# Monitoring & Observability Runbook

Real-time visibility into system health, performance, and errors.

## Observability Stack

```
Application → Instrumentation → Collector → Storage → Visualization
(metrics)      (SDKs)             (OpenTel)   (InfluxDB) (Grafana)
(traces)       (logging)          (Prometheus)(Elastic) (Kibana)
(logs)         (structured)       (Jaeger)    (Datadog) (Datadog)
```

## Key Metrics

### Application Metrics

**Request Performance**

- `request_latency_ms` - Time to process request (p50, p95, p99)
- `request_rate` - Requests per second
- `request_errors` - Errors per second
- `request_duration_by_endpoint` - Latency per route

**Error Tracking**

- `error_rate` - Errors / total requests
- `errors_by_type` - Count of each error type
- `errors_by_endpoint` - Which routes have issues
- `error_budget_remaining` - % of allowed errors left

**Business Metrics**

- `user_registrations` - New sign-ups per day
- `login_success_rate` - Successful logins %
- `transaction_amount_total` - Total transaction value
- `feature_adoption` - % users using new feature

### Infrastructure Metrics

**Compute**

- `cpu_utilization_percent` - CPU usage
- `memory_usage_bytes` - RAM in use
- `memory_usage_percent` - RAM percentage
- `disk_free_bytes` - Storage available
- `network_io_bytes` - Network bandwidth

**Database**

- `query_latency_ms` - SQL query time (p99)
- `active_connections` - Concurrent connections
- `replication_lag_seconds` - Read replica delay
- `storage_usage_bytes` - Database size
- `slow_queries_count` - Queries exceeding threshold

**Cache**

- `cache_hit_rate_percent` - Cache effectiveness
- `cache_evictions_total` - Items evicted due to memory
- `connection_count` - Active Redis connections
- `memory_usage_bytes` - Cache memory used

## Setting Alerts

### Alert Severity Levels

**Critical** - Page on-call immediately (< 5 min)

- Application completely down
- Data loss occurring
- Security incident in progress
- Error rate > 50%

**High** - Create incident ticket (< 15 min)

- Feature broken for users
- Latency p99 > 2x SLA
- Error rate 5-50%
- Database replication lag > 30s

**Medium** - Investigate next business day

- Latency p99 > 1.5x SLA
- Error rate 1-5%
- Memory usage > 80%
- Disk space < 15% available

**Low** - Log for weekly review

- Latency approaching SLA
- Memory usage > 70%
- Unusual traffic patterns

### Example Alerts

**High Error Rate**

```text
Alert: HTTP_ERROR_RATE_HIGH
Condition: error_rate > 5% for 5 minutes
Action: Page on-call, create incident
Runbook: docs/runbooks/incident-response.md
```

**Slow Queries**

```text
Alert: DATABASE_QUERY_LATENCY_HIGH
Condition: query_latency_p99 > 500ms for 10 minutes
Action: Page DBA, check slow query log
Runbook: Analyze query plan, add index if needed
```

**Memory Pressure**

```text
Alert: MEMORY_USAGE_CRITICAL
Condition: memory_percent > 90% for 5 minutes
Action: Auto-scale (add instances)
Fallback: Page on-call if auto-scale fails
```

**Deployment Failure**

```text
Alert: DEPLOYMENT_FAILED
Condition: Deployment job exits with error
Action: Immediate notification to release engineer
Runbook: Check logs, rollback if applicable
```

## Dashboards

### Main Operations Dashboard

**Real-time view (refresh every 10s)**

- Request rate (requests/sec)
- Error rate (%)
- Latency (p50, p95, p99)
- Active users
- Database connections
- Cache hit rate

**Alerts section**

- Critical alerts (red)
- High alerts (orange)
- Recent incidents
- Deployment status

### Performance Dashboard

**Latency trends**

- Request latency over 24 hours (p50, p95, p99)
- Top 10 slowest endpoints
- Database query latency
- Cache performance

**Capacity**

- CPU utilization trend
- Memory usage trend
- Disk space available
- Network I/O

### Business Dashboard

**User activity**

- Active users (last hour)
- New registrations (today)
- Login success rate
- Feature adoption

**Transactions**

- Transaction volume
- Transaction value
- Error by business flow
- Conversion rate

### Error Dashboard

**Error analysis**

- Error rate trend
- Top error types
- Errors by endpoint
- Error distribution by severity

**Debugging**

- Recent errors with stack traces
- Error correlation (related errors)
- User impact assessment
- Rollout progress (if deploying)

## Logs

### Log Levels

**DEBUG** - Detailed information for development

- Variable values, loop iterations
- Function entry/exit
- Developer-only events
- Not in production

**INFO** - General informational messages

- Application startup
- Feature toggles enabled/disabled
- Configuration loaded
- User actions (login, file upload)

**WARN** - Warning conditions, not errors

- Deprecated API usage
- Missing optional configuration
- Retry attempts
- Performance degradation

**ERROR** - Error conditions requiring attention

- Failed database query
- External API failure
- Validation errors
- Business rule violations

**FATAL** - Critical errors causing shutdown

- Database unavailable
- Configuration missing
- Unrecoverable error

### Structured Logging

Always use structured (JSON) logs, never free-form text:

```javascript
// Good: Structured
logger.info('user_login_success', {
  user_id: 'user_123',
  method: 'email',
  ip_address: '192.168.1.1',
  duration_ms: 245,
  timestamp: '2026-01-19T10:30:00Z'
});

// Bad: Free-form
logger.info('User 123 logged in successfully from 192.168.1.1');
```

### Log Retention

| Environment | Level | Retention | Purpose |
|-------------|-------|-----------|---------|
| Development | DEBUG | 7 days | Local debugging |
| Staging | INFO | 30 days | Testing and QA |
| Production | INFO | 90 days | Support & debugging |
| Production | WARN+ | 1 year | Compliance & audits |

### Searching Logs

**By error:**

```text
level: ERROR AND timestamp > now-1h
```

**By user:**

```text
user_id: user_123 AND timestamp > now-24h
```

**By endpoint:**

```text
endpoint: "/api/auth/login" AND error_rate > 5%
```

**By deployment:**

```text
deployment_id: v2.1.0 AND timestamp > now-30m
```

## Tracing

### Distributed Tracing

Track request flow across services:

```text
User Request
  ↓
API Gateway (trace_id: abc123)
  ├─ Auth Service (span: auth_verify)
  ├─ Database (span: query_user)
  ├─ Cache (span: cache_lookup)
  └─ Response Service (span: format_response)
  ↓
Response returned (total time: 245ms)
```

### Tracing Configuration

```javascript
// Initialize tracing
const tracer = require('dd-trace').init();

// Create span
const span = tracer.trace('function_name', () => {
  // Do work
  span.setTag('user_id', userId);
  span.setTag('duration_ms', duration);
});

// View in Datadog APM
// Drill down to see exactly where time is spent
```

### Performance Profiling

Identify bottlenecks:

1. **Enable CPU profiling** - See which functions use CPU
2. **Enable memory profiling** - Find memory leaks
3. **Run profiler for 10 minutes** - Collect data
4. **Analyze results** - Top functions consuming resources
5. **Optimize** - Refactor or cache hot spots

## Health Checks

### Readiness Checks

Endpoint: `GET /health/ready`

Returns 200 if service is ready to accept traffic:

- [ ] Database connection succeeds
- [ ] Cache connection succeeds
- [ ] Configuration loaded
- [ ] Dependencies responding

```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "cache": "ok",
    "config": "ok"
  }
}
```

### Liveness Checks

Endpoint: `GET /health/live`

Returns 200 if service is running (simplest check):

- [ ] Process running
- [ ] Memory not exhausted
- [ ] Goroutines < threshold

Used by orchestrators (Kubernetes) to restart if failing.

### Dependency Checks

Endpoint: `GET /health/dependencies`

Returns status of all external dependencies:

```json
{
  "status": "degraded",
  "dependencies": {
    "database": {"status": "ok", "latency_ms": 23},
    "cache": {"status": "ok", "latency_ms": 2},
    "email_service": {"status": "error", "error": "timeout"}
  }
}
```

## Error Budget

### Concept

- Each service gets an "error budget" per month
- E.g., 99.9% uptime = 0.1% downtime = 43 minutes/month
- Track actual errors against budget
- When budget exhausted, freeze new deployments

### Calculation

```text
Error Budget = (1 - Target SLA) × Time Period

Example:
- Target SLA: 99.9%
- Time period: 30 days
- Error budget: 0.1% × 30 × 24 × 60 = 43.2 minutes

If you're at 99.95% (exceeding target):
- You have 14 minutes left before budget exhausted
- Consider freezing deployments (risk)
- Or accept some failures to test
```

### Using Error Budget

**If budget is healthy (> 50% remaining):**

- Deploy freely
- Experiment with features
- Take calculated risks

**If budget is low (< 10% remaining):**

- Freeze new deployments
- Focus on stability
- Fix bugs and performance issues
- Scale infrastructure if needed

## On-Call Workflow

### Page On-Call

When alert fires:

1. [ ] Automatic alert sent (SMS + push notification)
2. [ ] Dashboard open automatically
3. [ ] Incident ticket created
4. [ ] Slack channel notified
5. [ ] Alert suppressed after 5 attempts (if unacknowledged)

### On-Call Response

1. **Acknowledge alert** (within 2 minutes)
   - "I'm investigating"
   - Prevents duplicate pages

2. **Assess impact** (5 minutes)
   - How many users affected?
   - Is it growing or isolated?
   - Business impact: Critical? High? Medium?

3. **Triage** (5 minutes)
   - Is it a known issue?
   - Check runbooks
   - Check recent deployments
   - Check infrastructure changes

4. **Remediate** (ongoing)
   - Apply fix from runbook
   - Or escalate to team
   - Or initiate rollback
   - Communicate status

5. **Verify** (5 minutes post-fix)
   - Error rate back to normal
   - Latency normal
   - Users not reporting issues
   - Alert fires and resolves

6. **Post-mortem** (within 24 hours)
   - Why did this happen?
   - How do we prevent it?
   - Update runbooks
   - Track action items

## References

- [Incident Response Runbook](incident-response.md)
- [Environment Strategy](../environment-strategy.md)
- [Infrastructure Overview](../infrastructure-overview.md)
