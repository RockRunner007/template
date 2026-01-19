# Using the Analyzer with AI

How to use the repository compliance analyzer with AI systems to automate issue discovery and reporting.

## Overview

The repository analyzer produces machine-readable JSON output that can be ingested by:
- Language models (Claude, GPT, etc.)
- Automated issue creation systems
- CI/CD pipelines
- Dashboard systems
- Reporting tools

## JSON Output Format

```bash
OUTPUT_FORMAT=json ./scripts/analyze-repo owner/repo > analysis.json
```

Output structure:
```json
{
  "repository": "owner/repo",
  "timestamp": "2026-01-19T20:45:59.822Z",
  "overallScore": 72,
  "categories": {
    "documentation": { "score": 100, "points": 41, "maxPoints": 41 },
    "governance": { "score": 50, "points": 12, "maxPoints": 24 },
    "lifecycle": { "score": 40, "points": 8, "maxPoints": 19 },
    "infrastructure": { "score": 0, "points": 0, "maxPoints": 21 },
    "testing": { "score": 0, "points": 0, "maxPoints": 20 },
    "specs": { "score": 60, "points": 9, "maxPoints": 15 },
    "workflows": { "score": 0, "points": 0, "maxPoints": 8 },
    "examples": { "score": 0, "points": 0, "maxPoints": 5 }
  },
  "quality": {
    "readme": { "found": true, "score": 90, "description": "README.md quality" },
    "contributing": { "found": false, "score": 0, "description": "CONTRIBUTING.md quality" },
    "security": { "found": true, "score": 70, "description": "SECURITY.md quality" }
  },
  "recommendations": [
    {
      "priority": "HIGH",
      "area": "Governance",
      "issue": "Missing governance documentation",
      "suggestion": "Add code review standards, change management, and onboarding guides",
      "impact": "Team lacks clear processes and standards"
    },
    {
      "priority": "MEDIUM",
      "area": "Infrastructure",
      "issue": "Missing infrastructure documentation",
      "suggestion": "Document infrastructure overview, environments, and deployment strategy",
      "impact": "Operations lack clear infrastructure guidance"
    }
  ]
}
```

## AI Integration Examples

### 1. With Claude/GPT via API

**Python script to analyze repo and send to AI:**

```python
#!/usr/bin/env python3
import subprocess
import json
import os
from anthropic import Anthropic

def get_analysis(owner_repo):
    """Get compliance analysis as JSON"""
    result = subprocess.run(
        ['node', 'scripts/analyze-repo.js', owner_repo],
        env={**os.environ, 'OUTPUT_FORMAT': 'json'},
        capture_output=True,
        text=True,
        cwd='/path/to/template'
    )
    
    # Parse JSON from output (skip "Analyzing..." line)
    lines = result.stdout.strip().split('\n')
    json_start = next(i for i, line in enumerate(lines) if line.startswith('{'))
    return json.loads('\n'.join(lines[json_start:]))

def analyze_with_claude(analysis):
    """Send analysis to Claude for interpretation"""
    client = Anthropic()
    
    prompt = f"""
You are a software engineering expert analyzing a GitHub repository's compliance with best practices.

Repository Analysis Results:
{json.dumps(analysis, indent=2)}

Please provide:
1. Executive Summary: Overall health assessment (1-2 sentences)
2. Critical Issues: Top 3 problems that must be addressed
3. Quick Wins: Easiest improvements to make
4. Recommended Timeline: Suggested order and timeline for fixes
5. Effort Estimation: Rough effort for each major recommendation

Be specific and actionable.
"""
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return message.content[0].text

# Main
if __name__ == "__main__":
    analysis = get_analysis("myorg/myrepo")
    recommendations = analyze_with_claude(analysis)
    print(recommendations)
```

### 2. Automated GitHub Issue Creation

**Create issues from recommendations:**

