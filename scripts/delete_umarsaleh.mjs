import PocketBase from 'pocketbase';

const PB_URL = 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020';

async function run() {
  const pb = new PocketBase(PB_URL);

  console.log('=== STEP 1: Login to PocketBase ===');
  try {
    await pb.collection('_superusers').authWithPassword(EMAIL, PASS);
    console.log('Login successful!');
  } catch (err) {
    console.error('Failed to login:', err.message);
    process.exit(1);
  }

  console.log('\n=== STEP 2: Deleting muhammadumarsaleh repos ===');
  try {
    const reposToDelete = ['muhammadumarsaleh/merch_ap', 'muhammadumarsaleh/ladziidz-catering'];
    
    for (const repoName of reposToDelete) {
      const records = await pb.collection('curated_repos').getFullList({ filter: `full_name='${repoName}'` });
      if (records.length > 0) {
        for (const record of records) {
          await pb.collection('curated_repos').delete(record.id);
          console.log(`Deleted ${record.full_name} (${record.id})`);
        }
      } else {
        console.log(`${repoName} not found in database.`);
      }
    }
  } catch (err) {
    console.error('Failed to delete:', err.message);
  }
}

run().catch(console.error);
