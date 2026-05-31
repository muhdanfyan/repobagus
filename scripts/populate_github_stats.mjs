

const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020'; // Dari credential admin sebelumnya
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';

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
  console.log("Login successful!");

  console.log("=== STEP 2: Updating Schema ===");
  const schemaRes = await fetch(`${PB_URL}/api/collections/curated_repos`, {
    headers: { 'Authorization': token }
  });
  const collection = await schemaRes.json();
  
  const existingFields = collection.fields ? collection.fields.map(f => f.name) : collection.schema.map(f => f.name);
  let fieldsToUpdate = collection.fields || collection.schema;
  let schemaModified = false;

  if (!existingFields.includes('stars')) {
    fieldsToUpdate.push({ name: 'stars', type: 'number', required: false, system: false, options: { min: 0 } });
    schemaModified = true;
  }
  if (!existingFields.includes('forks')) {
    fieldsToUpdate.push({ name: 'forks', type: 'number', required: false, system: false, options: { min: 0 } });
    schemaModified = true;
  }
  if (!existingFields.includes('language')) {
    fieldsToUpdate.push({ name: 'language', type: 'text', required: false, system: false, options: { max: 255 } });
    schemaModified = true;
  }

  if (schemaModified) {
    const payload = collection.fields ? { fields: fieldsToUpdate } : { schema: fieldsToUpdate };
    const updateSchema = await fetch(`${PB_URL}/api/collections/curated_repos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(payload)
    });
    if (updateSchema.ok) {
      console.log("Schema updated with stars, forks, and language fields.");
    } else {
      console.error("Failed to update schema:", await updateSchema.text());
    }
  } else {
    console.log("Schema already has the fields.");
  }

  console.log("=== STEP 3: Fetching Repos & Updating Stats ===");
  const reposRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?perPage=500`, {
    headers: { 'Authorization': token }
  });
  const { items } = await reposRes.json();

  for (const repo of items) {
    console.log(`Fetching stats for ${repo.full_name}...`);
    try {
      const ghRes = await fetch(`https://api.github.com/repos/${repo.full_name}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (ghRes.ok) {
        const ghData = await ghRes.json();
        const stars = ghData.stargazers_count || 0;
        const forks = ghData.forks_count || 0;
        const language = ghData.language || 'Unknown';

        const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${repo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify({ stars, forks, language })
        });
        
        if (updateRes.ok) {
          console.log(`Updated ${repo.full_name}: ${stars} stars, ${forks} forks, ${language}`);
        } else {
          console.error(`Failed to update ${repo.full_name} in PocketBase:`, await updateRes.text());
        }
      } else {
        console.warn(`GitHub API failed for ${repo.full_name}: ${ghRes.status} ${ghRes.statusText}`);
      }
    } catch (e) {
      console.error(`Error processing ${repo.full_name}:`, e.message);
    }
    
    // Prevent GitHub secondary rate limits
    await delay(300);
  }
  
  console.log("DONE!");
}

run();
