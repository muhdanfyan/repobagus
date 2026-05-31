const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';

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

  console.log("=== STEP 2: Fetching README and Updating Repos ===");
  for (const repoFullName of targetRepos) {
    console.log(`Processing ${repoFullName}...`);
    
    // First, find the record ID
    const getRes = await fetch(`${PB_URL}/api/collections/curated_repos/records?filter=(full_name='${repoFullName}')`, {
      headers: { 'Authorization': token }
    });
    const existing = await getRes.json();
    if (!existing.items || existing.items.length === 0) {
      console.log(`Repo ${repoFullName} not found in CMS.`);
      continue;
    }
    const recordId = existing.items[0].id;

    // Second, fetch the Readme
    let decodedReadme = '';
    let fetchSuccess = false;
    const [owner, repoName] = repoFullName.split('/');
    const rawBranches = ['master', 'main'];
    const rawFiles = ['content/README.md', 'docs/index.md', 'README.md', 'readme.md'];

    for (const branch of rawBranches) {
      if (fetchSuccess) break;
      for (const file of rawFiles) {
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${file}`);
          if (rawRes.ok) {
            decodedReadme = await rawRes.text();
            if ((decodedReadme.includes('content/README.md') || decodedReadme.includes('docs/index.md')) && decodedReadme.length < 50) {
               // Ignore if it's just a pointer file
               continue;
            }
            fetchSuccess = true;
            break;
          }
        } catch (e) { }
      }
    }

    if (fetchSuccess && decodedReadme) {
      // Extract first meaningful paragraph
      const lines = decodedReadme.split('\n');
      let description = '';
      for (let line of lines) {
        line = line.trim();
        // Skip headers, empty lines, html tags, images, links if they are the only thing
        if (line && !line.startsWith('#') && !line.startsWith('<') && !line.startsWith('![')) {
          // clean up markdown links
          line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); 
          if (line.length > 50) {
            description = line;
            break;
          }
        }
      }

      if (description) {
        // truncate to 200 chars smoothly
        if (description.length > 200) {
           description = description.substring(0, 200) + '...';
        }
        
        console.log(`Extracted desc: ${description}`);
        const updateRes = await fetch(`${PB_URL}/api/collections/curated_repos/records/${recordId}`, {
           method: 'PATCH',
           headers: { 'Content-Type': 'application/json', 'Authorization': token },
           body: JSON.stringify({ fallback_desc: description })
        });
        if (updateRes.ok) {
           console.log(`✅ Updated description for ${repoFullName}`);
        } else {
           console.error(`❌ Failed to update ${repoFullName}:`, await updateRes.text());
        }
      } else {
        console.log(`No suitable description found for ${repoFullName}`);
      }
    } else {
      console.log(`Could not fetch README for ${repoFullName}`);
    }
  }
}

run();
