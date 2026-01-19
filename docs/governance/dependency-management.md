# Dependency Management

Managing library versions, updates, and deprecation of dependencies.

## Dependency Inventory

### Production Dependencies

Core libraries required for production:

```text
express            - Web framework
bcrypt             - Password hashing
jsonwebtoken        - JWT token generation
pg                 - PostgreSQL driver
redis              - Redis client
uuid               - UUID generation
dotenv             - Environment variables
```

### Development Dependencies

Tools for development and testing:

```text
jest               - Test runner
nodemon            - Auto-restart on changes
eslint             - Code linting
prettier           - Code formatting
supertest          - HTTP testing
```

### Security Dependencies

```text
helmet             - Security headers
cors               - Cross-origin requests
express-rate-limit - Rate limiting
sql-injection-check - SQL injection prevention
```

## Update Policy

### Patch Updates (Minor)

**Example:** 2.1.3 → 2.1.4

**When:** Every release cycle (every 2 weeks)

**Process:**

```bash
# Automatically apply patches
npm update

# Test thoroughly
npm test

# No manual PR needed (automated)
```

**Decision:** Apply automatically

### Minor Updates (New Features)

**Example:** 2.1.x → 2.2.0

**When:** Every sprint (every 2-4 weeks)

**Process:**

```bash
# Check what would be updated
npm outdated

# Update specific package
npm install express@2.2.0 --save

# Run tests
npm test

# Create PR for review
git add package.json package-lock.json
git commit -m "chore: update express to 2.2.0"
git push origin chore/express-2.2.0
```

**Decision:** Manual review recommended

### Major Updates (Breaking Changes)

**Example:** 2.x → 3.0.0

**When:** Quarterly or as needed

**Process:**

1. **Research compatibility**

   ```bash
   # Check breaking changes
   npm view express@3.0.0 description
   
   # Read changelog
   # Check GitHub issues
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feat/upgrade-express-3
   ```

3. **Test in isolation**

   ```bash
   npm install express@3.0.0 --save
   npm test
   npm run build
   ```

4. **Verify compatibility**
   - [ ] All imports still work
   - [ ] API calls unchanged
   - [ ] Tests passing
   - [ ] No runtime errors

5. **Create PR with detailed notes**

   ```text
   ## Major Upgrade: Express 2 → 3
   
   ### Breaking Changes
   - Middleware signature changed
   - Error handling improved
   
   ### Changes Made
   - Updated 3 middleware functions
   - Updated 2 error handlers
   
   ### Testing
   - All unit tests pass
   - E2E tests pass
   - Staging deployment successful
   
   ### Migration Guide
   See: https://expressjs.com/en/guide/migrating-3.x.html
   ```

6. **Staging validation**
   - Deploy to staging
   - Run full test suite
   - Performance testing
   - Security scanning

7. **Merge and release**
   - Update version number
   - Update CHANGELOG
   - Tag release

**Decision:** Requires full review + testing

## Deprecation Warnings

### Monitor for Deprecations

```bash
# Check for deprecation warnings during build
npm run build 2>&1 | grep -i deprecat

# Example output:
# DeprecationWarning: express.Router() no longer accepts ...
```

### Respond to Warnings

**Step 1: Identify the warning**

```text
Warning: express.Router() deprecated ...
Location: src/routes/auth.js:5
```

**Step 2: Create task**

- [ ] Track in backlog as tech debt
- [ ] Estimate effort (usually small)
- [ ] Assign to next sprint

**Step 3: Fix before major version bump**

- [ ] Update code to new API
- [ ] Test thoroughly
- [ ] Document why change needed

**Step 4: Monitor**

- [ ] Verify warning gone
- [ ] Update documentation if needed

## Security Updates

### Critical Security Vulnerabilities

**When:** Immediately

**Example Vulnerability:**

```text
npm audit

# Output:
HIGH   SQL Injection in mysql 2.14.0-2.15.0
       versions >= 2.14.0 < 2.16.1

Fix: npm install mysql@2.16.1
```

**Process:**

1. Update immediately to patched version
2. Test in staging
3. Deploy to production (if needed)
4. No PR required (hot fix)

### Dependency Audit

