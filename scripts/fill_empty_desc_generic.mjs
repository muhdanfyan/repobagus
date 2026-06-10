// Use built-in fetch

const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';

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
  console.log(`Found ${emptyRepos.length} repos with empty description.`);

  for (const repo of emptyRepos) {
    const fallback_name = repo.full_name.split('/')[1];
    const fallback_desc = `Proyek repositori open-source ${fallback_name}.`;

    const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${repo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ 
        fallback_desc: fallback_desc,
        fallback_name: repo.fallback_name || fallback_name
      })
    });
    
    if (updateRes.ok) {
      console.log(`Updated ${repo.full_name} with generic description.`);
    } else {
      console.error(`Failed to update ${repo.full_name}:`, await updateRes.text());
    }
  }
  
  console.log("DONE! All empty descriptions filled.");
}

run();
