const PB_URL = 'https://cms.sarjanakomputer.id';
const ADMIN_EMAIL = 'admin@sarjanakomputer.id';
const ADMIN_PASS = 'Piblajar2020';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';

const repoFullName = "iv-org/invidious";

async function run() {
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
  });
  
  if (!authRes.ok) return;
  const { token } = await authRes.json();

  let decodedReadme = '';
  let description = 'Invidious is an alternative front-end to YouTube';
  
  const ghRes = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  const payload = {
    full_name: repoFullName,
    category: 'tools', 
    is_active: true,
    fallback_desc: description,
  };

  if (ghRes.ok) {
    const ghData = await ghRes.json();
    payload.fallback_name = ghData.name;
    payload.stars = ghData.stargazers_count || 0;
    payload.forks = ghData.forks_count || 0;
    payload.language = ghData.language || 'Unknown';
    if (ghData.description) {
        payload.fallback_desc = ghData.description;
    }
  }

  const createRes = await fetch(`${PB_URL}/api/collections/curated_repos/records`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Authorization': token },
     body: JSON.stringify(payload)
  });
  console.log(`Inserted ${repoFullName} to CMS:`, createRes.ok);
}

run();
