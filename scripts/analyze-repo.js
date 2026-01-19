#!/usr/bin/env node

/**
 * Repository Compliance Analyzer
 * 
 * Analyzes a GitHub repository against the template and provides
 * recommendations for missing or incomplete areas.
 * 
 * Usage:
 *   node scripts/analyze-repo.js <owner>/<repo>
 *   node scripts/analyze-repo.js RockRunner007/template
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuration
const TEMPLATE_FILES = {
  documentation: {
    'README.md': { weight: 10, description: 'Project overview' },
    'CONTRIBUTING.md': { weight: 8, description: 'Contribution guidelines' },
    'SECURITY.md': { weight: 8, description: 'Security policy' },
    'CODE_OF_CONDUCT.md': { weight: 5, description: 'Code of conduct' },
    'LICENSE': { weight: 10, description: 'License file' },
  },
  governance: {
    'docs/governance/code-review-standards.md': { weight: 7, description: 'Code review standards' },
    'docs/governance/change-management.md': { weight: 6, description: 'Change management process' },
    'docs/governance/onboarding.md': { weight: 6, description: 'Team onboarding guide' },
    'docs/governance/dependency-management.md': { weight: 5, description: 'Dependency management' },
  },
  lifecycle: {
    'docs/lifecycle/feature-lifecycle.md': { weight: 7, description: 'Feature lifecycle' },
    'docs/lifecycle/release-management.md': { weight: 7, description: 'Release management' },
    'docs/lifecycle/deprecation-policy.md': { weight: 5, description: 'Deprecation policy' },
  },
  infrastructure: {
    'docs/infrastructure-overview.md': { weight: 8, description: 'Infrastructure overview' },
    'docs/environment-strategy.md': { weight: 7, description: 'Environment strategy' },
    'docs/runbooks/': { weight: 6, description: 'Runbooks directory' },
  },
  testing: {
    'docs/testing/test-pyramid.md': { weight: 7, description: 'Testing strategy' },
    'docs/testing/security-testing.md': { weight: 7, description: 'Security testing guide' },
    'docs/testing/performance-testing.md': { weight: 6, description: 'Performance testing' },
  },
  specs: {
    'specs/': { weight: 8, description: 'Specs directory' },
    'specs/readme.md': { weight: 7, description: 'Specs documentation' },
  },
  workflows: {
    '.github/workflows/': { weight: 8, description: 'GitHub Actions workflows' },
  },
  examples: {
    'example/': { weight: 5, description: 'Example implementations' },
  },
};

const QUALITY_CHECKS = {
  readme: {
    minLength: 500,
    shouldInclude: ['installation', 'usage', 'contributing', 'license'],
    description: 'README quality',
  },
  contributing: {
    minLength: 300,
    shouldInclude: ['guidelines', 'process', 'tests', 'pull request'],
    description: 'Contributing guide quality',
  },
  security: {
    minLength: 200,
    shouldInclude: ['vulnerability', 'report', 'responsible', 'disclosure'],
    description: 'Security policy quality',
  },
};

// Helper functions
function makeGitHubRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'RepoAnalyzer',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    if (process.env.GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode}`));
        }
      });
    }).on('error', reject).end();
  });
}

function getFileContent(owner, repo, filePath) {
  const encodedPath = encodeURIComponent(filePath);
  return makeGitHubRequest(`/repos/${owner}/${repo}/contents/${encodedPath}`)
    .then(data => {
      if (data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      return null;
    })
    .catch(() => null);
}

function calculateScore(points, maxPoints) {
  return Math.round((points / maxPoints) * 100);
}

function getRecommendations(results) {
  const recommendations = [];
  
  // Check documentation completeness
  const docScore = results.categories.documentation.score;
  if (docScore < 80) {
    recommendations.push({
      priority: 'HIGH',
      area: 'Documentation',
      issue: 'Missing core documentation files',
      suggestion: 'Add README.md, CONTRIBUTING.md, SECURITY.md files',
      impact: 'Developers cannot understand project or contribute effectively',
    });
  }

  // Check governance
  const govScore = results.categories.governance.score;
  if (govScore < 70) {
    recommendations.push({
      priority: 'HIGH',
      area: 'Governance',
      issue: 'Missing governance documentation',
      suggestion: 'Add code review standards, change management, and onboarding guides',
      impact: 'Team lacks clear processes and standards',
    });
  }

  // Check testing documentation
  const testScore = results.categories.testing.score;
  if (testScore < 60) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'Testing',
      issue: 'Missing testing strategy documentation',
      suggestion: 'Document test pyramid, security testing, and performance testing approaches',
      impact: 'Team may lack consistency in testing practices',
    });
  }

  // Check lifecycle documentation
  const lifecycleScore = results.categories.lifecycle.score;
  if (lifecycleScore < 70) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'Lifecycle',
      issue: 'Missing lifecycle documentation',
      suggestion: 'Add feature lifecycle, release management, and deprecation policy',
      impact: 'Unclear feature and release processes',
    });
  }

  // Check infrastructure
  const infraScore = results.categories.infrastructure.score;
  if (infraScore < 70) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'Infrastructure',
      issue: 'Missing infrastructure documentation',
      suggestion: 'Document infrastructure overview, environments, and deployment strategy',
      impact: 'Operations lack clear infrastructure guidance',
    });
  }

  // Check specs
  const specsScore = results.categories.specs.score;
  if (specsScore < 80) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'Specifications',
      issue: 'Missing or incomplete specification examples',
      suggestion: 'Create specs/ directory with documented examples',
      impact: 'Team may not be using specification-driven development',
    });
  }

  // Check CI/CD workflows
  const workflowScore = results.categories.workflows.score;
  if (workflowScore < 80) {
    recommendations.push({
      priority: 'MEDIUM',
      area: 'CI/CD',
      issue: 'Missing GitHub Actions workflows',
      suggestion: 'Create workflows for testing, linting, and deployment',
      impact: 'Manual processes prevent automation',
    });
  }

  // Check quality
  if (results.quality.readme.score < 70) {
    recommendations.push({
      priority: 'HIGH',
      area: 'Documentation',
      issue: 'README.md needs improvement',
      suggestion: 'Add installation, usage, contributing, and license sections',
      impact: 'New users cannot understand project',
    });
  }

  if (results.quality.contributing.score < 70) {
    recommendations.push({
      priority: 'HIGH',
      area: 'Contributing',
      issue: 'CONTRIBUTING.md incomplete',
      suggestion: 'Document contribution process, testing requirements, and PR guidelines',
      impact: 'Contributors lack clear guidance',
    });
  }

  return recommendations;
}

function formatResults(owner, repo, results) {
  const totalScore = results.overallScore;
  const scoreColor = totalScore >= 80 ? '🟢' : totalScore >= 60 ? '🟡' : '🔴';

  console.log('\n' + '='.repeat(70));
  console.log(`Repository Analysis: ${owner}/${repo}`.padEnd(70));
  console.log('='.repeat(70) + '\n');

  console.log(`${scoreColor} Overall Compliance Score: ${totalScore}/100\n`);

  // Category scores
  console.log('Category Breakdown:');
  console.log('-'.repeat(70));
  for (const [category, data] of Object.entries(results.categories)) {
    const bar = '█'.repeat(Math.round(data.score / 5)) + '░'.repeat(20 - Math.round(data.score / 5));
    console.log(`${category.padEnd(20)} [${bar}] ${data.score}/100 (${data.points}/${data.maxPoints} points)`);
  }

  // Quality checks
  console.log('\n\nContent Quality Checks:');
  console.log('-'.repeat(70));
  for (const [check, result] of Object.entries(results.quality)) {
    const status = result.found ? '✓' : '✗';
    console.log(`${status} ${result.description}: ${result.score}/100`);
    if (result.details) {
      console.log(`  ${result.details}`);
    }
  }

  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n\nRecommendations for Improvement:');
    console.log('-'.repeat(70));
    
    const highPriority = results.recommendations.filter(r => r.priority === 'HIGH');
    const mediumPriority = results.recommendations.filter(r => r.priority === 'MEDIUM');

    if (highPriority.length > 0) {
      console.log('\n🔴 HIGH PRIORITY:');
      highPriority.forEach((rec, i) => {
        console.log(`\n${i + 1}. ${rec.area}: ${rec.issue}`);
        console.log(`   Suggestion: ${rec.suggestion}`);
        console.log(`   Impact: ${rec.impact}`);
      });
    }

    if (mediumPriority.length > 0) {
      console.log('\n\n🟡 MEDIUM PRIORITY:');
      mediumPriority.forEach((rec, i) => {
        console.log(`\n${i + 1}. ${rec.area}: ${rec.issue}`);
        console.log(`   Suggestion: ${rec.suggestion}`);
        console.log(`   Impact: ${rec.impact}`);
      });
    }
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

function formatJSON(owner, repo, results) {
  return {
    repository: `${owner}/${repo}`,
    timestamp: new Date().toISOString(),
    overallScore: results.overallScore,
    categories: results.categories,
    quality: results.quality,
    recommendations: results.recommendations,
  };
}

async function analyzeRepository(owner, repo) {
  try {
    console.log(`\nAnalyzing ${owner}/${repo}...`);
    
    const results = {
      categories: {},
      quality: {},
      overallScore: 0,
      recommendations: [],
    };

    let totalPoints = 0;
    let earnedPoints = 0;

    // Check each category
    for (const [category, files] of Object.entries(TEMPLATE_FILES)) {
      let categoryPoints = 0;
      let categoryMaxPoints = 0;

      for (const [file, metadata] of Object.entries(files)) {
        categoryMaxPoints += metadata.weight;
        totalPoints += metadata.weight;

        try {
          const content = await getFileContent(owner, repo, file);
          if (content || await checkPathExists(owner, repo, file)) {
            categoryPoints += metadata.weight;
            earnedPoints += metadata.weight;
          }
        } catch (err) {
          // File not found, no points
        }
      }

      results.categories[category] = {
        score: categoryMaxPoints > 0 ? calculateScore(categoryPoints, categoryMaxPoints) : 0,
        points: categoryPoints,
        maxPoints: categoryMaxPoints,
      };
    }

    // Quality checks
    const readmeContent = await getFileContent(owner, repo, 'README.md');
    if (readmeContent) {
      const checks = QUALITY_CHECKS.readme.shouldInclude.filter(keyword =>
        readmeContent.toLowerCase().includes(keyword)
      );
      results.quality.readme = {
        found: true,
        score: Math.min(100, Math.round((readmeContent.length / QUALITY_CHECKS.readme.minLength) * 100 * (checks.length / QUALITY_CHECKS.readme.shouldInclude.length))),
        description: 'README.md quality',
        details: `Contains ${checks.length}/${QUALITY_CHECKS.readme.shouldInclude.length} recommended sections`,
      };
    } else {
      results.quality.readme = {
        found: false,
        score: 0,
        description: 'README.md quality',
        details: 'File not found',
      };
    }

    const contributingContent = await getFileContent(owner, repo, 'CONTRIBUTING.md');
    if (contributingContent) {
      const checks = QUALITY_CHECKS.contributing.shouldInclude.filter(keyword =>
        contributingContent.toLowerCase().includes(keyword)
      );
      results.quality.contributing = {
        found: true,
        score: Math.min(100, Math.round((contributingContent.length / QUALITY_CHECKS.contributing.minLength) * 100 * (checks.length / QUALITY_CHECKS.contributing.shouldInclude.length))),
        description: 'CONTRIBUTING.md quality',
        details: `Contains ${checks.length}/${QUALITY_CHECKS.contributing.shouldInclude.length} recommended sections`,
      };
    } else {
      results.quality.contributing = {
        found: false,
        score: 0,
        description: 'CONTRIBUTING.md quality',
        details: 'File not found',
      };
    }

    const securityContent = await getFileContent(owner, repo, 'SECURITY.md');
    if (securityContent) {
      const checks = QUALITY_CHECKS.security.shouldInclude.filter(keyword =>
        securityContent.toLowerCase().includes(keyword)
      );
      results.quality.security = {
        found: true,
        score: Math.min(100, Math.round((securityContent.length / QUALITY_CHECKS.security.minLength) * 100 * (checks.length / QUALITY_CHECKS.security.shouldInclude.length))),
        description: 'SECURITY.md quality',
        details: `Contains ${checks.length}/${QUALITY_CHECKS.security.shouldInclude.length} recommended sections`,
      };
    } else {
      results.quality.security = {
        found: false,
        score: 0,
        description: 'SECURITY.md quality',
        details: 'File not found',
      };
    }

    // Calculate overall score
    const categoryScores = Object.values(results.categories).map(c => c.score);
    const qualityScores = Object.values(results.quality).map(q => q.score);
    const allScores = [...categoryScores, ...qualityScores];
    results.overallScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

    // Generate recommendations
    results.recommendations = getRecommendations(results);

    return results;
  } catch (error) {
    console.error(`\nError analyzing repository: ${error.message}`);
    process.exit(1);
  }
}

async function checkPathExists(owner, repo, filePath) {
  try {
    await makeGitHubRequest(`/repos/${owner}/${repo}/contents/${filePath}`);
    return true;
  } catch {
    return false;
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/analyze-repo.js <owner>/<repo>');
    console.log('Example: node scripts/analyze-repo.js RockRunner007/template');
    console.log('\nEnvironment variables:');
    console.log('  GITHUB_TOKEN - GitHub API token for higher rate limits');
    console.log('  OUTPUT_FORMAT - output format: "text" or "json" (default: text)');
    process.exit(1);
  }

  const [owner, repo] = args[0].split('/');
  if (!owner || !repo) {
    console.error('Invalid format. Use: owner/repo');
    process.exit(1);
  }

  const outputFormat = process.env.OUTPUT_FORMAT || 'text';

  const results = await analyzeRepository(owner, repo);

  if (outputFormat === 'json') {
    console.log(JSON.stringify(formatJSON(owner, repo, results), null, 2));
  } else {
    formatResults(owner, repo, results);
  }
}

main().catch(console.error);
