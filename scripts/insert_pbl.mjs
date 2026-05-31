const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';

const targetRepos = [
  "SethHWeidman/CNN_from_scratch",
  "SethHWeidman/RNN_from_scratch"
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

  for (const repoFullName of targetRepos) {
    console.log(`=== STEP 2: Fetching README for ${repoFullName} ===`);
    const [owner, repoName] = repoFullName.split('/');
    
    let decodedReadme = '';
    let description = 'Curated educational repository';
    try {
      const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repoName}/master/README.md`);
      if (rawRes.ok) {
        decodedReadme = await rawRes.text();
        const lines = decodedReadme.split('\n');
        for (let line of lines) {
          line = line.trim();
          if (line && !line.startsWith('#') && !line.startsWith('<') && !line.startsWith('![')) {
            line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); 
            if (line.length > 30) {
              description = line;
              break;
            }
          }
        }
        if (description.length > 200) {
           description = description.substring(0, 200) + '...';
        }
      }
    } catch(e) {}
    
    console.log(`Extracted desc: ${description}`);

    console.log(`=== STEP 3: Fetching stats from GitHub ===`);
    const ghRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const payload = {
      full_name: repoFullName,
      category: 'edukasi', 
      is_active: true,
      fallback_desc: description,
    };

    if (ghRes.ok) {
      const ghData = await ghRes.json();
      payload.fallback_name = ghData.name;
      payload.stars = ghData.stargazers_count || 0;
      payload.forks = ghData.forks_count || 0;
      payload.language = ghData.language || 'Unknown';
    }

    // Check if it exists
    const getRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?filter=(full_name='${repoFullName}')`, {
       headers: { 'Authorization': token }
    });
    const existing = await getRes.json();
    
    if (existing.items && existing.items.length > 0) {
       const recordId = existing.items[0].id;
       const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${recordId}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json', 'Authorization': token },
         body: JSON.stringify(payload)
       });
       console.log(`Updated ${repoFullName} category to edukasi:`, updateRes.ok);
    } else {
       const createRes = await fetch(`${PB_URL}/api/collections/curated_repos/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify(payload)
       });
       console.log(`Inserted ${repoFullName} to CMS:`, createRes.ok);
    }
    console.log("-----------------------------------------");
  }
}

run();
