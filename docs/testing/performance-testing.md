# Performance Testing Guide

Load testing, profiling, and optimization strategies.

## Performance Testing Types

### Load Testing

**What:** Simulate expected user load  
**Why:** Verify system handles normal traffic  
**When:** Before each major release  
**Duration:** 10-30 minutes  

### Stress Testing

**What:** Push system beyond expected limits  
**Why:** Find breaking point, error handling  
**When:** Quarterly or before scaling  
**Duration:** 5-10 minutes  

### Spike Testing

**What:** Sudden traffic increase  
**Why:** Verify auto-scaling and recovery  
**When:** Before new features  
**Duration:** 5 minutes  

### Soak Testing

**What:** Sustained load for extended period  
**Why:** Find memory leaks, degradation  
**When:** Before production deployments  
**Duration:** 2-8 hours  

## Setting Performance Baselines

### SLA Definition

```text
Endpoint: POST /api/auth/login
├─ Latency p50: < 100ms
├─ Latency p95: < 200ms
├─ Latency p99: < 500ms
├─ Error rate: < 0.1%
└─ Throughput: 1000+ req/sec
```

### Measure Current Performance

```bash
# Run against baseline
k6 run baseline-test.js --out json=results.json

# Analyze results
k6 stats results.json
```

### Set Targets

- **Response time:** Typical = p95 < 200ms, Worst case = p99 < 500ms
- **Error rate:** < 0.5% in normal conditions
- **Throughput:** Based on concurrent users and expected volume

## Load Testing with k6

### Basic Load Test

```javascript
import http from 'k6/http';
import { check, group } from 'k6';

export let options = {
  vus: 100,              // 100 virtual users
  duration: '5m',        // Run for 5 minutes
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],  // SLA
    http_req_failed: ['rate<0.1'],
  }
};

export default function() {
  group('Auth Flow', function() {
    // Login request
    let response = http.post('https://api.example.com/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      tags: { name: 'Login' }
    });
    
    check(response, {
      'login status is 200': (r) => r.status === 200,
      'login response time < 200ms': (r) => r.timings.duration < 200,
      'login has token': (r) => r.json('token') !== null,
    });
  });
}
```

### Ramping Load Test

Gradually increase load to find breaking point:

```javascript
export let options = {
  stages: [
    { duration: '2m', target: 50 },     // Ramp up to 50 users
    { duration: '5m', target: 100 },    // Ramp up to 100 users
    { duration: '10m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'],
    http_req_failed: ['rate<0.1'],
  }
};
```

### Running Test

```bash
# Run and output to JSON
k6 run loadtest.js --out json=results.json

# View in real-time
k6 run loadtest.js --vus 100 --duration 5m

# Run with custom environment
k6 run loadtest.js -e ENV=staging -e API_URL=https://staging.example.com

# Output shows:
# ✓ Passed checks
# ✗ Failed checks
# - Response time statistics (min, max, avg, p95, p99)
# - Error rate and count
# - Request rate (req/sec)
```

## Identifying Bottlenecks

### CPU Profiling

Find functions consuming CPU:

```javascript
// Enable CPU profiling
const profiler = require('v8-profiler-next');

profiler.startProfiling('auth_service');

// ... run code ...

const profile = profiler.stopProfiling('auth_service');
profile.export(function(err, result) {
  fs.writeFileSync('profile.cpuprofile', result);
  profiler.deleteAllProfiles();
});

// Analyze in Chrome DevTools
// Open chrome://inspect → Open dedicated DevTools for Node
```

### Memory Profiling

Find memory leaks:

```bash
# Start app with memory snapshot option
node --inspect-brk app.js

# In Chrome DevTools:
# 1. Memory tab
# 2. Take heap snapshot
# 3. Do work
# 4. Take another snapshot
# 5. Compare → Shows new allocations
# 6. Find leaks by looking for objects not freed
```

### Database Query Profiling

Slow query detection:

```sql
-- Enable slow query log (PostgreSQL)
SET log_min_duration_statement = 100;  -- 100ms threshold

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Analyze query plan
EXPLAIN ANALYZE SELECT * FROM users WHERE id = ?;

-- Results show:
-- - Seq Scan vs Index Scan
-- - Rows estimated vs actual
-- - Execution time
```

