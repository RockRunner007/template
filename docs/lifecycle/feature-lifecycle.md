# Feature Lifecycle

Complete flow from initial concept through production release and maintenance.

## Phases

### Phase 1: Ideation & Research

**Duration:** 1-2 weeks  
**Owner:** Product, Architecture

**Outputs:**

- Problem statement
- User personas affected
- Initial requirements sketch
- Technology research if novel

**Gates:**

- [ ] Problem is well-defined
- [ ] Business value clear
- [ ] Doesn't duplicate existing work
- [ ] Architecture review scheduled

**Next:** Create specification

---

### Phase 2: Specification (SDD)

**Duration:** 1-2 weeks  
**Owner:** Technical Lead + Product

**Deliverables:**

- `specs/NNN-feature-name/spec.md` - User stories, acceptance criteria, edge cases
- `specs/NNN-feature-name/research.md` - Technology decisions documented
- Design review document
- Architecture diagram

**Activities:**

- Write user stories with personas
- Define acceptance criteria (testable)
- Document edge cases and constraints
- Mark `[NEEDS CLARIFICATION]` for unknowns
- Conduct architecture review meeting

**Gates:**

- [ ] All acceptance criteria have tests
- [ ] Non-functional requirements specified
- [ ] Security requirements included
- [ ] Architecture review approved

**Next:** Create implementation plan

---

### Phase 3: Planning & Design

**Duration:** 1 week  
**Owner:** Tech Lead, Engineering Team

**Deliverables:**

- `plan.md` - Implementation phases and effort estimates
- `data-model.md` - Database schemas
- `contracts/endpoints.md` - API specifications
- `tasks.md` - Executable task list
- Team kickoff slides

**Activities:**

- Break spec into implementation phases
- Identify parallelizable work
- Estimate effort per task
- Design data model and migrations
- Define API contracts
- Identify dependencies and risks

**Gates:**

- [ ] Tasks have effort estimates
- [ ] All acceptance criteria mapped to tasks
- [ ] Data model reviewed for performance
- [ ] Risk mitigation plans documented

**Next:** Begin implementation

---

### Phase 4: Implementation

**Duration:** 2-4 weeks  
**Owner:** Engineering Team

**Deliverables:**

- Code changes (spec-driven)
- Unit tests
- Integration tests
- Updated documentation
- PR with spec link

**Standards:**

- Code passes linting
- >80% code coverage
- All acceptance criteria tested
- Security scanning passes
- Performance benchmarks met

**Gates:**

- [ ] All tasks completed
- [ ] Code review approved (2 reviewers)
- [ ] All tests passing
- [ ] No new security vulnerabilities

**Next:** Deploy to staging

---

### Phase 5: Staging & QA

**Duration:** 3-5 days  
**Owner:** QA, Engineering

**Deliverables:**

- Test execution report
- Performance test results
- Security scan results
- User acceptance test sign-off

**Activities:**

- Run comprehensive test suite
- Load test and performance validation
- Security scanning (SAST, dependency audit)
- Manual QA testing
- UAT with stakeholders

**Gates:**

- [ ] All acceptance criteria verified
- [ ] Performance within SLA
- [ ] No critical/high severity bugs
- [ ] Security scan clean

**Next:** Prepare for production

---

### Phase 6: Release Preparation

**Duration:** 2-3 days  
**Owner:** Release Engineer, Tech Lead

**Deliverables:**

- Release notes
- Runbook for deployment
- Rollback procedure
- Communication plan
- Release checklist

**Activities:**

- Tag release in git
- Update version numbers
- Generate changelog from specs
- Create rollback procedure
- Notify stakeholders
- Schedule deployment window

**Gates:**

- [ ] Release notes approved
- [ ] Rollback tested
- [ ] All dependencies documented
- [ ] Communication sent

**Next:** Deploy to production

---

### Phase 7: Production Deployment

**Duration:** 1-2 hours  
**Owner:** Release Engineer

**Deliverables:**

- Deployment completed successfully
- Health checks passing
- Monitoring alerts configured
- Post-deploy verification

**Activities:**

- Execute deployment checklist
- Monitor deployment logs
- Run smoke tests
- Verify business metrics
- Escalate issues immediately

**Gates:**

- [ ] Deployment successful
- [ ] Health checks passing
- [ ] No error rate increase
- [ ] Performance within SLA

**Next:** Monitor and support

---

### Phase 8: Monitoring & Support (30 days)

**Duration:** 30 days post-release  
**Owner:** Engineering + On-Call

**Deliverables:**

- Incident reports (if any)
- Performance data
- User feedback summary
- Post-release retrospective

**Activities:**

- Monitor error rates and latency
- Respond to user issues
- Collect performance metrics
- Gather user feedback
- Conduct retrospective

**Gates:**

- [ ] Error rate < SLA
- [ ] Escalation procedures working
- [ ] User satisfaction > 90%
- [ ] Performance stable

**Next:** Maintenance mode or iterate

---

## State Transitions

```text
Ideation → Specification → Planning → Implementation → Staging → Release → Production → Monitoring
                                                         ↓           ↓
                                                    [Issue] ← [Rollback]
```

## Rollback Decision Tree

**When to rollback:**

- Critical bugs affecting core functionality
- Data corruption or loss
- Security vulnerability in production
- Performance degradation > 20%
- User volume dropped > 50%

**Not rollback-worthy:**

- Minor UI issues (fix forward)
- Non-critical features broken (feature flag off)
- Single user affected (investigate)

See: [Rollback Runbook](../runbooks/rollback.md)

## Timeline Example

```text
Week 1:     Ideation & Research
Week 2:     Specification
Week 3:     Planning & Design
Weeks 4-6:  Implementation
Week 7:     Staging & QA
Week 8:     Release Preparation & Deployment
Weeks 9-12: Monitoring & Support
```

**Total: ~2 months typical feature** (small features 4 weeks, complex 12 weeks)

## Key Metrics

- **Cycle time:** Days from spec approval to production
- **Quality:** Bugs found post-release / bugs found in testing
- **Safety:** Rollback rate per 100 releases
- **Velocity:** Stories completed per sprint
- **Satisfaction:** User feedback score (1-5)

## Checkpoints

| Checkpoint | Date | Owner | Status |
|-----------|------|-------|--------|
| Spec approved | | Tech Lead | |
| Plan approved | | Engineering | |
| Code review complete | | Reviewers | |
| Staging verification | | QA | |
| Release approved | | Release Lead | |
| Deployment complete | | Ops | |
| Monitoring clear | +30d | On-Call | |
