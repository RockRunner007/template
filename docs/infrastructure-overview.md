# Infrastructure Overview

High-level architecture and cloud infrastructure documentation.

## Deployment Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                   GitHub Repository                      │
│  - Source code, specs, docs, IaC (Terraform/Bicep)      │
│  - GitHub Actions workflows for CI/CD                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               GitHub Actions (CI/CD Pipeline)            │
│  - Build & test                                          │
│  - Security scanning (CodeQL, SAST, dependencies)        │
│  - Deploy to cloud environment                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Cloud Provider (Azure/AWS)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Load Balancer / API Gateway                      │   │
│  │ - Handles HTTPS/TLS termination                  │   │
│  │ - Rate limiting & DDoS protection                │   │
│  │ - Route traffic to app services                  │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Container Orchestration (Kubernetes/AKS)        │   │
│  │ - App Service instances (auto-scaling)          │   │
│  │ - Health checks & rolling updates                │   │
│  │ - Log aggregation & monitoring                   │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Data Layer                                       │   │
│  │ ┌────────────────┐  ┌──────────────────────┐   │   │
│  │ │ PostgreSQL DB  │  │ Redis Cache          │   │   │
│  │ │ - User data    │  │ - Sessions           │   │   │
│  │ │ - Audit logs   │  │ - Tokens             │   │   │
│  │ │ - Transactions │  │ - Rate limiters      │   │   │
│  │ └────────────────┘  └──────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Message Queue (RabbitMQ / Azure Service Bus)    │   │
│  │ - Async task processing                         │   │
│  │ - Event distribution                            │   │
│  │ - Email/notification sending                    │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ External Services                                │   │
│  │ - Email provider (SendGrid/Azure Mail)          │   │
│  │ - SMS provider (Twilio/Azure SMS)               │   │
│  │ - Monitoring (DataDog/Azure Monitor)            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Cloud Provider Setup

### Azure Deployment

**Resource Group:** `rg-template-{env}`

**Key Resources:**

- **App Service Plan** - Compute layer for containers
- **Azure Database for PostgreSQL** - Managed SQL database
- **Azure Cache for Redis** - Managed in-memory cache
- **Azure Service Bus** - Message queue for async work
- **Application Gateway** - Load balancer & WAF
- **Application Insights** - APM & monitoring
- **Key Vault** - Secrets management
- **Blob Storage** - File/log storage

### AWS Deployment (Alternative)

**Resource Group:** Terraform workspace `template-{env}`

**Key Resources:**

- **ECS/EKS** - Container orchestration
- **RDS PostgreSQL** - Managed database
- **ElastiCache Redis** - Managed cache
- **SQS/SNS** - Message queue & pub/sub
- **ALB** - Application Load Balancer
- **CloudWatch** - Monitoring & logs
- **Secrets Manager** - Secrets management
- **S3** - File storage

## Network Architecture

### VPC/Network Setup

```text
Public Subnet (DMZ)
├── API Gateway / Load Balancer
│   └── SSL/TLS termination
│   └── WAF rules
│   └── DDoS protection
└── NAT Gateway (outbound internet)

Private Subnet (Application)
├── App Service instances
│   └── Auto-scaling group
│   └── Health checks every 30s
└── No direct internet access
    (Outbound through NAT only)

Private Subnet (Data)
├── PostgreSQL database
│   └── Multi-AZ for HA
│   └── Automated backups
├── Redis cluster
│   └── High-availability mode
└── Service Bus
    └── Encrypted in transit
```

### Security Groups / Network Policies

**Ingress (Inbound)**

- HTTP 80: API Gateway → Internet
- HTTPS 443: API Gateway → Internet
- SSH 22: Bastion host only (emergency)

**Egress (Outbound)**

- App → Database (5432 PostgreSQL)
- App → Redis (6379)
- App → Service Bus (amqps)
- App → External APIs (443 HTTPS)

**Database**

- Accept from App Service only (5432)
- No direct internet access

**Redis**

- Accept from App Service only (6379)
- No direct internet access

## Data Persistence

### PostgreSQL Database

**Instance Size:** Varies by environment

- Dev: `B_Gen5_1` (1 core, 2GB RAM)
- Staging: `GP_Gen5_2` (2 cores, 8GB RAM)
- Production: `GP_Gen5_4` (4 cores, 16GB RAM)

**Backup Strategy:**

- Automated daily backups (7-day retention)
- Point-in-time restore (35 days)
- Weekly full backup to long-term storage
- Monthly archive to cold storage

**High Availability:**

- Multi-AZ deployment in production
- Automatic failover < 2 minutes
- Read replicas for reporting (staging+)

**Scaling:**

- Vertical: Increase instance size for more capacity
- Horizontal: Read replicas for read-heavy workloads
- Connection pooling: PgBouncer for connection management

### Redis Cache

**Instance Size:**

- Dev: `cache.t3.micro`
- Staging: `cache.t3.small`
- Production: `cache.r6g.large` (high availability)

**TTL Strategy:**

