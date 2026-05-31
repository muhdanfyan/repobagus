import fs from 'fs';

const filePath = './src/data/repos.json';
const newReposPath = './new_repos.txt';

let repos = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const newReposLines = fs.readFileSync(newReposPath, 'utf-8').split('\n').filter(Boolean);

for (const line of newReposLines) {
  try {
    const repo = JSON.parse(line);
    repos.push(repo);
  } catch (e) {
    console.error("Failed to parse line:", line);
  }
}

// Remove duplicates based on fullName
const uniqueRepos = [];
const seen = new Set();
for (const r of repos) {
    if (!seen.has(r.fullName)) {
        seen.add(r.fullName);
        uniqueRepos.push(r);
    }
}

fs.writeFileSync(filePath, JSON.stringify(uniqueRepos, null, 2));
console.log('Appended successfully.');
