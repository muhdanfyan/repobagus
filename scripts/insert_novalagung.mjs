const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';

const targetRepos = [
  "novalagung/dasarpemrogramangolang",
  "novalagung/dasarpemrogramanpython",
  "novalagung/dasarpemrogramanrust"
];

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

  console.log("=== STEP 2: Inserting Repos ===");
  for (const repoFullName of targetRepos) {
    console.log(`Fetching ${repoFullName} from GitHub...`);
    const ghRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (ghRes.ok) {
      const ghData = await ghRes.json();
      
      const payload = {
        full_name: repoFullName,
        category: 'edukasi', // Set the new category
        is_active: true,
        fallback_name: ghData.name,
        fallback_desc: ghData.description || "Buku referensi dasar pemrograman",
        stars: ghData.stargazers_count || 0,
        forks: ghData.forks_count || 0,
        language: ghData.language || 'Unknown'
      };

      const createRes = await fetch(`${PB_URL}/api/collections/curated_repos/records`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': token 
        },
        body: JSON.stringify(payload)
      });
      
      if (createRes.ok) {
        console.log(`✅ Successfully added ${repoFullName} to PocketBase.`);
      } else {
        const errorText = await createRes.text();
        if (errorText.includes('validation_not_unique')) {
           console.log(`⚠️ ${repoFullName} is already in PocketBase, updating category to edukasi...`);
           // Fetch to get ID
           const getRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?filter=(full_name='${repoFullName}')`, {
             headers: { 'Authorization': token }
           });
           const existing = await getRes.json();
           if (existing.items && existing.items.length > 0) {
             const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${existing.items[0].id}`, {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json', 'Authorization': token },
               body: JSON.stringify(payload)
             });
             console.log(`Updated ${repoFullName} status:`, updateRes.ok);
           }
        } else {
           console.error(`❌ Failed to add ${repoFullName}:`, errorText);
        }
      }
    } else {
      console.error(`Failed to fetch from GitHub: ${ghRes.status} ${ghRes.statusText}`);
    }
  }
}

run();
