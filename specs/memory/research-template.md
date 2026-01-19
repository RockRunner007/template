# Spec-Kit Advanced: Research Template

How to document technology decisions and design considerations.

## Purpose

Research documents capture the reasoning behind technical choices, not the final decisions. They help:

1. **Future developers understand why** - "Why did we choose PostgreSQL?"
2. **Avoid repeating mistakes** - If you tried X and it failed, document it
3. **Alternatives considered** - What did we reject and why?
4. **Trade-offs made** - What are we sacrificing by choosing this way?

## Location & Naming

```text
specs/NNN-feature-name/
├── spec.md           # WHAT to build
├── plan.md           # HOW to build it (phases)
├── research.md       # WHY we chose this way (decisions)
└── data-model.md     # Data schema
```

## Research Document Structure

### 1. Executive Summary

```markdown
## Executive Summary

**Question:** Should we use PostgreSQL or MongoDB for user data?

**Decision:** PostgreSQL

**Key Reasons:**
- ACID transactions needed for consistency
- Complex queries for reporting
- Lower operational overhead than MongoDB
- Team has 5+ years PostgreSQL experience

**Trade-off:** Slightly slower for nested documents, but that's OK
```

### 2. Problem Statement

What decision needs to be made?

```markdown
## Problem Statement

We need to store user data for the authentication system.

**Requirements:**
- Support 1M+ users
- Complex queries for analytics (JOINs, aggregations)
- Need ACID transactions for consistency
- Must support complex relationships
  - Users → Sessions (1:many)
  - Users → Organizations (many:many)
  - Sessions → Audit Events (1:many)

**Options to evaluate:**
1. PostgreSQL (SQL)
2. MongoDB (NoSQL)
3. DynamoDB (NoSQL, cloud-native)
```

### 3. Option Analysis

For each option, include:

```markdown
## Option 1: PostgreSQL

### Pros
- ✅ ACID transactions prevent data corruption
- ✅ Proven, mature ecosystem
- ✅ Complex queries simple with SQL
- ✅ Team expertise (5+ years)
- ✅ Open source, no licensing costs
- ✅ Can handle 1M+ users easily

### Cons
- ⚠️ Vertical scaling limit (~100K ops/sec per instance)
- ⚠️ Requires read replicas for high-read scenarios
- ⚠️ Operational complexity (backups, replication)

### Performance
- Read: 50-100 µs per query
- Write: 200-500 µs per transaction
- Max throughput: 10K-50K ops/sec

### Scalability
- Handles up to 1B rows easily
- Replication: Read replicas for 10x read scaling
- Sharding: Can scale writes horizontally (complex)

### Cost
- Small instance: ~$50/month
- Production HA: ~$500-1000/month
- Scaling: Linear cost increase with throughput

### Maturity
- Version 14+ (stable, not bleeding edge)
- LTS support through 2026
- Industry standard

### Example: User Query
```sql
-- Complex query that MongoDB would need aggregation pipeline for
SELECT 
  u.id, u.email, count(s.id) as session_count,
  max(s.created_at) as last_login,
  org.name as organization
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id AND s.revoked_at IS NULL
LEFT JOIN user_organizations uo ON u.id = uo.user_id
LEFT JOIN organizations org ON uo.org_id = org.id
GROUP BY u.id, org.name
HAVING count(s.id) > 5
ORDER BY last_login DESC;
```

---

## Option 2: MongoDB

### Pros

- ✅ Easy to start (flexible schema)
- ✅ Horizontal scaling built-in
- ✅ Document model matches our objects

### Cons

- ❌ No ACID transactions (pre-4.0)
- ❌ Complex queries require aggregation pipelines
- ❌ Data duplication needed (denormalization)
- ❌ Harder to maintain data consistency
- ❌ Team has no MongoDB experience

### Performance

- Read: 10-20 µs (lower latency than PostgreSQL)
- Write: 100-200 µs (but less consistent)
- Max throughput: 100K+ ops/sec

### Scalability

- Built-in sharding
- Can add nodes without migration
- Easier horizontal scaling than PostgreSQL

### Cost

- MongoDB Atlas: $57/month (small)
- Atlas at scale: $500-2000/month
- Similar to PostgreSQL

### Maturity

- Version 5.0+ (stable)
- Industry adoption growing
- But less proven than PostgreSQL

### Example: User Query

```javascript
// Aggregation pipeline is complex and harder to optimize
db.users.aggregate([
  {
    $lookup: {
      from: "sessions",
      let: { user_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$user_id", "$$user_id"] },
            revoked_at: null
          }
        }
      ],
      as: "sessions"
    }
  },
  {
    $addFields: {
      session_count: { $size: "$sessions" },
      last_login: { $max: "$sessions.created_at" }
    }
  },
  {
    $match: {
      session_count: { $gt: 5 }
    }
  }
]);
```

---

## Option 3: DynamoDB

### Pros

- ✅ Fully managed (no operations)
- ✅ Automatic scaling
- ✅ AWS integrated (if on AWS)

### Cons

- ❌ Single-region replication only
- ❌ No complex queries (KeyConditionExpression limited)
- ❌ Eventual consistency (not ACID)
- ❌ Expensive for complex access patterns
- ❌ Requires denormalization

### Performance

- Read: < 10 µs (very fast)
- Write: < 10 µs (very fast)
- But: Only simple key lookups

### Scalability

- Automatic scaling
- No operational overhead
- Complex queries not possible

### Cost

- On-demand: ~$1 per million read units
- At our scale: $1000-5000/month
- More expensive than PostgreSQL/MongoDB

### Maturity

- AWS service (battle-tested)
- But not suitable for complex queries

---

## Comparison Matrix

| Factor | PostgreSQL | MongoDB | DynamoDB |
|--------|-----------|---------|----------|
| Complex queries | ✅ Yes | ⚠️ Possible | ❌ No |
| ACID transactions | ✅ Yes | ⚠️ Limited | ❌ No |
| Scaling | ⚠️ Vertical | ✅ Horizontal | ✅ Automatic |
| Cost | ✅ Low | ✅ Low | ⚠️ High |
| Team expertise | ✅ Yes | ❌ No | ❌ No |
| Operational burden | ⚠️ Medium | ⚠️ Medium | ✅ None |
| Maturity | ✅ Proven | ⚠️ Growing | ✅ Battle-tested |

---

## Decision

**Chosen: PostgreSQL**

**Rationale:**

1. **ACID transactions critical** - User consistency requirements
2. **Complex analytics queries** - Team needs to generate reports
3. **Team expertise** - 5+ years PostgreSQL experience
4. **Cost** - Similar to other options, but better features
5. **Maturity** - Battle-tested, proven at scale

**Trade-off accepted:**

- Slightly higher operational burden (backups, replication)
- Vertical scaling limits (can address with read replicas)

**Future consideration:**

- If write scaling becomes issue, implement read replicas + sharding
- If complex scaling needed, consider document store later

---

## Implementation Notes

- Use connection pooling (PgBouncer)
- Enable replication for HA
- Set up automated backups
- Plan for ~6 months operation before evaluating if choice was right

## References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/)
- [CAP Theorem Explained](https://en.wikipedia.org/wiki/CAP_theorem)
- [ACID vs BASE](https://www.dataversity.net/acid-vs-base-databases/)
```

