import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function createAndPushToGitHub() {
  try {
    console.log('🔗 Connecting to GitHub...');
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`👤 Connected as: ${user.login}`);

    // Repository name
    const repoName = 'ai-research-data-collection';
    
    console.log(`📁 Creating repository: ${repoName}`);
    
    // Try to create the repository
    let repo;
    try {
      const { data } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'Mobile-friendly research data collection website for AI model training - Hair & Scalp Analysis',
        private: false,
        auto_init: false
      });
      repo = data;
      console.log(`✅ Repository created: ${repo.html_url}`);
    } catch (error) {
      if (error.status === 422) {
        // Repository already exists
        console.log('ℹ️ Repository already exists, using existing one');
        const { data } = await octokit.rest.repos.get({
          owner: user.login,
          repo: repoName
        });
        repo = data;
      } else {
        throw error;
      }
    }

    // Initialize git repository if it doesn't exist
    try {
      execSync('git status', { stdio: 'pipe' });
      console.log('📦 Git repository already initialized');
    } catch {
      console.log('📦 Initializing git repository...');
      execSync('git init');
      execSync(`git remote add origin ${repo.clone_url}`);
    }

    // Configure git user if not set
    try {
      execSync('git config user.email', { stdio: 'pipe' });
    } catch {
      execSync(`git config user.email "${user.email || user.login + '@users.noreply.github.com'}"`);
      execSync(`git config user.name "${user.name || user.login}"`);
    }

    // Create .gitignore if it doesn't exist
    const gitignorePath = '.gitignore';
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
.nuxt/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
logs/

# Temporary files
tmp/
temp/
`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('📝 Created .gitignore file');
    }

    // Stage all files
    console.log('📋 Staging files...');
    execSync('git add .');

    // Check if there are changes to commit
    try {
      execSync('git diff --cached --exit-code', { stdio: 'pipe' });
      console.log('ℹ️ No changes to commit');
    } catch {
      // There are changes to commit
      console.log('💾 Committing changes...');
      execSync('git commit -m "Initial commit: Mobile-friendly AI research data collection website\n\nFeatures:\n- Study instructions with photo examples\n- 6-photo upload system (hair, scalp, face)\n- Comprehensive metadata form\n- Real-time progress tracking\n- Mobile-first responsive design\n- Submission confirmation flow"');
    }

    // Push to GitHub
    console.log('🚀 Pushing to GitHub...');
    try {
      execSync('git push -u origin main', { stdio: 'inherit' });
    } catch {
      // Try master branch if main doesn't work
      try {
        execSync('git branch -M main');
        execSync('git push -u origin main', { stdio: 'inherit' });
      } catch {
        execSync('git push -u origin master', { stdio: 'inherit' });
      }
    }

    console.log('🎉 Successfully pushed to GitHub!');
    console.log(`🔗 Repository URL: ${repo.html_url}`);
    
    return {
      success: true,
      repoUrl: repo.html_url,
      repoName: repo.full_name
    };

  } catch (error) {
    console.error('❌ Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the deployment
createAndPushToGitHub().then(result => {
  if (result.success) {
    console.log(`\n✅ Deployment successful!`);
    console.log(`Repository: ${result.repoUrl}`);
  } else {
    console.log(`\n❌ Deployment failed: ${result.error}`);
    process.exit(1);
  }
}).catch(console.error);