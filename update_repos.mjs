import fs from 'fs';
import { execSync } from 'child_process';

function updateRepos() {
  const filePath = './src/data/repos.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const newRepos = [];
  
  for (const repo of data) {
    if (repo.fullName.startsWith('muhdanfyan/')) {
      console.log(`Checking ${repo.fullName}...`);
      try {
        const output = execSync(`env -u GITHUB_TOKEN gh api repos/${repo.fullName} --jq '{fork: .fork, parent: .parent.full_name}'`, { encoding: 'utf-8' });
        const repoData = JSON.parse(output.trim());
        
        if (repoData.fork && repoData.parent) {
            console.log(`  -> Fork of ${repoData.parent}`);
            newRepos.push({
                fullName: repoData.parent,
                category: repo.category
            });
        } else {
            console.log(`  -> Not a fork. Removing.`);
        }
      } catch (err) {
        console.error(`Error fetching ${repo.fullName}:`, err.message);
      }
    } else {
      newRepos.push(repo);
    }
  }
  
  // Remove duplicates
  const uniqueRepos = [];
  const seen = new Set();
  for (const r of newRepos) {
      if (!seen.has(r.fullName)) {
          seen.add(r.fullName);
          uniqueRepos.push(r);
      }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(uniqueRepos, null, 2));
  console.log('Update complete.');
}

updateRepos();