```python
#!/usr/bin/env python3
import subprocess
import json
import os
from github import Github

def create_issues_from_analysis(owner, repo, token):
    """Create GitHub issues from analysis recommendations"""
    
    # Get analysis
    result = subprocess.run(
        ['node', 'scripts/analyze-repo.js', f'{owner}/{repo}'],
        env={**os.environ, 'OUTPUT_FORMAT': 'json'},
        capture_output=True,
        text=True
    )
    
    lines = result.stdout.strip().split('\n')
    json_start = next(i for i, line in enumerate(lines) if line.startswith('{'))
    analysis = json.loads('\n'.join(lines[json_start:]))
    
    # Connect to GitHub
    g = Github(token)
    github_repo = g.get_user(owner).get_repo(repo)
    
    # Create issues for recommendations
    for rec in analysis['recommendations']:
        if rec['priority'] in ['HIGH', 'MEDIUM']:
            issue_title = f"[{rec['priority']}] {rec['area']}: {rec['issue']}"
            issue_body = f"""
## Issue
{rec['issue']}

## Suggested Solution
{rec['suggestion']}

## Impact
{rec['impact']}

## Details
- Score: {analysis['overallScore']}/100
- Category: {rec['area']}
- Priority: {rec['priority']}

---
*Auto-generated by repository compliance analyzer*
"""
            
            # Check if issue already exists
            existing = github_repo.get_issues(
                state='open',
                labels=['compliance', rec['area'].lower()]
            )
            
            if not any(issue_title in issue.title for issue in existing):
                github_repo.create_issue(
                    title=issue_title,
                    body=issue_body,
                    labels=['compliance', rec['area'].lower()]
                )
                print(f"✓ Created issue: {issue_title}")
            else:
                print(f"⊘ Issue already exists: {issue_title}")

# Usage
create_issues_from_analysis("myorg", "myrepo", os.environ['GITHUB_TOKEN'])
```

### 3. CI/CD Pipeline Integration

**GitHub Actions workflow:**

```yaml
name: Repository Compliance Check

on:
  schedule:
    # Run weekly
    - cron: '0 9 * * 1'
  workflow_dispatch:

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Get compliance analysis
        id: analyze
        env:
          OUTPUT_FORMAT: json
        run: |
          cd scripts
          ANALYSIS=$(node analyze-repo.js ${{ github.repository }} 2>&1 | grep -A 1000 '^{')
          echo "analysis<<EOF" >> $GITHUB_OUTPUT
          echo "$ANALYSIS" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT
          
          SCORE=$(echo "$ANALYSIS" | jq -r '.overallScore')
          echo "score=$SCORE" >> $GITHUB_OUTPUT
      
      - name: Create/Update Summary
        if: always()
        run: |
          SCORE=${{ steps.analyze.outputs.score }}
          
          if [ $SCORE -ge 80 ]; then
            EMOJI="🟢"
          elif [ $SCORE -ge 60 ]; then
            EMOJI="🟡"
          else
            EMOJI="🔴"
          fi
          
          echo "## $EMOJI Repository Compliance: $SCORE/100" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`json" >> $GITHUB_STEP_SUMMARY
          echo '${{ steps.analyze.outputs.analysis }}' >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
      
      - name: Create compliance issue if needed
        if: fromJson(steps.analyze.outputs.analysis).overallScore < 70
        uses: actions/github-script@v6
        with:
          script: |
            const analysis = ${{ steps.analyze.outputs.analysis }};
            const recommendations = analysis.recommendations
              .filter(r => r.priority === 'HIGH')
              .map(r => `- **${r.area}**: ${r.issue}`)
              .join('\n');
            
            const body = `
## Repository Compliance Issue

**Score:** ${analysis.overallScore}/100 ⚠️

### High Priority Items
${recommendations}

### Recommendations
${analysis.recommendations
  .slice(0, 5)
  .map(r => `- ${r.suggestion}`)
  .join('\n')}

---
*Generated by compliance analyzer*
`;
            
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '📋 Repository Compliance Issues',
              body: body,
              labels: ['documentation', 'process']
            });
