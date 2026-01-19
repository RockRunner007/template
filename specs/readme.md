# Specifications Directory

This directory contains all feature specifications following Spec-Driven Development (SDD) methodology from [github/spec-kit](https://github.com/github/spec-kit).

## Directory Structure

Each feature gets its own numbered directory:

```text
specs/
├── 001-feature-name/
│   ├── spec.md                 # Feature requirements & user stories (WHAT and WHY)
│   ├── plan.md                 # Technical implementation plan (HOW with tech stack)
│   ├── research.md             # Technology research & comparisons
│   ├── data-model.md           # Data schemas, entities, and relationships
│   ├── contracts/              # API contracts & interfaces
│   │   ├── endpoints.md        # REST API specifications
│   │   └── events.md           # Event/message definitions
│   ├── quickstart.md           # Key validation scenarios & acceptance tests
│   └── tasks.md                # Executable task list (derived from plan)
├── 002-another-feature/
│   └── [same structure]
└── memory/
    ├── constitution.md         # Project principles (immutable - governs all specs)
    └── research/               # Shared research and context
```

## Workflow

### 1. Create Specification (What & Why)

```bash
/speckit.specify Real-time notifications with push support
```

This creates: `specs/NNN-real-time-notifications/spec.md`

**spec.md includes:**

- User stories and personas
- Acceptance criteria
- Edge cases
- [NEEDS CLARIFICATION] markers for ambiguities
- Non-functional requirements

### 2. Create Implementation Plan (How & Tech Stack)

```bash
/speckit.plan Use WebSockets for real-time, PostgreSQL for preferences, Redis for caching
```

This creates:

- `plan.md` - Technical architecture and implementation phases
- `data-model.md` - Database schemas
- `research.md` - Tech choices rationale
- `contracts/endpoints.md` - API specifications

### 3. Generate Tasks (Actionable Items)

```bash
/speckit.tasks
```

This creates: `tasks.md` with numbered implementation steps and parallelizable task markers.

## Key Principles

1. **Spec is Source of Truth**: Code is generated from specifications
2. **Focus on WHAT & WHY First**: Implementation details come in the plan
3. **Mark Uncertainties**: Use `[NEEDS CLARIFICATION: question]` for ambiguities
4. **Living Documents**: Specs evolve with code and feedback loops
5. **Version with Git**: Specs are reviewed like code

## Example Specs

- [001-example](./001-example/) - User authentication system example

## Integration Guides

- [Creating Tickets from Tasks](../docs/spec-integration/tickets.md)
- [Publishing to Knowledge Base](../docs/spec-integration/knowledge-base.md)
- [Managing Diagrams](../docs/spec-integration/diagrams.md)

## Getting Started

1. Create first spec: `/speckit.specify Build user authentication`
2. Review and refine in `specs/001-authentication/spec.md`
3. Create implementation plan: `/speckit.plan Use Express.js with JWT`
4. Generate tasks: `/speckit.tasks`
5. Create GitHub Issues from tasks
6. Begin implementation