## Research Best Practices

### Do

- ✅ Write for future readers (future you included)
- ✅ Include numbers (costs, performance, scale limits)
- ✅ Link to sources and documentation
- ✅ Include rejected options (and why)
- ✅ Document trade-offs explicitly
- ✅ Update when new information emerges

### Don't

- ❌ Make research too long (1-2 pages per decision)
- ❌ Write without evidence (cite sources)
- ❌ Ignore implementation details
- ❌ Assume team knows context (explain)
- ❌ Hide the decision at the end (put it first)

## When to Write Research

**Write research for:**
- New technology choice (database, framework, language)
- Architecture decisions (monolith vs microservices)
- Integration approach (API vs message queue)
- Performance optimization (caching strategy)
- Security implementation (auth approach)

**Don't write research for:**
- Small implementation details
- Bug fixes
- Minor refactoring
- Library version updates (unless major change)

## Referencing Research

Link from spec.md:

```markdown
# Authentication Specification

## Technology Decisions

This spec implements decisions from:
- [Database Choice Research](research.md) - Why PostgreSQL
- [JWT vs Sessions Research](research.md#jwt-vs-sessions) - Authentication tokens

See [research.md](research.md) for full analysis.
```

## Example Research Topics

1. **Database Selection** - PostgreSQL vs MongoDB vs DynamoDB
2. **Caching Strategy** - Redis vs Memcached vs Application Cache
3. **Authentication** - JWT vs Session Cookies vs OAuth
4. **API Style** - REST vs GraphQL vs gRPC
5. **Deployment** - Containers vs Serverless vs VMs
6. **Message Queue** - RabbitMQ vs Kafka vs Cloud Services
7. **Logging** - ELK vs Datadog vs CloudWatch
8. **Monitoring** - Prometheus vs Datadog vs New Relic

## References

- [Architecture Decision Records (ADRs)](https://adr.github.io/)
- [Tyranny of Choices](https://en.wikipedia.org/wiki/The_Paradox_of_Choice)