```

### 4. Dashboard Integration

**Express server to show compliance dashboard:**

```javascript
// server.js
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.get('/api/compliance/:owner/:repo', (req, res) => {
  try {
    const { owner, repo } = req.params;
    const result = execSync(
      `OUTPUT_FORMAT=json node scripts/analyze-repo.js ${owner}/${repo}`,
      { encoding: 'utf-8', env: { ...process.env, OUTPUT_FORMAT: 'json' } }
    );
    
    // Extract JSON (skip "Analyzing..." line)
    const lines = result.trim().split('\n');
    const jsonStart = lines.findIndex(l => l.startsWith('{'));
    const json = JSON.parse(lines.slice(jsonStart).join('\n'));
    
    res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// HTML Dashboard
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Repository Compliance Dashboard</title>
  <style>
    body { font-family: -apple-system, system-ui; margin: 20px; }
    .score { font-size: 48px; font-weight: bold; }
    .category { margin: 10px 0; }
    .high { color: #d32f2f; }
    .medium { color: #f57c00; }
    .good { color: #388e3c; }
  </style>
</head>
<body>
  <h1>Repository Compliance</h1>
  <input type="text" id="repo" placeholder="owner/repo" value="RockRunner007/template">
  <button onclick="analyze()">Analyze</button>
  
  <div id="results"></div>
  
  <script>
    async function analyze() {
      const repo = document.getElementById('repo').value;
      const [owner, name] = repo.split('/');
      const resp = await fetch(\`/api/compliance/\${owner}/\${name}\`);
      const data = await resp.json();
      
      let html = \`
        <div class="score">
          <span class="\${data.overallScore >= 80 ? 'good' : data.overallScore >= 60 ? 'medium' : 'high'}">
            \${data.overallScore}/100
          </span>
        </div>
      \`;
      
      for (const [category, info] of Object.entries(data.categories)) {
        html += \`
          <div class="category">
            \${category}: \${info.score}/100 (\${info.points}/\${info.maxPoints})
          </div>
        \`;
      }
      
      html += '<h3>Recommendations</h3>';
      for (const rec of data.recommendations.slice(0, 5)) {
        html += \`
          <div class="category \${rec.priority.toLowerCase()}">
            <strong>[\${rec.priority}] \${rec.area}:</strong> \${rec.suggestion}
          </div>
        \`;
      }
      
      document.getElementById('results').innerHTML = html;
    }
  </script>
</body>
</html>
  `);
});

app.listen(3000, () => console.log('Dashboard on http://localhost:3000'));
```

### 5. Batch Analysis

**Process multiple repos:**

```bash
#!/bin/bash

# Get list of repos and analyze all
GITHUB_TOKEN=$1

repos=(
  "myorg/backend"
  "myorg/frontend"
  "myorg/mobile"
  "myorg/admin"
  "myorg/api"
)

echo "Repository Compliance Report"
echo "============================"
echo ""

for repo in "${repos[@]}"; do
  score=$(OUTPUT_FORMAT=json GITHUB_TOKEN=$GITHUB_TOKEN \
    node scripts/analyze-repo.js $repo 2>/dev/null | \
    jq -r '.overallScore')
  
  if [ -z "$score" ]; then
    score="ERROR"
  fi
  
  printf "%-30s %3s/100\n" "$repo" "$score"
done
```

## LLM Prompt Templates

### For Analysis Interpretation

```
I have a repository compliance analysis in JSON format. 
Can you:
1. Identify the top 3 critical issues
2. Suggest a timeline for fixes (quick wins first)
3. Estimate effort for each recommendation
4. Provide specific file/directory examples

Analysis:
{json_output}
```

### For Issue Generation

```
Convert this compliance recommendation into a well-formatted GitHub issue:

Area: {area}
Issue: {issue}
Suggestion: {suggestion}
Impact: {impact}

Format it as markdown with:
- Clear problem statement
- Suggested solution
- Links to relevant documentation
- Acceptance criteria
```

### For Report Generation

```
Create an executive summary report based on this compliance analysis:
- Overview (2-3 sentences)
- Score interpretation
- Top 3 action items
- Effort/benefit matrix
- 90-day roadmap

Data:
{json_output}
```

## Querying Results

### Using jq

```bash
# Overall score
jq '.overallScore' report.json

# All high-priority recommendations
jq '.recommendations[] | select(.priority == "HIGH")' report.json

# Missing areas (score 0)
jq '.categories[] | select(.score == 0) | keys' report.json

# Category scores sorted
jq '.categories | to_entries | sort_by(.value.score) | .[] | "\(.key): \(.value.score)"' report.json
```

### Using Python

```python
import json

with open('report.json') as f:
    data = json.load(f)

# Get recommendations by priority
high_priority = [r for r in data['recommendations'] if r['priority'] == 'HIGH']
print(f"High priority issues: {len(high_priority)}")

# Find areas needing most work
categories = sorted(
    data['categories'].items(),
    key=lambda x: x[1]['score']
)
print(f"Worst area: {categories[0][0]} ({categories[0][1]['score']}/100)")
```

## References

- [Repository Analyzer](../docs/tools/repository-analyzer.md) - Full analyzer documentation
- [GitHub API](https://docs.github.com/en/rest) - GitHub API reference
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD integration