```bash
# Check for known vulnerabilities
npm audit

# Results:
# 0 vulnerabilities  ✅
# Or
# 5 vulnerabilities (3 high, 2 medium) ❌

# Fix automatically where possible
npm audit fix

# Manual review required
npm audit fix --force  # Use caution
```

### Supply Chain Security

```bash
# Verify package integrity
npm audit signatures

# Check for tampered packages
npm pkg get integrity

# Use lock file (always commit)
git add package-lock.json
```

## License Compliance

### Check Licenses

```bash
# Install license checker
npm install -g license-report

# Generate report
license-report --output markdown > LICENSES.md

# Review before using in production
# Acceptable: MIT, Apache 2.0, BSD, ISC
# Review: LGPL, GPL (copyleft)
# Avoid: Commercial, proprietary
```

### License Requirements

**Commercial use OK:**

- ✅ MIT
- ✅ Apache 2.0
- ✅ BSD (2-Clause, 3-Clause)
- ✅ ISC

**Need review:**

- ⚠️ LGPL - Requires notice
- ⚠️ GPL v3 - Requires source release
- ⚠️ AGPL - Requires source if used online

**Avoid:**

- ❌ Commercial licenses
- ❌ Custom proprietary
- ❌ Dual licensing

## Managing Deprecated Packages

### When a Package Is Deprecated

Example: `node-deprecated-lib` no longer maintained

**Step 1: Identify replacement**

```bash
npm search [replacement-lib]
npm view [replacement-lib]
```

**Step 2: Evaluate alternative**

- [ ] Similar API?
- [ ] Active maintenance?
- [ ] Good security record?
- [ ] License compatible?

**Step 3: Plan migration**

- [ ] Create task with requirements
- [ ] Estimate effort
- [ ] Schedule work

**Step 4: Implement migration**

```bash
# Install replacement
npm install new-lib --save

# Remove old package
npm uninstall node-deprecated-lib --save

# Update imports
# Before: const old = require('node-deprecated-lib');
# After: const new = require('new-lib');

# Test thoroughly
npm test
```

**Step 5: Release**

- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for issues

## Monorepo Dependency Management

If using monorepo (multiple packages):

```text
project/
├── packages/
│   ├── api/
│   │   └── package.json
│   ├── web/
│   │   └── package.json
│   └── shared/
│       └── package.json
└── package.json (root)
```

### Update Strategy

```bash
# Update root dependencies
npm update -w

# Update specific workspace
npm update -w api

# Install across all workspaces
npm install
```

## Performance After Updates

### Benchmark Performance

```bash
# Before update
npm run benchmark > before.json

# Update package
npm install new-version@latest

# After update
npm run benchmark > after.json

# Compare
npm run compare-benchmarks before.json after.json

# If performance degraded:
# - Revert update
# - Report issue to maintainer
# - Wait for fix
```

## Dependency Dashboard

### Monthly Review

Track:

- [ ] How many security updates available?
- [ ] How many minor updates available?
- [ ] How many major updates available?
- [ ] Any deprecated packages?
- [ ] License compliance OK?

### Update Schedule

```text
Week 1: Review available updates
Week 2: Apply patches (auto)
Week 3: Test minor updates
Week 4: Plan major upgrades (quarterly)
```

## Tools

### Dependabot

GitHub-native dependency management:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "03:00"
    reviewers:
      - "tech-lead"
    allow:
      - dependency-type: "all"
    open-pull-requests-limit: 5
    rebase-strategy: "auto"
```

### Renovate

Alternative to Dependabot (more flexible):

```json
// renovate.json
{
  "extends": ["config:base"],
  "schedule": ["weekly"],
  "reviewers": ["tech-lead"],
  "semanticCommits": true,
  "automerge": false
}
```

## Checklist for Updates

Before merging dependency update:

- [ ] Update is from official source
- [ ] No security issues in new version
- [ ] All tests passing
- [ ] Code coverage maintained
- [ ] No breaking changes (or PR notes them)
- [ ] Performance impact checked
- [ ] Compatibility verified
- [ ] Release notes updated
- [ ] License still compatible
- [ ] Staging tested

## References

- [npm Documentation](https://docs.npmjs.com/)
- [npm Audit Guide](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Node.js Dependencies](https://nodejs.org/en/docs/guides/nodejs-dependency-injection/)
- [OWASP Supply Chain](https://owasp.org/www-project-supply-chain-maturity-model/)