## Optimization Techniques

### Application-Level

**Caching:**

```javascript
// Cache expensive operations
const cache = new Map();

function getUser(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  
  const user = db.query('SELECT * FROM users WHERE id = ?', [id]);
  cache.set(id, user);
  
  // Expire after 5 minutes
  setTimeout(() => cache.delete(id), 5 * 60 * 1000);
  
  return user;
}
```

**Connection Pooling:**

```javascript
// Reuse database connections
const pool = new Pool({
  max: 20,           // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// All queries use connection from pool
pool.query('SELECT * FROM users WHERE id = ?', [id]);
```

**Compression:**

```javascript
// Compress responses
app.use(compression());

// Results in 70-90% smaller payloads
```

**Pagination:**

```javascript
// Don't fetch all records
app.get('/api/users', (req, res) => {
  const limit = Math.min(req.query.limit || 20, 100);
  const offset = (req.query.page || 0) * limit;
  
  const users = db.query(
    'SELECT * FROM users LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  res.json({ users, total, page: req.query.page });
});
```

### Database-Level

**Indexing:**

```sql
-- Add index on frequently searched column
CREATE INDEX idx_users_email ON users(email);

-- Multi-column index for common queries
CREATE INDEX idx_users_status_created 
ON users(status, created_at DESC);

-- Check index usage
SELECT * FROM pg_stat_user_indexes;
```

**Query Optimization:**

```sql
-- Before: N+1 query problem
SELECT * FROM users;           -- Query 1
FOR EACH user:
  SELECT * FROM orders WHERE user_id = ?;  -- N queries

-- After: Join query
SELECT u.*, o.* 
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;  -- 1 query
```

### Infrastructure-Level

**Caching:**

- Redis for session storage
- CDN for static assets
- Browser cache for images/CSS

**Load Balancing:**

- Distribute requests across servers
- Auto-scaling based on CPU/memory
- Connection draining on shutdown

**Database Replication:**

- Read replicas for analytics
- Multi-AZ for failover
- Async replication to regions

## Performance Regression Testing

### Automated Benchmarks

Run before/after each deployment:

```javascript
// benchmark.js
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
  }
};

export default function() {
  http.get('https://api.example.com/api/users');
}
```

### Compare Results

```bash
# Run baseline
k6 run benchmark.js --out json=baseline.json

# Deploy new code

# Run test again
k6 run benchmark.js --out json=current.json

# Compare
compare-k6-results baseline.json current.json
# Reports:
# ✓ p95 latency: 195ms vs 198ms (+3ms, +1.5%)
# ✗ p99 latency: 480ms vs 520ms (-40ms, -8%)
```

### Regression Alert

Fail deployment if:

- p99 latency increase > 10%
- Error rate increase > 5%
- Throughput decrease > 5%

## Performance Test Report

### Generate Report

```bash
# Run test and generate HTML report
k6 run loadtest.js --out html=report.html

# Report includes:
# - Summary statistics
# - Charts over time
# - Request breakdown
# - Error details
```

### Report Contents

1. **Executive Summary**
   - Total requests
   - Pass/fail rate
   - Latency statistics

2. **Metrics Over Time**
   - Request rate trend
   - Latency trend
   - Error rate trend
   - Resource utilization

3. **Request Breakdown**
   - By endpoint (latency, errors)
   - By status code
   - Top 10 slowest requests

4. **Errors**
   - Error types
   - Frequency
   - Associated requests

5. **Recommendations**
   - Bottlenecks identified
   - Optimization suggestions
   - Compliance with SLA

## Performance Checklist

Before production deployment:

- [ ] Load test completed (100+ concurrent users)
- [ ] All endpoints within SLA
- [ ] Error rate < 0.1%
- [ ] No memory leaks (soak test 2h+)
- [ ] Database queries indexed
- [ ] Caching enabled
- [ ] Compression enabled
- [ ] CDN configured
- [ ] Auto-scaling tested
- [ ] Monitoring alerts set

## References

- [k6 Documentation](https://k6.io/docs/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
