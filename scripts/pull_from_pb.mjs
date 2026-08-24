import fs from 'fs';
import path from 'path';

const PB_URL = 'https://cms.sarjanakomputer.id';

async function run() {
  console.log('=== Fetching Curated Repos from CMS ===');
  try {
    const res = await fetch(`${PB_URL}/api/collections/curated_repos/records?perPage=500`);
    if (!res.ok) {
      throw new Error(`Failed to fetch from CMS: ${res.statusText}`);
    }
    const data = await res.json();
    
    console.log(`Fetched ${data.items.length} records.`);
    
    const newRepos = data.items.map(item => ({
      fullName: item.full_name,
      category: item.category,
      name: item.fallback_name || item.full_name.split('/')[1],
      description: item.fallback_desc || '',
      stargazers_count: item.stars || 0,
      forks_count: item.forks || 0,
      language: item.language || ''
    }));

    // Read local repos.json to preserve any fields not in CMS
    const reposPath = path.join(process.cwd(), 'src/data/repos.json');
    let localRepos = [];
    if (fs.existsSync(reposPath)) {
      localRepos = JSON.parse(fs.readFileSync(reposPath, 'utf8'));
    }

    // Merge strategy: update local with CMS data
    const localMap = new Map();
    localRepos.forEach(repo => localMap.set(repo.fullName, repo));

    newRepos.forEach(repo => {
      if (localMap.has(repo.fullName)) {
        const local = localMap.get(repo.fullName);
        // Overwrite CMS mapped fields
        localMap.set(repo.fullName, { ...local, ...repo });
      } else {
        localMap.set(repo.fullName, repo);
      }
    });

    // Write back
    fs.writeFileSync(reposPath, JSON.stringify(Array.from(localMap.values()), null, 2));
    console.log(`Successfully synced ${localMap.size} repos to src/data/repos.json.`);
  } catch (err) {
    console.error('Sync failed:', err.message);
  }
}

run().catch(console.error);
