# First-Time Setup Runbook

Getting started: local development environment setup.

## Prerequisites

- [ ] Git installed
- [ ] GitHub account with repo access
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/shell (zsh, bash)
- [ ] 10-20 GB free disk space

## System Requirements

### macOS

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install git node postgresql redis docker
```

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install git nodejs npm postgresql redis-server docker.io
```

### Windows

```powershell
# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; `
  [System.Net.ServicePointManager]::SecurityProtocol = `
  [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install dependencies
choco install git nodejs postgresql redis docker-desktop
```

## Project Setup

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/RockRunner007/template.git
cd template

# Verify you're on main branch
git branch
git checkout main
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Verify installation
npm list | head -20

# Should show dependencies installed successfully
```

### 3. Database Setup

```bash
# Start PostgreSQL (if not running)
# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql

# Windows
net start postgresql-x64-XX

# Create development database
createdb template_dev

# Verify connection
psql -d template_dev -c "SELECT version();"
```

### 4. Redis Setup

```bash
# Start Redis (if not running)
# macOS
brew services start redis

# Ubuntu
sudo systemctl start redis-server

# Windows (Docker)
docker run -d -p 6379:6379 redis:latest

# Verify connection
redis-cli ping
# Should return: PONG
```

### 5. Environment Configuration

Create `.env` file (never commit):

```bash
cp .env.example .env
```

Edit `.env`:

```
# .env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgres://postgres:password@localhost:5432/template_dev
DATABASE_POOL_SIZE=5

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-secret-key-not-for-production-random-string

# Logging
LOG_LEVEL=debug

# External Services (use test keys)
SENDGRID_API_KEY=test_key
STRIPE_API_KEY=sk_test_xxxx
```

### 6. Database Migrations

```bash
# Run pending migrations
npm run db:migrate

# Verify tables created
psql -d template_dev -c "\dt"

# Should show tables: users, sessions, audit_logs, etc.
```

### 7. Run Application

```bash
# Start development server
npm run dev

# Output should show:
# Server running on http://localhost:3000
# Database connected
# Redis connected

# Keep running in terminal
# Open http://localhost:3000 in browser
```

### 8. Run Tests

```bash
# Unit tests
npm run test:unit

# Integration tests (requires running app)
npm run test:integration

# All tests
npm test

# With coverage
npm run test:coverage
```

## Verify Setup

Complete checklist:

```bash
# 1. Check Node.js
node --version  # Should be v18+

# 2. Check npm
npm --version   # Should be v8+

# 3. Check git
git --version   # Should be v2.30+

# 4. Check PostgreSQL
psql --version  # Should show PostgreSQL version

# 5. Check Redis
redis-cli --version  # Should show Redis version

# 6. Check environment file
ls -la .env  # Should exist and not be in git

# 7. Test database connection
psql -d template_dev -c "SELECT COUNT(*) FROM users;"

# 8. Test Redis connection
redis-cli ping  # Should return PONG

# 9. Test app starts
npm run dev   # Should start without errors
```

## First Workflow

### 1. Check Current Branch

```bash
git branch  # Should be on main
git status  # Should be clean
```

### 2. Create Feature Branch

```bash
# Create branch for your work
git checkout -b feat/my-feature

# Make changes to files
```

### 3. Run Tests

```bash
# Make sure tests pass
npm test

# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user authentication

- Implement login endpoint
- Add password hashing
- Add JWT token generation"

# View your commits
git log --oneline -5
```

### 5. Push and Create PR

```bash
# Push branch to GitHub
git push origin feat/my-feature

# Go to GitHub and create Pull Request
# Add description, link spec
# Request reviewers
```

### 6. Review Process

- [ ] Wait for reviews
- [ ] Respond to comments
- [ ] Make requested changes
- [ ] Push again (automatically updates PR)
- [ ] Repeat until approved

### 7. Merge and Deploy

```bash
# Reviewer approves and merges to main
# This triggers CI/CD pipeline

# Pull latest main locally
git checkout main
git pull origin main

# Verify new changes
git log --oneline -5
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Should return: accepting connections

# If not, start it
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Ubuntu

# Check connection string
echo $DATABASE_URL

# Should be: postgres://user:password@localhost:5432/template_dev
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# If not, start it
brew services start redis  # macOS
sudo systemctl start redis-server  # Ubuntu

# Check redis connection
redis-cli -h localhost -p 6379 ping
```

### Tests Failing

```bash
# Make sure app is running
npm run dev

# In another terminal, run tests
npm test

# If still failing, check logs
npm run test:unit -- --verbose

# Check test database is clean
npm run db:migrate:reset
```

### Git Conflicts

```bash
# If you have merge conflicts
git status

# Edit conflicted files and resolve

# Mark as resolved
git add <file>

# Continue
git rebase --continue
# or
git merge --continue
```

## Daily Development

### Start of Day

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/new-feature

# Install any new dependencies
npm install

# Run tests to verify setup
npm test
```

### During Development

```bash
# Keep terminal running
npm run dev  # In terminal 1

# In terminal 2, run tests
npm test -- --watch

# In terminal 3, use git
git status
git add .
git commit -m "feat: description"
```

### End of Day

```bash
# Push branch
git push origin feat/new-feature

# Clean up
npm run lint -- --fix
npm test
```

## Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build

# Testing
npm test             # Run all tests
npm run test:unit    # Unit tests only
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report

# Linting
npm run lint         # Check linting
npm run lint -- --fix # Auto-fix issues
npm run format       # Format code

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:reset     # Reset database

# Git
git log --oneline    # View commits
git diff             # View changes
git status           # Current status
git branch -a        # View all branches
```

## IDE Setup

### VS Code Extensions

Install for better development experience:

- ESLint - Find code problems
- Prettier - Code formatter
- Thunder Client - API testing
- PostgreSQL - Database explorer
- Redis - Cache explorer

### VS Code Settings

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.env": true
  }
}
```

## Getting Help

### Documentation

- [README](../README.md) - Project overview
- [Contributing](../CONTRIBUTING.md) - How to contribute
- [Specs](../specs) - Feature specifications
- [Docs](../docs) - Full documentation

### Common Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/documentation)
- [Git Reference](https://git-scm.com/docs)

### Ask for Help

- Post in Slack #dev-help
- Create GitHub issue with [HELP] tag
- Email: dev-team@example.com

## Next Steps

1. ✅ Local environment working
2. ✅ Can run tests
3. ✅ Created first feature branch
4. Read [Contributing Guidelines](../CONTRIBUTING.md)
5. Review [Spec-Driven Development](../specs/readme.md)
6. Start implementing features!

## Checklist Summary

- [ ] All dependencies installed
- [ ] Environment file created (.env)
- [ ] Database running and seeded
- [ ] Redis running
- [ ] Application starts without errors
- [ ] All tests passing
- [ ] Git configured with credentials
- [ ] Can create feature branch
- [ ] Can run linting and formatting
- [ ] IDE configured with extensions