- Session tokens: 1 hour
- Password reset: 24 hours
- Cache entries: 5 minutes to 1 day
- Rate limit counters: 1 minute

**Eviction Policy:**

- `allkeys-lru` - Evict least recently used when full
- Max memory: 90% then evict

**Backup:**

- Snapshots every 6 hours
- Keep 7 days of snapshots
- Production RDB backup to S3 daily

## Scaling Strategy

### Horizontal Scaling (App Services)

**Auto-Scaling Triggers:**

- CPU > 70% for 5 minutes → add 1 instance
- CPU < 30% for 10 minutes → remove 1 instance
- Min instances: 2 (always running)
- Max instances: 20 (cost limit)

**Load Balancing:**

- Round-robin across instances
- Health check every 30 seconds
- Unhealthy instances taken out immediately
- Connection draining on shutdown (30s)

### Vertical Scaling (Database)

**Monitoring for need:**

- CPU > 80% for 15+ minutes
- Memory > 85% utilization
- Disk space > 80% used

**Process:**

1. Plan maintenance window
2. Create read replica
3. Test with traffic
4. Failover to larger instance
5. Monitor performance

### Caching Layer Scaling

**Redis Scaling:**

- Cluster mode for 250K+ ops/sec
- Sharding by key prefix
- Replication for high availability

## Disaster Recovery

### Backup Strategy

| Component | Frequency | Retention | Recovery |
|-----------|-----------|-----------|----------|
| Database | Daily | 35 days | < 5 min PITR |
| Database | Weekly | 1 year | < 1 hour |
| Code | Continuous | Forever | Instant redeploy |
| Secrets | N/A | Current | Immediate |
| Logs | 30 days | Rolling window | Historical lookup |

### RTO / RPO Targets

- **RTO (Recovery Time Objective)** - 1 hour max downtime
- **RPO (Recovery Point Objective)** - 5 minutes max data loss
- **Failover time** - < 2 minutes automatic

### Disaster Scenarios

**Database Failure:**

- Failover to read replica (automatic, < 2 min)
- If replica unavailable: Restore from backup (< 5 min)
- Alert team immediately

**Data Center Outage:**

- Multi-region replication (async)
- Fail to secondary region (5-15 min manual process)
- Activate disaster recovery mode

**Application Crash:**

- Auto-restart policy triggers (< 30s)
- Health check notices, removes from load balancer
- New instance spawned from latest image
- Entire cluster restart < 5 minutes

## Monitoring & Alerting

### Key Metrics to Monitor

**Application:**

- Request latency (p50, p95, p99)
- Error rate by endpoint
- Throughput (requests/sec)
- Memory usage per instance
- CPU utilization

**Database:**

- Query latency (p99)
- Active connections
- Replication lag (if read replica)
- Storage growth rate
- Slow query log

**Infrastructure:**

- Disk usage
- Network I/O
- Deployment frequency
- Build times
- Test coverage

### Alert Thresholds

| Alert | Threshold | Action |
|-------|-----------|--------|
| High error rate | > 5% errors | Page on-call |
| Database latency | p99 > 500ms | Investigate |
| Memory pressure | > 90% used | Auto-scale |
| Disk full | < 10% available | Urgent alert |
| Deployment failure | N/A | Rollback |

See: [Monitoring & Observability Runbook](../runbooks/monitoring-observability.md)

## Cost Optimization

### Resource Sizing

- Right-size instances for actual usage (not peak)
- Use reserved instances (1-3 year commitments)
- Spot instances for non-critical workloads
- Scheduled scaling for predictable patterns

### Cost Controls

- Set budget alerts and limits
- Tag resources by cost center
- Regular cost reviews (weekly)
- Terminate unused resources immediately
- Archive old logs to cold storage

### Expected Monthly Costs

- **Dev environment:** $200-400
- **Staging environment:** $400-800
- **Production environment:** $1000-3000
- **Total:** $1600-4200/month (scales with traffic)

## Infrastructure as Code

All infrastructure defined in code:

- `infrastructure/terraform/` - Terraform configurations
- `infrastructure/terraform/main.tf` - Core resources
- `infrastructure/terraform/variables.tf` - Input variables
- `infrastructure/terraform/outputs.tf` - Output values

**Deployment:**

```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

## Compliance & Security

### Encryption

- **In Transit:** TLS 1.2+ on all connections
- **At Rest:** AES-256 for database, secrets, backups
- **Key Management:** HSM-backed key encryption in Key Vault

### Compliance Standards

- **SOC 2 Type II** - Passed annual audit
- **PCI DSS** - If handling credit cards
- **GDPR** - Data residency in EU if applicable
- **HIPAA** - If handling health data

### Security Scanning

- Container scanning (Trivy) on every build
- IaC scanning (tfsec) on infrastructure changes
- Dependency scanning (Dependabot)
- SAST scanning (CodeQL)
- Penetration testing (annual)

## References

- [Infrastructure as Code](./infrastructure/)
- [Deployment Runbook](../runbooks/deploy.md)
- [Monitoring Guide](../runbooks/monitoring-observability.md)
