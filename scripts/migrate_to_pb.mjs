import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';

const PB_URL = 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Skomindo2026Admin';

async function run() {
  const pb = new PocketBase(PB_URL);

  console.log('=== STEP 1: Login to PocketBase ===');
  try {
    await pb.collection('_superusers').authWithPassword(EMAIL, PASS);
    console.log('Login successful!');
  } catch (err) {
    console.error('Failed to login:', err.message);
    console.error('Status:', err.status);
    console.error('Data:', JSON.stringify(err.data));
    process.exit(1);
  }

  console.log('\n=== STEP 2: Creating "curated_repos" Collection (if not exists) ===');
  try {
    const checkColl = await pb.collections.getOne('curated_repos');
    console.log('Collection "curated_repos" already exists.');
  } catch (err) {
    console.log('Collection not found, creating...');
    try {
      await pb.collections.create({
        name: 'curated_repos',
        type: 'base',
        listRule: '',
        viewRule: '',
        fields: [
          { name: "full_name", type: "text", required: true, unique: true },
          { name: "category", type: "text", required: true },
          { name: "fallback_name", type: "text", required: false },
          { name: "fallback_desc", type: "text", required: false },
          { name: "is_active", type: "bool", required: false }
        ]
      });
      console.log('Successfully created curated_repos collection.');
    } catch (createErr) {
      console.error('Failed to create collection:', createErr.message, JSON.stringify(createErr.data));
      process.exit(1);
    }
  }

  console.log('\n=== STEP 3: Seeding Repositories ===');
  const reposPath = path.join(process.cwd(), 'src/data/repos.json');
  if (fs.existsSync(reposPath)) {
    const reposRaw = fs.readFileSync(reposPath, 'utf8');
    const curatedRepos = JSON.parse(reposRaw);
    
    let count = 0;
    for (const repo of curatedRepos) {
      const recordData = {
        full_name: repo.fullName,
        category: repo.category || 'tools',
        fallback_name: repo.name || '',
        fallback_desc: repo.description || '',
        is_active: true
      };

      try {
        const records = await pb.collection('curated_repos').getFullList({ filter: `full_name='${recordData.full_name}'` });
        if (records.length > 0) {
          console.log(`[Update] ${recordData.full_name}`);
          await pb.collection('curated_repos').update(records[0].id, recordData);
        } else {
          console.log(`[Create] ${recordData.full_name}`);
          await pb.collection('curated_repos').create(recordData);
        }
        count++;
      } catch (insertErr) {
        console.error(`Failed to process repo "${recordData.full_name}":`, insertErr.message, JSON.stringify(insertErr.data));
      }
    }
    console.log(`\nSuccessfully processed ${count} repositories!`);
  } else {
    console.error(`File not found: ${reposPath}`);
  }

  console.log('\n=== ALL SEEDING TASKS COMPLETE! ===');
}

run().catch(console.error);
