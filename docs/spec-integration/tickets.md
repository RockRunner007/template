# Creating Tickets from Specifications

Guide for converting specification tasks into actionable GitHub Issues.

## Overview

Once `tasks.md` is generated from your spec, it becomes the source for creating tickets:

```text
tasks.md → GitHub Issues → Development Workflow
```

## Example Workflow

### 1. Review Generated tasks.md

From `specs/001-authentication/tasks.md`:

```markdown
# Authentication Feature - Tasks

## Phase 1: Foundation
- [ ] **[P]** Create User model with email and password fields
- [ ] **[P]** Implement bcrypt password hashing utility
- [ ] **[P]** Create JWT token generation utility
- [ ] Create login endpoint
- [ ] Create register endpoint

## Phase 2: Security
- [ ] Implement rate limiting on login attempts
- [ ] Add CSRF protection
- [ ] Validate email format and uniqueness
```

### 2. Create Individual Tickets

Convert each task into a GitHub Issue:

**Title:** Clear task description

```text
Add User model with email and password fields
```

**Body:**

```markdown
## From Specification
Feature: 001-authentication
Task: Create User model with email and password fields

## Description
Create a database model for users that stores email and hashed password.

## Acceptance Criteria
- [ ] User model has email field (unique constraint)
- [ ] User model has password field (stores hash, not plaintext)
- [ ] Model includes created_at and updated_at timestamps
- [ ] Migration file is created and applied
- [ ] Model passes all unit tests

## Links
- Spec: https://github.com/RockRunner007/template/blob/main/specs/001-authentication/spec.md
- Tasks: https://github.com/RockRunner007/template/blob/main/specs/001-authentication/tasks.md
```

**Labels:**

- `spec:001-authentication` (links to feature)
- `priority:high` or `priority:medium`
- `area:backend` or `area:frontend`
- `phase:1` (groups by implementation phase)

## Automated Ticket Creation

### GitHub Actions Workflow

Create `.github/workflows/create-tickets-from-tasks.yml` to automatically parse tasks.md and create GitHub Issues.

## Best Practices

1. **Create tickets AFTER spec review** - Dont create tickets from incomplete specs
2. **Group by phase** - Respect dependencies and parallel task markers [P]
3. **Link back to source** - Always include link to spec/plan/tasks files
4. **Assign to phases** - Use labels for Phase 1, Phase 2, etc.
5. **Update spec if blocked** - If task is impossible, update spec instead of creating workaround
6. **Reference in code** - Link issue number in PRs: "Fixes #123"
