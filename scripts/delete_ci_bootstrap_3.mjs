import PocketBase from 'pocketbase';

const PB_URL = 'http://103.126.117.20:8095';
const EMAIL = 'admin@sarjanakomputer.id';
const PASS = 'Piblajar2020'; // Reverted to correct password

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

  console.log('\n=== STEP 2: Deleting ci_bootstrap_3 ===');
  try {
    const records = await pb.collection('curated_repos').getFullList({ 
      filter: `full_name~'ci_bootstrap_3' || fallback_name~'ci_bootstrap_3'` 
    });
    
    if (records.length > 0) {
      for (const record of records) {
        await pb.collection('curated_repos').delete(record.id);
        console.log(`Deleted ${record.full_name} (${record.id})`);
      }
      console.log('Successfully deleted ci_bootstrap_3.');
    } else {
      console.log('ci_bootstrap_3 not found in database.');
    }
  } catch (err) {
    console.error('Failed to delete:', err.message, err.data);
  }
}

run().catch(console.error);
