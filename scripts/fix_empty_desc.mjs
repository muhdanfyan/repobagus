import fs from 'fs';

const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("=== STEP 1: Login to PocketBase ===");
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
  });
  
  if (!authRes.ok) {
    console.error("Login failed:", await authRes.text());
    return;
  }
  const { token } = await authRes.json();

  console.log("=== STEP 2: Fetching Repos with Empty Fallback Desc ===");
  const reposRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?perPage=500`, {
    headers: { 'Authorization': token }
  });
  const { items } = await reposRes.json();

  const emptyRepos = items.filter(item => !item.fallback_desc || item.fallback_desc.trim() === '');
  console.log(`Found ${emptyRepos.length} repos needing description updates.`);

  for (const repo of emptyRepos) {
    console.log(`Fetching data for ${repo.full_name}...`);
    try {
      const ghRes = await fetch(`https://api.github.com/repos/${repo.full_name}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (ghRes.ok) {
        const ghData = await ghRes.json();
        const stars = ghData.stargazers_count || 0;
        const forks = ghData.forks_count || 0;
        const language = ghData.language || 'Unknown';
        const fallback_desc = ghData.description || 'Tidak ada deskripsi dari repositori GitHub.';
        const fallback_name = ghData.name || repo.full_name.split('/')[1];

        const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${repo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify({ stars, forks, language, fallback_desc, fallback_name })
        });
        
        if (updateRes.ok) {
          console.log(`Updated ${repo.full_name} successfully.`);
        } else {
          console.error(`Failed to update ${repo.full_name}:`, await updateRes.text());
        }
      } else {
        console.warn(`GitHub API failed for ${repo.full_name}: ${ghRes.status}`);
        if (ghRes.status === 403 || ghRes.status === 429) {
           console.log("Rate limit hit! Stopping.");
           break;
        }
      }
    } catch (e) {
      console.error(`Error processing ${repo.full_name}:`, e.message);
    }
    
    await delay(1000);
  }
  
  console.log("DONE!");
}

run();
